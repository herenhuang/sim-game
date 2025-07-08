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
  "AAA": { code: "AAA", archetype: "Hallway Conductor", insight: "You hold your fire until the dust settles, then pull everyone into one channel and give them credit up front. Partners trust your calm, but slow starts mean your own priorities may get overwritten. Notice whether waiting costs you leverage you never recover.", whatCanBiteYou: "Waiting for clarity lets others lock scope before you weigh in.", practicalSuggestion: "Claim one deliverable you care about during the very first kickoff call." },
  "AAB": { code: "AAB", archetype: "Fog-Lamp Host", insight: "You wait, convene the room, then keep public comments deliberately vague. The group feels managed, not rushed—but ambiguity lingers. Try flagging one concrete next step so momentum survives the good manners.", whatCanBiteYou: "Courteous vagueness blurs what 'done' means.", practicalSuggestion: "End every all-hands with a single next step, owner, and date." },
  "AAC": { code: "AAC", archetype: "On-Air Archivist", insight: "You pause, gather everyone, and correct the public record on the spot. People appreciate the clean ledger, yet the sudden assertiveness can feel jarring. Experiment with previewing your standards earlier to soften the punch.", whatCanBiteYou: "Live corrections feel like ambush even when you're right.", practicalSuggestion: "Slack a heads-up ten minutes before you flag the error in public." },
  "AAD": { code: "AAD", archetype: "Curtain-Call Broker", insight: "You stay quiet, herd the team, and shift the real bargaining off-camera. Deals get done, but outsiders fill the silence with their own story. Ask whether a brief status ping would prevent rumours from writing the narrative.", whatCanBiteYou: "Quiet deal-making sparks hallway rumours.", practicalSuggestion: "Post a three-bullet recap of any backstage agreement within 24 h." },
  "ABA": { code: "ABA", archetype: "Surfboard MC", insight: "You hold back just long enough to read the room, then keep the train moving and spread the credit mid-ride. Energy stays high, though details can trail behind. Guard against glossing over small issues that grow teeth later.", whatCanBiteYou: "Riding momentum often hides small flaws that later bite.", practicalSuggestion: "Schedule a 15-min 'loose screws' check halfway through the sprint." },
  "ABB": { code: "ABB", archetype: "Soft-Jazz Narrator", insight: "You keep the train moving and talk in broad strokes on stage. The vibe is smooth, but vague promises stack up. Tack one specific deliverable to your recap email so good will turns into traction." },
  "ABC": { code: "ABC", archetype: "Mid-Set Fixer", insight: "You ride momentum until a fact veers off-track—then you fix it live without slowing down. Admirable nerve, but some teammates need warning to pivot with you. Try a quick 'heads-up' wave before you hit the brakes." },
  "ABD": { code: "ABD", archetype: "Galley Closer", insight: "You push for speed, then duck out to seal terms privately. The hustle shows, yet the hand-off feels abrupt. Offer a short debrief so the team knows what changed while they were sprinting." },
  "ACA": { code: "ACA", archetype: "Boundary Spotlighter", insight: "You're mild until numbers look skewed; then you stake out fair lines and still lift others on stage. Clarity is welcome, but the gear-shift surprises folks. Give a signal when the boundary line is coming up." },
  "ACB": { code: "ACB", archetype: "Velvet Umpire", insight: "You set firm terms behind the scenes, but speak softly in public. It keeps tempers cool, yet obscures who's doing the hard guarding. Decide if invisible labour is a gift or a liability in this crew." },
  "ACC": { code: "ACC", archetype: "Ledger Lighthouse", insight: "You draw the line *and* announce it live. Everyone knows where things stand—comforting to some, confrontational to others. Sense whether the venue suits full transparency." },
  "ACD": { code: "ACD", archetype: "Quiet Arbiter", insight: "You set the rules early, then finalise them in private. Process stays orderly, but those outside the room may doubt it. Flash a summary of key points to extend the trust perimeter." },
  "ADA": { code: "ADA", archetype: "Echo-Stagehand", insight: "You watch, align with a trusted ally, then hand the spotlight around. Cohesion feels great until your own view goes missing. Voice at least one personal stake so people can calibrate." },
  "ADB": { code: "ADB", archetype: "Shadow Chorus", insight: "You mirror a partner's stance and keep external remarks soft. The group stays placid, but your authorship fades. Test what happens when you own a piece of the public story." },
  "ADC": { code: "ADC", archetype: "Playback Editor", insight: "You back an ally until facts skew, then you straighten them live. Loyal yet principled—but the pivot can bruise relationships. Signal your non-negotiables earlier." },
  "ADD": { code: "ADD", archetype: "Mirror-Room Deal-Maker", insight: "You echo a partner, then hammer the deal backstage. Effective, though spectators may wonder who pulled which lever. A brief joint statement can keep guesses off the table." },
  "BAA": { code: "BAA", archetype: "Thread-Pull Host", insight: "Your first move is a gentle probe; next you open the group chat and amplify others. This uncovers issues fast, but your own agenda can drift. Anchor one clear outcome before the room fills up." },
  "BAB": { code: "BAB", archetype: "Lantern-Bearing Diplomat", insight: "You ask a question, convene everyone, then offer guarded language on stage. Space for nuance is good; endless grey can stall action. Drop one concrete fact to ground the conversation." },
  "BAC": { code: "BAC", archetype: "Interview Fact-Checker", insight: "You probe, gather, and tidy the narrative in public. Sharp work, yet some feel ambushed by the sudden precision. Give a quick 'I may address this live' cue beforehand." },
  "BAD": { code: "BAD", archetype: "Table-Setter", insight: "You probe, convene, then settle numbers offstage. Efficient, but watchers lose the thread. Share the headline terms or risk rumours outrunning you." },
  "BBA": { code: "BBA", archetype: "Momentum Shepherd", insight: "You ask one pointed question, ride the momentum, and splash credit around. Energising, though follow-ups can slip through the cracks. Bolt a tracker to the plan so curiosity turns into completion." },
  "BBB": { code: "BBB", archetype: "Slipstream Navigator", insight: "You probe, keep speed, and stay soft-spoken publicly. Momentum holds; clarity limps. Plant a flag on one non-negotiable so teammates know what *must* be done." },
  "BBC": { code: "BBC", archetype: "Riptide Redirector", insight: "You combine probing with live fact-fixing at full tilt. High-wire act—thrilling when it works, messy when it doesn't. Decide which settings merit that degree of risk." },
  "BBD": { code: "BBD", archetype: "Side-Door Closer", insight: "You prod, sprint, then close doors to negotiate. Fast, but opaque. A short 'why' after the fact keeps confidence intact." },
  "BCA": { code: "BCA", archetype: "Fairness Herald", insight: "You test weak seams, set fairness markers, and spotlight collaborators. The candour builds respect, yet can feel sudden. Warm the group with context before you draw the line." },
  "BCB": { code: "BCB", archetype: "Understudy Referee", insight: "You question, call the foul, then speak in code to the crowd. What stories grow in the gaps?" },
  "BCC": { code: "BCC", archetype: "Live-Tally Umpire", insight: "You call out numbers mid-stride in front of the crowd. The ledger is clear; feelings, less so. Check emotional barometer before going full accountant." },
  "BCD": { code: "BCD", archetype: "Quiet Dealmaker", insight: "You probe, protect, then bargain privately. Solid defence, but silence breeds speculation. Release a digest of key changes." },
  "BDA": { code: "BDA", archetype: "Echo Reporter", insight: "A gentle question first, then you sync with the loudest source and hand out credit. Was the source actually right?" },
  "BDB": { code: "BDB", archetype: "Low-Key Wingman", insight: "You query, align, and keep public language soft. How long before a wingman needs a pilot's seat?" },
  "BDC": { code: "BDC", archetype: "Shadow Auditor", insight: "You ask, echo, then audit the ledger on camera. Can a sudden audit land without whiplash?" },
  "BDD": { code: "BDD", archetype: "Reflective Broker", insight: "Inquiry, mirroring, private deals. Does discretion build calm or fog?" },
  "CAA": { code: "CAA", archetype: "Front-Door Host", insight: "You tackle the glitch head-on, circle the band, and shine a beam on every player. Straight paths earn trust—unless someone needed a softer ramp." },
  "CAB": { code: "CAB", archetype: "Civic Spokesperson", insight: "You go direct, unite the team, then soften language externally. This cools the room but can look like mixed messaging. Align tone and content so outsiders aren't guessing." },
  "CAC": { code: "CAC", archetype: "Mic-Drop Archivist", insight: "You hit problems hard, assemble everyone, and correct live. No one can claim ignorance—yet some feel cornered. Offer a path forward along with the correction." },
  "CAD": { code: "CAD", archetype: "Town-Hall Closer", insight: "You're blunt up front, group-minded mid-way, private at the finish. Results come, but tempo shifts may confuse. Narrate the hand-offs so people stay oriented." },
  "CBA": { code: "CBA", archetype: "Launch Conductor", insight: "You confront, keep speed, and celebrate others on the fly. Magnetic, but corners may get shaved. Build in a late-stage quality pass." },
  "CBB": { code: "CBB", archetype: "Rapid-Fire Diplomat", insight: "You push hard, move fast, speak soft outside. Intensity inside, calm outside; sync or schism depends on context. Check that the mask matches the momentum." },
  "CBC": { code: "CBC", archetype: "Momentum Editor", insight: "You drive, then fact-check live without slowing. Spectators admire the precision; the team might flinch. Warn them when a pit-stop is coming." },
  "CBD": { code: "CBD", archetype: "Express-Line Broker", insight: "You sprint, then slip away to seal terms. Rapid but abrupt. A 'deal done—here's why' note keeps trust alive." },
  "CCA": { code: "CCA", archetype: "Equal-Rights MC", insight: "You mark the boundary early and shine light on everyone's part. Fair and transparent—unless folks prefer quiet negotiation. Decide which arena you're in." },
  "CCB": { code: "CCB", archetype: "Velvet-Rule Setter", insight: "Hard stake in the ground, velvet words on top. Do people mistake velvet for wiggle room?" },
  "CCC": { code: "CCC", archetype: "Ledger-Side Announcer", insight: "You post the rules publicly, in real time. Crystal clear, occasionally icy. Pair numbers with a human reason to soften edges." },
  "CCD": { code: "CCD", archetype: "Frank Arbiter", insight: "You set strict terms and finalise privately. Orderly, but opaque. A quick bullet list of outcomes invites confidence." },
  "CDA": { code: "CDA", archetype: "Aligned Promoter", insight: "You speak up, align with a key ally, and hand out praise. Loyal and loud. Ensure your own thinking isn't lost in translation." },
  "CDB": { code: "CDB", archetype: "Concord Liaison", insight: "You solve the issue, mirror a partner, then brief the public in broad strokes. Where does ownership blur?" },
  "CDC": { code: "CDC", archetype: "Reflection Editor", insight: "You back an ally until facts bend, then correct live. Principled, but relationship stress is real. Prep the ally first." },
  "CDD": { code: "CDD", archetype: "Twin-Track Dealer", insight: "You confront, mirror, then close doors to negotiate. Efficient, but who owns the outcome? Share authorship explicitly." },
  "DAA": { code: "DAA", archetype: "Back-Channel Herald", insight: "You collect whispers, unite the room, and spotlight others' work. Low ego, high trust—until folks wonder what *you* want. State at least one personal win-condition." },
  "DAB": { code: "DAB", archetype: "Private Courier", insight: "You work behind the scenes, convene, then keep external comments modest. Discretion is classy; ambiguity can stunt buy-in. Drop one clear fact for anchoring." },
  "DAC": { code: "DAC", archetype: "Lobby Proofreader", insight: "You move in shadows until the story warps, then fix it publicly. The contrast startles. Offer a quick 'heads-up' before stepping into the light." },
  "DAD": { code: "DAD", archetype: "Shadow Mediator", insight: "You orchestrate quietly and close terms off-mic. Sleek but invisible. Decide if future credit matters to you before ceding it." },
  "DBA": { code: "DBA", archetype: "Underground Hype Agent", insight: "You pilot from the wings, keep speed, and cast praise wide. Feels effortless; sometimes *too* invisible. Own one milestone so your steering shows." },
  "DBB": { code: "DBB", archetype: "Quiet-Current Driver", insight: "Quiet hand on the throttle, soft words on airtime. Good for harmony, bad for accountability. Plant a flag when clarity is cheap." },
  "DBC": { code: "DBC", archetype: "Stealth Signal Fixer", insight: "Stealthy until facts wobble, then public correction mid-sprint. Necessary, but whiplash exists. Preview your tolerance threshold." },
  "DBD": { code: "DBD", archetype: "Hidden-Station Broker", insight: "You guide momentum then vanish to negotiate. The magic trick works if people know the rabbit's still alive. Reveal the outcome promptly." },
  "DCA": { code: "DCA", archetype: "Shadow-Ref Announcer", insight: "You audit softly, stake fairness, and hand credit around. Fairness lands; motives stay occult. Share why the line matters, not just where it is." },
  "DCB": { code: "DCB", archetype: "Back-Room Umpire", insight: "You defend in silence, speak gently outside. People feel protected—yet uninformed. Show one calculation behind your stance." },
  "DCC": { code: "DCC", archetype: "Quiet Scorekeeper", insight: "You keep score quietly, then publish stats live. Transparency is noble; surprise is not. Trail hints early." },
  "DCD": { code: "DCD", archetype: "Secret Ledger Dealer", insight: "You guard quietly and seal deals in private. The machine runs, but no one sees the cogs. Decide if opacity fuels or drains trust here." },
  "DDA": { code: "DDA", archetype: "Ghostwriter Promoter", insight: "You gather intel, echo an ally's pitch, then light up the group. Community grows—your fingerprint fades. Carve a small signature somewhere visible." },
  "DDB": { code: "DDB", archetype: "Shadow-Chorus Leader", insight: "You stay in the background, echo an ally, and speak softly. The alliance is smooth, the edges blurry. Test a direct 'I' statement next round." },
  "DDC": { code: "DDC", archetype: "Mirrored Fact-Checker", insight: "You mirror until numbers skew, then correct them live. Fair, surprising. A quiet pre-brief avoids shock." },
  "DDD": { code: "DDD", archetype: "Invisible Deal Architect", insight: "You stay hidden, mirror an ally, and close deals in the dark. Results, yes—recognition, not so much. Decide if anonymity is the reward or the tax." }
}

// Hardcoded beats for the music scenario
export const BEATS: Beat[] = [
  {
    title: "Beat 1 — The DM",
    scene: "Maya shoots you a quick DM:\n\"OMG this is exploding. Didn't expect this to blow up. Let's talk tomorrow?\"\n\nYour next move:",
    options: [
      { label: "Heart-react the message, drop a \"wow, wild!\" reply, and wait.", code: "A" },
      { label: "Ask one innocent question—\"Love it! Did you tag us anywhere?\"—and gauge her response.", code: "B" },
      { label: "Fire off a voice note congratulating her, then add, \"Hey, overnight credits got weird—shall we sync?\"", code: "C" },
      { label: "Screenshot the viral post, send it to Jonah with a single eyeball emoji, and say nothing to Maya yet.", code: "D" }
    ]
  },
  {
    title: "Beat 2 — The Clause", 
    scene: "Next morning you wake to an email from an indie label's A&R rep, CC'd to you, Maya, and Jonah:\n\"Love the track. Our boilerplate rev-share is 60% lead artist, 40% split among collaborators. Please confirm splits by EOD so we can fast-track release.\"\n\nJonah finally pings you privately:\n\"Bro, Maya's saying we each get 10%. That cool?\"\n\nYour reply to Jonah:",
    options: [
      { label: "\"Let's hop on a three-way call with her first.\"", code: "A" },
      { label: "\"I'm good with 10%. Let's not kill momentum.\"", code: "B" },
      { label: "\"Nope. We each own a third. I'll draft a counter-proposal.\"", code: "C" },
      { label: "\"What do you think is fair? I'll back your number.\"", code: "D" }
    ]
  },
  {
    title: "Beat 3 — The Live Interview",
    scene: "That afternoon the label books a sudden IG Live to hype the signing. You're still ironing splits in a group chat when the host adds you to the stream—20k viewers and counting.\n\nThe host beams:\n\"So tell us, Maya, how did you craft this track?\"\n\nMaya launches into a polished story that barely references you or Jonah. The host throws you the mic for last remarks.\n\nYou say:",
    options: [
      { label: "\"Huge team effort—wait till you hear Jonah's textures on the stems!\" (and pivot spotlight)", code: "A" },
      { label: "\"Thanks! The track's story is evolving—can't wait to share the full credits soon.\" (cryptic but polite)", code: "B" },
      { label: "\"Actually, funny thing about credits—Jonah and I co-wrote half the hook. We're ironing splits as we speak.\" (on-air nudge)", code: "C" },
      { label: "\"Congrats Maya. I'll talk business with the label offline.\" and leave the stream within ten seconds.", code: "D" }
    ]
  }
]

export function getPersonalityFromChoices(choices: UserChoice[]): PersonalityResult {
  const code = choices.map(choice => choice.code).join('')
  return PERSONALITY_MATRIX[code] || {
    code: code,
    archetype: "Unknown Archetype",
    insight: "Your unique combination reveals a complex personality pattern that defies simple categorization."
  }
}