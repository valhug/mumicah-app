# Mumicah Database Architecture

**Last Updated**: January 23, 2025  
**Databases**: Supabase (PostgreSQL) + MongoDB Hybrid Architecture  
**Framework**: Next.js 15 with App Router

---

## 🏗️ Architecture Overview

This project uses a **hybrid database architecture** combining Supabase (PostgreSQL) and MongoDB to leverage the strengths of both relational and document databases, following Next.js 15 best practices.

### Why Supabase + MongoDB Hybrid?

1. **Supabase Advantages**: 
   - Built-in authentication & authorization
   - Real-time subscriptions
   - Row Level Security (RLS)
   - Auto-generated APIs
   - Built-in file storage

2. **MongoDB Strengths**: 
   - Flexible schemas for content
   - Complex nested documents
   - Horizontal scaling
   - Rich queries for user-generated content

3. **Next.js 15 Integration**: 
   - Server Actions for data mutations
   - Server Components for data fetching
   - Real-time updates via Supabase
   - Optimistic UI updates

---

## 📊 Database Distribution

### Supabase (PostgreSQL) - Structured Data + Auth
**Use Case**: User management, authentication, structured learning data with RLS

| Table | Purpose | RLS Policy | Real-time |
|-------|---------|------------|-----------|
| `users` | User accounts (managed by Supabase Auth) | User owns data | ✅ |
| `profiles` | User profile data | User owns profile | ✅ |
| `subscriptions` | Billing & plans | User owns subscription | ✅ |
| `learning_paths` | Structured courses | Public read, admin write | ✅ |
| `modules` | Course modules | Public read, admin write | ✅ |
| `lessons` | Individual lessons | Public read, admin write | ✅ |
| `progress` | Learning progress | User owns progress | ✅ |
| `analytics` | User analytics | User owns analytics | ❌ |
| `transactions` | Payment history | User owns transactions | ❌ |
| `follows` | User relationships | User can read/write own | ✅ |

### MongoDB - Document Data  
**Use Case**: Flexible content, user-generated data, real-time features

| Collection | Purpose | Access Pattern | Indexes |
|------------|---------|----------------|---------|
| `communities` | Community metadata | Public read, mod write | `language`, `level`, `member_count` |
| `posts` | Community posts | Community-based access | `community_id`, `user_id`, `created_at` |
| `conversations` | Chat messages | Participant-based access | `participants`, `updated_at` |
| `resources` | Learning materials | Public read | `tags`, `difficulty`, `language` |
| `activities` | Activity feeds | User-based access | `user_id`, `timestamp` |
| `notifications` | User notifications | User-based access | `recipient`, `read`, `created_at` |
| `media` | File metadata | Reference-based access | `upload_id`, `user_id` |

---

## 🔄 Data Synchronization & Next.js 15 Integration

### Cross-Database References

```typescript
// Supabase user table (auto-managed by Supabase Auth)
interface User {
  id: string;          // UUID from Supabase Auth
  email: string;       // Managed by Supabase
  created_at: string;  // ISO timestamp
}

// MongoDB posts collection
interface Post {
  _id: ObjectId;
  user_id: string;     // References Supabase auth.users.id
  community_id: string;
  content: string;
  media: Media[];
  reactions: Reaction[];
  created_at: Date;
}
```

### Next.js 15 Data Patterns

#### Server Actions for Mutations (Updated with Latest Patterns)
```typescript
// app/actions/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { connectMongoDB } from '@/lib/mongodb'
import { PostModel } from '@/models/Post'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Enhanced form validation schema
const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  community_id: z.string().uuid('Invalid community ID'),
  tags: z.array(z.string()).optional(),
  media: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video', 'audio']),
    alt: z.string().optional()
  })).optional()
})

export async function createPost(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  // Get current user from Supabase
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }
  
  // Validate form data
  const validatedFields = createPostSchema.safeParse({
    content: formData.get('content'),
    community_id: formData.get('community_id'),
    tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [],
    media: formData.get('media') ? JSON.parse(formData.get('media') as string) : []
  })
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields'
    }
  }
  
  const { content, community_id, tags = [], media = [] } = validatedFields.data
  
  try {
    // Create post in MongoDB
    await connectMongoDB()
    const post = await PostModel.create({
      user_id: user.id,
      community_id,
      content,
      tags,
      media,
      created_at: new Date()
    })
    
    // Revalidate the posts page
    revalidatePath(`/communities/${community_id}`)
    
    return { 
      success: true, 
      post_id: post._id.toString(),
      message: 'Post created successfully' 
    }
  } catch (error) {
    console.error('Failed to create post:', error)
    return {
      message: 'Failed to create post. Please try again.'
    }
  }
}

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }
  
  const displayName = formData.get('display_name') as string
  const bio = formData.get('bio') as string
  
  try {
    // Update profile in Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
    
    if (updateError) throw updateError
    
    // Log activity in MongoDB
    await connectMongoDB()
    const { ActivityModel } = await import('@/models/Activity')
    await ActivityModel.create({
      user_id: user.id,
      action: 'profile_updated',
      metadata: { updated_fields: ['display_name', 'bio'] },
      timestamp: new Date()
    })
    
    revalidatePath('/profile')
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return { message: 'Failed to update profile. Please try again.' }
  }
}
```

#### Server Components with `use cache` Directive (Latest Pattern)
```typescript
// app/communities/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { connectMongoDB } from '@/lib/mongodb'
import { PostModel } from '@/models/Post'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { cacheTag, cacheLife } from 'next/cache'

interface PageProps {
  params: Promise<{ id: string }>
}

// Cached data fetching functions with Next.js 15 cache directive
const getCommunityPosts = cache(async (communityId: string, userId?: string) => {
  'use cache'
  cacheTag('community-posts', `community-${communityId}`)
  cacheLife('posts')
  
  await connectMongoDB()
  
  const posts = await PostModel
    .find({ community_id: communityId })
    .sort({ created_at: -1 })
    .limit(20)
    .lean()
  
  // Transform MongoDB ObjectIds to strings for client
  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    created_at: post.created_at.toISOString(),
    reactions: post.reactions?.map(r => ({
      ...r,
      created_at: r.created_at.toISOString()
    })) || [],
    comments: post.comments?.map(c => ({
      ...c,
      created_at: c.created_at.toISOString()
    })) || []
  }))
})

const getCurrentUser = cache(async () => {
  'use cache'
  cacheLife('session')
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get additional profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { ...user, profile }
})

export default async function CommunityPage({ params }: PageProps) {
  const { id } = await params
  
  // Get user and posts in parallel
  const [user, posts] = await Promise.all([
    getCurrentUser(),
    getCommunityPosts(id, undefined)
  ])
  
  if (!posts.length && id) {
    notFound()
  }
  
  return (
    <div>
      <PostList posts={posts} currentUser={user} />
    </div>
  )
}
```

#### Enhanced Client Components with useActionState
```typescript
// app/components/create-post-form.tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions/posts'

interface CreatePostFormProps {
  communityId: string
}

export function CreatePostForm({ communityId }: CreatePostFormProps) {
  const [state, action, pending] = useActionState(createPost, undefined)
  
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="community_id" value={communityId} />
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          What's on your mind?
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Share your thoughts..."
          disabled={pending}
        />
        {state?.errors?.content && (
          <p className="mt-1 text-sm text-red-600">{state.errors.content}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium">
          Tags (optional)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Comma-separated tags"
          disabled={pending}
        />
        {state?.errors?.tags && (
          <p className="mt-1 text-sm text-red-600">{state.errors.tags}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={pending}
        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pending ? 'Creating...' : 'Create Post'}
      </button>
      
      {state?.message && (
        <p className={`mt-2 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  )
}
```

#### Real-time with Supabase (Enhanced Pattern)
```typescript
// app/components/real-time-progress.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'
import { Database } from '@/types/supabase'

type Progress = Database['public']['Tables']['progress']['Row']

interface RealTimeProgressProps {
  userId: string
}

export function RealTimeProgress({ userId }: RealTimeProgressProps) {
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('progress')
        .select(`
          *,
          lessons:lesson_id (
            title,
            learning_path_id
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      setProgress(data || [])
    } catch (err) {
      console.error('Error fetching progress:', err)
      setError('Failed to load progress')
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])
  
  useEffect(() => {
    fetchProgress()
    
    // Subscribe to progress changes
    const channel = supabase
      .channel('progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProgress(prev => [payload.new as Progress, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProgress(prev => 
              prev.map(p => p.id === payload.new.id ? payload.new as Progress : p)
            )
          } else if (payload.eventType === 'DELETE') {
            setProgress(prev => 
              prev.filter(p => p.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, fetchProgress])
  
  if (loading) return <ProgressSkeleton />
  if (error) return <ErrorMessage message={error} onRetry={fetchProgress} />
  
  return <ProgressDisplay progress={progress} />
}
```

---

## 🔧 Technical Implementation

### Supabase Configuration (Updated for Next.js 15)

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// lib/supabase/middleware.ts  
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

// middleware.ts (root level)
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### MongoDB Connection (Next.js 15 Optimized)

```typescript
// lib/mongodb.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectMongoDB() {
  if (cached.conn) return cached.conn
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }
  
  return cached.conn
}
```

### Service Layer with Data Access Layer (DAL)

```typescript
// lib/dal.ts (Data Access Layer)
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  return { isAuth: true, userId: user.id, user }
})

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get additional profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { ...user, profile }
})

// services/user.service.ts
import { createClient } from '@/lib/supabase/server'
import { connectMongoDB } from '@/lib/mongodb'
import { ActivityModel } from '@/models/Activity'

export class UserService {
  private async getSupabase() {
    return await createClient()
  }
  
  async updateProfile(userId: string, profileData: any) {
    const supabase = await this.getSupabase()
    
    // Update in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    
    // Log activity in MongoDB
    await connectMongoDB()
    await ActivityModel.create({
      user_id: userId,
      action: 'profile_updated',
      metadata: { updated_fields: Object.keys(profileData) },
      timestamp: new Date()
    })
    
    return data
  }
  
  async getUserActivity(userId: string, limit = 20) {
    await connectMongoDB()
    
    return ActivityModel
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()
  }
  
  async getUserProgress(userId: string) {
    const supabase = await this.getSupabase()
    
    const { data: progress, error } = await supabase
      .from('progress')
      .select(`
        *,
        lessons:lesson_id (
          title,
          learning_path_id
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    
    return progress
  }
}
```

---

## 📋 Schema Definitions

### Supabase Schemas (with RLS)

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  native_language TEXT,
  learning_languages JSONB DEFAULT '[]'::jsonb,
  timezone TEXT DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- subscriptions table
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status subscription_status NOT NULL DEFAULT 'trial',
  plan_name TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for subscriptions
CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- learning_paths table (public read, admin write)
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for learning_paths
CREATE POLICY "Anyone can view published learning paths" ON learning_paths
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Only admins can manage learning paths" ON learning_paths
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID NOT NULL,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- RLS for progress
CREATE POLICY "Users can manage their own progress" ON progress
  FOR ALL USING (auth.uid() = user_id);
```

### MongoDB Schemas (Mongoose)

```typescript
// models/Community.ts
import mongoose from 'mongoose'

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'mixed'],
    default: 'mixed'
  },
  creator_id: { type: String, required: true }, // Supabase user ID
  moderators: [{ type: String }], // Array of Supabase user IDs
  member_count: { type: Number, default: 0 },
  is_private: { type: Boolean, default: false },
  rules: [{ type: String }],
  tags: [{ type: String }],
  settings: {
    allow_media: { type: Boolean, default: true },
    require_approval: { type: Boolean, default: false },
    auto_approve_members: { type: Boolean, default: true }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for performance
CommunitySchema.index({ language: 1, level: 1 })
CommunitySchema.index({ creator_id: 1 })
CommunitySchema.index({ tags: 1 })

export const CommunityModel = mongoose.models.Community || 
  mongoose.model('Community', CommunitySchema)

// models/Post.ts
const PostSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // Supabase user ID
  community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  media: [{
    type: { type: String, enum: ['image', 'video', 'audio'] },
    url: { type: String, required: true },
    thumbnail: String,
    alt: String,
    size: Number,
    width: Number,
    height: Number
  }],
  reactions: [{
    user_id: { type: String, required: true },
    type: { type: String, enum: ['like', 'love', 'helpful', 'celebrate', 'thinking'] },
    created_at: { type: Date, default: Date.now }
  }],
  comments: [{
    user_id: { type: String, required: true },
    content: { type: String, required: true, maxlength: 500 },
    created_at: { type: Date, default: Date.now },
    edited_at: Date
  }],
  tags: [{ type: String, maxlength: 50 }],
  language_note: { // For language learning corrections
    corrected_text: String,
    corrections: [{
      original: String,
      suggested: String,
      type: { type: String, enum: ['grammar', 'vocabulary', 'spelling', 'style'] },
      explanation: String
    }]
  },
  is_pinned: { type: Boolean, default: false },
  is_archived: { type: Boolean, default: false },
  view_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes
PostSchema.index({ community_id: 1, created_at: -1 })
PostSchema.index({ user_id: 1, created_at: -1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ 'reactions.user_id': 1 })

export const PostModel = mongoose.models.Post || 
  mongoose.model('Post', PostSchema)

// models/Conversation.ts
const ConversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // Supabase user IDs
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  title: String, // For group conversations
  messages: [{
    sender_id: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'audio', 'file'], default: 'text' },
    media_url: String,
    reply_to: mongoose.Schema.Types.ObjectId, // Reference to another message
    edited_at: Date,
    created_at: { type: Date, default: Date.now }
  }],
  last_message_at: { type: Date, default: Date.now },
  is_archived: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes
ConversationSchema.index({ participants: 1, last_message_at: -1 })
ConversationSchema.index({ 'messages.sender_id': 1 })

export const ConversationModel = mongoose.models.Conversation || 
  mongoose.model('Conversation', ConversationSchema)

// models/Activity.ts
const ActivitySchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // Supabase user ID
  action: { 
    type: String, 
    required: true,
    enum: [
      'profile_updated', 'post_created', 'comment_added', 'reaction_added',
      'community_joined', 'community_left', 'lesson_completed', 'achievement_earned',
      'friend_added', 'message_sent', 'conversation_started', 'login', 'logout'
    ]
  },
  target_type: { 
    type: String, 
    enum: ['post', 'comment', 'community', 'user', 'lesson', 'conversation', 'achievement'],
    required: function() { 
      return this.target_id != null 
    }
  },
  target_id: { type: String }, // Reference to the target object
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: { type: Date, default: Date.now },
  ip_address: String,
  user_agent: String
}, {
  timestamps: { createdAt: 'timestamp' }
})

// Indexes for activity tracking
ActivitySchema.index({ user_id: 1, timestamp: -1 })
ActivitySchema.index({ action: 1, timestamp: -1 })
ActivitySchema.index({ target_type: 1, target_id: 1 })

export const ActivityModel = mongoose.models.Activity || 
  mongoose.model('Activity', ActivitySchema)

// models/Resource.ts
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  content_type: { 
    type: String, 
    enum: ['video', 'audio', 'pdf', 'article', 'interactive', 'quiz', 'flashcards'],
    required: true 
  },
  language: { type: String, required: true },
  target_language: { type: String }, // Language being learned
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  topics: [{ type: String, trim: true }], // Grammar, vocabulary, pronunciation, etc.
  tags: [{ type: String, trim: true, maxlength: 30 }],
  url: { type: String }, // External URL or file path
  file_data: {
    size: Number,
    mime_type: String,
    duration: Number, // For video/audio in seconds
    transcript: String // For audio/video content
  },
  creator_id: { type: String, required: true }, // Supabase user ID
  is_public: { type: Boolean, default: true },
  is_premium: { type: Boolean, default: false },
  usage_count: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user_id: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for resource discovery
ResourceSchema.index({ language: 1, difficulty: 1, content_type: 1 })
ResourceSchema.index({ tags: 1 })
ResourceSchema.index({ topics: 1 })
ResourceSchema.index({ creator_id: 1 })
ResourceSchema.index({ 'rating.average': -1, usage_count: -1 })
ResourceSchema.index({ is_public: 1, is_premium: 1 })

export const ResourceModel = mongoose.models.Resource || 
  mongoose.model('Resource', ResourceSchema)

// models/Notification.ts
const NotificationSchema = new mongoose.Schema({
  recipient_id: { type: String, required: true }, // Supabase user ID
  sender_id: { type: String }, // Supabase user ID (optional for system notifications)
  type: { 
    type: String, 
    required: true,
    enum: [
      'friend_request', 'friend_accepted', 'message', 'mention', 'reaction',
      'comment', 'community_invite', 'achievement', 'lesson_reminder',
      'subscription_update', 'system_announcement', 'content_featured'
    ]
  },
  title: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 500 },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  action_url: { type: String }, // Deep link to relevant page
  is_read: { type: Boolean, default: false },
  is_archived: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal' 
  },
  expires_at: { type: Date }, // Optional expiration for time-sensitive notifications
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at' }
})

// Indexes for notification management
NotificationSchema.index({ recipient_id: 1, created_at: -1 })
NotificationSchema.index({ recipient_id: 1, is_read: 1 })
NotificationSchema.index({ type: 1, created_at: -1 })
NotificationSchema.index({ expires_at: 1 }, { sparse: true })

export const NotificationModel = mongoose.models.Notification || 
  mongoose.model('Notification', NotificationSchema)

// models/Media.ts
const MediaSchema = new mongoose.Schema({
  upload_id: { type: String, required: true, unique: true }, // Supabase Storage file ID
  user_id: { type: String, required: true }, // Supabase user ID
  filename: { type: String, required: true },
  original_name: { type: String, required: true },
  mime_type: { type: String, required: true },
  size: { type: Number, required: true }, // File size in bytes
  dimensions: {
    width: Number,
    height: Number
  },
  duration: Number, // For video/audio files in seconds
  url: { type: String, required: true }, // Supabase Storage URL
  thumbnail_url: String, // For videos and large images
  alt_text: { type: String, maxlength: 200 },
  tags: [{ type: String, maxlength: 30 }],
  usage_count: { type: Number, default: 0 },
  is_public: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error'],
    default: 'uploading'
  },
  metadata: {
    // EXIF data for images, codec info for videos, etc.
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Indexes for media management
MediaSchema.index({ user_id: 1, created_at: -1 })
MediaSchema.index({ upload_id: 1 })
MediaSchema.index({ mime_type: 1 })
MediaSchema.index({ status: 1 })
MediaSchema.index({ tags: 1 })

export const MediaModel = mongoose.models.Media || 
  mongoose.model('Media', MediaSchema)
```

### TypeScript Type Definitions

```typescript
// types/database.ts - Enhanced TypeScript types
import { Database as DatabaseGenerated } from './supabase-generated.types'
import { MergeDeep } from 'type-fest'
import { ObjectId } from 'mongodb'

// Enhanced Database type with custom JSON schemas
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        profiles: {
          Row: {
            learning_languages: string[] // Enhanced JSON type
            preferences: UserPreferences | null
            achievements: Achievement[] | null
          }
          Insert: {
            learning_languages?: string[]
            preferences?: UserPreferences | null
            achievements?: Achievement[] | null
          }
          Update: {
            learning_languages?: string[]
            preferences?: UserPreferences | null
            achievements?: Achievement[] | null
          }
        }
        learning_paths: {
          Row: {
            curriculum: Curriculum | null
            settings: LearningPathSettings | null
          }
          Insert: {
            curriculum?: Curriculum | null
            settings?: LearningPathSettings | null
          }
          Update: {
            curriculum?: Curriculum | null
            settings?: LearningPathSettings | null
          }
        }
      }
    }
  }
>

// Custom JSON type definitions
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    in_app: boolean
    daily_reminder: boolean
    weekly_summary: boolean
  }
  privacy: {
    profile_visibility: 'public' | 'friends' | 'private'
    show_progress: boolean
    allow_friend_requests: boolean
  }
  learning: {
    daily_goal: number // minutes per day
    preferred_difficulty: 'beginner' | 'intermediate' | 'advanced'
    auto_play_audio: boolean
    show_corrections: boolean
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned_at: string
  category: 'learning' | 'social' | 'streak' | 'milestone'
  points: number
}

export interface Curriculum {
  modules: CurriculumModule[]
  prerequisites: string[]
  estimated_completion_time: number
}

export interface CurriculumModule {
  id: string
  title: string
  description: string
  lessons: CurriculumLesson[]
  order: number
  is_required: boolean
}

export interface CurriculumLesson {
  id: string
  title: string
  type: 'video' | 'interactive' | 'quiz' | 'reading' | 'speaking'
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skills: string[]
  order: number
}

export interface LearningPathSettings {
  is_self_paced: boolean
  allow_skip: boolean
  require_completion: boolean
  certificate_enabled: boolean
  community_enabled: boolean
}

// MongoDB Document Types with enhanced TypeScript
export interface CommunityDocument {
  _id: ObjectId
  name: string
  description: string
  language: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed'
  creator_id: string
  moderators: string[]
  member_count: number
  is_private: boolean
  rules: string[]
  tags: string[]
  settings: {
    allow_media: boolean
    require_approval: boolean
    auto_approve_members: boolean
  }
  created_at: Date
  updated_at: Date
}

export interface PostDocument {
  _id: ObjectId
  user_id: string
  community_id: ObjectId
  content: string
  media: MediaAttachment[]
  reactions: Reaction[]
  comments: Comment[]
  tags: string[]
  language_note?: LanguageNote
  is_pinned: boolean
  is_archived: boolean
  view_count: number
  created_at: Date
  updated_at: Date
}

export interface MediaAttachment {
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  alt?: string
  size?: number
  width?: number
  height?: number
}

export interface Reaction {
  user_id: string
  type: 'like' | 'love' | 'helpful' | 'celebrate' | 'thinking'
  created_at: Date
}

export interface Comment {
  user_id: string
  content: string
  created_at: Date
  edited_at?: Date
}

export interface LanguageNote {
  corrected_text: string
  corrections: LanguageCorrection[]
}

export interface LanguageCorrection {
  original: string
  suggested: string
  type: 'grammar' | 'vocabulary' | 'spelling' | 'style'
  explanation: string
}

export interface ConversationDocument {
  _id: ObjectId
  participants: string[]
  type: 'direct' | 'group'
  title?: string
  messages: Message[]
  last_message_at: Date
  is_archived: boolean
  created_at: Date
  updated_at: Date
}

export interface Message {
  sender_id: string
  content: string
  type: 'text' | 'image' | 'audio' | 'file'
  media_url?: string
  reply_to?: ObjectId
  edited_at?: Date
  created_at: Date
}

export interface ActivityDocument {
  _id: ObjectId
  user_id: string
  action: string
  target_type?: string
  target_id?: string
  metadata: Record<string, any>
  timestamp: Date
  ip_address?: string
  user_agent?: string
}

export interface ResourceDocument {
  _id: ObjectId
  title: string
  description: string
  content_type: 'video' | 'audio' | 'pdf' | 'article' | 'interactive' | 'quiz' | 'flashcards'
  language: string
  target_language?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
  tags: string[]
  url?: string
  file_data?: {
    size: number
    mime_type: string
    duration?: number
    transcript?: string
  }
  creator_id: string
  is_public: boolean
  is_premium: boolean
  usage_count: number
  rating: {
    average: number
    count: number
  }
  reviews: ResourceReview[]
  created_at: Date
  updated_at: Date
}

export interface ResourceReview {
  user_id: string
  rating: number
  comment?: string
  created_at: Date
}

export interface NotificationDocument {
  _id: ObjectId
  recipient_id: string
  sender_id?: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  action_url?: string
  is_read: boolean
  is_archived: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  expires_at?: Date
  created_at: Date
}

export interface MediaDocument {
  _id: ObjectId
  upload_id: string
  user_id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
  duration?: number
  url: string
  thumbnail_url?: string
  alt_text?: string
  tags: string[]
  usage_count: number
  is_public: boolean
  status: 'uploading' | 'processing' | 'ready' | 'error'
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

// Helper types for API responses
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T]

// Query result types
import { QueryData, QueryError } from '@supabase/supabase-js'

// Example usage for complex queries
export const getUserProfileWithProgressQuery = (supabase: any, userId: string) =>
  supabase
    .from('profiles')
    .select(`
      *,
      progress (
        id,
        lesson_id,
        status,
        score,
        completed_at,
        lessons:lesson_id (
          title,
          learning_path_id,
          learning_paths:learning_path_id (
            title,
            language
          )
        )
      ),
      subscriptions (
        status,
        plan_name,
        current_period_end
      )
    `)
    .eq('id', userId)
    .single()

export type UserProfileWithProgress = QueryData<
  ReturnType<typeof getUserProfileWithProgressQuery>
>
```

---

## 🚀 Enhanced Setup Instructions (2025)

### 1. Install Database Dependencies

```bash
# Supabase dependencies
pnpm add @supabase/supabase-js @supabase/ssr

# MongoDB dependencies  
pnpm add mongoose

# Additional type utilities
pnpm add type-fest

# Development dependencies
pnpm add -D supabase @types/bcryptjs
```

### 2. Install Form Validation and Utilities

```bash
# Form validation and data handling
pnpm add zod server-only

# Date handling utilities
pnpm add date-fns

# Optional: Additional utilities
pnpm add lodash
pnpm add -D @types/lodash
```

### 3. Initialize Supabase Project (Updated CLI)

```bash
# Install Supabase CLI globally or as dev dependency
pnpm add -D supabase

# Login to Supabase
npx supabase login

# Initialize project
npx supabase init

# Link to your remote project
npx supabase link --project-ref your-project-ref

# Generate TypeScript types from your database
npx supabase gen types typescript --project-id your-project-ref --schema public > types/supabase-generated.types.ts

# Pull remote schema for local development
npx supabase db pull
```

### 4. Set up Enhanced Database Schemas

```bash
# Apply Supabase migrations
npx supabase db reset

# Create additional tables if needed
npx supabase migration new add_missing_tables
```

### 5. Configure Enhanced Authentication

In your Supabase dashboard:

1. **Authentication Settings**:
   - Enable email/password authentication
   - Configure OAuth providers (Google, GitHub, Discord)
   - Set up custom SMTP for emails
   - Configure password requirements

2. **URL Configuration**:
   - Site URL: `http://localhost:3000` (development)
   - Redirect URLs: `http://localhost:3000/auth/callback`

3. **Email Templates**:
   - Customize confirmation and recovery emails
   - Add your branding and styling

### 6. Set up Enhanced Row Level Security

```sql
-- Run in Supabase SQL editor
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS policies with better performance
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Performance optimized policies
CREATE INDEX idx_profiles_user_id ON profiles(id);
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

### 7. Initialize MongoDB Collections and Indexes

```typescript
// scripts/init-mongodb.ts
import { connectMongoDB } from '@/lib/mongodb'
import { 
  CommunityModel, 
  PostModel, 
  ConversationModel,
  ActivityModel,
  ResourceModel,
  NotificationModel,
  MediaModel 
} from '@/models'

async function initializeDatabase() {
  try {
    await connectMongoDB()
    
    // Create optimized indexes for all collections
    console.log('Creating Community indexes...')
    await CommunityModel.collection.createIndex({ language: 1, level: 1 })
    await CommunityModel.collection.createIndex({ creator_id: 1 })
    await CommunityModel.collection.createIndex({ tags: 1 })
    await CommunityModel.collection.createIndex({ member_count: -1 })
    
    console.log('Creating Post indexes...')
    await PostModel.collection.createIndex({ community_id: 1, created_at: -1 })
    await PostModel.collection.createIndex({ user_id: 1, created_at: -1 })
    await PostModel.collection.createIndex({ tags: 1 })
    await PostModel.collection.createIndex({ 'reactions.user_id': 1 })
    
    console.log('Creating Conversation indexes...')
    await ConversationModel.collection.createIndex({ participants: 1, last_message_at: -1 })
    await ConversationModel.collection.createIndex({ 'messages.sender_id': 1 })
    
    console.log('Creating Activity indexes...')
    await ActivityModel.collection.createIndex({ user_id: 1, timestamp: -1 })
    await ActivityModel.collection.createIndex({ action: 1, timestamp: -1 })
    
    console.log('Creating Resource indexes...')
    await ResourceModel.collection.createIndex({ language: 1, difficulty: 1 })
    await ResourceModel.collection.createIndex({ tags: 1 })
    await ResourceModel.collection.createIndex({ 'rating.average': -1 })
    
    console.log('Creating Notification indexes...')
    await NotificationModel.collection.createIndex({ recipient_id: 1, created_at: -1 })
    await NotificationModel.collection.createIndex({ recipient_id: 1, is_read: 1 })
    
    console.log('Creating Media indexes...')
    await MediaModel.collection.createIndex({ user_id: 1, created_at: -1 })
    await MediaModel.collection.createIndex({ upload_id: 1 })
    await MediaModel.collection.createIndex({ status: 1 })
    
    console.log('MongoDB collections and indexes initialized successfully!')
  } catch (error) {
    console.error('Error initializing MongoDB:', error)
    throw error
  }
}

// Run the script
initializeDatabase()
```

Run the initialization script:

```bash
# Add to package.json scripts
{
  "scripts": {
    "db:init": "tsx scripts/init-mongodb.ts",
    "db:seed": "tsx scripts/seed-database.ts",
    "types:generate": "supabase gen types typescript --project-id $PROJECT_REF --schema public > types/supabase-generated.types.ts"
  }
}

# Install tsx for TypeScript execution
pnpm add -D tsx

# Run the initialization
pnpm run db:init
```

### 8. Set up Environment Variables (Enhanced)

```bash
# .env.local

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mumicah
MONGODB_DB_NAME=mumicah

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# External Services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email Service (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AI Services
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION=org-...

# File Upload (Supabase Storage)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=uploads
SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1

# Analytics & Monitoring
VERCEL_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_FEATURE_CHAT=true
NEXT_PUBLIC_FEATURE_AI_TUTOR=false
NEXT_PUBLIC_FEATURE_COMMUNITIES=true

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

### 9. Configure TypeScript (Enhanced)

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/components/*": ["./src/components/*"],
      "@/types/*": ["./types/*"],
      "@/models/*": ["./src/models/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 10. Create Project Structure

```bash
# Create the enhanced project structure
mkdir -p src/{components/{ui,layout,features},lib/{supabase,mongodb},models,services,hooks,utils}
mkdir -p types
mkdir -p scripts

# Create type definition files
touch types/database.ts
touch types/supabase.ts
touch types/api.ts
touch types/global.d.ts

# Create core library files
touch src/lib/supabase/server.ts
touch src/lib/supabase/client.ts
touch src/lib/supabase/middleware.ts
touch src/lib/mongodb.ts
touch src/lib/dal.ts
touch src/lib/validations.ts
touch src/lib/utils.ts

# Create model files
touch src/models/index.ts
touch src/models/Community.ts
touch src/models/Post.ts
touch src/models/Conversation.ts
touch src/models/Activity.ts
touch src/models/Resource.ts
touch src/models/Notification.ts
touch src/models/Media.ts

# Create service files
touch src/services/user.service.ts
touch src/services/community.service.ts
touch src/services/notification.service.ts

# Create utility scripts
touch scripts/init-mongodb.ts
touch scripts/seed-database.ts
```

This enhanced setup provides a robust foundation for the Mumicah language learning platform with modern best practices, type safety, and scalable architecture.
