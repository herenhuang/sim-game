import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { CONCLUSION_PROMPT as REMIX_CONCLUSION_PROMPT } from '@/lib/scenarios/remix'
import { CONCLUSION_PROMPT as CRISIS_CONCLUSION_PROMPT } from '@/lib/scenarios/crisis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { storySoFar, userActions, scenarioType } = await request.json()

    // Get scenario-specific conclusion prompt
    const conclusionPrompt = getScenarioConclusionPrompt(storySoFar, userActions, scenarioType)

    // Generate conclusion using Claude
    const conclusionResponse = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: conclusionPrompt
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

function getScenarioConclusionPrompt(storySoFar: string, userActions: string[], scenarioType: string): string {
  switch (scenarioType) {
    case 'remix':
      return REMIX_CONCLUSION_PROMPT(storySoFar, userActions)
    case 'crisis':
      return CRISIS_CONCLUSION_PROMPT(storySoFar, userActions)
    default:
      throw new Error(`Unknown scenario type: ${scenarioType}`)
  }
}