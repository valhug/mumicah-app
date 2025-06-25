#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { ConversationDataProcessor } from '../src/services/conversation-data-processor';

/**
 * Enhanced script to process multiple conversation transcript files 
 * and generate comprehensive structured conversation patterns
 */
async function processAllConversationData() {
  console.log('🚀 Starting comprehensive conversation data processing...');
  
  const processor = new ConversationDataProcessor();  
  // Define all available transcript files
  const transcriptFiles = [
    {
      filename: 'conversations_two_examples.md',
      description: 'University life, work, sports, travel conversations'
    },
    {
      filename: 'Conversations_examples.md', 
      description: 'Daily life, media, cultural discussions'
    },
    {
      filename: 'conversation_three_examples.md',
      description: 'Spanish language conversations - business, culture, daily life'
    }
  ];
  
  let allPatterns: any[] = [];
  let totalProcessed = 0;
  
  // Process each transcript file
  for (const { filename, description } of transcriptFiles) {
    const filePath = path.join(process.cwd(), filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`\n📖 Processing ${filename}...`);
      console.log(`   Theme: ${description}`);
        try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const patterns = await processor.processTranscriptFile(fileContent);
        
        allPatterns.push(...patterns);
        totalProcessed += patterns.length;
        
        console.log(`✅ Extracted ${patterns.length} conversation patterns`);
        
        // Show quick stats for this file
        const scenarios = patterns.reduce((acc: Record<string, number>, p: any) => {
          acc[p.scenario] = (acc[p.scenario] || 0) + 1;
          return acc;
        }, {});
        
        console.log(`   Scenarios: ${Object.entries(scenarios).map(([k, v]) => `${k}(${v})`).join(', ')}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error);
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
    }
  }
  
  if (allPatterns.length === 0) {
    console.log('❌ No patterns were processed. Check if transcript files exist.');
    return;
  }
  
  console.log(`\n🎯 Combined Results: ${totalProcessed} total conversation patterns`);
  
  // Generate comprehensive statistics
  const combinedStats = generateCombinedStats(allPatterns);
  displayCombinedStats(combinedStats);
    // Generate enhanced persona mappings (already included in patterns)
  const personaMappings = generatePersonaMappingSummary(allPatterns);
  displayPersonaMappings(allPatterns, personaMappings);
  
  // Save all processed data
  await saveProcessedData(allPatterns, processor, personaMappings);
  
  console.log('\n🎉 Comprehensive conversation data processing completed successfully!');
  console.log(`📈 Total dataset: ${allPatterns.length} patterns from ${transcriptFiles.length} source files`);
}

function generatePersonaMappingSummary(patterns: any[]) {
  const personas = ['maya', 'alex', 'luna'] as const;
  const summary: Record<string, any> = {};
  
  personas.forEach(persona => {
    const relevantPatterns = patterns.filter(p => p.personaMapping[persona].score >= 6);
    summary[persona] = {
      totalPatterns: relevantPatterns.length,
      averageScore: relevantPatterns.length > 0 
        ? relevantPatterns.reduce((acc, p) => acc + p.personaMapping[persona].score, 0) / relevantPatterns.length 
        : 0,
      topScenarios: relevantPatterns.reduce((acc: Record<string, number>, p: any) => {
        acc[p.scenario] = (acc[p.scenario] || 0) + 1;
        return acc;
      }, {})
    };
  });
  
  return summary;
}

function generateCombinedStats(patterns: any[]) {
  return {
    totalPatterns: patterns.length,
    byDifficulty: patterns.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, { beginner: 0, intermediate: 0, advanced: 0 }),
    byScenario: patterns.reduce((acc, p) => {
      acc[p.scenario] = (acc[p.scenario] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    vocabularyItems: patterns.reduce((acc, p) => 
      acc + p.vocabularyPatterns.reduce((vacc: number, vp: any) => vacc + vp.words.length, 0), 0
    ),
    grammarStructures: patterns.reduce((acc, p) => acc + p.grammarStructures.length, 0),
    culturalElements: patterns.reduce((acc, p) => acc + p.culturalElements.length, 0),
    sourceFiles: [...new Set(patterns.map(p => p.sourceFile))].length
  };
}

function displayCombinedStats(stats: any) {
  console.log(`\n📊 Comprehensive Dataset Statistics:`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📈 Total Patterns: ${stats.totalPatterns}`);
  console.log(`📚 Source Files: ${stats.sourceFiles}`);
  console.log(`\n🎯 Difficulty Distribution:`);
  console.log(`   • Beginner: ${stats.byDifficulty.beginner} patterns (${Math.round(stats.byDifficulty.beginner / stats.totalPatterns * 100)}%)`);
  console.log(`   • Intermediate: ${stats.byDifficulty.intermediate} patterns (${Math.round(stats.byDifficulty.intermediate / stats.totalPatterns * 100)}%)`);
  console.log(`   • Advanced: ${stats.byDifficulty.advanced} patterns (${Math.round(stats.byDifficulty.advanced / stats.totalPatterns * 100)}%)`);
  
  console.log(`\n🎬 Conversation Scenarios:`);
  const sortedScenarios = Object.entries(stats.byScenario)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 8); // Top 8 scenarios
  
  sortedScenarios.forEach(([scenario, count]) => {
    const percentage = Math.round((count as number) / stats.totalPatterns * 100);
    console.log(`   • ${scenario}: ${count} patterns (${percentage}%)`);
  });
  
  console.log(`\n📖 Content Analysis:`);
  console.log(`   • Vocabulary items: ${stats.vocabularyItems}`);
  console.log(`   • Grammar structures: ${stats.grammarStructures}`);
  console.log(`   • Cultural elements: ${stats.culturalElements}`);
}

function displayPersonaMappings(patterns: any[], personaMappings: any) {
  console.log(`\n🎭 Enhanced Persona Mapping Results:`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  
  const personas = ['maya', 'alex', 'luna'] as const;
  
  personas.forEach(persona => {
    const relevantPatterns = patterns.filter(p => p.personaMapping[persona].score >= 6);
    const avgScore = relevantPatterns.length > 0 
      ? (relevantPatterns.reduce((acc, p) => acc + p.personaMapping[persona].score, 0) / relevantPatterns.length).toFixed(1)
      : '0';
      const topScenarios = relevantPatterns.reduce((acc: Record<string, number>, p: any) => {
      acc[p.scenario] = (acc[p.scenario] || 0) + 1;
      return acc;
    }, {});
    
    const scenarioList = Object.entries(topScenarios)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([scenario, count]) => `${scenario}(${count})`)
      .join(', ');
    
    console.log(`👤 ${persona.toUpperCase()} - ${getPersonaDescription(persona)}:`);
    console.log(`   • Relevant patterns: ${relevantPatterns.length}`);
    console.log(`   • Average relevance: ${avgScore}/10`);
    console.log(`   • Top scenarios: ${scenarioList || 'none'}`);
    console.log('');
  });
}

function getPersonaDescription(persona: string): string {
  const descriptions = {
    maya: 'Patient Teacher',
    alex: 'Conversational Friend', 
    luna: 'Cultural Guide'
  };
  return descriptions[persona as keyof typeof descriptions] || 'Unknown';
}

function generateConversationExamples(patterns: any[]) {
  const personas = ['maya', 'alex', 'luna'] as const;
  const examples: Record<string, any> = {};
  
  personas.forEach(persona => {
    const relevantPatterns = patterns.filter(p => p.personaMapping[persona].score >= 6);
    const byDifficulty: Record<string, any[]> = { beginner: [], intermediate: [], advanced: [] };
    
    relevantPatterns.forEach(pattern => {
      const example = {
        id: pattern.id,
        scenario: pattern.scenario,
        context: pattern.context,
        sampleDialogue: pattern.dialogueSegments.slice(0, 2), // First 2 dialogue segments
        keyVocabulary: pattern.vocabularyPatterns.flatMap((vp: any) => vp.words).slice(0, 5),
        grammarFocus: pattern.grammarStructures.map((gs: any) => gs.pattern),
        culturalNotes: pattern.culturalElements.map((ce: any) => ce.aspect)
      };
      
      byDifficulty[pattern.difficulty].push(example);
    });
    
    examples[persona] = {
      totalExamples: relevantPatterns.length,
      byDifficulty
    };
  });
  
  return examples;
}

async function saveProcessedData(patterns: any[], processor: any, personaMappings: any) {
  console.log(`\n💾 Saving processed data...`);
  
  // Create data directory
  const outputDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save main processed dataset
  const processedDataPath = path.join(outputDir, 'processed-conversation-patterns.json');
  fs.writeFileSync(processedDataPath, JSON.stringify(patterns, null, 2));
  console.log(`✅ Master dataset: ${processedDataPath}`);

  // Save persona-specific patterns
  const personas = ['maya', 'alex', 'luna'] as const;
  let totalPersonaPatterns = 0;
  
  for (const persona of personas) {
    const personaPatterns = patterns.filter(
      pattern => pattern.personaMapping[persona].score >= 6
    );
    
    const personaDataPath = path.join(outputDir, `${persona}-conversation-patterns.json`);
    fs.writeFileSync(personaDataPath, JSON.stringify(personaPatterns, null, 2));
    console.log(`✅ ${persona.toUpperCase()} patterns (${personaPatterns.length}): ${personaDataPath}`);
    
    totalPersonaPatterns += personaPatterns.length;
  }
  // Generate and save conversation examples
  const conversationExamples = generateConversationExamples(patterns);
  const examplesPath = path.join(outputDir, 'conversation-examples.json');
  fs.writeFileSync(examplesPath, JSON.stringify(conversationExamples, null, 2));
  console.log(`✅ Conversation examples: ${examplesPath}`);
  
  console.log(`\n📊 Data saved successfully!`);
  console.log(`   • Master patterns: ${patterns.length}`);
  console.log(`   • Persona-mapped patterns: ${totalPersonaPatterns}`);
  console.log(`   • Example conversations generated`);
}

// Run the comprehensive processing
processAllConversationData().catch(console.error);
