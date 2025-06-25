#!/usr/bin/env tsx

import { EnhancedPersonaConversationService } from '../src/services/enhanced-persona-conversation-service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Demo script to showcase the enhanced persona conversation service
 * using real French conversation data
 */
async function runPersonaDemo() {
  console.log('🎭 Enhanced Persona Conversation Demo');
  console.log('=====================================\n');

  // Load processed conversation patterns
  const processedPatternsPath = path.join(__dirname, '../src/data/processed-conversation-patterns.json');
  const processedPatterns = JSON.parse(fs.readFileSync(processedPatternsPath, 'utf-8'));
  
  console.log(`📊 Loaded ${processedPatterns.length} processed conversation patterns\n`);

  const service = new EnhancedPersonaConversationService(processedPatterns);

  // Test scenarios for each persona
  const testScenarios = [
    {
      persona: 'maya' as const,
      userLevel: 'beginner' as const,
      userInput: "Je voudrais apprendre la géographie de l'Europe",
      scenario: 'educational' as const,
      description: 'Maya helping with geography learning'
    },
    {
      persona: 'alex' as const,
      userLevel: 'intermediate' as const,
      userInput: "Qu'est-ce que tu penses de cette veste?",
      scenario: 'general' as const,
      description: 'Alex discussing fashion casually'
    },
    {
      persona: 'luna' as const,
      userLevel: 'beginner' as const,
      userInput: "Qu'est-ce qu'on mange pour le petit-déjeuner en France?",
      scenario: 'dining' as const,
      description: 'Luna sharing French breakfast culture'
    },
    {
      persona: 'maya' as const,
      userLevel: 'intermediate' as const,
      userInput: "Je ne comprends pas la différence entre 'tu' et 'vous'",
      scenario: 'educational' as const,
      description: 'Maya explaining formal vs informal address'
    },
    {
      persona: 'alex' as const,
      userLevel: 'beginner' as const,
      userInput: "Comment se passe tes vacances?",
      scenario: 'travel' as const,
      description: 'Alex sharing travel experiences'
    }
  ];

  for (const test of testScenarios) {
    console.log(`🎬 Scenario: ${test.description}`);
    console.log(`👤 Persona: ${test.persona.toUpperCase()}`);
    console.log(`📚 User Level: ${test.userLevel}`);
    console.log(`💬 User Input: "${test.userInput}"`);
    console.log(`🎯 Context: ${test.scenario}\n`);

    try {
      const response = await service.generatePersonaResponse(
        test.persona,
        test.userInput,
        {
          userLevel: test.userLevel,
          conversationContext: {
            scenario: test.scenario,
            previousMessages: [],
            userPreferences: {
              focusAreas: ['grammar', 'vocabulary', 'culture'],
              learningStyle: 'interactive'
            }
          }
        }
      );

      console.log('🤖 Persona Response:');
      console.log(`   "${response.response}"\n`);
        if (response.teachingElements) {
        if (response.teachingElements.vocabularyHighlights && response.teachingElements.vocabularyHighlights.length > 0) {
          console.log('📚 Vocabulary Highlights:');
          response.teachingElements.vocabularyHighlights.forEach(v => {
            console.log(`   • ${v.word}: ${v.definition} (${v.category})`);
          });
          console.log('');
        }

        if (response.teachingElements.grammarExplanations && response.teachingElements.grammarExplanations.length > 0) {
          console.log('📝 Grammar Points:');
          response.teachingElements.grammarExplanations.forEach(g => {
            console.log(`   • ${g.concept}: ${g.explanation}`);
          });
          console.log('');
        }

        if (response.teachingElements.culturalInsights && response.teachingElements.culturalInsights.length > 0) {
          console.log('🌍 Cultural Insights:');
          response.teachingElements.culturalInsights.forEach(c => {
            console.log(`   • ${c.aspect}: ${c.description}`);
          });
          console.log('');
        }

        if (response.teachingElements.suggestedFollowUp) {
          console.log(`💡 Suggested Follow-up: "${response.teachingElements.suggestedFollowUp}"\n`);
        }
      }

      console.log('─'.repeat(60) + '\n');
    } catch (error) {
      console.error(`❌ Error generating response for ${test.persona}:`, error);
      console.log('─'.repeat(60) + '\n');
    }
  }

  // Demonstrate conversation context tracking
  console.log('🔄 Conversation Context Demo');
  console.log('=============================\n');

  const conversationHistory = [];
  const contextualInputs = [
    "Bonjour! Je voudrais apprendre le français.",
    "Oui, je suis débutant.",
    "Pouvez-vous m'aider avec la prononciation?"
  ];

  for (let i = 0; i < contextualInputs.length; i++) {
    const userInput = contextualInputs[i];
    console.log(`👤 Turn ${i + 1}: "${userInput}"`);

    try {
      const response = await service.generatePersonaResponse(
        'maya',
        userInput,
        {
          userLevel: 'beginner',
          conversationContext: {
            scenario: 'educational',
            previousMessages: [...conversationHistory],
            userPreferences: {
              focusAreas: ['pronunciation', 'basic_vocabulary'],
              learningStyle: 'structured'
            }
          }
        }
      );

      console.log(`🤖 Maya: "${response.response}"`);
        // Add to conversation history
      conversationHistory.push(
        { role: 'user', content: userInput },
        { role: 'assistant', content: response.response || response.content }
      );

      console.log('');
    } catch (error) {
      console.error(`❌ Error in conversation turn ${i + 1}:`, error);
    }
  }

  console.log('🎉 Enhanced Persona Demo Complete!');
  console.log('\n💡 Key Features Demonstrated:');
  console.log('   • Real conversation data integration');
  console.log('   • Persona-specific response patterns');
  console.log('   • Context-aware conversations');
  console.log('   • Vocabulary and grammar extraction');
  console.log('   • Cultural insight sharing');
  console.log('   • Educational scaffolding');
  console.log('   • Conversation continuity');
}

// Run the demo
runPersonaDemo().catch(console.error);
