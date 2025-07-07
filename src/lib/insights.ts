import { UserChoice } from './types'

export interface PersonalInsight {
  strengths: string[]
  blindSpots: string[]
  uniquePattern: string
}

export function generatePersonalInsights(choices: UserChoice[]): PersonalInsight {
  const pattern = choices.map(c => c.archetype).join('-')
  const weights = choices.map(c => c.weight)
  const archetypes = choices.map(c => c.archetype)
  
  // Analyze consistency vs adaptability
  const isConsistent = new Set(archetypes).size === 1
  const isEscalating = weights[0] < weights[1] && weights[1] < weights[2]
  const isDeescalating = weights[0] > weights[1] && weights[1] > weights[2]
  
  const dominantArchetype = getMostFrequentArchetype(archetypes)
  const hasReactive = archetypes.includes('Reactive')
  const hasResilient = archetypes.includes('Resilient')
  
  return {
    strengths: generateStrengths(dominantArchetype, isConsistent, isEscalating, archetypes),
    blindSpots: generateBlindSpots(dominantArchetype, isConsistent, hasReactive, hasResilient, archetypes),
    uniquePattern: generateUniquePattern(pattern, isConsistent, isEscalating, isDeescalating)
  }
}

function getMostFrequentArchetype(archetypes: string[]): string {
  const counts = archetypes.reduce((acc, arch) => {
    acc[arch] = (acc[arch] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0]
}

function generateStrengths(
  dominantArchetype: string, 
  isConsistent: boolean, 
  isEscalating: boolean, 
  archetypes: string[]
): string[] {
  const strengths: string[] = []
  
  // Core archetype strengths
  if (dominantArchetype === 'Reactive') {
    strengths.push('**Quick decision-maker** - You don\'t freeze under pressure')
    strengths.push('**Action-oriented** - You get things moving when others hesitate')
  } else if (dominantArchetype === 'Measured') {
    strengths.push('**Strategic thinker** - You consider consequences before acting')
    strengths.push('**Balanced approach** - You find middle ground in complex situations')
  } else {
    strengths.push('**Steady under pressure** - You remain calm when others panic')
    strengths.push('**Team-focused** - You inspire confidence in high-stress moments')
  }
  
  // Pattern-based strengths
  if (isConsistent) {
    strengths.push('**Consistent approach** - Your team knows what to expect from you')
  } else if (isEscalating) {
    strengths.push('**Adaptive escalation** - You know when to step up your response')
  } else {
    strengths.push('**Situational flexibility** - You adjust your style based on the moment')
  }
  
  // Unique combinations
  if (archetypes.includes('Reactive') && archetypes.includes('Resilient')) {
    strengths.push('**Dynamic range** - You can both act fast and think long-term')
  }
  
  return strengths.slice(0, 3) // Keep top 3
}

function generateBlindSpots(
  dominantArchetype: string, 
  isConsistent: boolean, 
  hasReactive: boolean, 
  hasResilient: boolean, 
  archetypes: string[]
): string[] {
  const blindSpots: string[] = []
  
  // Core archetype blind spots
  if (dominantArchetype === 'Reactive') {
    blindSpots.push('**May miss important details** in the rush to act')
    blindSpots.push('**Could create team anxiety** with urgent communication style')
  } else if (dominantArchetype === 'Measured') {
    blindSpots.push('**May move too slowly** in true emergencies')
    blindSpots.push('**Could frustrate faster-moving team members**')
  } else {
    blindSpots.push('**May appear disconnected** from immediate urgency')
    blindSpots.push('**Could under-communicate** specific timelines')
  }
  
  // Pattern-based blind spots
  if (isConsistent && dominantArchetype === 'Reactive') {
    blindSpots.push('**One-size-fits-all approach** - not all situations need the same intensity')
  } else if (isConsistent && dominantArchetype === 'Resilient') {
    blindSpots.push('**May miss opportunities** for quicker wins')
  } else if (!isConsistent) {
    blindSpots.push('**Inconsistent signaling** - team may struggle to predict your next move')
  }
  
  // Unique pattern insights
  if (archetypes[0] === 'Resilient' && archetypes[2] === 'Reactive') {
    blindSpots.push('**Pressure-point reactivity** - calm start but reactive finish under stress')
  }
  
  return blindSpots.slice(0, 3) // Keep top 3
}

function generateUniquePattern(
  pattern: string, 
  isConsistent: boolean, 
  isEscalating: boolean, 
  isDeescalating: boolean
): string {
  const patternInsights: Record<string, string> = {
    'Reactive-Reactive-Reactive': 'You maintain consistent urgency across all situations - a true crisis manager.',
    'Measured-Measured-Measured': 'You believe in systematic approaches regardless of external pressure.',
    'Resilient-Resilient-Resilient': 'You\'re the steady anchor your team relies on in any storm.',
    'Reactive-Measured-Resilient': 'You show impressive growth under pressure - starting reactive but ending with wisdom.',
    'Resilient-Measured-Reactive': 'You start calm but escalate when pushed - a hidden intensity.',
    'Reactive-Resilient-Measured': 'You can quickly pivot from crisis mode to strategic thinking.',
    'Measured-Reactive-Resilient': 'You show interesting adaptability - analytical, then urgent, then steady.',
    'Resilient-Reactive-Measured': 'You have a unique calm-storm-calm pattern that might confuse teams.',
    'Measured-Resilient-Reactive': 'You build up intensity over time - methodical to steady to action-oriented.'
  }
  
  return patternInsights[pattern] || 'You show a unique decision-making pattern that adapts to each situation.'
}