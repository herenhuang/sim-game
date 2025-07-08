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
  const [stakeholder, setStakeholder] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [resultsStep, setResultsStep] = useState(1) // 1, 2, or 3 for the three results parts
  const [isAIEnabled, setIsAIEnabled] = useState(false)

  useEffect(() => {
    // AI is always available now (handled by backend)
    setIsAIEnabled(true)
    
    // Get context from URL params or sessionStorage
    const urlParams = new URLSearchParams(window.location.search)
    const project = urlParams.get('project') || ''
    const stakeholderParam = urlParams.get('stakeholder') || ''
    
    // Fallback to sessionStorage
    if (!project || !stakeholderParam) {
      const storedContext = sessionStorage.getItem('simulationContext')
      if (storedContext) {
        const parsed = JSON.parse(storedContext)
        setProjectContext(parsed.project || '')
        setStakeholder(parsed.stakeholder || '')
        if (parsed.project && parsed.stakeholder) {
          loadTurn(1, parsed.project, parsed.stakeholder)
        } else {
          setError('Incomplete context found')
        }
      } else {
        setError('No context found')
      }
    } else {
      setProjectContext(project)
      setStakeholder(stakeholderParam)
      loadTurn(1, project, stakeholderParam)
    }
  }, [])

  const loadTurn = async (turnNumber: number, project: string, stakeholderParam?: string, previousChoices: UserChoice[] = []) => {
    setLoading(true)
    setError(null)
    
    try {
      const context = { project, stakeholder: stakeholderParam || stakeholder }
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
      loadTurn(currentTurn + 1, projectContext, stakeholder, newChoices)
    } else {
      // Simulation complete - start with results part 1
      setIsComplete(true)
      setResultsStep(1)
    }
  }

  const renderTurn = () => {
    if (loading) {
      return <LoadingState />
    }

    if (error) {
      return <ErrorState onRetry={() => loadTurn(currentTurn, projectContext, stakeholder, choices)} />
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

  const getMainProgressStep = () => {
    // Step 1: Setup (25%), Step 2: Turn 1 (50%), Step 3: Turn 2 (75%), Step 4: Turn 3 (100%)
    return currentTurn + 1 // currentTurn starts at 1, so +1 makes it: Turn1=2, Turn2=3, Turn3=4
  }

  const handleResultsContinue = () => {
    if (resultsStep < 3) {
      setResultsStep(resultsStep + 1)
    }
  }

  const renderResults = () => {
    const totalScore = choices.reduce((sum, choice) => sum + choice.weight, 0)
    const persona = getPersonaFromScore(totalScore)
    
    return (
      <ResultsDisplay 
        persona={persona}
        choices={choices}
        projectContext={projectContext}
        stakeholder={stakeholder}
        step={resultsStep}
        onContinue={handleResultsContinue}
      />
    )
  }

  if (isComplete) {
    return renderResults()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      {!isComplete && <MainProgressBar currentStep={getMainProgressStep()} />}
      
      {/* AI Status Indicator */}
      <div className="fixed top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAIEnabled 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}>
          {isAIEnabled ? '🤖 AI Powered' : '📝 Demo Mode'}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {renderTurn()}
      </AnimatePresence>
    </div>
  )
}

// Main experience progress bar (4 segments)
function MainProgressBar({ currentStep }: { currentStep: number }) {
  const totalSteps = 4 // Setup, Turn 1, Turn 2, Turn 3
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-100 flex gap-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isActive = index < currentStep
          
          return (
            <div key={index} className="flex-1">
              <div className="h-full bg-gray-100">
                <motion.div
                  className="h-full bg-primary"
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

// Results experience progress bar (3 segments)
function ResultsProgressBar({ currentStep }: { currentStep: number }) {
  const totalSteps = 3 // Results 1, Results 2, Results 3
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-100 flex gap-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isActive = index < currentStep
          
          return (
            <div key={index} className="flex-1">
              <div className="h-full bg-gray-100">
                <motion.div
                  className="h-full bg-primary"
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

// Loading skeleton component
function LoadingState() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 pt-8">
      <div className="w-full max-w-mobile">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-6 bg-gray-200 rounded-lg mb-10"></div>
          <div className="space-y-6">
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 pt-8">
      <div className="w-full max-w-mobile text-center">
        <div className="text-3xl mb-8 text-text font-semibold">Oops! Our simulation engine hiccupped.</div>
        <button
          onClick={onRetry}
          className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
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
      className="min-h-screen bg-surface flex items-center justify-center p-6 pt-8"
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
                  className="w-full p-6 text-left bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-102"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg font-medium text-text">{choice.label}</span>
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
    }, 25) // Faster typing animation

    return () => clearInterval(timer)
  }, [currentIndex, text, onComplete])

  // Parse text to replace **bold** with colored spans
  const parseText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2)
        return <span key={index} className="text-primary font-bold">{content}</span>
      }
      return part
    })
  }

  return (
    <h2 className="text-3xl font-semibold text-text mb-8 min-h-[5rem] leading-relaxed">
      {parseText(displayedText)}
    </h2>
  )
}

// Results display component
function ResultsDisplay({ persona, choices, projectContext, stakeholder, step, onContinue }: {
  persona: { title: string, description: string },
  choices: UserChoice[],
  projectContext: string,
  stakeholder: string,
  step: number,
  onContinue: () => void
}) {
  const turnLabels = ['The Setup', 'The Confrontation', 'The Resolution']
  const insights = generatePersonalInsights(choices)
  
  const renderStep = () => {
    if (step === 1) {
      // Step 1: The Reveal
      return (
        <motion.div
          key="reveal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div>
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {persona.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {persona.description}
            </motion.p>
          </div>
          
          <motion.button
            onClick={onContinue}
            className="bg-primary text-white px-10 py-4 text-xl font-semibold rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Continue
          </motion.button>
        </motion.div>
      )
    }
    
    if (step === 2) {
      // Step 2: The Analysis
      return (
        <motion.div
          key="analysis"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Let's understand what drives you
            </h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
          >
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
          
          <div className="text-center">
            <button
              onClick={onContinue}
              className="bg-primary text-white px-10 py-4 text-xl font-semibold rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )
    }
    
    // Step 3: The Journey
    return (
      <motion.div
        key="journey"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text mb-8 tracking-tight">
            Here's how your story unfolded
          </h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-left"
        >
          <div className="space-y-6">
            {choices.map((choice, index) => (
              <motion.div 
                key={index} 
                className="border-l-4 border-primary pl-8 relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.2) }}
              >
                <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full border-2 border-surface"></div>
                <h3 className="font-bold text-text text-lg">{turnLabels[index]}</h3>
                <p className="text-text-secondary mt-2 text-lg">Your choice: <span className="italic font-medium">"{choice.label}"</span></p>
                <p className="text-sm text-text-secondary mt-2">
                  This showed a <span className="font-semibold text-primary">{choice.archetype}</span> approach.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-gray-600 mb-6">
            Thank you for experiencing this leadership simulation.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-gray-700 transition-all"
          >
            Start Over
          </button>
        </motion.div>
      </motion.div>
    )
  }
  
  return (
    <div className="min-h-screen bg-surface p-6 overflow-y-auto pt-12">
      {/* Results Progress Bar */}
      <ResultsProgressBar currentStep={step} />
      
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  )
}