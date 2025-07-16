'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { SimulationState, HandleTurnResponse } from '@/lib/types'
import { INITIAL_SCENE } from '@/lib/scenarios/remix'

export default function SimulationPage() {
  const router = useRouter()
  const params = useParams()
  
  const turn = parseInt(params.turn as string)
  const page = parseInt(params.page as string)
  
  const [simulationState, setSimulationState] = useState<SimulationState>({
    currentTurn: turn,
    storySoFar: `SCENE: ${INITIAL_SCENE}`,
    userPath: [],
    userActions: []
  })
  
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [textComplete, setTextComplete] = useState(false)

  // Load simulation state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('remix-simulation-state')
    if (savedState) {
      setSimulationState(JSON.parse(savedState))
    }
  }, [])

  // Save simulation state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('remix-simulation-state', JSON.stringify(simulationState))
  }, [simulationState])

  const getTurnPageContent = () => {
    if (turn === 1) {
      if (page === 1) {
        return `You and two friends have been making music together for months. Last night, you remixed a popular song that's been stuck in your head. You stayed up until 4AM, perfecting every beat. You posted it online this morning.

It blew up. 2 million views. Comments exploding. Your phone won't stop buzzing.`
      } else if (page === 2) {
        return `But there's a problem. You used the original song's audio without permission.

In between the praise, the comments start shifting: "This is genius." "Wait... isn't this copyright infringement?"

Notifications keep flooding in—only now, they carry a different weight.`
      } else if (page === 3) {
        return `Casey: "Should we be worried about this copyright thing?"

What do you text back?`
      }
    } else if (turn === 2) {
      if (page === 1) {
        // This should show the AI-generated response from Turn 1
        return simulationState.storySoFar.split('NARRATIVE CONTINUATION: "')[1]?.split('"')[0] || "Loading..."
      } else if (page === 2) {
        return `The situation gets crazier. A major record label DMs you: 'We love your remix. We want to sign you for an official release, but we need to move fast - the hype window is short. Can you get permission from the original artist by tomorrow?'

What do you respond to them with?`
      }
    } else if (turn === 3) {
      if (page === 1) {
        // This should show the AI-generated response from Turn 2
        return simulationState.storySoFar.split('NARRATIVE CONTINUATION: "')[2]?.split('"')[0] || "Loading..."
      } else if (page === 2) {
        return `Plot twist: The original artist's manager emails you. They're not angry - they want to collaborate! But they want to re-record the whole thing 'properly' in a studio. This would take at least two weeks and kill your current viral momentum.

What's your call?`
      }
    }
    return ""
  }

  const isInputPage = () => {
    return (turn === 1 && page === 3) || (turn === 2 && page === 2) || (turn === 3 && page === 2)
  }

  const handleNext = () => {
    if (turn === 1 && page < 3) {
      router.push(`/remix-simulation/${turn}/${page + 1}`)
    } else if (turn === 2 && page < 2) {
      router.push(`/remix-simulation/${turn}/${page + 1}`)
    } else if (turn === 3 && page < 2) {
      router.push(`/remix-simulation/${turn}/${page + 1}`)
    }
  }

  const handleSubmitInput = async () => {
    if (!userInput.trim()) return
    
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/handleTurn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: userInput.trim(),
          storySoFar: simulationState.storySoFar,
          scenarioType: 'remix',
          currentTurn: turn
        })
      })

      const result: HandleTurnResponse = await response.json()

      if (result.status === 'needs_retry') {
        setErrorMessage(result.errorMessage || 'Please try again')
        setIsLoading(false)
        return
      }

      if (result.status === 'success' && result.classification && result.actionSummary && result.nextSceneText) {
        const newStorySoFar = `${simulationState.storySoFar}\nUSER'S ACTION: "${userInput.trim()}"\nNARRATIVE CONTINUATION: "${result.nextSceneText}"`
        
        const newState: SimulationState = {
          currentTurn: turn + 1,
          storySoFar: newStorySoFar,
          userPath: [...simulationState.userPath, result.classification],
          userActions: [...simulationState.userActions, result.actionSummary]
        }

        setSimulationState(newState)
        
        // Navigate to appropriate next page
        if (turn === 3) {
          router.push('/remix-simulation/conclusion/1')
        } else {
          router.push(`/remix-simulation/${turn + 1}/1`)
        }
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentPageNumber = () => {
    if (turn === 1) {
      return page // Pages 1-3
    } else if (turn === 2) {
      return 3 + page // Pages 4-5
    } else if (turn === 3) {
      return 5 + page // Pages 6-7
    }
    return 1
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <ProgressBar currentPage={getCurrentPageNumber()} />
      
      <div className="flex-1 flex flex-col p-8 pt-12">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          {/* Scene Text - positioned towards top */}
          <div className="mt-8 mb-auto">
            <AnimatedText 
              text={getTurnPageContent()}
              onComplete={() => setTextComplete(true)}
            />
          </div>

          {/* Bottom section - always at bottom */}
          {textComplete && (
            <div className="mt-auto">
              {isInputPage() ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-base"
                    disabled={isLoading}
                  />
                  
                  {errorMessage && (
                    <div className="text-red-600 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    onClick={handleSubmitInput}
                    disabled={isLoading || !userInput.trim()}
                    className="w-full bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Submit Response'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <button
                    onClick={handleNext}
                    className="w-full bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
                  >
                    Continue
                  </button>
                </motion.div>
              )}
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