// scripts/process-conversation-data.ts
import fs from 'fs';
import path from 'path';
import { ConversationDataProcessor } from '../src/services/conversation-data-processor';

/**
 * Script to process conversation transcripts and generate structured data
 * for the Conversate persona models
 */
async function processConversationData() {
  console.log('🚀 Starting conversation data processing...');
  
  try {
    // Initialize the processor
    const processor = new ConversationDataProcessor();
    
    // Read the conversation transcript file
    const transcriptPath = path.join(__dirname, '..', 'conversations_two_examples.md');
    const fileContent = fs.readFileSync(transcriptPath, 'utf-8');
    
    console.log('📖 Processing transcript file...');
    
    // Process the transcript
    const processedPatterns = await processor.processTranscriptFile(fileContent);
    
    console.log(`✅ Processed ${processedPatterns.length} conversation patterns`);
    
    // Generate summary statistics
    const stats = generateProcessingStats(processedPatterns);
    console.log('\n📊 Processing Statistics:');
    console.log(`- Total patterns: ${stats.totalPatterns}`);
    console.log(`- By difficulty: Beginner (${stats.beginner}), Intermediate (${stats.intermediate}), Advanced (${stats.advanced})`);
    console.log(`- By scenario: ${Object.entries(stats.scenarios).map(([k, v]) => `${k} (${v})`).join(', ')}`);
    console.log(`- Vocabulary patterns: ${stats.vocabularyPatterns}`);
    console.log(`- Grammar structures: ${stats.grammarStructures}`);
    console.log(`- Cultural elements: ${stats.culturalElements}`);
    
    // Generate persona mappings
    const personaMappings = generatePersonaMappings(processedPatterns);
    console.log('\n🎭 Persona Mappings:');
    console.log(`- Maya (Patient Teacher): ${personaMappings.maya} relevant patterns`);
    console.log(`- Alex (Conversational Friend): ${personaMappings.alex} relevant patterns`);
    console.log(`- Luna (Cultural Guide): ${personaMappings.luna} relevant patterns`);
    
    // Save processed data
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'processed-conversation-patterns.json');
    
    // Ensure data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save the processed patterns
    fs.writeFileSync(outputPath, JSON.stringify(processedPatterns, null, 2));
    console.log(`\n💾 Saved processed data to: ${outputPath}`);
    
    // Generate persona-specific data files
    await generatePersonaDataFiles(processor, path.dirname(outputPath));
    
    // Generate conversation examples
    await generateConversationExamples(processedPatterns, path.dirname(outputPath));
    
    console.log('\n🎉 Conversation data processing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error processing conversation data:', error);
    process.exit(1);
  }
}

/**
 * Generate processing statistics
 */
function generateProcessingStats(patterns: any[]) {
  const stats = {
    totalPatterns: patterns.length,
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    scenarios: {} as Record<string, number>,
    vocabularyPatterns: 0,
    grammarStructures: 0,
    culturalElements: 0
  };
    patterns.forEach(pattern => {
    // Count by difficulty
    if (pattern.difficulty === 'beginner') stats.beginner++;
    else if (pattern.difficulty === 'intermediate') stats.intermediate++;
    else if (pattern.difficulty === 'advanced') stats.advanced++;
    
    // Count by scenario
    const scenario = pattern.scenario;
    stats.scenarios[scenario] = (stats.scenarios[scenario] || 0) + 1;
    
    // Count vocabulary patterns
    stats.vocabularyPatterns += pattern.vocabularyPatterns.length;
    
    // Count grammar structures
    stats.grammarStructures += pattern.grammarStructures.length;
    
    // Count cultural elements
    stats.culturalElements += pattern.culturalElements.length;
  });
  
  return stats;
}

/**
 * Generate persona mapping statistics
 */
function generatePersonaMappings(patterns: any[]) {
  const mappings = {
    maya: 0,
    alex: 0,
    luna: 0
  };
  
  patterns.forEach(pattern => {
    if (pattern.personaMapping.maya.score >= 6) mappings.maya++;
    if (pattern.personaMapping.alex.score >= 6) mappings.alex++;
    if (pattern.personaMapping.luna.score >= 6) mappings.luna++;
  });
  
  return mappings;
}

/**
 * Generate persona-specific data files
 */
async function generatePersonaDataFiles(processor: ConversationDataProcessor, outputDir: string) {
  const personas = ['maya', 'alex', 'luna'] as const;
  
  for (const persona of personas) {
    const personaPatterns = processor.getPatternsForPersona(persona);
    const outputPath = path.join(outputDir, `${persona}-conversation-patterns.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(personaPatterns, null, 2));
    console.log(`💾 Saved ${persona} patterns (${personaPatterns.length} patterns) to: ${outputPath}`);
  }
}

/**
 * Generate conversation examples for each persona
 */
async function generateConversationExamples(patterns: any[], outputDir: string) {
  const examples = {
    maya: generatePersonaExamples(patterns, 'maya'),
    alex: generatePersonaExamples(patterns, 'alex'),
    luna: generatePersonaExamples(patterns, 'luna')
  };
  
  const outputPath = path.join(outputDir, 'conversation-examples.json');
  fs.writeFileSync(outputPath, JSON.stringify(examples, null, 2));
  console.log(`💾 Saved conversation examples to: ${outputPath}`);
}

/**
 * Generate examples for a specific persona
 */
function generatePersonaExamples(patterns: any[], persona: string) {
  const relevantPatterns = patterns.filter(p => p.personaMapping[persona].score >= 6);
  
  return {
    totalExamples: relevantPatterns.length,
    byDifficulty: {
      beginner: relevantPatterns.filter(p => p.difficulty === 'beginner').map(extractExample),
      intermediate: relevantPatterns.filter(p => p.difficulty === 'intermediate').map(extractExample),
      advanced: relevantPatterns.filter(p => p.difficulty === 'advanced').map(extractExample)
    },
    byScenario: relevantPatterns.reduce((acc, pattern) => {
      const scenario = pattern.scenario;
      if (!acc[scenario]) acc[scenario] = [];
      acc[scenario].push(extractExample(pattern));
      return acc;
    }, {} as Record<string, any[]>)
  };
}

/**
 * Extract example data from a pattern
 */
function extractExample(pattern: any) {
  return {
    id: pattern.id,
    scenario: pattern.scenario,
    context: pattern.context,
    sampleDialogue: pattern.dialogueSegments.slice(0, 3).map((s: any) => ({
      speaker: s.speaker,
      content: s.content,
      intent: s.intent
    })),
    keyVocabulary: pattern.vocabularyPatterns.flatMap((vp: any) => vp.words.slice(0, 3)),
    grammarFocus: pattern.grammarStructures.map((gs: any) => gs.pattern),
    culturalNotes: pattern.culturalElements.map((ce: any) => ce.aspect)
  };
}

/**
 * Run the script
 */
if (require.main === module) {
  processConversationData();
}

export { processConversationData };
