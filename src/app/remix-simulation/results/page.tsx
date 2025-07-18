'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SimulationState, Archetype } from '@/lib/types'
import { getArchetypeFromPath, INTENT_WEIGHTS } from '@/lib/scenarios/remix'

export default function ResultsPage() {
  const router = useRouter()
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null)
  const [showAnalyzing, setShowAnalyzing] = useState(true)
  const [currentResultsPage, setCurrentResultsPage] = useState(1)
  const [textComplete, setTextComplete] = useState(false)
  const [conclusionText, setConclusionText] = useState<string | null>(null)
  const [behavioralDebriefText, setBehavioralDebriefText] = useState<string | null>(null)

  // Load simulation state and conclusion on mount
  useEffect(() => {
    const savedState = localStorage.getItem('remix-simulation-state')
    const savedConclusion = localStorage.getItem('remix-conclusion-text')
    const savedBehavioralDebrief = localStorage.getItem('remix-behavioral-debrief')
    
    if (savedState) {
      setSimulationState(JSON.parse(savedState))
    } else {
      // If no state found, redirect to start
      router.push('/remix-simulation/1/1')
    }
    
    if (savedConclusion) {
      setConclusionText(savedConclusion)
    }
    
    if (savedBehavioralDebrief) {
      setBehavioralDebriefText(savedBehavioralDebrief)
    }
  }, [router])

  // Animation sequence: analyzing -> archetype reveal
  useEffect(() => {
    if (simulationState) {
      // Show analyzing text for 1.5 seconds
      const analyzingTimer = setTimeout(() => {
        setShowAnalyzing(false)
        setCurrentResultsPage(1) // Start with archetype reveal
      }, 1500)

      return () => clearTimeout(analyzingTimer)
    }
  }, [simulationState])

  // Generate behavioral debrief when moving to archetype reveal (page 1)
  useEffect(() => {
    if (currentResultsPage === 1 && simulationState && !behavioralDebriefText) {
      generateBehavioralDebrief(simulationState)
    }
  }, [currentResultsPage, simulationState, behavioralDebriefText])

  const generateBehavioralDebrief = async (state: SimulationState) => {
    try {
      const response = await fetch('/api/generateBehavioralDebrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userResponses: state.userResponses || [],
          userPath: state.userPath || [],
          scenarioType: 'remix'
        })
      })

      const result = await response.json()
      if (result.status === 'success' && result.behavioralDebriefText) {
        setBehavioralDebriefText(result.behavioralDebriefText)
        localStorage.setItem('remix-behavioral-debrief', result.behavioralDebriefText)
        
        // Add to console debugging
        console.log('\n=== BEHAVIORAL DEBRIEF LOADED ===')
        console.log('📊 Generated behavioral debrief:')
        console.log(`"${result.behavioralDebriefText}"`)
        console.log('=== END BEHAVIORAL DEBRIEF ===\n')
      } else {
        console.error('Behavioral debrief generation failed:', result)
      }
    } catch (error) {
      console.error('Error generating behavioral debrief:', error)
    }
  }

  const handleNextPage = () => {
    if (currentResultsPage < 2) {
      setCurrentResultsPage(currentResultsPage + 1)
      setTextComplete(false)
    }
  }

  if (!simulationState) {
    return <div>Loading...</div>
  }

  const archetype: Archetype = getArchetypeFromPath(simulationState.userPath)
  
  // Safety check with detailed debugging
  if (!archetype) {
    console.error('=== ARCHETYPE DEBUG ===')
    console.error('Raw userPath:', simulationState.userPath)
    console.error('userPath length:', simulationState.userPath?.length)
    console.error('userPath contents:', JSON.stringify(simulationState.userPath))
    console.error('Intent breakdown:', simulationState.userPath?.reduce((counts, intent) => {
      counts[intent] = (counts[intent] || 0) + 1;
      return counts;
    }, {} as Record<string, number>))
    console.error('Total weight:', simulationState.userPath?.reduce((sum, intent) => sum + (INTENT_WEIGHTS[intent] || 0), 0))
    console.error('=== END DEBUG ===')
    return <div>Error loading results. Please try again.</div>
  }

  // Get page content based on new flow
  const getPageContent = (page: number) => {
    switch (page) {
      case 2:
        // Behavioral debrief page - use AI-generated content
        if (behavioralDebriefText) {
          return behavioralDebriefText;
        }
        return 'Loading behavioral insights...';
        
      default:
        return ''
    }
  }
  
  return (
    <div className="h-full bg-white flex flex-col relative">
      <div className="flex-1 flex flex-col p-6 pt-8">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          {/* Analyzing Animation - overlay style */}
          {showAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-sm font-light text-gray-600"
                >
                  Simulation completed. Analyzing your actions.
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* Results Pages */}
          {currentResultsPage > 0 && !showAnalyzing && (
            <motion.div
              key={currentResultsPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex flex-col"
            >
              {/* Page 1: Archetype Card */}
              {currentResultsPage === 1 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-sm mx-auto">
                    {/* Archetype Card */}
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                      {/* Large Emoji */}
                      <div className="text-center mb-6">
                        <div className="text-6xl mb-4">{archetype.emoji}</div>
                      </div>
                      
                      {/* Archetype Name */}
                      <h1 className="text-xl font-medium text-gray-900 text-center mb-4">
                        {archetype.name}
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-sm font-light text-gray-600 text-center leading-relaxed">
                        {archetype.subtitle}
                      </p>
                    </div>
                    
                    {/* Continue Button */}
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleNextPage}
                        className="bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* This section was causing duplicates - removed */}
              {false && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-sm mx-auto">
                    {/* Archetype Card */}
                    <div className="bg-white border-4 border-orange-400 rounded-2xl p-8 shadow-xl">
                      {/* Large Emoji */}
                      <div className="text-center mb-6">
                        <div className="text-6xl mb-4">{archetype.emoji}</div>
                      </div>
                      
                      {/* Archetype Name */}
                      <h1 className="text-xl font-medium text-gray-900 text-center mb-4">
                        {archetype.name}
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-sm font-light text-gray-600 text-center leading-relaxed">
                        {archetype.subtitle}
                      </p>
                    </div>
                    
                    {/* Continue Button */}
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleNextPage}
                        className="bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Page 2: Behavioral Debrief */}
              {currentResultsPage === 2 && (
                <div className="flex-1 flex flex-col">
                  {/* Page Title Header */}
                  <div className="text-center mb-4 pt-8">
                    <h1 className="text-xl font-medium text-gray-900">
                      📊 Your Decision-Making Patterns
                    </h1>
                  </div>
                  
                  {/* Content Text - Full Page Scrollable */}
                  <div 
                    className="overflow-y-auto px-6 pb-8 h-[32rem]"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#d1d5db transparent'
                    }}
                  >
                    <div className="max-w-2xl mx-auto">
                      <AnimatedText 
                        text={getPageContent(currentResultsPage)}
                        onComplete={() => setTextComplete(true)}
                      />
                      
                      {/* Navigation button removed - now handled within AnimatedText component */}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function AnimatedText({ text, onComplete }: { text: string, onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText('')
    setCurrentWordIndex(0)
  }, [text])

  useEffect(() => {
    const words = text.split(' ')
    
    const timer = setInterval(() => {
      if (currentWordIndex < words.length) {
        const newText = words.slice(0, currentWordIndex + 1).join(' ')
        setDisplayedText(newText)
        setCurrentWordIndex(currentWordIndex + 1)
      } else {
        clearInterval(timer)
        onComplete()
      }
    }, 80) // Word-by-word speed

    return () => clearInterval(timer)
  }, [currentWordIndex, text, onComplete])

  // Parse text to handle formatting (for pages 2 & 3)
  const parseText = (text: string) => {
    const lines = text.split('\n')
    
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') {
        // Empty line
        return <br key={lineIndex} />
      } else {
        // Regular content lines
        return (
          <p key={lineIndex} className="mb-3 last:mb-0">
            {line}
          </p>
        )
      }
    })
  }

  // Parse behavioral debrief with sections
  const parseBehavioralDebrief = (text: string) => {
    if (!text || text.trim() === '') return null
    
    const sentences = text.split('. ').filter(sentence => sentence.trim() !== '')
    const sections = []
    
    // First section: Initial Response Pattern
    const firstSectionSentences = sentences.slice(0, Math.ceil(sentences.length / 2))
    const firstContent = firstSectionSentences.join('. ')
    sections.push({
      title: "📊 Your Initial Response Pattern",
      content: firstContent + (firstContent.endsWith('.') ? '' : '.')
    })
    
    // Second section: Opportunity & Adaptation
    const secondSectionSentences = sentences.slice(Math.ceil(sentences.length / 2))
    const secondContent = secondSectionSentences.join('. ')
    sections.push({
      title: "🚀 Opportunity & Adaptation Style", 
      content: secondContent + (secondContent.endsWith('.') ? '' : '.')
    })
    
    return sections.map((section, sectionIndex) => (
      <div key={sectionIndex} className="mb-6 last:mb-0">
        <h3 className="text-sm font-medium text-gray-900 mb-3">{section.title}</h3>
        <p className="text-base font-light text-gray-800 leading-relaxed">{section.content}</p>
      </div>
    ))
  }

  return (
    <div className="text-base font-light text-gray-800 leading-relaxed text-left">
      {/* Check if this is behavioral debrief content */}
      {text.includes('Your responses') || text.includes('decision pattern') || text.includes('pressure') ? 
        parseBehavioralDebrief(displayedText) : 
        parseText(displayedText)
      }
      
      {/* Add navigation link at the end of behavioral debrief */}
      {(text.includes('Your responses') || text.includes('decision pattern') || text.includes('pressure')) && displayedText.length > 0 && displayedText.length >= text.length && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            <button
              onClick={() => {
                localStorage.removeItem('remix-simulation-state')
                localStorage.removeItem('remix-conclusion-text')
                localStorage.removeItem('remix-behavioral-debrief')
                window.location.href = '/scenarios'
              }}
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              Try another scenario →
            </button>
          </p>
        </div>
      )}
    </div>
  )
}