'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Choice, Turn, UserChoice, getPersonaFromScore } from '@/lib/types'
import { generateTurn } from '@/lib/ai'
import { generatePersonalInsights } from '@/lib/insights'

export default function SimulationPage() {
  const [currentTurn, setCurrentTurn] = useState(1)
  const [turnData, setTurnData] = useState<Turn | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [choices, setChoices] = useState<UserChoice[]>([])
  const [projectContext, setProjectContext] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Get project context from URL params or sessionStorage
    const urlParams = new URLSearchParams(window.location.search)
    const context = urlParams.get('context') || sessionStorage.getItem('projectContext') || ''
    setProjectContext(context)
    
    if (context) {
      loadTurn(1, context)
    } else {
      setError('No project context found')
    }
  }, [])

  const loadTurn = async (turnNumber: number, context: string, previousChoices: UserChoice[] = []) => {
    setLoading(true)
    setError(null)
    
    try {
      const turn = await generateTurn(turnNumber, context, previousChoices)
      setTurnData(turn)
    } catch (err) {
      setError('Failed to load simulation. Please try again.')
      console.error('Turn generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChoice = (choice: Choice) => {
    const userChoice: UserChoice = {
      turn: currentTurn,
      weight: choice.weight,
      label: choice.label,
      archetype: choice.archetype
    }
    
    const newChoices = [...choices, userChoice]
    setChoices(newChoices)

    if (currentTurn < 3) {
      setCurrentTurn(currentTurn + 1)
      loadTurn(currentTurn + 1, projectContext, newChoices)
    } else {
      // Simulation complete
      setIsComplete(true)
    }
  }

  const renderTurn = () => {
    if (loading) {
      return <LoadingState />
    }

    if (error) {
      return <ErrorState onRetry={() => loadTurn(currentTurn, projectContext, choices)} />
    }

    if (!turnData) {
      return null
    }

    return (
      <TurnDisplay 
        turnData={turnData} 
        onChoice={handleChoice}
        turnNumber={currentTurn}
      />
    )
  }

  const renderResults = () => {
    const totalScore = choices.reduce((sum, choice) => sum + choice.weight, 0)
    const persona = getPersonaFromScore(totalScore)
    
    return (
      <ResultsDisplay 
        persona={persona}
        choices={choices}
        projectContext={projectContext}
      />
    )
  }

  if (isComplete) {
    return renderResults()
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {renderTurn()}
      </AnimatePresence>
    </div>
  )
}

// Loading skeleton component
function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-mobile">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-mobile text-center">
        <div className="text-2xl mb-4">Oops! Our simulation engine hiccupped. T^T</div>
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// Turn display component
function TurnDisplay({ turnData, onChoice, turnNumber }: { 
  turnData: Turn, 
  onChoice: (choice: Choice) => void,
  turnNumber: number
}) {
  const [sceneComplete, setSceneComplete] = useState(false)

  return (
    <motion.div
      key={turnNumber}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="min-h-screen bg-white flex items-center justify-center p-6"
    >
      <div className="w-full max-w-mobile">
        <AnimatedText 
          text={turnData.scene}
          onComplete={() => setSceneComplete(true)}
        />
        
        <AnimatePresence>
          {sceneComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              {turnData.options.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => onChoice(choice)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {choice.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Animated text component
function AnimatedText({ text, onComplete }: { text: string, onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        clearInterval(timer)
        onComplete()
      }
    }, 50) // Adjust speed as needed

    return () => clearInterval(timer)
  }, [currentIndex, text, onComplete])

  // Parse text to replace **bold** with colored spans
  const parseText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2)
        return <span key={index} className="text-primary font-semibold">{content}</span>
      }
      return part
    })
  }

  return (
    <h2 className="text-2xl font-medium text-gray-900 mb-6 min-h-[4rem]">
      {parseText(displayedText)}
    </h2>
  )
}

// Results display component
function ResultsDisplay({ persona, choices, projectContext }: {
  persona: { title: string, description: string },
  choices: UserChoice[],
  projectContext: string
}) {
  const turnLabels = ['The Setup', 'The Confrontation', 'The Resolution']
  const insights = generatePersonalInsights(choices)
  
  return (
    <div className="min-h-screen bg-white p-6 overflow-y-auto">
      <div className="w-full max-w-mobile mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Persona Title & Description */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {persona.title}
            </h1>
            <p className="text-lg text-gray-700">
              {persona.description}
            </p>
          </div>

          {/* Strengths & Blind Spots Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Your Strengths & Blind Spots
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">💪</span>
                  Strengths
                </h3>
                <div className="space-y-3">
                  {insights.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 text-sm" 
                            dangerouslySetInnerHTML={{ __html: strength.replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-700">$1</strong>') }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Blind Spots */}
              <div>
                <h3 className="text-lg font-medium text-orange-800 mb-4 flex items-center">
                  <span className="text-orange-600 mr-2">👁️</span>
                  Blind Spots
                </h3>
                <div className="space-y-3">
                  {insights.blindSpots.map((blindSpot, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 text-sm" 
                            dangerouslySetInnerHTML={{ __html: blindSpot.replace(/\*\*(.*?)\*\*/g, '<strong class="text-orange-700">$1</strong>') }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Unique Pattern */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                <span className="text-blue-600 mr-2">🎯</span>
                Your Unique Pattern
              </h3>
              <p className="text-gray-700 text-sm italic bg-white rounded-lg p-4 border border-blue-200">
                {insights.uniquePattern}
              </p>
            </div>
          </motion.div>

          {/* Journey Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-left"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Journey</h2>
            
            <div className="space-y-6">
              {choices.map((choice, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-6 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                  <h3 className="font-semibold text-gray-900">{turnLabels[index]}</h3>
                  <p className="text-gray-700 mt-1">Your choice: <span className="italic">"{choice.label}"</span></p>
                  <p className="text-sm text-gray-500 mt-1">
                    This showed a <span className="font-medium text-primary">{choice.archetype}</span> approach.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}