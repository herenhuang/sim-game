import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { storySoFar, userActions, scenarioType } = await request.json()

    // Generate conclusion using Claude
    const conclusionResponse = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: getConclusionPrompt(storySoFar, userActions, scenarioType)
        }
      ]
    })

    const conclusionText = conclusionResponse.content[0].type === 'text' 
      ? conclusionResponse.content[0].text 
      : ''

    if (!conclusionText) {
      throw new Error('Failed to generate conclusion text')
    }

    return NextResponse.json({
      status: 'success',
      conclusionText
    })

  } catch (error) {
    console.error('Conclusion generation error:', error)
    return NextResponse.json({
      status: 'error',
      errorMessage: 'Failed to generate story conclusion'
    }, { status: 500 })
  }
}

function getConclusionPrompt(storySoFar: string, userActions: string[], scenarioType: string): string {
  return `You are creating a story conclusion. Based on the user's choices, write a short 2-paragraph ending (800 characters max total).

User's actions: ${userActions.join('. ')}

Write exactly 2 paragraphs showing what happens next. Keep it brief and forward-looking. No analysis, just story outcome.

Response format:
PARAGRAPH1: [~400 chars]
PARAGRAPH2: [~400 chars]`
}