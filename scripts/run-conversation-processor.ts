// scripts/run-conversation-processor.ts
import { promises as fs } from 'fs';
import path from 'path';
import { ConversationDataProcessor } from '../src/services/conversation-data-processor';

/**
 * Simple script to demonstrate conversation data processing
 * Run this to see how the conversation transcripts are analyzed and structured
 */
async function runConversationProcessor() {
  console.log('🚀 Starting Enhanced Conversation Data Processing Demo\n');
  
  try {
    // Initialize processor
    const processor = new ConversationDataProcessor();
    console.log('✅ Processor initialized');
    
    // Read the conversation transcript
    const transcriptPath = path.join(__dirname, '..', 'conversations_two_examples.md');
    
    let fileContent: string;
    try {
      fileContent = await fs.readFile(transcriptPath, 'utf-8');
      console.log(`📖 Loaded transcript file: ${transcriptPath}`);
      console.log(`📏 File size: ${fileContent.length} characters\n`);
    } catch (error) {
      console.error('❌ Could not read transcript file:', error);
      return;
    }
    
    // Process the transcript
    console.log('🔄 Processing conversation data...');
    const patterns = await processor.processTranscriptFile(fileContent);
    console.log(`✅ Processed ${patterns.length} conversation patterns\n`);
    
    // Display processing results
    displayProcessingResults(patterns);
    
    // Show persona mappings
    displayPersonaMappings(patterns);
    
    // Show sample patterns for each persona
    displaySamplePatterns(processor);
    
    // Display vocabulary analysis
    displayVocabularyAnalysis(patterns);
    
    // Display cultural elements
    displayCulturalElements(patterns);
    
    console.log('\n🎉 Processing complete! This data can now be used to enhance the Conversate personas.');
    
  } catch (error) {
    console.error('❌ Error during processing:', error);
  }
}

function displayProcessingResults(patterns: any[]) {
  console.log('📊 PROCESSING RESULTS');
  console.log('='.repeat(50));
  
  const stats = {
    total: patterns.length,
    byDifficulty: {
      beginner: patterns.filter(p => p.difficulty === 'beginner').length,
      intermediate: patterns.filter(p => p.difficulty === 'intermediate').length,
      advanced: patterns.filter(p => p.difficulty === 'advanced').length
    },
    byScenario: patterns.reduce((acc, p) => {
      acc[p.scenario] = (acc[p.scenario] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalVocabulary: patterns.reduce((sum, p) => sum + p.vocabularyPatterns.length, 0),
    totalGrammar: patterns.reduce((sum, p) => sum + p.grammarStructures.length, 0),
    totalCultural: patterns.reduce((sum, p) => sum + p.culturalElements.length, 0)
  };
  
  console.log(`📈 Total Patterns: ${stats.total}`);
  console.log(`🎯 By Difficulty:`);
  console.log(`   • Beginner: ${stats.byDifficulty.beginner}`);
  console.log(`   • Intermediate: ${stats.byDifficulty.intermediate}`);
  console.log(`   • Advanced: ${stats.byDifficulty.advanced}`);
  
  console.log(`🎭 By Scenario:`);
  Object.entries(stats.byScenario).forEach(([scenario, count]) => {
    console.log(`   • ${scenario}: ${count}`);
  });
  
  console.log(`📚 Vocabulary Patterns: ${stats.totalVocabulary}`);
  console.log(`📝 Grammar Structures: ${stats.totalGrammar}`);
  console.log(`🌍 Cultural Elements: ${stats.totalCultural}\n`);
}

function displayPersonaMappings(patterns: any[]) {
  console.log('🎭 PERSONA MAPPINGS');
  console.log('='.repeat(50));
  
  const personaScores = {
    maya: patterns.filter(p => p.personaMapping.maya.score >= 6),
    alex: patterns.filter(p => p.personaMapping.alex.score >= 6),
    luna: patterns.filter(p => p.personaMapping.luna.score >= 6)
  };
  
  console.log(`👩‍🏫 Maya (Patient Teacher): ${personaScores.maya.length} relevant patterns`);
  if (personaScores.maya.length > 0) {
    const avgScore = personaScores.maya.reduce((sum, p) => sum + p.personaMapping.maya.score, 0) / personaScores.maya.length;
    console.log(`   • Average relevance score: ${avgScore.toFixed(1)}/10`);
    console.log(`   • Best scenarios: ${personaScores.maya.slice(0, 3).map(p => p.scenario).join(', ')}`);
  }
  
  console.log(`🤝 Alex (Conversational Friend): ${personaScores.alex.length} relevant patterns`);
  if (personaScores.alex.length > 0) {
    const avgScore = personaScores.alex.reduce((sum, p) => sum + p.personaMapping.alex.score, 0) / personaScores.alex.length;
    console.log(`   • Average relevance score: ${avgScore.toFixed(1)}/10`);
    console.log(`   • Best scenarios: ${personaScores.alex.slice(0, 3).map(p => p.scenario).join(', ')}`);
  }
  
  console.log(`🌟 Luna (Cultural Guide): ${personaScores.luna.length} relevant patterns`);
  if (personaScores.luna.length > 0) {
    const avgScore = personaScores.luna.reduce((sum, p) => sum + p.personaMapping.luna.score, 0) / personaScores.luna.length;
    console.log(`   • Average relevance score: ${avgScore.toFixed(1)}/10`);
    console.log(`   • Best scenarios: ${personaScores.luna.slice(0, 3).map(p => p.scenario).join(', ')}`);
  }
  console.log();
}

function displaySamplePatterns(processor: any) {
  console.log('🎨 SAMPLE CONVERSATION PATTERNS');
  console.log('='.repeat(50));
  
  const personas = ['maya', 'alex', 'luna'] as const;
  
  personas.forEach(persona => {
    const patterns = processor.getPatternsForPersona(persona);
    if (patterns.length > 0) {
      const sample = patterns[0];
      console.log(`\n${persona.toUpperCase()} - Sample Pattern:`);
      console.log(`📍 Scenario: ${sample.scenario}`);
      console.log(`🎯 Difficulty: ${sample.difficulty}`);
      console.log(`💬 Sample Dialogue:`);
      sample.dialogueSegments.slice(0, 2).forEach((seg: any, i: number) => {
        console.log(`   ${i + 1}. [${seg.speaker}] ${seg.content.substring(0, 80)}${seg.content.length > 80 ? '...' : ''}`);
        console.log(`      Intent: ${seg.intent} | Tone: ${seg.emotionalTone}`);
      });
      
      if (sample.vocabularyPatterns.length > 0) {
        console.log(`📚 Key Vocabulary: ${sample.vocabularyPatterns[0].words.slice(0, 3).map((w: any) => w.word).join(', ')}`);
      }
      
      if (sample.culturalElements.length > 0) {
        console.log(`🌍 Cultural Aspect: ${sample.culturalElements[0].aspect}`);
      }
    }
  });
  console.log();
}

function displayVocabularyAnalysis(patterns: any[]) {
  console.log('📚 VOCABULARY ANALYSIS');
  console.log('='.repeat(50));
  
  const allVocabulary = patterns.flatMap(p => p.vocabularyPatterns.flatMap((vp: any) => vp.words));
  const categoryCount = allVocabulary.reduce((acc, vocab) => {
    acc[vocab.category] = (acc[vocab.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`📈 Total vocabulary items: ${allVocabulary.length}`);
  console.log(`🏷️ Top categories:`);  Object.entries(categoryCount)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} items`);
    });
  
  // Show sample vocabulary by category
  const samplesByCategory = Object.keys(categoryCount).slice(0, 3);
  samplesByCategory.forEach(category => {
    const samples = allVocabulary.filter(v => v.category === category).slice(0, 3);
    console.log(`\n📝 Sample ${category} vocabulary:`);
    samples.forEach(vocab => {
      console.log(`   • ${vocab.word} - ${vocab.definition}`);
    });
  });
  console.log();
}

function displayCulturalElements(patterns: any[]) {
  console.log('🌍 CULTURAL ELEMENTS');
  console.log('='.repeat(50));
  
  const allCultural = patterns.flatMap(p => p.culturalElements);
  const aspectCount = allCultural.reduce((acc, cultural) => {
    acc[cultural.aspect] = (acc[cultural.aspect] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`🎭 Total cultural elements: ${allCultural.length}`);
  console.log(`🏛️ Cultural aspects identified:`);
  Object.entries(aspectCount).forEach(([aspect, count]) => {
    console.log(`   • ${aspect}: ${count} references`);
  });
  
  // Show sample cultural insights
  if (allCultural.length > 0) {
    console.log(`\n🌟 Sample Cultural Insights:`);
    allCultural.slice(0, 3).forEach((cultural, i) => {
      console.log(`${i + 1}. ${cultural.aspect}:`);
      console.log(`   📖 ${cultural.description}`);
      console.log(`   💡 Significance: ${cultural.significance}`);
      if (cultural.example) {
        console.log(`   📝 Example: "${cultural.example}"`);
      }
    });
  }
  console.log();
}

// Run the demo
if (require.main === module) {
  runConversationProcessor().catch(console.error);
}

export { runConversationProcessor };
