import { Turn, UserChoice } from './types'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''

export async function generateTurn(
  turnNumber: number, 
  projectContext: string, 
  previousChoices: UserChoice[] = []
): Promise<Turn> {
  
  // For now, return mock data - we'll implement AI later
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

// This will be implemented when we add AI integration
export async function generateTurnWithAI(
  turnNumber: number,
  projectContext: string,
  previousChoices: UserChoice[]
): Promise<Turn> {
  
  const prompt = buildPrompt(turnNumber, projectContext, previousChoices)
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    
    return JSON.parse(content)
  } catch (error) {
    console.error('AI generation failed:', error)
    // Fallback to mock data
    return getMockTurn(turnNumber, projectContext, previousChoices)
  }
}

function buildPrompt(turnNumber: number, projectContext: string, previousChoices: UserChoice[]): string {
  const basePrompt = `You are a work-sim engine for Product Managers at tech companies. Use Markdown to bold key terms.

# Context
- projectContext: "${projectContext}"
`

  if (turnNumber === 1) {
    return basePrompt + `
# Your Task for Turn 1 (The Setup)
1. Write a 2-sentence \`scene\` presenting a last-minute launch crisis directly involving the projectContext
2. Rewrite the \`options\` below to fit your scene, preserving \`weight\` and \`archetype\`

# Archetypes to Rewrite
- Option A (Weight 1 - REACTIVE): "Cut a corner or ignore a problem to guarantee launch"
- Option B (Weight 2 - MEASURED): "Announce a short delay to fix the issue properly"  
- Option C (Weight 3 - RESILIENT): "Find a creative third option that doesn't compromise quality"

Return valid JSON with: scene, options[{label, weight, archetype}]`
  }

  const lastChoice = previousChoices[previousChoices.length - 1]
  
  return basePrompt + `
# Context
- previousScene: "${getPreviousScene(turnNumber - 1)}"
- userChoice: "${lastChoice.label}"
- choiceArchetype: "${lastChoice.archetype}"

# Your Task for Turn ${turnNumber} (${turnNumber === 2 ? 'The Confrontation' : 'The Resolution'})
1. Write a 2-sentence \`scene\` showing the DIRECT CONSEQUENCE of the user's choice from Turn ${turnNumber - 1}
2. Make it feel like a natural continuation of their decision
3. Rewrite the \`options\` below to fit this new crisis situation

# Archetypes to Rewrite  
- Option A (Weight 1 - REACTIVE): "React emotionally or make a snap decision"
- Option B (Weight 2 - MEASURED): "Gather information and create a coordinated response"
- Option C (Weight 3 - RESILIENT): "Stay calm and guide the team through the crisis"

Return valid JSON with: scene, options[{label, weight, archetype}]`
}

function getPreviousScene(turnNumber: number): string {
  // This would store the actual previous scene in a real implementation
  return "Previous scene context would go here"
}