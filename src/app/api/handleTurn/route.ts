import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { HandleTurnRequest, HandleTurnResponse } from '@/lib/types';
import { GUARD_RAIL_PROMPT as CRISIS_GUARD_RAIL, ENGINE_PROMPT as CRISIS_ENGINE, QUESTIONS as CRISIS_QUESTIONS } from '@/lib/scenarios/crisis';
import { GUARD_RAIL_PROMPT as REMIX_GUARD_RAIL, STORY_PROMPT_TURN_1, STORY_PROMPT_TURN_2, STORY_PROMPT_TURN_3, INTENT_CLASSIFIER_PROMPT as REMIX_CLASSIFICATION, QUESTIONS as REMIX_QUESTIONS } from '@/lib/scenarios/remix';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest): Promise<NextResponse<HandleTurnResponse>> {
  try {
    const { userInput, storySoFar, scenarioType, currentTurn }: HandleTurnRequest = await request.json();

    console.log('\n=== TURN PROCESSING TRANSCRIPT ===')
    console.log(`🎯 SCENARIO: ${scenarioType} | TURN: ${currentTurn}`)
    console.log(`📝 USER INPUT: "${userInput}"`)
    console.log(`📖 STORY SO FAR: ${storySoFar.substring(0, 200)}...`)

    // Get the current question that the user is responding to
    const getCurrentQuestion = (type: string, turn: number): string | null => {
      const questions = type === 'crisis' ? CRISIS_QUESTIONS : REMIX_QUESTIONS;
      return turn > 0 && turn <= questions.length ? questions[turn - 1] : null; // turn-1 because they're responding to the previous question
    };

    const currentQuestion = getCurrentQuestion(scenarioType, currentTurn);

    // Get the appropriate scenario prompts
    const getScenarioPrompts = (type: string) => {
      switch (type) {
        case 'crisis':
          return { guardRail: CRISIS_GUARD_RAIL, engine: CRISIS_ENGINE };
        case 'remix':
          return { guardRail: REMIX_GUARD_RAIL, classification: REMIX_CLASSIFICATION };
        default:
          throw new Error(`Unknown scenario type: ${type}`);
      }
    };

    const scenarioPrompts = getScenarioPrompts(scenarioType);

    // Guard Rail Check (Prompt #1) - DISABLED FOR PERFORMANCE
    // const guardRailPrompt = scenarioPrompts.guardRail(userInput);
    
    console.log('=== GUARDRAIL DEBUG ===');
    console.log('Scenario:', scenarioType);
    console.log('User Input:', userInput);
    console.log('Guardrail: SKIPPED FOR PERFORMANCE');
    console.log('=== END DEBUG ===');

    // Trim context if too long
    const trimmedStorySoFar = storySoFar.length > 2000 ? 
      storySoFar.substring(storySoFar.length - 2000) : storySoFar;

    console.log('=== ENGINE DEBUG ===');
    console.log('Story length:', storySoFar.length);
    console.log('Trimmed story length:', trimmedStorySoFar.length);
    console.log('=== END ENGINE DEBUG ===');

    // Handle different prompt structures
    if (scenarioType === 'remix') {
      // Step 1: Classification first
      const classificationPrompt = (scenarioPrompts as any).classification(userInput);
      
      const classificationResponse = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        messages: [{ role: 'user', content: classificationPrompt }]
      });

      const classificationResult = classificationResponse.content[0].type === 'text' 
        ? classificationResponse.content[0].text.trim() 
        : '';

      // Parse the JSON response to get the intent
      let intent;
      try {
        const parsedClassification = JSON.parse(classificationResult);
        intent = parsedClassification.intent;
      } catch (error) {
        console.error('Failed to parse classification JSON:', error);
        intent = 'Unknown';
      }

      // Step 2: Get the appropriate story prompt for this turn
      let storyPrompt;
      switch (currentTurn) {
        case 1:
          storyPrompt = STORY_PROMPT_TURN_1(userInput, intent);
          break;
        case 2:
          storyPrompt = STORY_PROMPT_TURN_2(userInput, intent);
          break;
        case 3:
          storyPrompt = STORY_PROMPT_TURN_3(userInput, intent);
          break;
        default:
          throw new Error(`Invalid turn number: ${currentTurn}`);
      }
      
      const storyResponse = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{ role: 'user', content: storyPrompt }]
      });

      const nextSceneText = storyResponse.content[0].type === 'text' 
        ? storyResponse.content[0].text.trim() 
        : '';

      console.log('\n📥 AI RESPONSES:')
      console.log(`   🧠 INTENT CLASSIFICATION: ${intent}`)
      console.log(`   🎭 STORY CONTINUATION (Turn ${currentTurn}): "${nextSceneText}"`)
      console.log('\n=== END TURN TRANSCRIPT ===\n')

      return NextResponse.json({
        status: 'success',
        classification: intent,
        actionSummary: `User responded with a ${intent.toLowerCase()} approach`,
        nextSceneText: nextSceneText
      });
      
    } else {
      // Single-step process for crisis (existing logic)
      const enginePrompt = (scenarioPrompts as any).engine(userInput, trimmedStorySoFar, getCurrentQuestion(scenarioType, currentTurn));

      const engineResponse = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [{ role: 'user', content: enginePrompt }]
      });

      const engineResult = engineResponse.content[0].type === 'text' 
        ? engineResponse.content[0].text.trim() 
        : '';

      let parsedResult;
      try {
        parsedResult = JSON.parse(engineResult);
      } catch (error) {
        throw new Error('Failed to parse AI response as JSON');
      }

      return NextResponse.json({
        status: 'success',
        classification: parsedResult.classification,
        actionSummary: parsedResult.action_summary,
        nextSceneText: parsedResult.next_scene_text
      });
    }

  } catch (error) {
    console.error('=== HANDLE TURN ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', (error as any)?.message || 'No message available');
    console.error('Full error:', error);
    console.error('=== END HANDLE TURN ERROR ===');
    
    return NextResponse.json({
      status: 'needs_retry',
      errorMessage: 'An error occurred processing your response. Please try again.'
    }, { status: 500 });
  }
}