import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { HandleTurnRequest, HandleTurnResponse } from '@/lib/types';
import { GUARD_RAIL_PROMPT as CRISIS_GUARD_RAIL, ENGINE_PROMPT as CRISIS_ENGINE, QUESTIONS as CRISIS_QUESTIONS } from '@/lib/scenarios/crisis';
import { GUARD_RAIL_PROMPT as REMIX_GUARD_RAIL, ENGINE_PROMPT as REMIX_ENGINE, QUESTIONS as REMIX_QUESTIONS } from '@/lib/scenarios/remix';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest): Promise<NextResponse<HandleTurnResponse>> {
  try {
    const { userInput, storySoFar, scenarioType, currentTurn }: HandleTurnRequest = await request.json();

    // Get the next story beat for context
    const getNextStoryBeat = (type: string, turn: number): string | null => {
      const questions = type === 'crisis' ? CRISIS_QUESTIONS : REMIX_QUESTIONS;
      return turn < questions.length ? questions[turn] : null; // turn is 0-indexed for next question
    };

    const nextStoryBeat = getNextStoryBeat(scenarioType, currentTurn);

    // Get the appropriate scenario prompts
    const getScenarioPrompts = (type: string) => {
      switch (type) {
        case 'crisis':
          return { guardRail: CRISIS_GUARD_RAIL, engine: CRISIS_ENGINE };
        case 'remix':
          return { guardRail: REMIX_GUARD_RAIL, engine: REMIX_ENGINE };
        default:
          throw new Error(`Unknown scenario type: ${type}`);
      }
    };

    const scenarioPrompts = getScenarioPrompts(scenarioType);

    // Guard Rail Check (Prompt #1)
    const guardRailPrompt = scenarioPrompts.guardRail(userInput);
    
    console.log('=== GUARDRAIL DEBUG ===');
    console.log('Scenario:', scenarioType);
    console.log('User Input:', userInput);
    console.log('Guardrail Prompt Preview:', guardRailPrompt.substring(0, 300) + '...');

    const guardRailResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [{ role: 'user', content: guardRailPrompt }]
    });

    const guardRailResult = guardRailResponse.content[0].type === 'text' 
      ? guardRailResponse.content[0].text.trim() 
      : '';
      
    console.log('AI Response:', guardRailResult);
    console.log('Is Harmful/Spam/Nonsense (will block):', guardRailResult === 'YES');
    console.log('Will Allow Through:', guardRailResult === 'NO');
    console.log('=== END DEBUG ===');

    if (guardRailResult === 'YES') {
      return NextResponse.json({
        status: 'needs_retry',
        errorMessage: 'Please try a different response.'
      });
    }

    // Engine Prompt (Prompt #2)
    const enginePrompt = scenarioPrompts.engine(userInput, storySoFar, nextStoryBeat);

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

  } catch (error) {
    console.error('Error in handleTurn:', error);
    return NextResponse.json({
      status: 'needs_retry',
      errorMessage: 'An error occurred processing your response. Please try again.'
    }, { status: 500 });
  }
}