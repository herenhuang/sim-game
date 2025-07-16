'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SimulationState, Archetype } from '@/lib/types'
import { getArchetypeFromPath } from '@/lib/scenarios/remix'

export default function ResultsPage() {
  const router = useRouter()
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null)
  const [showAnalyzing, setShowAnalyzing] = useState(true)
  const [showTitleCard, setShowTitleCard] = useState(false)
  const [showFullResults, setShowFullResults] = useState(false)
  const [textComplete, setTextComplete] = useState(false)

  // Load simulation state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('remix-simulation-state')
    if (savedState) {
      setSimulationState(JSON.parse(savedState))
    } else {
      // If no state found, redirect to start
      router.push('/remix-simulation/1/1')
    }
  }, [router])

  // Animation sequence: analyzing -> title card -> full results
  useEffect(() => {
    if (simulationState) {
      // Show analyzing text for 1.5 seconds
      const analyzingTimer = setTimeout(() => {
        setShowAnalyzing(false)
        setShowTitleCard(true)
      }, 1500)

      return () => clearTimeout(analyzingTimer)
    }
  }, [simulationState])

  const handleContinueToResults = () => {
    setShowTitleCard(false)
    setShowFullResults(true)
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
    console.error('Momentum count:', simulationState.userPath?.filter(c => c === "Momentum").length)
    console.error('Method count:', simulationState.userPath?.filter(c => c === "Method").length)
    console.error('=== END DEBUG ===')
    return <div>Error loading results. Please try again.</div>
  }

  const resultsText = `${archetype.emoji} ${archetype.name}

${archetype.flavorText}`
  
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 flex flex-col p-8 pt-12">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          {/* Analyzing Animation */}
          {showAnalyzing && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-lg font-light text-gray-600"
                >
                  Simulation completed. Analyzing your actions.
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* Title Card */}
          {showTitleCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="w-full max-w-sm mx-auto">
                {/* Tarot Card */}
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
                    onClick={handleContinueToResults}
                    className="bg-orange-500 text-white px-6 py-2 text-sm font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full Results */}
          {showFullResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex flex-col"
            >
              {/* Results Text - positioned towards top */}
              <div className="mt-8 mb-auto">
                <AnimatedText 
                  text={resultsText}
                  onComplete={() => setTextComplete(true)}
                />
              </div>

              {/* Try Another Scenario Button */}
              {textComplete && (
                <div className="mt-auto">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={() => {
                        // Clear saved state when starting new scenario
                        localStorage.removeItem('remix-simulation-state')
                        localStorage.removeItem('remix-conclusion-text')
                        router.push('/scenarios')
                      }}
                      className="w-full bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
                    >
                      Try Another Scenario
                    </button>
                  </motion.div>
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

  // Parse text to handle formatting
  const parseText = (text: string) => {
    // Split by lines first to handle the header separately
    const lines = text.split('\n')
    
    return lines.map((line, lineIndex) => {
      if (lineIndex === 0) {
        // First line contains emoji and archetype name
        return (
          <div key={lineIndex} className="text-2xl font-medium text-gray-900 mb-6 text-center">
            {line}
          </div>
        )
      } else if (line.trim() === '') {
        // Empty line
        return <br key={lineIndex} />
      } else {
        // Regular content lines
        return (
          <p key={lineIndex} className="mb-4 last:mb-0">
            {line}
          </p>
        )
      }
    })
  }

  return (
    <div className="text-lg font-light text-gray-800 leading-relaxed text-left max-w-2xl mx-auto">
      {parseText(displayedText)}
    </div>
  )
}