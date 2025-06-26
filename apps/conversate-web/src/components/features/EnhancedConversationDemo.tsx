// components/features/EnhancedConversationDemo.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedPersonaConversationService } from '@/services/enhanced-persona-conversation-service';
import { ConversationDataProcessor } from '@/services/conversation-data-processor';
import { PersonaId, ConversationContext, ConversationMessage, EnhancedConversationContext } from '@/types/conversation';
import { Button, Card, Badge, CardHeader, CardContent, CardTitle } from '@mumicah/ui';
import { 
  MessageCircle, 
  User, 
  BookOpen, 
  Globe, 
  Lightbulb, 
  Volume2,
  Settings,
  Play,
  RotateCcw
} from 'lucide-react';

interface PersonaOption {
  id: PersonaId;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function EnhancedConversationDemo() {
  const [conversationService, setConversationService] = useState<EnhancedPersonaConversationService | null>(null);
  const [dataProcessor] = useState(() => new ConversationDataProcessor());
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('maya');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedScenario, setSelectedScenario] = useState('general');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    conversationId: `conv_${Date.now()}`,
    userLevel: 'intermediate',
    culturalBackground: 'english',
    sessionGoal: 'practice_conversation',
    topics: ['daily_life'],
    difficultyLevel: 'intermediate'
  });

  const personas: PersonaOption[] = [
    {
      id: 'maya',
      name: 'Maya',
      description: 'Patient teacher focused on grammar and learning',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    {
      id: 'alex',
      name: 'Alex',
      description: 'Friendly companion for casual conversation',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-green-500'
    },
    {
      id: 'luna',
      name: 'Luna',
      description: 'Cultural guide for French traditions',
      icon: <Globe className="w-4 h-4" />,
      color: 'bg-purple-500'
    }
  ];

  const scenarios = [
    { value: 'general', label: 'General Conversation' },
    { value: 'academic', label: 'Academic Life' },
    { value: 'professional', label: 'Professional Settings' },
    { value: 'recreational', label: 'Sports & Recreation' },
    { value: 'travel', label: 'Travel & Tourism' },
    { value: 'dining', label: 'Food & Dining' },
    { value: 'cultural', label: 'Cultural Exploration' }
  ];

  // Initialize the conversation service with processed data
  useEffect(() => {
    initializeConversationService();
  }, []);

  const initializeConversationService = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you would load this from your processed data files
      // For now, we'll create a simple instance
      const service = new EnhancedPersonaConversationService();
      setConversationService(service);
      setIsInitialized(true);
      
      console.log('✅ Conversation service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize conversation service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new conversation with selected persona
  const startNewConversation = async () => {
    if (!conversationService) return;
    
    try {
      setIsLoading(true);
      setMessages([]);
      
      // Get conversation starter from persona
      const starter = conversationService.getConversationStarter(
        selectedPersona, 
        userLevel, 
        selectedScenario
      );
      
      let initialMessage = '';
      if (starter) {
        initialMessage = starter.opener;
      } else {
        // Default greetings
        const defaultGreetings = {
          maya: "Bonjour ! Je suis Maya, ton professeur de français. Comment ça va aujourd'hui ? Es-tu prêt à apprendre quelque chose de nouveau ?",
          alex: "Salut ! Moi c'est Alex ! Alors, qu'est-ce que tu fais de beau aujourd'hui ? Tu veux qu'on discute un peu ?",
          luna: "Bonsoir ! Je suis Luna. J'adore parler de la culture française ! Dis-moi, qu'est-ce qui t'intéresse le plus dans la France ?"
        };
        initialMessage = defaultGreetings[selectedPersona];
      }
      
      const initialMessageObj: ConversationMessage = {
        id: `msg_${Date.now()}`,
        sender: selectedPersona,
        content: initialMessage,
        timestamp: new Date(),
        metadata: {
          culturalNotes: starter?.context || 'Conversation starter',
          vocabularyHighlights: [],
          grammarPoints: [],
          audioPath: undefined
        }
      };
      
      setMessages([initialMessageObj]);
      
    } catch (error) {
      console.error('❌ Error starting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send user message and get persona response
  const sendMessage = async () => {
    if (!conversationService || !currentMessage.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessageObj: ConversationMessage = {
        id: `msg_${Date.now()}_user`,
        sender: 'user',
        content: currentMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessageObj]);
      setCurrentMessage('');
      
      // Generate persona response
      const enhancedContext: EnhancedConversationContext = {
        userLevel: conversationContext.userLevel,
        conversationContext: {
          scenario: selectedScenario,
          previousMessages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          userPreferences: {
            focusAreas: ['conversation'],
            learningStyle: 'interactive'
          }
        }
      };
      
      const response = await conversationService.generatePersonaResponse(
        selectedPersona,
        currentMessage,
        enhancedContext
      );
      
      // Add persona response
      const personaMessageObj: ConversationMessage = {
        id: `msg_${Date.now()}_${selectedPersona}`,
        sender: selectedPersona,
        content: response.content,
        timestamp: new Date(),
        metadata: {
          culturalNotes: response.culturalNotes,
          vocabularyHighlights: response.vocabularyHighlights,
          grammarPoints: response.grammarPoints,
          audioPath: response.audioPath
        }
      };
      
      setMessages(prev => [...prev, personaMessageObj]);
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedPersonaInfo = personas.find(p => p.id === selectedPersona);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Initializing conversation system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Enhanced Conversate Demo</h1>
        <p className="text-gray-600">
          Interactive French conversation with AI personas powered by real transcript data
        </p>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Conversation Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Persona Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Choose Persona</label>
              <div className="space-y-2">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedPersona === persona.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full text-white ${persona.color}`}>
                        {persona.icon}
                      </div>
                      <div>
                        <div className="font-medium">{persona.name}</div>
                        <div className="text-sm text-gray-600">{persona.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Level & Scenario */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Level</label>
                <select 
                  value={userLevel} 
                  onChange={(e) => setUserLevel(e.target.value as typeof userLevel)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  title="Select your language level"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scenario</label>
                <select 
                  value={selectedScenario} 
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white w-full"
                  title="Select a conversation scenario"
                >
                  {scenarios.map((scenario) => (
                    <option key={scenario.value} value={scenario.value}>
                      {scenario.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start Conversation */}
            <div className="flex flex-col justify-center">
              <Button 
                onClick={startNewConversation}
                disabled={isLoading}
                className="w-full mb-2"
              >
                <Play className="w-4 h-4 mr-2" />
                Start New Conversation
              </Button>
              <Button 
                variant="outline"
                onClick={() => setMessages([])}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Messages
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Conversation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-3">
                {selectedPersonaInfo && (
                  <>
                    <div className={`p-2 rounded-full text-white ${selectedPersonaInfo.color}`}>
                      {selectedPersonaInfo.icon}
                    </div>
                    <div>
                      <span>Conversation with {selectedPersonaInfo.name}</span>
                      <div className="text-sm font-normal text-gray-600">
                        {selectedPersonaInfo.description}
                      </div>
                    </div>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation to begin practicing!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          selectedPersonaInfo?.icon
                        )}
                        <span className="text-sm font-medium">
                          {message.sender === 'user' ? 'You' : selectedPersonaInfo?.name}
                        </span>
                        {message.metadata?.audioPath && (
                          <Button size="sm" variant="ghost" className="p-1">
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p>{message.content}</p>
                      
                      {/* Show metadata for persona messages */}
                      {message.sender !== 'user' && message.metadata && (
                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                          {message.metadata.culturalNotes && (
                            <div className="mb-1">
                              <strong>Cultural Note:</strong> {message.metadata.culturalNotes}
                            </div>
                          )}
                          {message.metadata.grammarPoints && message.metadata.grammarPoints.length > 0 && (
                            <div className="mb-1">
                              <strong>Grammar:</strong> {message.metadata.grammarPoints.join(', ')}
                            </div>
                          )}
                          {message.metadata.vocabularyHighlights && message.metadata.vocabularyHighlights.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {message.metadata.vocabularyHighlights.slice(0, 3).map((vocab, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {vocab.word}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      <span className="text-sm text-gray-600">
                        {selectedPersonaInfo?.name} is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message in French..."
                  className="flex-1 min-h-[60px] resize-none px-3 py-2 border border-gray-300 rounded-md text-sm"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="px-6"
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Learning Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Learning Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>Current Persona:</strong> {selectedPersonaInfo?.name}
                <p className="text-gray-600 mt-1">{selectedPersonaInfo?.description}</p>
              </div>
              
              <div className="text-sm">
                <strong>Level:</strong> {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
                <p className="text-gray-600 mt-1">
                  Conversations are adapted to your current level
                </p>
              </div>
              
              <div className="text-sm">
                <strong>Scenario:</strong> {scenarios.find(s => s.value === selectedScenario)?.label}
                <p className="text-gray-600 mt-1">
                  This affects vocabulary and cultural context
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Ask for grammar help
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Learn about French culture
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Change conversation topic
              </Button>
            </CardContent>
          </Card>

          {/* Conversation Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Messages:</span>
                  <span>{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your messages:</span>
                  <span>{messages.filter(m => m.sender === 'user').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Persona responses:</span>
                  <span>{messages.filter(m => m.sender !== 'user').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
