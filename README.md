# Micro-Simulation Quiz

A dynamic, AI-powered micro-simulation designed to understand how Product Managers handle pressure through realistic decision-making scenarios.

## Features

- **3-turn narrative simulation** with personalized insights
- **AI-driven choice generation** that adapts to user decisions
- **Enhanced debrief screen** with strengths, blind spots, and unique patterns
- **Mobile-first responsive design** with smooth animations
- **Fallback mock scenarios** when AI is unavailable

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## AI Integration (Optional)

For personalized, AI-generated choices and scenarios:

1. **Get an Anthropic API key** from [console.anthropic.com](https://console.anthropic.com/)

2. **Create `.env.local`** file:
   ```bash
   cp .env.local.example .env.local
   ```

3. **Add your API key:**
   ```
   NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

4. **Restart the dev server** to enable AI-powered scenarios

## How It Works

### Without AI
- Uses intelligent mock scenarios that branch based on user choices
- Provides realistic consequences and personalized insights
- Perfect for demos and testing

### With AI
- Generates personalized choices based on project context using Claude
- Creates unique scenarios that react to user decision patterns
- Analyzes choice history to craft relevant next steps
- Each playthrough feels unique and personally tailored

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Anthropic Claude** - AI scenario generation (optional)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with project input
│   ├── simulation/page.tsx   # Main simulation flow
│   └── globals.css          # Global styles
├── lib/
│   ├── ai.ts               # AI integration and mock scenarios
│   ├── insights.ts         # Personalized insights generation
│   └── types.ts            # TypeScript definitions
└── components/             # (Future: reusable components)
```

## Demo

1. Enter a project context (e.g., "AI-powered expense tracker")
2. Navigate through 3 decision points
3. Receive personalized insights about your leadership style
4. See detailed breakdown of your decision-making pattern

---

🤖 *Generated with [Claude Code](https://claude.ai/code)*