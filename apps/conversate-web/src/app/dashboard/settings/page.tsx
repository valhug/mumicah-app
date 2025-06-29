'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Button } from '@mumicah/ui'
import { 
  User, 
  Bell, 
  Shield, 
  Volume2, 
  Monitor,
  Download,
  Trash2,
  Save
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      targetLanguage: 'Spanish',
      nativeLanguage: 'English',
      proficiencyLevel: 'Intermediate',
      learningGoals: ['Conversation', 'Business', 'Travel']
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: true,
      achievementAlerts: true,
      reminderNotifications: true
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      compactMode: false
    },
    privacy: {
      conversationHistory: true,
      analyticsSharing: false,
      profileVisibility: 'private'
    },
    voice: {
      speechRate: 1.0,
      voicePitch: 1.0,
      autoSpeak: true,
      pronunciationFeedback: true
    }
  })

  const [activeSection, setActiveSection] = useState('profile')
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (section: string, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Here you would save to your backend
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Monitor },
    { id: 'voice', name: 'Voice & Audio', icon: Volume2 },
    { id: 'privacy', name: 'Privacy', icon: Shield },
  ]

  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese']
  const proficiencyLevels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced']
  const themes = ['light', 'dark', 'system']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="p-4 h-fit">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.name}
                </button>
              )
            })}
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Language</label>
                      <select
                        value={settings.profile.targetLanguage}
                        onChange={(e) => updateSetting('profile', 'targetLanguage', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Native Language</label>
                      <select
                        value={settings.profile.nativeLanguage}
                        onChange={(e) => updateSetting('profile', 'nativeLanguage', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Proficiency Level</label>
                    <select
                      value={settings.profile.proficiencyLevel}
                      onChange={(e) => updateSetting('profile', 'proficiencyLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {proficiencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {key === 'emailNotifications' && 'Receive important updates via email'}
                          {key === 'pushNotifications' && 'Get instant notifications on your device'}
                          {key === 'weeklyReport' && 'Weekly summary of your learning progress'}
                          {key === 'achievementAlerts' && 'Notifications when you unlock achievements'}
                          {key === 'reminderNotifications' && 'Daily reminders to practice'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                        className="w-4 h-4 text-primary border border-border rounded focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <div className="flex gap-2">
                      {themes.map(theme => (
                        <Button
                          key={theme}
                          variant={settings.appearance.theme === theme ? "default" : "outline"}
                          onClick={() => updateSetting('appearance', 'theme', theme)}
                          className="capitalize"
                        >
                          {theme}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large'].map(size => (
                        <Button
                          key={size}
                          variant={settings.appearance.fontSize === size ? "default" : "outline"}
                          onClick={() => updateSetting('appearance', 'fontSize', size)}
                          className="capitalize"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Compact Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing for a more dense interface
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactMode}
                      onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                      className="w-4 h-4 text-primary border border-border rounded focus:ring-primary"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Voice Settings */}
            {activeSection === 'voice' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Voice & Audio</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Speech Rate</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.voice.speechRate}
                      onChange={(e) => updateSetting('voice', 'speechRate', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slow</span>
                      <span>{settings.voice.speechRate}x</span>
                      <span>Fast</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Voice Pitch</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.voice.voicePitch}
                      onChange={(e) => updateSetting('voice', 'voicePitch', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>{settings.voice.voicePitch}x</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto Speak</h3>
                        <p className="text-sm text-muted-foreground">
                          Automatically read responses aloud
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.voice.autoSpeak}
                        onChange={(e) => updateSetting('voice', 'autoSpeak', e.target.checked)}
                        className="w-4 h-4 text-primary border border-border rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Pronunciation Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                          Get feedback on your pronunciation
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.voice.pronunciationFeedback}
                        onChange={(e) => updateSetting('voice', 'pronunciationFeedback', e.target.checked)}
                        className="w-4 h-4 text-primary border border-border rounded focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Privacy & Data</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Save Conversation History</h3>
                        <p className="text-sm text-muted-foreground">
                          Keep your conversations for review and progress tracking
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.conversationHistory}
                        onChange={(e) => updateSetting('privacy', 'conversationHistory', e.target.checked)}
                        className="w-4 h-4 text-primary border border-border rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Analytics Sharing</h3>
                        <p className="text-sm text-muted-foreground">
                          Share anonymized usage data to help improve the platform
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.analyticsSharing}
                        onChange={(e) => updateSetting('privacy', 'analyticsSharing', e.target.checked)}
                        className="w-4 h-4 text-primary border border-border rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <h3 className="font-medium text-foreground">Data Management</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
