import { Archetype } from '../types';

export const SCENARIO_CONTEXT = "The user's viral music remix has a potential copyright issue, and they are navigating the fallout and opportunities.";

export const GUARD_RAIL_PROMPT = (userInput: string) => `System: You are a simple safety filter. Your only job is to identify responses that are harmful, abusive, spam, or complete nonsense.

Task: Is this response harmful, abusive, spam, or complete nonsense? Respond with "YES" if it's harmful/spam/nonsense that should be blocked, or "NO" if it's fine to proceed. Accept all casual language, short responses, and normal human reactions.

# Scenario Context:
${SCENARIO_CONTEXT}

# User's Response:
"${userInput}"

# Your Verdict (YES or NO):`;

export const ENGINE_PROMPT = (userInput: string, storySoFar: string, nextStoryBeat: string | null = null) => `You're an expert in reading people's emotions and motivations in high-pressure creative situations. You understand not just what people say, but HOW they say it - their confidence, fear, excitement, dismissiveness, uncertainty, or bravado.

# The Situation
Someone's navigating a viral remix with copyright complications. Every response reveals their personality, emotional state, and approach to risk.

# Your Analysis Process
1. **Read Their Emotional State**: What feeling is behind their words? (confident, anxious, dismissive, excited, conflicted, etc.)
2. **Identify Their Attitude**: How are they approaching this situation? (cautious, reckless, thoughtful, impulsive, etc.)
3. **Capture Their Voice**: What does their word choice and tone tell you about who they are?
4. **Respect Their Energy**: Match the emotional rhythm they're setting

# Story Context
${storySoFar}

# Their Response
"${userInput}"

# Response Requirements

**Emotional Intelligence**: Your continuation must acknowledge the specific feeling/attitude they expressed. If they sound worried, show you heard that worry. If they sound cocky, reflect that energy back.

**Story Narration (NOT Advice)**: You are writing THEIR story, not giving advice. Don't say "I think you should..." or "My advice is...". Instead, write what THEY do next based on their mindset.

**Natural Reaction**: Write what would naturally happen next to someone with THAT specific emotional state. Show their actions and internal experience.

**Voice**: Write in second person ("you") as a neutral narrator telling their story. You're not a friend giving advice - you're continuing their narrative.

**Classification**: 
- 🔥 Momentum: Acting quickly, trusting instincts, seizing the moment, taking risks
- ⚡️ Method: Wanting to think it through, gathering information, being cautious, planning ahead

**Length**: 2-3 sentences that feel natural - not rushed, not overwritten.

Return ONLY this JSON:
{
  "classification": "Momentum" or "Method",
  "next_scene_text": "Continue their story in a way that shows you truly heard them...",
  "action_summary": "what they did, reflecting their actual attitude"
}`;

export const CONCLUSION_PROMPT = (storySoFar: string, userActions: string[]) => `You're wrapping up someone's viral remix story. Write their ending in a casual, authentic way that feels real to the music scene.

# Their Journey
User's choices: ${userActions.join('. ')}

# Writing Instructions
- Write in second person ("you") - you're telling THEIR story
- Keep it casual and conversational, like a friend recapping what happened
- 2 short paragraphs, about 600 characters total
- If there are consequences, show how things work out or what was learned
- End on a realistic but not overly negative note
- This is about YOUR individual creative journey as a solo music maker

# Format
PARAGRAPH1: [~300 chars - what happened next]
PARAGRAPH2: [~300 chars - how it settled/what you learned/moving forward]

Write a natural conclusion to their remix story.`;

// The four remix archetypes based on Momentum vs Method
export const ARCHETYPES: Record<string, Archetype> = {
  "crisis_catalyst": {
    name: "The Crisis Catalyst",
    emoji: "🔥",
    subtitle: "You act when others freeze. Chaos sharpens your focus.",
    flavorText: "You respond to pressure with speed and decisiveness. When others are still naming the problem, you're already doing something about it. You're at your best in live fire - triaging fast, reducing harm, keeping momentum alive.\n\nPeople lean on you in moments of uncertainty because they know you won't stall. You instinctively cut to what matters, and you're willing to absorb risk if it keeps the engine running.\n\nBut not everything is a fire. And not all fires need you to jump in first. The challenge is learning when urgency is real - and when it's your reflex talking. Sustainable leadership means knowing when not to act."
  },
  "rapid_strategist": {
    name: "The Rapid Strategist", 
    emoji: "⚡️",
    subtitle: "You move fast - without losing the bigger picture.",
    flavorText: "You don't just react. You adapt. You make moves quickly, but they're rarely random. Your gift is integrating speed and foresight: acting decisively while still accounting for downstream effects.\n\nYou're the person who keeps things from stalling, but doesn't break them in the process. In fast-moving environments, you're often the glue: unblocking, shaping direction, and adjusting on the fly.\n\nBut sometimes, your speed hides how much you're still figuring out. You might move so fast that others can't follow... or don't trust there's a strategy behind the urgency. Slow down just enough to loop others in."
  },
  "systematic_solver": {
    name: "The Systematic Solver",
    emoji: "🧩", 
    subtitle: "You fix what broke - and the pattern that broke it.",
    flavorText: "You think in layers. Not just 'what went wrong?' but: 'why did this happen?' You're the person who moves deliberately in a crisis - assessing, probing, building something that won't break again.\n\nYour work is often invisible until it's obvious: that thing didn't fall apart because you quietly rerouted its failure point. You're not flashy, but you're trustworthy.\n\nYour shadow is perfectionism. You wait too long for clarity when messy action might have been enough. Not every fix needs to be final. Sometimes, it's okay to move forward before every detail is known."
  },
  "systems_architect": {
    name: "The Systems Architect",
    emoji: "📐",
    subtitle: "You think beyond today - and build to prevent tomorrow's fires.",
    flavorText: "You're a long-term thinker in a short-term world. You see failure modes before others see friction. You design for durability, edge cases, and complexity - often in ways that make things look simple on the surface.\n\nPeople rarely notice the things that don't break, but that's your legacy. You prevent chaos by never letting it start.\n\nThe risk? You stay stuck in theory while the real world burns. In moments of crisis, your strength can become your blind spot. Sometimes the best system is the one you can duct-tape right now."
  }
};

// Static questions for the three turns
export const QUESTIONS = [
  "Your phone is buzzing with notifications. Some comments are saying 'This is fire!' Others are saying 'Isn't this copyright infringement?' Your friend Casey texts you: 'Should we be worried about this copyright thing?'",
  "The situation gets crazier. A major record label DMs you: 'We love your remix. We want to sign you for an official release, but we need to move fast - the hype window is short. Can you get permission from the original artist by tomorrow?'",
  "Plot twist: The original artist's manager emails you. They're not angry - they want to collaborate! But they want to re-record the whole thing 'properly' in a studio. This would take at least two weeks and kill your current viral momentum. What's your call?"
];

// Initial scene text
export const INITIAL_SCENE = "You've been making music in your spare time for the past few months. Last night, you remixed a popular song that's been stuck in your head. You stayed up until 4AM, perfecting every beat. You posted it online this morning. It went viral overnight - 2 million views and climbing. But there's a problem: you used the original song's audio without getting permission. The comments are blowing up with both praise and questions about copyright.";

// Scenario metadata
export const SCENARIO_INFO = {
  title: "The Remix Controversy",
  description: "A viral music scenario testing how you handle creative success mixed with legal uncertainty.",
  path: "/remix-simulation"
};

// Function to determine archetype from user path
export function getArchetypeFromPath(userPath: string[]): Archetype {
  const momentumCount = userPath.filter(classification => classification === "Momentum").length;
  
  if (momentumCount === 3) {
    return ARCHETYPES.crisis_catalyst;
  } else if (momentumCount === 2) {
    return ARCHETYPES.rapid_strategist;
  } else if (momentumCount === 1) {
    return ARCHETYPES.systematic_solver;
  } else {
    return ARCHETYPES.systems_architect;
  }
}
