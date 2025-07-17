# Project Decisions & TODOs

## 🎯 Current Priority Tasks

### 1. Scenario-Specific Prompts
- [x] Create remix-specific ENGINE_PROMPT (music industry focused, immersive)
- [ ] Create crisis-specific ENGINE_PROMPT (business focused, immersive) 
- [x] Remove shared generic prompt template
- [x] Add contextual understanding for emotional intelligence

### 2. Multi-Dimensional Context Understanding (NEW)
- [x] Add emotional state analysis to prompts
- [x] Include attitude and voice recognition
- [x] Require acknowledgment of user's specific feelings
- [ ] Test and iterate on emotional responsiveness

### 2. 500 Error Investigation
- [ ] Investigate root cause of Turn 3 API failures
- [ ] Check if context trimming actually fixes the issue
- [ ] Review error logs from debugging we added

## ✅ Recent Decisions Made

### Prompt Strategy
- **Decision**: Each scenario should have its own immersive, scenario-specific prompts
- **Rationale**: Better user experience, more authentic feel than generic templates
- **Status**: Agreed, needs implementation

### URL Structure  
- **Decision**: Simplified from complex page-level URLs to single-page simulation
- **Implementation**: `/remix-simulation` → `/remix-simulation/results`
- **Status**: ✅ Complete

### Story Focus
- **Decision**: Changed from group project to individual music maker
- **Rationale**: Story consistency - friends disappeared after Turn 1
- **Status**: ✅ Complete

### Model Choice
- **Decision**: Switched from Claude Opus to Haiku
- **Rationale**: Faster response times (1-2s vs 3-5s)
- **Status**: ✅ Complete

### Archetype Reveal
- **Decision**: Two-stage reveal with title card → full results
- **Implementation**: Tarot card style with animations
- **Status**: ✅ Complete

## 🤔 Open Questions

- Should we have different prompt files for each scenario or keep them in scenario files?
- What's the actual root cause of the 500 errors?
- Do we need turn-specific prompts within each scenario?