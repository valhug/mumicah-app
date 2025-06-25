// components/features/ConversationInterface.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PersonaConversationService } from '@/services/persona-conversation-service';
import { PersonaId, ConversationContext, ConversationMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, MessageCircle, BookOpen, Globe } from 'lucide-react';

interface ConversationInterfaceProps {
  selectedPersona: PersonaId;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  culturalBackground: string;
  onConversationUpdate?: (messages: ConversationMessage[]) => void;
}

export function ConversationInterface({
  selectedPersona,
  userLevel,
  culturalBackground,
  onConversationUpdate
}: ConversationInterfaceProps) {
  
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationService] = useState(() => new PersonaConversationService());
  const [currentContext, setCurrentContext] = useState<ConversationContext>({
    conversationId: `conv_${Date.now()}`,
    userLevel,
    culturalBackground,
    sessionGoal: 'general_conversation',
    topics: ['daily_life'],
    difficultyLevel: userLevel
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation with persona greeting
  useEffect(() => {
    initializeConversation();
  }, [selectedPersona]);

  const initializeConversation = async () => {
    const greetingMessage = await getPersonaGreeting(selectedPersona);
    const initialMessage: ConversationMessage = {
      id: `msg_${Date.now()}`,
      sender: selectedPersona,
      content: greetingMessage.content,
      timestamp: new Date(),
      metadata: {
        culturalNotes: greetingMessage.culturalNotes,
        vocabularyHighlights: greetingMessage.vocabularyHighlights,
        grammarPoints: greetingMessage.grammarPoints
      }
    };
    
    setMessages([initialMessage]);
  };

  const getPersonaGreeting = async (personaId: PersonaId) => {
    // Based on our conversation data, generate appropriate greetings
    const greetings = {
      maya: {
        content: "Bonjour! Comment allez-vous aujourd'hui? J'espère que vos études se passent bien. N'hésitez pas si vous avez des questions!",
        culturalNotes: "French teachers often use formal 'vous' initially and show interest in students' academic progress.",
        vocabularyHighlights: [
          { word: 'études', category: 'academic', definition: 'studies, education' }
        ],
        grammarPoints: ['Formal greeting with vous', 'Present tense expressions']
      },
      alex: {
        content: "Salut! Quoi de neuf? J'ai entendu dire que tu apprends le français - c'est génial! On peut discuter de tout ce que tu veux.",
        culturalNotes: "Casual French greetings often use 'tu' form and express enthusiasm about shared interests.",
        vocabularyHighlights: [
          { word: 'quoi de neuf', category: 'casual', definition: 'what\'s new, what\'s up' }
        ],
        grammarPoints: ['Casual greeting with tu', 'Present continuous tense']
      },
      luna: {
        content: "Bonsoir! Permettez-moi de me présenter. Je suis là pour vous aider à découvrir la culture française. Comment puis-je vous aider aujourd'hui?",
        culturalNotes: "Formal French introductions emphasize cultural respect and offering assistance.",
        vocabularyHighlights: [
          { word: 'permettez-moi', category: 'formal', definition: 'allow me, permit me' }
        ],
        grammarPoints: ['Formal politeness structures', 'Subjunctive mood introduction']
      }
    };
    
    return greetings[personaId];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage: ConversationMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    try {
      // Generate persona response using conversation models
      const personaResponse = await conversationService.generatePersonaResponse(
        selectedPersona,
        currentMessage,
        currentContext
      );
      
      // Create persona message
      const personaMessage: ConversationMessage = {
        id: `msg_${Date.now()}_${selectedPersona}`,
        sender: selectedPersona,
        content: personaResponse.content,
        timestamp: new Date(),
        metadata: {
          culturalNotes: personaResponse.culturalNotes,
          vocabularyHighlights: personaResponse.vocabularyHighlights,
          grammarPoints: personaResponse.grammarPoints,
          audioPath: personaResponse.audioPath
        }
      };
      
      const finalMessages = [...updatedMessages, personaMessage];
      setMessages(finalMessages);
      
      // Update conversation context based on response
      setCurrentContext(prev => ({
        ...prev,
        topics: [...new Set([...prev.topics, ...extractTopics(currentMessage)])],
        conversationTurn: prev.conversationTurn ? prev.conversationTurn + 1 : 1
      }));
      
      // Callback for parent component
      onConversationUpdate?.(finalMessages);
      
    } catch (error) {
      console.error('Error generating persona response:', error);
      // Add error message
      const errorMessage: ConversationMessage = {
        id: `msg_${Date.now()}_error`,
        sender: selectedPersona,
        content: "Désolé, j'ai eu un petit problème. Pouvez-vous répéter votre question?",
        timestamp: new Date(),
        metadata: {
          isError: true
        }
      };
      setMessages([...updatedMessages, errorMessage]);
    }
    
    setCurrentMessage('');
    setIsLoading(false);
  };

  const playAudio = async (audioPath: string) => {
    try {
      const audio = new Audio(audioPath);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const extractTopics = (message: string): string[] => {
    // Simple topic extraction based on keywords from our conversation data
    const topicKeywords = {
      academic: ['étude', 'cours', 'examen', 'université', 'professeur'],
      work: ['travail', 'emploi', 'bureau', 'collègue', 'société'],
      social: ['ami', 'sortir', 'fête', 'weekend', 'restaurant'],
      health: ['médecin', 'santé', 'malade', 'médicament', 'hôpital'],
      travel: ['voyage', 'vacances', 'pays', 'culture', 'avion']
    };
    
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics.length > 0 ? topics : ['general'];
  };

  const getPersonaAvatar = (personaId: PersonaId) => {
    const avatars = {
      maya: "/personas/maya-teacher.jpg",
      alex: "/personas/alex-friend.jpg", 
      luna: "/personas/luna-guide.jpg"
    };
    return avatars[personaId];
  };

  const getPersonaName = (personaId: PersonaId) => {
    const names = {
      maya: "Maya (Professeure)",
      alex: "Alex (Ami)",
      luna: "Luna (Guide Culturel)"
    };
    return names[personaId];
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      
      {/* Conversation Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={getPersonaAvatar(selectedPersona)} 
              alt={getPersonaName(selectedPersona)}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <CardTitle className="text-lg">{getPersonaName(selectedPersona)}</CardTitle>
              <p className="text-sm text-gray-600">
                Conversation en français • Niveau: {userLevel}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  
                  {/* Message Content */}
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Persona Message Features */}
                  {message.sender !== 'user' && message.metadata && (
                    <div className="mt-2 space-y-2">
                      
                      {/* Audio Playback */}
                      {message.metadata.audioPath && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playAudio(message.metadata.audioPath!)}
                          className="p-1 h-auto"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {/* Vocabulary Highlights */}
                      {message.metadata.vocabularyHighlights && message.metadata.vocabularyHighlights.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {message.metadata.vocabularyHighlights.map((vocab, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {vocab.word}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Cultural Notes */}
                      {message.metadata.culturalNotes && (
                        <div className="text-xs text-gray-600 border-l-2 border-blue-200 pl-2 mt-1">
                          <Globe className="w-3 h-3 inline mr-1" />
                          {message.metadata.culturalNotes}
                        </div>
                      )}
                      
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Tapez votre message en français..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Suggestion Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            {getQuickSuggestions(selectedPersona).map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setCurrentMessage(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper function for quick suggestions based on conversation data
function getQuickSuggestions(personaId: PersonaId): string[] {
  const suggestions = {
    maya: [
      "Comment allez-vous?",
      "J'ai des questions sur mes études",
      "Pouvez-vous m'expliquer cette grammaire?",
      "Je ne comprends pas bien"
    ],
    alex: [
      "Quoi de neuf?", 
      "Qu'est-ce que tu fais ce weekend?",
      "Parle-moi de ton travail",
      "On peut sortir ensemble?"
    ],
    luna: [
      "Expliquez-moi cette coutume française",
      "Comment dit-on poliment...?",
      "Quelle est la différence culturelle?",
      "Puis-je avoir des conseils?"
    ]
  };
  
  return suggestions[personaId] || [];
}

export default ConversationInterface;
