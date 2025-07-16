'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SimulationState, Archetype } from '@/lib/types'
import { getArchetypeFromPath } from '@/lib/scenarios/remix'

export default function ResultsPage() {
  const router = useRouter()
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null)
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

  const resultsText = `${archetype.name}

${archetype.flavorText}`
  
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 flex flex-col p-8 pt-12">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
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

  return (
    <div className="text-lg font-light text-gray-800 leading-relaxed text-left max-w-2xl mx-auto whitespace-pre-line">
      {displayedText}
    </div>
  )
}