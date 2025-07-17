import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { CONCLUSION_PROMPT as REMIX_CONCLUSION_PROMPT } from '@/lib/scenarios/remix'
import { CONCLUSION_PROMPT as CRISIS_CONCLUSION_PROMPT } from '@/lib/scenarios/crisis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { storySoFar, userActions, userResponses, scenarioType } = await request.json()

    console.log('\n=== CONCLUSION GENERATION TRANSCRIPT ===')
    console.log('📝 USER RESPONSES:')
    userResponses.forEach((response: string, index: number) => {
      console.log(`   Turn ${index + 1}: "${response}"`)
    })
    console.log('\n📖 STORY SO FAR:')
    console.log(`   ${storySoFar.substring(0, 200)}...`)
    console.log('\n🎯 SCENARIO TYPE:', scenarioType)

    // Get scenario-specific conclusion prompt
    const conclusionPrompt = getScenarioConclusionPrompt(storySoFar, userActions, userResponses, scenarioType)
    
    console.log('\n📤 SENDING TO AI:')
    console.log(`   Prompt length: ${conclusionPrompt.length} characters`)
    console.log(`   Prompt preview: ${conclusionPrompt.substring(0, 300)}...`)

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

    console.log('\n📥 AI RESPONSE:')
    console.log(`   Response length: ${conclusionText.length} characters`)
    console.log(`   Generated conclusion:`)
    console.log(`   "${conclusionText}"`)
    console.log('\n=== END CONCLUSION TRANSCRIPT ===\n')

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

function getScenarioConclusionPrompt(storySoFar: string, userActions: string[], userResponses: string[], scenarioType: string): string {
  switch (scenarioType) {
    case 'remix':
      return REMIX_CONCLUSION_PROMPT(storySoFar, userResponses || [])
    case 'crisis':
      return CRISIS_CONCLUSION_PROMPT(storySoFar, userActions)
    default:
      throw new Error(`Unknown scenario type: ${scenarioType}`)
  }
}