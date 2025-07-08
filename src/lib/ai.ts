import { Turn, UserChoice, SimulationContext } from './types'

// API key is now handled in the backend API route

export async function generateTurn(
  turnNumber: number, 
  context: SimulationContext, 
  previousChoices: UserChoice[] = []
): Promise<Turn> {
  
  // Try AI first, fallback to mock data
  try {
    return await generateTurnWithAI(turnNumber, context, previousChoices)
  } catch (error) {
    console.warn('AI generation failed, using fallback:', error)
  }
  
  return getMockTurn(turnNumber, context, previousChoices)
}

function getMockTurn(turnNumber: number, context: SimulationContext, previousChoices: UserChoice[]): Turn {
  // Parse context for natural language
  const projectRef = parseProjectContext(context.project)
  const stakeholderRef = parseStakeholder(context.stakeholder)
  
  if (turnNumber === 1) {
    return {
      scene: `You're **48 hours** away from launching your ${projectRef}. Your QA team just discovered a **critical bug** that affects user data accuracy. The marketing team has already announced the launch date publicly.`,
      options: [
        { label: `Push the ${projectRef} launch anyway - we'll fix it in post-launch patches`, weight: 1, archetype: "Reactive" },
        { label: `Delay the ${projectRef} launch by one week to properly fix the issue`, weight: 2, archetype: "Measured" },
        { label: `Call an emergency meeting with engineering to explore quick fixes for the ${projectRef}`, weight: 3, archetype: "Resilient" }
      ]
    }
  }

  const lastChoice = previousChoices[previousChoices.length - 1]
  
  if (turnNumber === 2) {
    let scene = ""
    if (lastChoice?.archetype === "Reactive") {
      scene = `**Two days post-launch**, your ${projectRef} is flooding support with angry customer emails about missing data. The support team is overwhelmed and ${stakeholderRef} wants a status update in **30 minutes**.`
    } else if (lastChoice?.archetype === "Measured") {
      scene = `After delaying the launch, stakeholders are pressuring you daily about the ${projectRef} timeline. A competitor just announced a **similar feature** and the team is stressed about falling behind.`
    } else {
      scene = `Your engineering team found a clever workaround for the ${projectRef} bug, but it requires **rebuilding a core component**. Users are already asking when they can access the new features.`
    }
    
    return {
      scene,
      options: [
        { label: `Send an immediate, decisive message to the team about how we're handling this`, weight: 1, archetype: "Reactive" },
        { label: `Take an hour to analyze the full impact before scheduling a coordinated response`, weight: 2, archetype: "Measured" },
        { label: `Draft a calm, reassuring update for the team while exploring alternative solutions`, weight: 3, archetype: "Resilient" }
      ]
    }
  }

  // Turn 3
  let scene = ""
  if (previousChoices.some(c => c.archetype === "Reactive")) {
    scene = `The **board** is demanding answers about the ${projectRef} crisis. Stakeholders are questioning your team's competence and you need to face ${stakeholderRef} directly.`
  } else {
    scene = `The executive team wants a **final update** on the ${projectRef} recovery. Your careful approach has gained some trust, but ${stakeholderRef} needs assurance that the product will deliver.`
  }
  
  return {
    scene,
    options: [
      { label: `Commit to an aggressive 48-hour fix timeline to ${stakeholderRef}, putting the team on overtime`, weight: 1, archetype: "Reactive" },
      { label: `Propose a conservative 2-week recovery plan to ${stakeholderRef} with thorough testing protocols`, weight: 2, archetype: "Measured" },
      { label: `Take full personal responsibility to ${stakeholderRef} and outline new processes to prevent future issues`, weight: 3, archetype: "Resilient" }
    ]
  }
}

function parseProjectContext(projectContext: string): string {
  // Smart parsing to make natural-sounding references
  const lower = projectContext.toLowerCase()
  
  // Common patterns
  if (lower.includes('edtech') || lower.includes('education')) return 'education platform'
  if (lower.includes('dashboard')) return 'analytics dashboard'
  if (lower.includes('mobile app') || lower.includes('app')) return 'mobile application'
  if (lower.includes('website') || lower.includes('landing')) return 'website'
  if (lower.includes('platform')) return 'platform'
  if (lower.includes('tool') || lower.includes('tracker')) return 'tool'
  if (lower.includes('system') || lower.includes('service')) return 'system'
  if (lower.includes('ai') || lower.includes('ml')) return 'AI-powered solution'
  
  // Extract key noun if possible
  const words = lower.split(' ')
  const lastWord = words[words.length - 1]
  if (['dashboard', 'platform', 'app', 'tool', 'system', 'website', 'portal'].includes(lastWord)) {
    return lastWord
  }
  
  return 'product'
}

function parseStakeholder(stakeholder: string): string {
  // Smart parsing to make natural-sounding references
  const lower = stakeholder.toLowerCase()
  
  // Handle "the CEO, John" or "John, the CEO" patterns
  if (lower.includes('ceo')) {
    // Extract name by removing CEO references more carefully
    let name = stakeholder
      .replace(/,?\s*the\s+ceo\s*,?/gi, '')  // Remove "the CEO"
      .replace(/,?\s*ceo\s*,?/gi, '')        // Remove "CEO"
      .replace(/^\s*,\s*|\s*,\s*$/g, '')     // Remove leading/trailing commas
      .trim()
    
    return name ? `${name}, your CEO` : 'your CEO'
  }
  
  // Handle customer references
  if (lower.includes('customer')) return 'your customers'
  if (lower.includes('client')) return 'your clients'
  if (lower.includes('user')) return 'your users'
  
  // Handle other titles
  if (lower.includes('head of sales') || lower.includes('sales director')) return 'your head of sales'
  if (lower.includes('head of marketing') || lower.includes('marketing director')) return 'your head of marketing'
  if (lower.includes('head of product') || lower.includes('product director')) return 'your head of product'
  if (lower.includes('cto')) return 'your CTO'
  if (lower.includes('founder')) return 'your founder'
  if (lower.includes('manager')) return 'your manager'
  if (lower.includes('director')) return 'your director'
  if (lower.includes('vp')) return 'your VP'
  
  // If it's just a name, assume it's important
  const words = stakeholder.trim().split(' ')
  if (words.length <= 2 && !lower.includes('the')) {
    return `${stakeholder}, your key stakeholder`
  }
  
  return stakeholder
}

// AI integration for personalized choice generation using Claude
export async function generateTurnWithAI(
  turnNumber: number,
  context: SimulationContext,
  previousChoices: UserChoice[]
): Promise<Turn> {
  
  // Turn 1 uses mock data with slight personalization
  if (turnNumber === 1) {
    return getMockTurn(1, context, previousChoices)
  }
  
  const prompt = buildPersonalizedPrompt(turnNumber, context, previousChoices)
  
  try {
    console.log('🤖 Calling Claude API for turn', turnNumber, 'with context:', context)
    console.log('🤖 Prompt being sent:', prompt.substring(0, 200) + '...')
    
    const response = await fetch('/api/generate-turn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API error: ${response.status} - ${errorData.error}`)
    }

    const parsedResponse = await response.json()
    console.log('🤖 Parsed response:', parsedResponse)
    
    return parsedResponse
  } catch (error) {
    console.error('AI generation failed:', error)
    // Fallback to mock data
    return getMockTurn(turnNumber, context, previousChoices)
  }
}

function buildPersonalizedPrompt(turnNumber: number, context: SimulationContext, previousChoices: UserChoice[]): string {
  const projectRef = parseProjectContext(context.project)
  const stakeholderRef = parseStakeholder(context.stakeholder)
  const lastChoice = previousChoices[previousChoices.length - 1]
  
  if (turnNumber === 2) {
    const baseScenario = lastChoice.archetype === 'Reactive' ? 
      `**Two days post-launch**, your platform is flooding support with angry customer emails about missing data. The support team is overwhelmed and can't keep up with the volume.` :
      lastChoice.archetype === 'Measured' ? 
      `After delaying the launch, the team is under **intense pressure** about timelines. A competitor just announced a **similar feature** and everyone's stressed about falling behind.` :
      `Your engineering team found a clever workaround for the bug, but it requires **rebuilding a core component**. Users are already asking when they can access the new features.`
    
    return `Rewrite this internal consequence scenario with personalization.

# Base scenario to rewrite:
${baseScenario}

# Personalize with:
- Project reference: ${projectRef}
- Keep the same urgency and specific details
- Write exactly 2 sentences
- NO stakeholder involvement yet - this is internal team/user issues only

# Return format:
{
  "scene": "Your 2-sentence rewrite here",
  "options": [
    {"label": "Send an immediate, decisive message to the team about how we're handling this", "weight": 1, "archetype": "Reactive"},
    {"label": "Take an hour to analyze the full impact before scheduling a coordinated response", "weight": 2, "archetype": "Measured"},
    {"label": "Draft a calm, reassuring update for the team while exploring alternative solutions", "weight": 3, "archetype": "Resilient"}
  ]
}`
  }
  
  // Turn 3
  const baseClimaxScenario = previousChoices.some(c => c.archetype === 'Reactive') ? 
    `The **board** is demanding answers about the crisis. Stakeholders are questioning your team's competence. You need to present a path forward that restores confidence.` :
    `The executive team wants a **final update** on the recovery. Your careful approach has gained some trust, but they need assurance that the product will deliver on its promises.`
  
  return `Rewrite this stakeholder confrontation scenario with personalization.

# Base scenario to rewrite:
${baseClimaxScenario}

# Personalize with:
- Project reference: ${projectRef}
- Stakeholder: ${stakeholderRef}
- Write exactly 2 sentences in SECOND PERSON ("You face...", not "I faced...")
- Create high-stakes tension about facing the stakeholder directly

# Return format:
{
  "scene": "Your 2-sentence rewrite here",
  "options": [
    {"label": "Commit to an aggressive 48-hour fix timeline to ${stakeholderRef}, putting the team on overtime", "weight": 1, "archetype": "Reactive"},
    {"label": "Propose a conservative 2-week recovery plan to ${stakeholderRef} with thorough testing protocols", "weight": 2, "archetype": "Measured"},
    {"label": "Take full personal responsibility to ${stakeholderRef} and outline new processes to prevent future issues", "weight": 3, "archetype": "Resilient"}
  ]
}`
}