export interface Choice {
  label: string;
  code: string; // A, B, C, or D
}

export interface Beat {
  title: string;
  scene: string;
  options: Choice[];
}

export interface UserChoice {
  beat: number;
  code: string;
  label: string;
}

export interface PersonalityResult {
  code: string; // 3-letter combination like "ABC"
  archetype: string;
  insight: string;
  whatCanBiteYou: string;
  practicalSuggestion: string;
}

// The 64 personality matrix from the specification
export const PERSONALITY_MATRIX: Record<string, PersonalityResult> = {
  "AAA": {
    code: "AAA",
    archetype: "Hallway Conductor",
    insight:
      "You hold your fire until the dust settles, then pull everyone into one channel and give them credit up front. Partners trust your calm, but slow starts mean your own priorities may get overwritten. Notice whether waiting costs you leverage you never recover.",
    whatCanBiteYou:
      "If you wait too long to speak, other people make the plan without you.",
    practicalSuggestion:
      "At the first meeting, say which task you will own."
  },
  "AAB": {
    code: "AAB",
    archetype: "Fog-Lamp Host",
    insight:
      "You wait, convene the room, then keep public comments deliberately vague. The group feels managed, not rushed—but ambiguity lingers.",
    whatCanBiteYou:
      "Vague comments mean no one knows what \\\"finished\\\" looks like.",
    practicalSuggestion:
      "End every meeting by naming one next step, who does it, and by when."
  },
  "AAC": {
    code: "AAC",
    archetype: "On-Air Archivist",
    insight:
      "You pause, gather everyone, and correct the public record on the spot. People appreciate the clean ledger, yet the sudden assertiveness can feel jarring.",
    whatCanBiteYou:
      "Fixing mistakes in front of everyone can feel like an attack.",
    practicalSuggestion:
      "Send a quick private warning before you point out the mistake."
  },
  "AAD": {
    code: "AAD",
    archetype: "Curtain-Call Broker",
    insight:
      "You stay quiet, herd the team, and shift the real bargaining off-camera. Deals get done, but outsiders fill the silence with their own story.",
    whatCanBiteYou:
      "Deals made in private make teammates suspicious.",
    practicalSuggestion:
      "After a private deal, share a short summary with the whole team."
  },
  "ABA": {
    code: "ABA",
    archetype: "Surfboard MC",
    insight:
      "You hold back just long enough to read the room, then keep the train moving and spread the credit mid-ride. Energy stays high, though details can trail behind.",
    whatCanBiteYou:
      "Moving fast can hide small problems that grow later.",
    practicalSuggestion:
      "Set a 15-minute mid-project check to hunt for issues."
  },
  "ABB": {
    code: "ABB",
    archetype: "Soft-Jazz Narrator",
    insight:
      "You keep the train moving and talk in broad strokes on stage. The vibe is smooth, but vague promises stack up.",
    whatCanBiteYou:
      "Big-picture talk doesn't assign real work.",
    practicalSuggestion:
      "Attach a to-do list with owners to every status update."
  },
  "ABC": {
    code: "ABC",
    archetype: "Mid-Set Fixer",
    insight:
      "You ride momentum until a fact veers off-track—then you fix it live without slowing down.",
    whatCanBiteYou:
      "Fixing things on the fly can surprise the team.",
    practicalSuggestion:
      "Give a brief heads-up before you make the fix."
  },
  "ABD": {
    code: "ABD",
    archetype: "Galley Closer",
    insight:
      "You push for speed, then duck out to seal terms privately. The hustle shows, yet the hand-off feels abrupt.",
    whatCanBiteYou:
      "Private, fast deals leave others unsure what changed.",
    practicalSuggestion:
      "Post a before-and-after list right after you wrap the deal."
  },
  "ACA": {
    code: "ACA",
    archetype: "Boundary Spotlighter",
    insight:
      "You're mild until numbers look skewed; then you stake out fair lines and still lift others on stage.",
    whatCanBiteYou:
      "Switching from easygoing to strict can shock people.",
    practicalSuggestion:
      "Tell the team your non-negotiables early."
  },
  "ACB": {
    code: "ACB",
    archetype: "Velvet Umpire",
    insight:
      "You set firm terms behind the scenes, but speak softly in public. It keeps tempers cool, yet obscures who's doing the hard guarding.",
    whatCanBiteYou:
      "Speaking softly hides the heavy lifting you're doing.",
    practicalSuggestion:
      "Show one metric that proves why your rule matters."
  },
  "ACC": {
    code: "ACC",
    archetype: "Ledger Lighthouse",
    insight:
      "You draw the line *and* announce it live. Everyone knows where things stand—comforting to some, confrontational to others.",
    whatCanBiteYou:
      "Public numbers can freeze people who fear mistakes.",
    practicalSuggestion:
      "Add a simple next step next to every metric."
  },
  "ACD": {
    code: "ACD",
    archetype: "Quiet Arbiter",
    insight:
      "You set the rules early, then finalise them in private. Process stays orderly, but those outside the room may doubt it.",
    whatCanBiteYou:
      "Secret decisions start rumors.",
    practicalSuggestion:
      "Publish a short FAQ that explains how you decided."
  },
  "ADA": {
    code: "ADA",
    archetype: "Echo-Stagehand",
    insight:
      "You watch, align with a trusted ally, then hand the spotlight around. Cohesion feels great until your own view goes missing.",
    whatCanBiteYou:
      "Copying an ally can hide what you want.",
    practicalSuggestion:
      "State one personal goal in the plan."
  },
  "ADB": {
    code: "ADB",
    archetype: "Shadow Chorus",
    insight:
      "You mirror a partner's stance and keep external remarks soft. The group stays placid, but your authorship fades.",
    whatCanBiteYou:
      "Always supporting others can stall decisions that need a leader.",
    practicalSuggestion:
      "Start one sentence with 'I recommend …'."
  },
  "ADC": {
    code: "ADC",
    archetype: "Playback Editor",
    insight:
      "You back an ally until facts skew, then you straighten them live. Loyal yet principled—but the pivot can bruise relationships.",
    whatCanBiteYou:
      "Changing course live can strain friendships.",
    practicalSuggestion:
      "Agree on a private signal with your ally for changes."
  },
  "ADD": {
    code: "ADD",
    archetype: "Mirror-Room Deal-Maker",
    insight:
      "You echo a partner, then hammer the deal backstage. Effective, though spectators may wonder who pulled which lever.",
    whatCanBiteYou:
      "Side deals confuse who did what.",
    practicalSuggestion:
      "Both of you sign the recap so credit is clear."
  },

  /* ----------  B SERIES  ---------- */

  "BAA": {
    code: "BAA",
    archetype: "Thread-Pull Host",
    insight:
      "Your first move is a gentle probe; next you open the group chat and amplify others. This uncovers issues fast, but your own agenda can drift.",
    whatCanBiteYou:
      "Asking too many questions drags meetings.",
    practicalSuggestion:
      "Limit discovery questions to the first 10 minutes."
  },
  "BAB": {
    code: "BAB",
    archetype: "Lantern-Bearing Diplomat",
    insight:
      "You ask a question, convene everyone, then offer guarded language on stage. Space for nuance is good; endless grey can stall action.",
    whatCanBiteYou:
      "Talking about nuance without details blocks budgets.",
    practicalSuggestion:
      "End with one clear resource request."
  },
  "BAC": {
    code: "BAC",
    archetype: "Interview Fact-Checker",
    insight:
      "You probe, gather, and tidy the narrative in public. Sharp work, yet some feel ambushed by the sudden precision.",
    whatCanBiteYou:
      "Fixing a document in front of everyone can embarrass people.",
    practicalSuggestion:
      "Offer to review privately before correcting it."
  },
  "BAD": {
    code: "BAD",
    archetype: "Table-Setter",
    insight:
      "You probe, convene, then settle numbers offstage. Efficient, but watchers lose the thread.",
    whatCanBiteYou:
      "Terms changing offstage leave people lost.",
    practicalSuggestion:
      "Share a one-page summary right after the deal."
  },
  "BBA": {
    code: "BBA",
    archetype: "Momentum Shepherd",
    insight:
      "You ask one pointed question, ride the momentum, and splash credit around. Energising, though follow-ups can slip through the cracks.",
    whatCanBiteYou:
      "Giving credit without follow-up leads to unfinished tasks.",
    practicalSuggestion:
      "Turn each shout-out into a task with a due date."
  },
  "BBB": {
    code: "BBB",
    archetype: "Slipstream Navigator",
    insight:
      "You probe, keep speed, and stay soft-spoken publicly. Momentum holds; clarity limps.",
    whatCanBiteYou:
      "Soft words and fast pace hide trade-offs.",
    practicalSuggestion:
      "Add a clear decision slide halfway through."
  },
  "BBC": {
    code: "BBC",
    archetype: "Riptide Redirector",
    insight:
      "You combine probing with live fact-fixing at full tilt. High-wire act—thrilling when it works, messy when it doesn't.",
    whatCanBiteYou:
      "Constant tweaks tire the team.",
    practicalSuggestion:
      "Collect small fixes and do them once a week."
  },
  "BBD": {
    code: "BBD",
    archetype: "Side-Door Closer",
    insight:
      "You prod, sprint, then close doors to negotiate. Fast, but opaque.",
    whatCanBiteYou:
      "Fast private deals can look shady.",
    practicalSuggestion:
      "Invite a neutral observer to the negotiation call."
  },
  "BCA": {
    code: "BCA",
    archetype: "Fairness Herald",
    insight:
      "You test weak seams, set fairness markers, and spotlight collaborators. The candour builds respect, yet can feel sudden.",
    whatCanBiteYou:
      "Sudden fairness checks feel like an ambush.",
    practicalSuggestion:
      "Share your fairness rules before crunch time."
  },
  "BCB": {
    code: "BCB",
    archetype: "Understudy Referee",
    insight:
      "You question, call the foul, then speak in code to the crowd. What stories grow in the gaps?",
    whatCanBiteYou:
      "Speaking in code lowers clarity.",
    practicalSuggestion:
      "Translate one coded note into plain language."
  },
  "BCC": {
    code: "BCC",
    archetype: "Live-Tally Umpire",
    insight:
      "You call out numbers mid-stride in front of the crowd. The ledger is clear; feelings, less so.",
    whatCanBiteYou:
      "Public scoreboards can shame slower people.",
    practicalSuggestion:
      "Add tips on how to improve next to each number."
  },
  "BCD": {
    code: "BCD",
    archetype: "Quiet Dealmaker",
    insight:
      "You probe, protect, then bargain privately. Solid defence, but silence breeds speculation.",
    whatCanBiteYou:
      "Silence after a private deal starts gossip.",
    practicalSuggestion:
      "Give a five-minute summary right after closing terms."
  },
  "BDA": {
    code: "BDA",
    archetype: "Echo Reporter",
    insight:
      "A gentle question first, then you sync with the loudest source and hand out credit. Was the source actually right?",
    whatCanBiteYou:
      "Repeating the loudest voice can spread bad info.",
    practicalSuggestion:
      "Double-check the source before sharing."
  },
  "BDB": {
    code: "BDB",
    archetype: "Low-Key Wingman",
    insight:
      "You query, align, and keep public language soft. How long before a wingman needs a pilot's seat?",
    whatCanBiteYou:
      "Always playing sidekick hides your skills.",
    practicalSuggestion:
      "Present the next demo yourself."
  },
  "BDC": {
    code: "BDC",
    archetype: "Shadow Auditor",
    insight:
      "You ask, echo, then audit the ledger on camera. Can a sudden audit land without whiplash?",
    whatCanBiteYou:
      "Surprise audits hurt morale.",
    practicalSuggestion:
      "Publish an audit calendar so checks feel routine."
  },
  "BDD": {
    code: "BDD",
    archetype: "Reflective Broker",
    insight:
      "Inquiry, mirroring, private deals. Does discretion build calm or fog?",
    whatCanBiteYou:
      "Too much discretion can look like indecision.",
    practicalSuggestion:
      "Write your own stance before talks start."
  },

  /* ----------  C SERIES  ---------- */

  "CAA": {
    code: "CAA",
    archetype: "Front-Door Host",
    insight:
      "You tackle the glitch head-on, circle the band, and shine a beam on every player. Straight paths earn trust—unless someone needed a softer ramp.",
    whatCanBiteYou:
      "A bright spotlight can overwhelm shy teammates.",
    practicalSuggestion:
      "Ask quieter members which part they'd like you to present."
  },
  "CAB": {
    code: "CAB",
    archetype: "Civic Spokesperson",
    insight:
      "You go direct, unite the team, then soften language externally. This cools the room but can look like mixed messaging.",
    whatCanBiteYou:
      "Different messages inside and outside confuse partners.",
    practicalSuggestion:
      "Use the same numbers in both internal and external decks."
  },
  "CAC": {
    code: "CAC",
    archetype: "Mic-Drop Archivist",
    insight:
      "You hit problems hard, assemble everyone, and correct live. No one can claim ignorance—yet some feel cornered.",
    whatCanBiteYou:
      "Hard truths need follow-up or they hurt relationships.",
    practicalSuggestion:
      "End every correction with an invitation to respond."
  },
  "CAD": {
    code: "CAD",
    archetype: "Town-Hall Closer",
    insight:
      "You're blunt up front, group-minded mid-way, private at the finish. Results come, but tempo shifts may confuse.",
    whatCanBiteYou:
      "Changing pace confuses staff.",
    practicalSuggestion:
      "Explain the communication style you'll use in each phase."
  },
  "CBA": {
    code: "CBA",
    archetype: "Launch Conductor",
    insight:
      "You confront, keep speed, and celebrate others on the fly. Magnetic, but corners may get shaved.",
    whatCanBiteYou:
      "Speed and celebration can hide tech debt.",
    practicalSuggestion:
      "Plan a maintenance sprint right after launch."
  },
  "CBB": {
    code: "CBB",
    archetype: "Rapid-Fire Diplomat",
    insight:
      "You push hard, move fast, speak soft outside. Intensity inside, calm outside; sync or schism depends on context.",
    whatCanBiteYou:
      "Fast inside, soft outside looks secretive.",
    practicalSuggestion:
      "Share a trimmed version of internal notes once a month."
  },
  "CBC": {
    code: "CBC",
    archetype: "Momentum Editor",
    insight:
      "You drive, then fact-check live without slowing. Spectators admire the precision; the team might flinch.",
    whatCanBiteYou:
      "Frequent pit-stops exhaust the team.",
    practicalSuggestion:
      "Bundle minor fixes into one weekly review."
  },
  "CBD": {
    code: "CBD",
    archetype: "Express-Line Broker",
    insight:
      "You sprint, then slip away to seal terms. Rapid but abrupt.",
    whatCanBiteYou:
      "Leaving suddenly to negotiate leaves gaps.",
    practicalSuggestion:
      "Assign a deputy to answer questions while you're out."
  },
  "CCA": {
    code: "CCA",
    archetype: "Equal-Rights MC",
    insight:
      "You mark the boundary early and shine light on everyone's part. Fair and transparent—unless folks prefer quiet negotiation.",
    whatCanBiteYou:
      "Public fairness talks don't fit every culture.",
    practicalSuggestion:
      "Offer a private way for people to raise concerns first."
  },
  "CCB": {
    code: "CCB",
    archetype: "Velvet-Rule Setter",
    insight:
      "Hard stake in the ground, velvet words on top. Do people mistake velvet for wiggle room?",
    whatCanBiteYou:
      "Soft wording invites loopholes.",
    practicalSuggestion:
      "Add 'This rule is firm' to the policy."
  },
  "CCC": {
    code: "CCC",
    archetype: "Ledger-Side Announcer",
    insight:
      "You post the rules publicly, in real time. Crystal clear, occasionally icy.",
    whatCanBiteYou:
      "Cold data can dampen creativity.",
    practicalSuggestion:
      "Share one positive story alongside the numbers."
  },
  "CCD": {
    code: "CCD",
    archetype: "Frank Arbiter",
    insight:
      "You set strict terms and finalise privately. Orderly, but opaque.",
    whatCanBiteYou:
      "Private strict rules hide lessons.",
    practicalSuggestion:
      "Turn key rulings into a lessons-learned slide."
  },
  "CDA": {
    code: "CDA",
    archetype: "Aligned Promoter",
    insight:
      "You speak up, align with a key ally, and hand out praise. Loyal and loud.",
    whatCanBiteYou:
      "Your ally's story can overshadow yours.",
    practicalSuggestion:
      "Publish a short reflection post-mortem in your own voice."
  },
  "CDB": {
    code: "CDB",
    archetype: "Concord Liaison",
    insight:
      "You solve the issue, mirror a partner, then brief the public in broad strokes. Where does ownership blur?",
    whatCanBiteYou:
      "Unclear ownership delays hand-offs.",
    practicalSuggestion:
      "Keep an up-to-date RACI chart visible."
  },
  "CDC": {
    code: "CDC",
    archetype: "Reflection Editor",
    insight:
      "You back an ally until facts bend, then correct live. Principled, but relationship stress is real.",
    whatCanBiteYou:
      "Correcting an ally publicly hurts trust.",
    practicalSuggestion:
      "Use a private 'pause' word to take issues offline."
  },
  "CDD": {
    code: "CDD",
    archetype: "Twin-Track Dealer",
    insight:
      "You confront, mirror, then close doors to negotiate. Efficient, but who owns the outcome?",
    whatCanBiteYou:
      "Hidden authorship blurs accountability.",
    practicalSuggestion:
      "Put initials next to each decision in the doc."
  },

  /* ----------  D SERIES  ---------- */

  "DAA": {
    code: "DAA",
    archetype: "Back-Channel Herald",
    insight:
      "You collect whispers, unite the room, and spotlight others' work. Low ego, high trust—until folks wonder what *you* want.",
    whatCanBiteYou:
      "People may suspect hidden agendas.",
    practicalSuggestion:
      "State your success metric at the project start."
  },
  "DAB": {
    code: "DAB",
    archetype: "Private Courier",
    insight:
      "You work behind the scenes, convene, then keep external comments modest. Discretion is classy; ambiguity can stunt buy-in.",
    whatCanBiteYou:
      "Being modest can hide blockers.",
    practicalSuggestion:
      "Share one potential blocker at each stand-up."
  },
  "DAC": {
    code: "DAC",
    archetype: "Lobby Proofreader",
    insight:
      "You move in shadows until the story warps, then fix it publicly. The contrast startles.",
    whatCanBiteYou:
      "Public fixes after silence feel abrupt.",
    practicalSuggestion:
      "Leave comments 30 minutes before the meeting."
  },
  "DAD": {
    code: "DAD",
    archetype: "Shadow Mediator",
    insight:
      "You orchestrate quietly and close terms off-mic. Sleek but invisible.",
    whatCanBiteYou:
      "Invisible work isn't valued.",
    practicalSuggestion:
      "Send a bi-weekly list of resolved issues."
  },
  "DBA": {
    code: "DBA",
    archetype: "Underground Hype Agent",
    insight:
      "You pilot from the wings, keep speed, and cast praise wide. Feels effortless; sometimes *too* invisible.",
    whatCanBiteYou:
      "Working in secret means you miss credit.",
    practicalSuggestion:
      "Ask a sponsor to mention you in retros."
  },
  "DBB": {
    code: "DBB",
    archetype: "Quiet-Current Driver",
    insight:
      "Quiet hand on the throttle, soft words on airtime. Good for harmony, bad for accountability.",
    whatCanBiteYou:
      "Keeping harmony can hide risks.",
    practicalSuggestion:
      "Have a peer review your plan before launch."
  },
  "DBC": {
    code: "DBC",
    archetype: "Stealth Signal Fixer",
    insight:
      "Stealthy until facts wobble, then public correction mid-sprint. Necessary, but whiplash exists.",
    whatCanBiteYou:
      "Mid-sprint fixes disrupt flow.",
    practicalSuggestion:
      "Hold a daily 5-minute sync for small issues."
  },
  "DBD": {
    code: "DBD",
    archetype: "Hidden-Station Broker",
    insight:
      "You guide momentum then vanish to negotiate. The magic trick works if people know the rabbit's still alive.",
    whatCanBiteYou:
      "Team stalls when you're absent.",
    practicalSuggestion:
      "Set an auto-status with your return time."
  },
  "DCA": {
    code: "DCA",
    archetype: "Shadow-Ref Announcer",
    insight:
      "You audit softly, stake fairness, and hand credit around. Fairness lands; motives stay occult.",
    whatCanBiteYou:
      "Decisions without reasons seem random.",
    practicalSuggestion:
      "Explain one past ruling step by step."
  },
  "DCB": {
    code: "DCB",
    archetype: "Back-Room Umpire",
    insight:
      "You defend in silence, speak gently outside. People feel protected—yet uninformed.",
    whatCanBiteYou:
      "Team may rely only on you to enforce rules.",
    practicalSuggestion:
      "Teach a junior to share rule enforcement."
  },
  "DCC": {
    code: "DCC",
    archetype: "Quiet Scorekeeper",
    insight:
      "You keep score quietly, then publish stats live. Transparency is noble; surprise is not.",
    whatCanBiteYou:
      "Surprise metrics feel like judgment.",
    practicalSuggestion:
      "Share draft numbers a day early."
  },
  "DCD": {
    code: "DCD",
    archetype: "Secret Ledger Dealer",
    insight:
      "You guard quietly and seal deals in private. The machine runs, but no one sees the cogs.",
    whatCanBiteYou:
      "Full secrecy breeds rumors.",
    practicalSuggestion:
      "Rotate different observers into private sessions."
  },
  "DDA": {
    code: "DDA",
    archetype: "Ghostwriter Promoter",
    insight:
      "You gather intel, echo an ally's pitch, then light up the group. Community grows—your fingerprint fades.",
    whatCanBiteYou:
      "No visible signature hurts your career.",
    practicalSuggestion:
      "Put your name on one big deliverable each quarter."
  },
  "DDB": {
    code: "DDB",
    archetype: "Shadow-Chorus Leader",
    insight:
      "You stay in the background, echo an ally, and speak softly. The alliance is smooth, the edges blurry.",
    whatCanBiteYou:
      "Echoing others hides your expertise.",
    practicalSuggestion:
      "Host a lunch session on your special skill."
  },
  "DDC": {
    code: "DDC",
    archetype: "Mirrored Fact-Checker",
    insight:
      "You mirror until numbers skew, then correct them live. Fair, surprising.",
    whatCanBiteYou:
      "Public corrections strain alliances.",
    practicalSuggestion:
      "Give partners a chance to fix issues privately first."
  },
  "DDD": {
    code: "DDD",
    archetype: "Invisible Deal Architect",
    insight:
      "You stay hidden, mirror an ally, and close deals in the dark. Results, yes—recognition, not so much.",
    whatCanBiteYou:
      "Anonymous wins don't build your reputation.",
    practicalSuggestion:
      "Negotiate for a credit line before final sign-off."
  }
};

// Hardcoded beats for the music scenario
export const BEATS: Beat[] = [
  {
    title: "Beat 1 — The DM",
    scene: "Maya shoots you a quick DM:\n\\\"OMG this is exploding. Didn't expect this to blow up. Let's talk tomorrow?\\\"\n\nYour next move:",
    options: [
      { label: "Heart-react the message, drop a \\\"wow, wild!\\\" reply, and wait.", code: "A" },
      { label: "Ask one innocent question—\\\"Love it! Did you tag us anywhere?\\\"—and gauge her response.", code: "B" },
      { label: "Fire off a voice note congratulating her, then add, \\\"Hey, overnight credits got weird—shall we sync?\\\"", code: "C" },
      { label: "Screenshot the viral post, send it to Jonah with a single eyeball emoji, and say nothing to Maya yet.", code: "D" }
    ]
  },
  {
    title: "Beat 2 — The Clause", 
    scene: "Next morning you wake to an email from an indie label's A&R rep, CC'd to you, Maya, and Jonah:\n\\\"Love the track. Our boilerplate rev-share is 60% lead artist, 40% split among collaborators. Please confirm splits by EOD so we can fast-track release.\\\"\n\nJonah finally pings you privately:\n\\\"Bro, Maya's saying we each get 10%. That cool?\\\"\n\nYour reply to Jonah:",
    options: [
      { label: "\\\"Let's hop on a three-way call with her first.\\\"", code: "A" },
      { label: "\\\"I'm good with 10%. Let's not kill momentum.\\\"", code: "B" },
      { label: "\\\"Nope. We each own a third. I'll draft a counter-proposal.\\\"", code: "C" },
      { label: "\\\"What do you think is fair? I'll back your number.\\\"", code: "D" }
    ]
  },
  {
    title: "Beat 3 — The Live Interview",
    scene: "That afternoon the label books a sudden IG Live to hype the signing. You're still ironing splits in a group chat when the host adds you to the stream—20k viewers and counting.\n\nThe host beams:\n\\\"So tell us, Maya, how did you craft this track?\\\"\n\nMaya launches into a polished story that barely references you or Jonah. The host throws you the mic for last remarks.\n\nYou say:",
    options: [
      { label: "\\\"Huge team effort—wait till you hear Jonah's textures on the stems!\\\" (and pivot spotlight)", code: "A" },
      { label: "\\\"Thanks! The track's story is evolving—can't wait to share the full credits soon.\\\" (cryptic but polite)", code: "B" },
      { label: "\\\"Actually, funny thing about credits—Jonah and I co-wrote half the hook. We're ironing splits as we speak.\\\" (on-air nudge)", code: "C" },
      { label: "\\\"Congrats Maya. I'll talk business with the label offline.\\\" and leave the stream within ten seconds.", code: "D" }
    ]
  }
]

export function getPersonalityFromChoices(choices: UserChoice[]): PersonalityResult {
  const code = choices.map(choice => choice.code).join('')
  return PERSONALITY_MATRIX[code] || {
    code: code,
    archetype: "Unknown Archetype",
    insight: "Your unique combination reveals a complex personality pattern that defies simple categorization.",
    whatCanBiteYou: "Data being updated...",
    practicalSuggestion: "Data being updated..."
  }
}