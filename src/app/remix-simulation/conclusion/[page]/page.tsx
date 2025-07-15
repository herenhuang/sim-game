'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { SimulationState } from '@/lib/types'

export default function ConclusionPage() {
  const router = useRouter()
  const params = useParams()
  
  const page = parseInt(params.page as string)
  
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null)
  const [conclusionText, setConclusionText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [textComplete, setTextComplete] = useState(false)

  // Load simulation state and conclusion text on mount
  useEffect(() => {
    const savedState = localStorage.getItem('remix-simulation-state')
    if (savedState) {
      const state = JSON.parse(savedState)
      setSimulationState(state)
      
      // If we don't have conclusion text yet, generate it
      const savedConclusion = localStorage.getItem('remix-conclusion-text')
      if (savedConclusion) {
        setConclusionText(savedConclusion)
      } else {
        generateConclusion(state)
      }
    }
  }, [])

  const generateConclusion = async (state: SimulationState) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/generateConclusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storySoFar: state.storySoFar,
          userActions: state.userActions,
          scenarioType: 'remix'
        })
      })

      const result = await response.json()

      if (result.status === 'success' && result.conclusionText) {
        setConclusionText(result.conclusionText)
        localStorage.setItem('remix-conclusion-text', result.conclusionText)
      } else {
        setErrorMessage('Failed to generate conclusion. Please try again.')
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getConclusionPageContent = () => {
    if (!conclusionText) return "Loading conclusion..."
    
    // Split the conclusion into paragraphs
    const paragraphs = conclusionText.split(/PARAGRAPH\d+:\s*/).filter(p => p.trim())
    
    if (page === 1) {
      return paragraphs[0]?.trim() || ""
    } else if (page === 2) {
      return paragraphs[1]?.trim() || ""
    }
    return ""
  }

  const handleNext = () => {
    if (page < 2) {
      router.push(`/remix-simulation/conclusion/${page + 1}`)
    }
  }

  const handleUnlockArchetype = () => {
    router.push('/remix-simulation/results')
  }

  const getCurrentPageNumber = () => {
    return 7 + page // Conclusion pages 8-9
  }

  if (!simulationState) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <ProgressBar currentPage={getCurrentPageNumber()} />
      
      <div className="flex-1 flex flex-col p-8 pt-12">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          {/* Conclusion Text */}
          <div className="mt-8 mb-auto">
            <AnimatedText 
              text={getConclusionPageContent()}
              onComplete={() => setTextComplete(true)}
            />
          </div>

          {/* Navigation Buttons */}
          {textComplete && (
            <div className="mt-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                {page < 2 ? (
                  <button
                    onClick={handleNext}
                    className="w-full bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleUnlockArchetype}
                    disabled={isLoading}
                    className="w-full bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Unlock Archetype'}
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ currentPage }: { currentPage: number }) {
  const totalPages = 9 // 3+2+2+2 pages total
  
  return (
    <div className="w-full p-2">
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const isActive = index < currentPage
          
          return (
            <div key={index} className="flex-1">
              <motion.div
                className={`h-1 rounded-full ${isActive ? 'bg-orange-500' : 'bg-gray-200'}`}
                initial={{ backgroundColor: isActive ? '#f97316' : '#e5e7eb' }}
                animate={{ backgroundColor: isActive ? '#f97316' : '#e5e7eb' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AnimatedText({ text, onComplete }: { text: string, onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        clearInterval(timer)
        onComplete()
      }
    }, 20) // Typing speed

    return () => clearInterval(timer)
  }, [currentIndex, text, onComplete])

  return (
    <div className="text-lg font-light text-gray-800 leading-relaxed text-left max-w-2xl mx-auto whitespace-pre-line">
      {displayedText}
    </div>
  )
}