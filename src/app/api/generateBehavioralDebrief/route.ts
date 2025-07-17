import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { userResponses, userPath, scenarioType } = await request.json()

    console.log('\n🚨 BEHAVIORAL DEBRIEF API CALLED! 🚨')
    console.log('=== BEHAVIORAL DEBRIEF TRANSCRIPT ===')
    console.log('📝 USER RESPONSES & INTENTS:')
    userResponses.forEach((response: string, index: number) => {
      console.log(`   Turn ${index + 1}: "${response}" -> ${userPath[index] || 'Unknown'}`)
    })
    console.log('\n🎯 SCENARIO TYPE:', scenarioType)

    // Get scenario-specific behavioral debrief prompt
    const behavioralDebriefPrompt = getBehavioralDebriefPrompt(userResponses, userPath, scenarioType)
    
    console.log('\n📤 SENDING TO AI:')
    console.log(`   Prompt length: ${behavioralDebriefPrompt.length} characters`)
    console.log(`   Full prompt:`)
    console.log(`   ${behavioralDebriefPrompt}`)
    console.log('')

    // Generate behavioral debrief using Claude
    const debriefResponse = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: behavioralDebriefPrompt
        }
      ]
    })

    const behavioralDebriefText = debriefResponse.content[0].type === 'text' 
      ? debriefResponse.content[0].text 
      : ''

    console.log('\n📥 AI RESPONSE:')
    console.log(`   Response length: ${behavioralDebriefText.length} characters`)
    console.log(`   Generated behavioral debrief:`)
    console.log(`   "${behavioralDebriefText}"`)
    console.log('\n=== END BEHAVIORAL DEBRIEF TRANSCRIPT ===\n')

    if (!behavioralDebriefText) {
      throw new Error('Failed to generate behavioral debrief text')
    }

    return NextResponse.json({
      status: 'success',
      behavioralDebriefText
    })

  } catch (error) {
    console.error('\n🚨 BEHAVIORAL DEBRIEF API ERROR! 🚨')
    console.error('Behavioral debrief generation error:', error)
    console.error('=== END BEHAVIORAL DEBRIEF ERROR ===\n')
    return NextResponse.json({
      status: 'error',
      errorMessage: 'Failed to generate behavioral debrief'
    }, { status: 500 })
  }
}

function getBehavioralDebriefPrompt(userResponses: string[], userPath: string[], scenarioType: string): string {
  if (scenarioType === 'remix') {
    return getRemixBehavioralDebriefPrompt(userResponses, userPath)
  }
  
  throw new Error(`Unknown scenario type: ${scenarioType}`)
}

function getRemixBehavioralDebriefPrompt(userResponses: string[], userPath: string[]): string {
  return `You're providing personalized behavioral insights for someone who just completed a viral remix scenario.

# Their Journey
Turn 1 (Friend's copyright question): "${userResponses[0] || 'No response'}" -> ${userPath[0] || 'Unknown'}
Turn 2 (Record label deadline): "${userResponses[1] || 'No response'}" -> ${userPath[1] || 'Unknown'}
Turn 3 (Artist collaboration offer): "${userResponses[2] || 'No response'}" -> ${userPath[2] || 'Unknown'}

# Your Task
Write a brief behavioral debrief about their decision-making patterns. Focus on what their choices reveal about their creative leadership style.

# Instructions
- Write in second person ("you") 
- Keep it conversational like a skilled coach
- Reference their specific intent choices
- Length: 300-400 characters MAX
- 2-3 insights they can apply to real situations

Write the behavioral debrief as flowing paragraphs.`
}