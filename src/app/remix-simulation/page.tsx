'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SimulationState, HandleTurnResponse, Archetype } from '@/lib/types'
import { QUESTIONS, INITIAL_SCENE, getArchetypeFromPath } from '@/lib/scenarios/remix'

export default function RemixSimulationPage() {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    currentTurn: 1,
    storySoFar: `SCENE: ${INITIAL_SCENE}`,
    userPath: [],
    userActions: []
  })
  
  const [isComplete, setIsComplete] = useState(false)
  const [currentSceneText, setCurrentSceneText] = useState(INITIAL_SCENE)
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1) // Track which page of Turn 1 we're on

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
          currentTurn: simulationState.currentTurn
        })
      })

      const result: HandleTurnResponse = await response.json()

      if (result.status === 'needs_retry') {
        setErrorMessage(result.errorMessage || 'Please try again')
        setIsLoading(false)
        return
      }

      if (result.status === 'success' && result.classification && result.actionSummary && result.nextSceneText) {
        // Update simulation state
        const newStorySoFar = `${simulationState.storySoFar}\nUSER'S ACTION: "${userInput.trim()}"\nNARRATIVE CONTINUATION: "${result.nextSceneText}"`
        
        const newState: SimulationState = {
          currentTurn: simulationState.currentTurn + 1,
          storySoFar: newStorySoFar,
          userPath: [...simulationState.userPath, result.classification],
          userActions: [...simulationState.userActions, result.actionSummary]
        }

        setSimulationState(newState)
        setCurrentSceneText(result.nextSceneText)
        setUserInput('')
        setCurrentPage(1) // Reset page when moving to next turn

        // Check if simulation is complete
        if (simulationState.currentTurn === 3) {
          setIsComplete(true)
        }
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getTurn1PageContent = () => {
    if (currentPage === 1) {
      return `You and two friends have been making music together for months. Last night, you remixed a popular song that's been stuck in your head. You stayed up until 4AM, perfecting every beat. You posted it online this morning.

It blew up. 2 million views. Comments exploding. Your phone won't stop buzzing.`
    } else if (currentPage === 2) {
      return `But there's a problem. You used the original song's audio without permission.

In between the praise, the comments start shifting: "This is genius." "Wait… isn't this copyright infringement?"

Notifications keep flooding in—only now, they carry a different weight.`
    } else if (currentPage === 3) {
      return "Casey: \"Should we be worried about this copyright thing?\""
    }
    return ""
  }

  const getTurn2PageContent = () => {
    if (currentPage === 1) {
      return currentSceneText // This will be the AI-generated response based on Turn 1 input
    } else if (currentPage === 2) {
      return "The situation gets crazier. A major record label DMs you: 'We love your remix. We want to sign you for an official release, but we need to move fast - the hype window is short. Can you get permission from the original artist by tomorrow?'"
    }
    return ""
  }

  const getTurn3PageContent = () => {
    if (currentPage === 1) {
      return currentSceneText // This will be the AI-generated response based on Turn 2 input
    } else if (currentPage === 2) {
      return "Plot twist: The original artist's manager emails you. They're not angry - they want to collaborate! But they want to re-record the whole thing 'properly' in a studio. This would take at least two weeks and kill your current viral momentum."
    }
    return ""
  }

  const getCurrentQuestion = () => {
    if (simulationState.currentTurn === 1) {
      return "" // No question for Turn 1 pages 1 and 2, only page 3 has input
    } else if (simulationState.currentTurn === 2) {
      return "" // No question for Turn 2 page 1, only page 2 has input
    } else if (simulationState.currentTurn === 3) {
      return "" // No question for Turn 3 page 1, only page 2 has input
    }
    return QUESTIONS[simulationState.currentTurn - 1]
  }

  const getPlaceholderText = () => {
    if (simulationState.currentTurn === 1) {
      return "What will you respond to Casey with?"
    } else if (simulationState.currentTurn === 2) {
      return "What do you respond to them with?"
    } else {
      return "Type your response here..."
    }
  }

  const handleNextPage = () => {
    if (simulationState.currentTurn === 1 && currentPage < 3) {
      setCurrentPage(currentPage + 1)
    } else if (simulationState.currentTurn === 2 && currentPage < 2) {
      setCurrentPage(currentPage + 1)
    } else if (simulationState.currentTurn === 3 && currentPage < 2) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (isComplete) {
    return <ResultsDisplay simulationState={simulationState} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentTurn={simulationState.currentTurn} />
      
      <div className="flex-1 flex flex-col p-8 pt-24">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-light text-gray-600 mb-8 tracking-wide">
              Turn {simulationState.currentTurn} — The Remix Controversy
            </h1>
          </div>

          {/* Scene Text - centered and taking up available space */}
          <div className="flex-1 flex items-center justify-center">
            <AnimatedText text={
              simulationState.currentTurn === 1 
                ? getTurn1PageContent() + (currentPage === 3 ? "\n\nWhat do you text back?" : "")
                : simulationState.currentTurn === 2 
                  ? getTurn2PageContent() + (currentPage === 2 ? "\n\nWhat do you respond to them with?" : "")
                  : simulationState.currentTurn === 3
                    ? getTurn3PageContent() + (currentPage === 2 ? "\n\nWhat's your call?" : "")
                    : currentSceneText
            } />
          </div>

          {/* Bottom section - always at bottom */}
          <div className="mt-auto">
            {/* Input Area - only show for Turn 1 page 3, Turn 2 page 2, or Turn 3 page 2 */}
            {(simulationState.currentTurn === 1 && currentPage === 3) || 
             (simulationState.currentTurn === 2 && currentPage === 2) || 
             (simulationState.currentTurn === 3 && currentPage === 2) ? (
              <div className="space-y-4">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={getPlaceholderText()}
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
                  className="w-full bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Submit Response'}
                </button>
              </div>
            ) : (
              /* Continue button for Turn 1 pages 1-2, Turn 2 page 1, and Turn 3 page 1 - always at bottom */
              <div className="space-y-4">
                <button
                  onClick={handleNextPage}
                  className="w-full bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ currentTurn }: { currentTurn: number }) {
  const totalTurns = 3
  
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-100 flex gap-1">
        {Array.from({ length: totalTurns }, (_, index) => {
          const isActive = index < currentTurn
          
          return (
            <div key={index} className="flex-1">
              <div className="h-full bg-gray-100">
                <motion.div
                  className="h-full bg-gray-900"
                  initial={{ width: "0%" }}
                  animate={{ width: isActive ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AnimatedText({ text }: { text: string }) {
  return (
    <div className="text-lg font-light text-gray-800 leading-relaxed text-left max-w-2xl mx-auto whitespace-pre-line">
      {text}
    </div>
  )
}

function ResultsDisplay({ simulationState }: { simulationState: SimulationState }) {
  const router = useRouter()
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
  
  return (
    <div className="flex-1 p-8 pt-12">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-12"
        >
          {/* Archetype Reveal */}
          <div>
            <motion.div 
              className="text-4xl mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {archetype.emoji}
            </motion.div>
            <motion.h1 
              className="text-3xl font-light text-gray-900 mb-8 tracking-wide"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {archetype.name}
            </motion.h1>
            <motion.p 
              className="text-lg font-light text-gray-800 leading-relaxed max-w-2xl mx-auto text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {archetype.flavorText}
            </motion.p>
          </div>

          {/* Action Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-light text-gray-600">Your Actions</h2>
            {simulationState.userActions.map((action, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-left">
                <h3 className="font-medium text-gray-800 mb-2">Turn {index + 1}</h3>
                <p className="text-gray-600 font-light">{action}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            onClick={() => router.push('/scenarios')}
            className="bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            Try Another Scenario
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}