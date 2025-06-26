import { connectMongoDB } from '@/lib/mongodb'
import { CommunityModel } from '@/models/Community'
import { PostModel } from '@/models/Post'
import { ActivityModel } from '@/models/Activity'
import { NotificationModel } from '@/models/Notification'
import type { CommunityDocument, PostDocument } from '../types/database'
import type { Model } from 'mongoose'

export class CommunityService {
  async createCommunity(communityData: {
    name: string
    description: string
    language: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'mixed'
    creator_id: string
    is_private?: boolean
    rules?: string[]
    tags?: string[]
  }): Promise<CommunityDocument> {
    await connectMongoDB()
    
    const community = await (CommunityModel as any).create({
      ...communityData,
      settings: {
        allow_media: true,
        require_approval: false,
        auto_approve_members: true
      }
    })
    
    // Log activity
    await this.logActivity(
      communityData.creator_id,
      'community_created',
      'community',
      community._id.toString(),
      { community_name: community.name }
    )
    
    return community
  }
  async getCommunity(communityId: string): Promise<any | null> {
    await connectMongoDB()
    
    return await (CommunityModel as any).findById(communityId).lean()
  }

  async updateCommunity(
    communityId: string,
    userId: string,
    updateData: any
  ): Promise<any | null> {
    await connectMongoDB()
    
    const community = await (CommunityModel as any).findById(communityId)
    if (!community) return null
    
    // Check if user is creator or moderator
    if (community.creator_id !== userId && !community.moderators.includes(userId)) {
      throw new Error('Unauthorized to update this community')
    }
    
    Object.assign(community, updateData)
    await community.save()
    
    await this.logActivity(
      userId,
      'community_updated',
      'community',
      communityId,
      { updated_fields: Object.keys(updateData) }
    )
    
    return community
  }

  async searchCommunities(
    filters: {
      query?: string
      language?: string
      level?: string
      isPrivate?: boolean
    } = {},
    limit = 20,
    skip = 0
  ) {
    await connectMongoDB()
    
    const query: any = {}
    
    if (filters.query) {
      query.$text = { $search: filters.query }
    }
    
    if (filters.language) {
      query.language = filters.language
    }
    
    if (filters.level) {
      query.level = filters.level
    }
    
    if (filters.isPrivate !== undefined) {
      query.is_private = filters.isPrivate
    }
    
    const communities = await (CommunityModel as any)
      .find(query)
      .sort(filters.query ? { score: { $meta: 'textScore' } } : { member_count: -1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    return communities
  }

  async getPopularCommunities(language?: string, limit = 20) {
    await connectMongoDB()
    
    const query: any = { is_private: false }
    if (language) query.language = language
    
    return await (CommunityModel as any)
      .find(query)
      .sort({ member_count: -1, created_at: -1 })
      .limit(limit)
      .lean()
  }

  async joinCommunity(communityId: string, userId: string) {
    await connectMongoDB()
    
    const community = await (CommunityModel as any).findById(communityId)
    if (!community) throw new Error('Community not found')
    
    if (community.is_private && community.settings.require_approval) {
      // Handle join request logic here
      throw new Error('Community requires approval - feature not implemented yet')
    }
    
    // Increment member count
    community.member_count += 1
    await community.save()
    
    // Log activity
    await this.logActivity(
      userId,
      'community_joined',
      'community',
      communityId,
      { community_name: community.name }
    )
    
    // Notify moderators if needed
    if (community.moderators.length > 0) {
      await this.notifyModerators(
        community,
        'New Member',
        `Someone joined ${community.name}`,
        { new_member_id: userId }
      )
    }
    
    return community
  }

  async leaveCommunity(communityId: string, userId: string) {
    await connectMongoDB()
    
    const community = await (CommunityModel as any).findById(communityId)
    if (!community) throw new Error('Community not found')
    
    if (community.creator_id === userId) {
      throw new Error('Community creator cannot leave. Transfer ownership first.')
    }
      // Remove from moderators if applicable
    community.moderators = community.moderators.filter((id: string) => id !== userId)
    
    // Decrement member count
    community.member_count = Math.max(0, community.member_count - 1)
    await community.save()
    
    // Log activity
    await this.logActivity(
      userId,
      'community_left',
      'community',
      communityId,
      { community_name: community.name }
    )
    
    return community
  }

  async createPost(postData: {
    user_id: string
    community_id: string
    content: string
    media?: any[]
    tags?: string[]
  }): Promise<any> {
    await connectMongoDB()
    
    const community = await (CommunityModel as any).findById(postData.community_id)
    if (!community) throw new Error('Community not found')
    
    const post = await (PostModel as any).create({
      ...postData,
      reactions: [],
      comments: [],
      view_count: 0
    })
    
    // Log activity
    await this.logActivity(
      postData.user_id,
      'post_created',
      'post',
      post._id.toString(),
      { 
        community_id: postData.community_id,
        community_name: community.name 
      }
    )
    
    return post
  }
  async getCommunityPosts(
    communityId: string,
    limit = 20,
    skip = 0,
    sortBy: 'recent' | 'popular' = 'recent'
  ) {
    await connectMongoDB()
    
    const sortOptions = sortBy === 'popular' 
      ? { view_count: -1, created_at: -1 }
      : { created_at: -1 }
    
    return await (PostModel as any)
      .find({ 
        community_id: communityId,
        is_archived: false 
      })
      .sort(sortOptions as any)
      .skip(skip)
      .limit(limit)
      .lean()
  }

  async getPost(postId: string): Promise<PostDocument | null> {
    await connectMongoDB()
    
    const post = await (PostModel as any).findById(postId)
    if (post) {
      // Increment view count
      post.view_count += 1
      await post.save()
    }
    
    return post
  }

  async addReaction(postId: string, userId: string, reactionType: string) {
    await connectMongoDB()
    
    const post = await (PostModel as any).findById(postId)
    if (!post) throw new Error('Post not found')
      // Remove existing reaction if any
    post.reactions = post.reactions.filter((r: any) => r.user_id !== userId)
    
    // Add new reaction
    post.reactions.push({
      user_id: userId,
      type: reactionType as any,
      created_at: new Date()
    })
    
    await post.save()
    
    // Log activity
    await this.logActivity(
      userId,
      'reaction_added',
      'post',
      postId,
      { reaction_type: reactionType }
    )
    
    // Notify post author if different user
    if (post.user_id !== userId) {
      await this.createNotification(
        post.user_id,
        'reaction',
        'Post Reaction',
        `Someone reacted to your post with ${reactionType}`,
        { 
          senderId: userId,
          actionUrl: `/posts/${postId}`,
          data: { post_id: postId, reaction_type: reactionType }
        }
      )
    }
    
    return post
  }

  async addComment(postId: string, userId: string, content: string) {
    await connectMongoDB()
    
    const post = await (PostModel as any).findById(postId)
    if (!post) throw new Error('Post not found')
    
    post.comments.push({
      user_id: userId,
      content,
      created_at: new Date()
    })
    
    await post.save()
    
    // Log activity
    await this.logActivity(
      userId,
      'comment_added',
      'post',
      postId,
      { comment_length: content.length }
    )
    
    // Notify post author if different user
    if (post.user_id !== userId) {
      await this.createNotification(
        post.user_id,
        'comment',
        'New Comment',
        `Someone commented on your post`,
        {
          senderId: userId,
          actionUrl: `/posts/${postId}`,
          data: { post_id: postId }
        }
      )
    }
    
    return post
  }

  async getUserCommunities(userId: string) {
    await connectMongoDB()
    
    // Get communities where user is creator or moderator
    return await (CommunityModel as any)
      .find({
        $or: [
          { creator_id: userId },
          { moderators: userId }
        ]
      })
      .sort({ created_at: -1 })
      .lean()
  }

  async addModerator(communityId: string, userId: string, moderatorId: string) {
    await connectMongoDB()
    
    const community = await (CommunityModel as any).findById(communityId)
    if (!community) throw new Error('Community not found')
    
    if (community.creator_id !== userId) {
      throw new Error('Only community creator can add moderators')
    }
    
    if (!community.moderators.includes(moderatorId)) {
      community.moderators.push(moderatorId)
      await community.save()
      
      await this.createNotification(
        moderatorId,
        'community_role',
        'Moderator Role',
        `You've been made a moderator of ${community.name}`,
        {
          senderId: userId,
          actionUrl: `/communities/${communityId}`,
          data: { community_id: communityId, role: 'moderator' }
        }
      )
    }
    
    return community
  }
  private async logActivity(
    userId: string,
    action: string,
    targetType?: string,
    targetId?: string,
    metadata?: Record<string, any>
  ) {
    try {
      await (ActivityModel as any).logActivity(userId, action, targetType, targetId, metadata)
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }

  private async createNotification(
    recipientId: string,
    type: string,
    title: string,
    message: string,
    options: {
      senderId?: string
      data?: Record<string, any>
      actionUrl?: string
      priority?: 'low' | 'normal' | 'high' | 'urgent'
    } = {}
  ) {
    try {
      await (NotificationModel as any).createNotification(
        recipientId,
        type,
        title,
        message,
        options
      )
    } catch (error) {
      console.error('Failed to create notification:', error)
    }
  }

  private async notifyModerators(
    community: CommunityDocument,
    title: string,
    message: string,
    data?: Record<string, any>
  ) {
    const moderators = [community.creator_id, ...community.moderators]
    
    await Promise.all(
      moderators.map(moderatorId =>
        this.createNotification(
          moderatorId,
          'community_activity',
          title,
          message,
          {
            actionUrl: `/communities/${community._id}`,
            data: { community_id: community._id.toString(), ...data }
          }
        )
      )
    )
  }
}
