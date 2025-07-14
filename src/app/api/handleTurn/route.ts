import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { HandleTurnRequest, HandleTurnResponse } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest): Promise<NextResponse<HandleTurnResponse>> {
  try {
    const { userInput, storySoFar }: HandleTurnRequest = await request.json();

    // Guard Rail Check (Prompt #1)
    const guardRailPrompt = `System: You are a simple classification AI. Your only job is to determine if a user's response in a workplace crisis simulation is a serious attempt to solve the problem.

Task: Analyze the user's response. Is it a serious attempt? Respond with only the word "YES" or "NO". Do not explain your reasoning or use any other words.

# Scenario Context:
The user's company is having a major product crisis on launch day, and customers cannot use the product.

# User's Response:
"${userInput}"

# Your Verdict (YES or NO):`;

    const guardRailResponse = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 10,
      messages: [{ role: 'user', content: guardRailPrompt }]
    });

    const guardRailResult = guardRailResponse.content[0].type === 'text' 
      ? guardRailResponse.content[0].text.trim() 
      : '';

    if (guardRailResult !== 'YES') {
      return NextResponse.json({
        status: 'needs_retry',
        errorMessage: 'Please provide a serious response to the crisis scenario.'
      });
    }

    // Engine Prompt (Prompt #2)
    const enginePrompt = `System: You are a master storyteller and behavioral psychologist creating a realistic workplace simulation. Your job is to analyze the user's response, classify their core approach, and continue the story in a way that feels natural and responsive.

# 1. The Axis of Analysis
You must classify the user's approach as one of two types:
- 🔥 Momentum: This approach prioritizes immediate action to mitigate external impact. It's about changing the state of the world *now* to control the narrative or stop the bleeding. Examples: rolling back a feature, posting a public status update, communicating with users.
- ⚡️ Method: This approach prioritizes internal analysis to understand the root cause before acting. It's about gathering information to ensure the next move is the right one. Examples: analyzing logs, looking at dashboards, asking engineers for data, creating a diagnostic plan.

# 2. Story Context
So far, the story is:
${storySoFar}

# 3. The User's Latest Action
"${userInput}"

# 4. Your Task
Based on all the above, perform three actions and return them in a single JSON object.
1.  **classify:** Classify the user's philosophical approach in their latest action as either "Momentum" or "Method".
2.  **continue_story:** Write the next 2-3 sentences of the story, continuing the narrative naturally.
3.  **summarize_action:** Write a brief, active summary of the user's core action in this turn (e.g., "choosing to analyze the data first" or "focusing on immediate public communication").

Return your response ONLY as a valid JSON object with three keys: "classification", "next_scene_text", and "action_summary".

Example Output:
{
  "classification": "Method",
  "next_scene_text": "You resist the urge to react publicly. The team dives into the logs...",
  "action_summary": "gathering information from the logs before acting"
}`;

    const engineResponse = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
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