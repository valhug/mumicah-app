'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@mumicah/ui'
import { 
  Users, 
  Globe, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock,
  Filter,
  Search
} from 'lucide-react'

interface LanguagePartner {
  id: string
  name: string
  avatar: string
  nativeLanguage: string
  learningLanguages: string[]
  level: string
  location: string
  timezone: string
  online: boolean
  rating: number
  totalSessions: number
  interests: string[]
  bio: string
  verified: boolean
}

interface LanguageExchangeProps {
  userId?: string
  className?: string
}

export default function LanguageExchange({ userId, className = '' }: LanguageExchangeProps) {
  const [partners, setPartners] = useState<LanguagePartner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadLanguagePartners()
  }, [])

  const loadLanguagePartners = async () => {
    setLoading(true)
    try {
      // Simulate API call - in real implementation, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockPartners: LanguagePartner[] = [
        {
          id: '1',
          name: 'Sofia Martinez',
          avatar: '👩🏻',
          nativeLanguage: 'Spanish',
          learningLanguages: ['English', 'French'],
          level: 'Intermediate',
          location: 'Madrid, Spain',
          timezone: 'CET',
          online: true,
          rating: 4.9,
          totalSessions: 245,
          interests: ['Travel', 'Cooking', 'Movies'],
          bio: 'Native Spanish speaker passionate about helping others learn while improving my English!',
          verified: true
        },
        {
          id: '2',
          name: 'Hiroshi Tanaka',
          avatar: '👨🏻',
          nativeLanguage: 'Japanese',
          learningLanguages: ['English', 'Korean'],
          level: 'Advanced',
          location: 'Tokyo, Japan',
          timezone: 'JST',
          online: true,
          rating: 4.8,
          totalSessions: 189,
          interests: ['Technology', 'Anime', 'Music'],
          bio: 'Software developer who loves cultural exchange and helping with Japanese language nuances.',
          verified: true
        },
        {
          id: '3',
          name: 'Emma Chen',
          avatar: '👩🏻',
          nativeLanguage: 'Mandarin',
          learningLanguages: ['Spanish', 'Italian'],
          level: 'Beginner',
          location: 'Singapore',
          timezone: 'SGT',
          online: false,
          rating: 4.7,
          totalSessions: 67,
          interests: ['Art', 'Food', 'History'],
          bio: 'Art student excited to practice languages and learn about different cultures!',
          verified: false
        },
        {
          id: '4',
          name: 'Lucas Dubois',
          avatar: '👨🏻',
          nativeLanguage: 'French',
          learningLanguages: ['German', 'Portuguese'],
          level: 'Intermediate',
          location: 'Lyon, France',
          timezone: 'CET',
          online: true,
          rating: 4.9,
          totalSessions: 312,
          interests: ['Sports', 'Literature', 'Wine'],
          bio: 'French teacher offering structured lessons and casual conversations.',
          verified: true
        },
        {
          id: '5',
          name: 'Priya Sharma',
          avatar: '👩🏽',
          nativeLanguage: 'Hindi',
          learningLanguages: ['English', 'Spanish'],
          level: 'Advanced',
          location: 'Mumbai, India',
          timezone: 'IST',
          online: true,
          rating: 4.8,
          totalSessions: 156,
          interests: ['Dance', 'Business', 'Yoga'],
          bio: 'Business professional passionate about languages and cross-cultural communication.',
          verified: true
        },
        {
          id: '6',
          name: 'Ahmed Hassan',
          avatar: '👨🏽',
          nativeLanguage: 'Arabic',
          learningLanguages: ['English', 'French'],
          level: 'Intermediate',
          location: 'Cairo, Egypt',
          timezone: 'EET',
          online: false,
          rating: 4.6,
          totalSessions: 98,
          interests: ['History', 'Photography', 'Travel'],
          bio: 'History enthusiast who loves sharing Arabic culture and learning from others.',
          verified: true
        }
      ]

      setPartners(mockPartners)
    } catch (error) {
      console.error('Error loading language partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.nativeLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.learningLanguages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLanguage = filterLanguage === 'all' || 
      partner.nativeLanguage === filterLanguage ||
      partner.learningLanguages.includes(filterLanguage)
    
    const matchesLevel = filterLevel === 'all' || partner.level === filterLevel

    return matchesSearch && matchesLanguage && matchesLevel
  })

  const handleConnect = (partnerId: string) => {
    console.log('Connecting with partner:', partnerId)
    // In real implementation, this would initiate a connection request
  }

  const handleMessage = (partnerId: string) => {
    console.log('Messaging partner:', partnerId)
    // In real implementation, this would open a chat with the partner
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Language Exchange Partners</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {filteredPartners.length} partners available
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Language</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="border border-gray-200 rounded px-3 py-1 text-sm"
                aria-label="Filter by language"
              >
                <option value="all">All Languages</option>
                <option value="Spanish">Spanish</option>
                <option value="Japanese">Japanese</option>
                <option value="French">French</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Hindi">Hindi</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="border border-gray-200 rounded px-3 py-1 text-sm"
                aria-label="Filter by level"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map(partner => (
          <div
            key={partner.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="text-3xl">{partner.avatar}</div>
                {partner.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 truncate">{partner.name}</h4>
                  {partner.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{partner.rating}</span>
                  <span>({partner.totalSessions} sessions)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Native:</span>
                <span>{partner.nativeLanguage}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Learning:</span>
                <span>{partner.learningLanguages.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{partner.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{partner.timezone} • {partner.level}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {partner.bio}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {partner.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleConnect(partner.id)}
                className="flex-1"
              >
                Connect
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMessage(partner.id)}
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No language partners found matching your criteria.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setFilterLanguage('all')
              setFilterLevel('all')
            }}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
    </Card>
  )
}
