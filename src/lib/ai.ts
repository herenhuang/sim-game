import { Turn, UserChoice } from './types'

const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || ''

export async function generateTurn(
  turnNumber: number, 
  projectContext: string, 
  previousChoices: UserChoice[] = []
): Promise<Turn> {
  
  // Try AI first, fallback to mock data
  if (ANTHROPIC_API_KEY) {
    try {
      return await generateTurnWithAI(turnNumber, projectContext, previousChoices)
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error)
    }
  }
  
  return getMockTurn(turnNumber, projectContext, previousChoices)
}

function getMockTurn(turnNumber: number, projectContext: string, previousChoices: UserChoice[]): Turn {
  // Extract key words from project context for natural weaving
  const productName = extractProductName(projectContext)
  const productType = extractProductType(projectContext)
  
  if (turnNumber === 1) {
    return {
      scene: `You're **48 hours** away from launching your ${productType}. Your QA team just discovered a **critical bug** that affects user data accuracy. The marketing team has already announced the launch date publicly.`,
      options: [
        { label: "Push the launch anyway - we'll fix it in post-launch patches", weight: 1, archetype: "Reactive" },
        { label: "Delay the launch by one week to properly fix the issue", weight: 2, archetype: "Measured" },
        { label: "Call an emergency meeting with engineering to explore quick fixes", weight: 3, archetype: "Resilient" }
      ]
    }
  }

  const lastChoice = previousChoices[previousChoices.length - 1]
  
  if (turnNumber === 2) {
    let scene = ""
    if (lastChoice?.archetype === "Reactive") {
      scene = `**Two days post-launch**, your ${productName} is flooding support with angry customer emails about missing data. Your CEO wants a status update in **30 minutes**. The support team is overwhelmed.`
    } else if (lastChoice?.archetype === "Measured") {
      scene = `After delaying the launch, stakeholders are pressuring you daily about the ${productName} timeline. A competitor just announced a **similar feature**. The team is stressed about falling behind.`
    } else {
      scene = `Your engineering team found a clever workaround for the ${productName} bug, but it requires **rebuilding a core component**. Users are already asking when they can access the new features.`
    }
    
    return {
      scene,
      options: [
        { label: "Send an immediate apology email promising a fix within 24 hours", weight: 1, archetype: "Reactive" },
        { label: "Analyze the issues first, then schedule a coordinated response", weight: 2, archetype: "Measured" },
        { label: "Draft a calm, transparent update acknowledging the problems", weight: 3, archetype: "Resilient" }
      ]
    }
  }

  // Turn 3
  let scene = ""
  if (previousChoices.some(c => c.archetype === "Reactive")) {
    scene = `The **board** is demanding answers about the ${productName} crisis. Stakeholders are questioning your team's competence. You need to present a path forward that restores confidence while being realistic about timelines.`
  } else {
    scene = `The executive team wants a **final update** on the ${productName} recovery. Your careful approach has gained some trust, but they need assurance that the product will deliver on its promises.`
  }
  
  return {
    scene,
    options: [
      { label: "Promise aggressive timelines to regain confidence quickly", weight: 1, archetype: "Reactive" },
      { label: "Present a detailed recovery plan with conservative estimates", weight: 2, archetype: "Measured" },
      { label: "Acknowledge mistakes while inspiring confidence in the team's abilities", weight: 3, archetype: "Resilient" }
    ]
  }
}

function extractProductName(projectContext: string): string {
  // Extract a natural product name from the context
  const words = projectContext.toLowerCase().split(' ')
  if (words.includes('app') || words.includes('application')) return 'app'
  if (words.includes('dashboard') || words.includes('platform')) return 'platform'
  if (words.includes('tracker') || words.includes('tool')) return 'tool'
  if (words.includes('system') || words.includes('service')) return 'system'
  return 'product'
}

function extractProductType(projectContext: string): string {
  // Return a natural description of the product type
  if (projectContext.toLowerCase().includes('ai')) return 'AI-powered solution'
  if (projectContext.toLowerCase().includes('mobile')) return 'mobile application'
  if (projectContext.toLowerCase().includes('web')) return 'web platform'
  if (projectContext.toLowerCase().includes('dashboard')) return 'analytics dashboard'
  return 'digital product'
}

// AI integration for personalized choice generation using Claude
export async function generateTurnWithAI(
  turnNumber: number,
  projectContext: string,
  previousChoices: UserChoice[]
): Promise<Turn> {
  
  const prompt = buildPersonalizedPrompt(turnNumber, projectContext, previousChoices)
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        temperature: 0.8,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Claude API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.content[0].text.trim()
    
    // Clean up any markdown code blocks
    const jsonString = content.replace(/```json\n?|\n?```/g, '').trim()
    
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('AI generation failed:', error)
    // Fallback to mock data
    return getMockTurn(turnNumber, projectContext, previousChoices)
  }
}

function buildPersonalizedPrompt(turnNumber: number, projectContext: string, previousChoices: UserChoice[]): string {
  const productName = extractProductName(projectContext)
  const productType = extractProductType(projectContext)
  
  if (turnNumber === 1) {
    return `You are an expert at creating realistic product management scenarios. Your goal is to write choices that feel personally relevant to this specific PM's situation.

# Task
Create a JSON response with:
1. A 2-sentence "scene" about a launch crisis for their ${productType}
2. Three "options" that feel personally crafted for this specific product context

# Context
- Product: ${projectContext}
- Setting: Tech company, 48 hours before launch
- Crisis: Critical bug affecting user data accuracy, marketing already announced

# Choice Requirements
Each option must:
- Feel specific to "${projectContext}" (not generic)
- Have personality and voice
- Reflect different PM approaches
- Include weight (1=reactive, 2=measured, 3=resilient) and archetype

Example format:
{
  "scene": "You're **48 hours** away from launching your ${productType}. Your QA team just discovered a **critical bug** that affects user data accuracy. The marketing team has already announced the launch date publicly.",
  "options": [
    {"label": "Push the launch anyway - we'll fix it in post-launch patches", "weight": 1, "archetype": "Reactive"},
    {"label": "Delay the launch by one week to properly fix the issue", "weight": 2, "archetype": "Measured"},
    {"label": "Call an emergency meeting with engineering to explore quick fixes", "weight": 3, "archetype": "Resilient"}
  ]
}

Make the choices feel like they're written FOR this specific product, not generic PM advice.`
  }

  const lastChoice = previousChoices[previousChoices.length - 1]
  const choicePattern = previousChoices.map(c => c.archetype).join(' → ')
  
  return `You are an expert at creating realistic product management scenarios. Your goal is to write choices that react personally to this PM's decision history.

# Task
Create a JSON response with:
1. A 2-sentence "scene" showing consequences of their previous decision
2. Three "options" that feel personally crafted based on their choice pattern

# Context
- Product: ${projectContext}
- Their previous choice: "${lastChoice.label}" (${lastChoice.archetype} approach)
- Their pattern so far: ${choicePattern}
- Turn: ${turnNumber} of 3 (${turnNumber === 2 ? 'The Confrontation' : 'The Resolution'})

# Previous Decision Analysis
${lastChoice.archetype === 'Reactive' ? 
  `They chose to act quickly/urgently. Show realistic consequences of rushing.` :
  lastChoice.archetype === 'Measured' ? 
  `They chose to be methodical/planned. Show realistic consequences of slowing down.` :
  `They chose to be resilient/creative. Show how their solution led to new challenges.`
}

# Choice Requirements
Each option must:
- React to their specific choice pattern (${choicePattern})
- Feel personally relevant to someone who chose "${lastChoice.label}"
- Include weight (1=reactive, 2=measured, 3=resilient) and archetype
- Reference the ${productName} naturally

The scene should make them think "wow, this is exactly what would happen if I made that choice."

Return valid JSON only.`
}