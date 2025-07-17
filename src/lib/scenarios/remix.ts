import { Archetype } from '../types';

export const SCENARIO_CONTEXT = "The user's viral music remix has a potential copyright issue, and they are navigating the fallout and opportunities.";

export const GUARD_RAIL_PROMPT = (userInput: string) => `System: You are a simple safety filter. Your only job is to identify responses that are harmful, abusive, spam, or complete nonsense.

Task: Is this response harmful, abusive, spam, or complete nonsense? Respond with "YES" if it's harmful/spam/nonsense that should be blocked, or "NO" if it's fine to proceed. Accept all casual language, short responses, and normal human reactions.

# Scenario Context:
${SCENARIO_CONTEXT}

# User's Response:
"${userInput}"

# Your Verdict (YES or NO):`;

export const STORY_PROMPT = (userInput: string, storySoFar: string, currentQuestion: string | null = null) => `You're continuing someone's story based on their response. 

# Their Response
"${userInput}"

# Your Task
Write what they do next in 2 sentences. Match the vibe of their response - if they say "YOLO!" then they're not too worried. If they're hesitant, show that. If they're confident, show that.

Example: If they say "YOLO!" → "You're aware of the situation but not too worried. You tell Casey that it's probably alright, before checking your phone again to see how your remix is doing."

Write in second person ("you"). Focus on their immediate reaction and what they do next.

Return ONLY the story text.`;

export const INTENT_CLASSIFIER_PROMPT = (userInput: string) => `You are an intent classifier.

Your job is to classify the user's freeform response into one of 8 behavioral intents based on their dominant instinct. These intents reflect how a user handles social, creative, and professional pressure in ambiguous situations.

Return only:
{
  "intent": "[best matching intent]"
}

Available intents:
- Escalate
- Defer
- Collaborate
- Anchor
- Triangulate
- Withdraw
- Frame
- Justify

Classify the intent based on the following scenario:
A solo creator has posted a remix of a popular song online. It went viral — but the audio was used without permission. Across 3 moments, they must respond to:
1. A worried friend (Casey)
2. A fast-moving record label
3. The original artist's manager

Use these examples as a guide:

---

Intent: Escalate
- "I'm down. Let's move before the hype dies."
- "Let's just record version and get it done over this weekend!"
- "Haha, no worries! I'm tweeting this to keep momentum going."

Intent: Defer
- "I sort of want to think it through overnight."
- "I told the manager I'll get back to them next week."
- "Let's not do anything until we hear from someone who knows copyright."

Intent: Collaborate
- "Can you help me figure this out?"
- "I told the manager I want to loop in the original artist before deciding."
- "I sent the song to a few friends for advice before replying to anyone."

Intent: Anchor
- "I told the label I'll only sign if the artist approves it directly."
- "I think I need to take it down until we know we're safe."
- "I said no to the re-record — I'm proud of the version that's out now."

Intent: Triangulate
- "Good question, I already DMed this lawyer I follow on TikTok to ask if it's actually infringement."
- "Hey, someone else already reached out before you at another label."
- "I sent it to a Discord server I'm in to get their take on whether this is risky."

Intent: Withdraw
- "I deleted the remix and logged off — it's not worth the stress."
- "Honestly, I don't think that's a good idea. I'm out."
- "I appreciate the offer but I'm not comfortable continuing."

Intent: Frame
- "I replied to the label saying this remix is a 'creative reinterpretation,' not a sample."
- "I messaged the manager saying I see this as a tribute, not a copyright issue."
- "This isn't stealing — this is elevating the original."

Intent: Justify
- "It's fine. People do this kind of remix all the time — we're not selling it."
- "We credited the artist, so I don't think it's technically a problem."
- "It's not like the original was even that popular. I'm helping them."

# User Response to Classify:
"${userInput}"

Classify this response into one of the 8 intents above.`;

export const CONCLUSION_PROMPT = (storySoFar: string, userResponses: string[]) => `You're concluding someone's viral remix story. Write how their journey ended.

# Their Journey
Turn 1 (Friend's copyright question): "${userResponses[0] || 'No response'}"
Turn 2 (Record label deadline): "${userResponses[1] || 'No response'}"
Turn 3 (Artist collaboration offer): "${userResponses[2] || 'No response'}"

# Your Task
Write a brief story conclusion about how things turned out. Keep it upbeat and focused on the outcome.

# Writing Instructions
- Write in second person ("you") - like the ending of a story
- Keep it professional but warm
- Length: 250-300 characters MAX
- End on a positive, successful note
- Focus on the story outcome, not addressing the reader directly

Example tone: "The collaboration timeline worked out perfectly, and you created something special together. The record label was excited to work with you, and your remix journey became a complete success."

Write the story conclusion.`;

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
  "Your phone is buzzing with notifications. Some comments are saying 'This is fire!' Others are saying 'Isn't this copyright infringement?' Your best friend texts you: 'Hey, you OK with this copyright stuff?'",
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

// Intent weight mapping (1-3 scale for behavioral intensity)
export const INTENT_WEIGHTS: Record<string, number> = {
  "Escalate": 3,    // High intensity - actively pushing forward, taking risks
  "Defer": 1,       // Low intensity - avoiding immediate action, wanting to wait
  "Collaborate": 2, // Medium intensity - seeking input, sharing decisions
  "Anchor": 2,      // Medium intensity - standing firm on principles, being cautious
  "Triangulate": 2, // Medium intensity - seeking information, comparing options
  "Withdraw": 1,    // Low intensity - pulling back, avoiding engagement
  "Frame": 3,       // High intensity - actively shaping narrative, taking control
  "Justify": 2      // Medium intensity - defending position, rationalizing actions
};

// Function to determine archetype from user path using new intent weights
export function getArchetypeFromPath(userPath: string[]): Archetype {
  // Calculate total weight from all intents
  const totalWeight = userPath.reduce((sum, intent) => {
    return sum + (INTENT_WEIGHTS[intent] || 0);
  }, 0);
  
  // Determine archetype based on total weight
  if (totalWeight >= 3 && totalWeight <= 4) {
    return ARCHETYPES.crisis_catalyst;
  } else if (totalWeight >= 5 && totalWeight <= 6) {
    return ARCHETYPES.rapid_strategist;
  } else if (totalWeight >= 7 && totalWeight <= 8) {
    return ARCHETYPES.systematic_solver;
  } else { // totalWeight >= 9
    return ARCHETYPES.systems_architect;
  }
}

// Removed hardcoded behavioral analyzer - now using AI-generated insights
