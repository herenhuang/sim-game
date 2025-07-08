'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Beat, Choice, UserChoice, PersonalityResult, BEATS, getPersonalityFromChoices } from '@/lib/types'

export default function SimulationPage() {
  const [currentBeat, setCurrentBeat] = useState(0) // 0, 1, 2 for the three beats
  const [choices, setChoices] = useState<UserChoice[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [resultsStep, setResultsStep] = useState(1) // 1 or 2 for the two results parts
  const [sceneComplete, setSceneComplete] = useState(false)

  useEffect(() => {
    // Start with the first beat
    setSceneComplete(false)
  }, [])


  const handleChoice = (choice: Choice) => {
    const userChoice: UserChoice = {
      beat: currentBeat,
      code: choice.code,
      label: choice.label
    }
    
    const newChoices = [...choices, userChoice]
    setChoices(newChoices)

    if (currentBeat < 2) {
      setCurrentBeat(currentBeat + 1)
      setSceneComplete(false)
    } else {
      // Simulation complete - start with results part 1
      setIsComplete(true)
      setResultsStep(1)
    }
  }

  const renderBeat = () => {
    const currentBeatData = BEATS[currentBeat]
    
    return (
      <BeatDisplay 
        beatData={currentBeatData} 
        onChoice={handleChoice}
        beatNumber={currentBeat}
        sceneComplete={sceneComplete}
        onSceneComplete={() => setSceneComplete(true)}
      />
    )
  }

  const getMainProgressStep = () => {
    // Beat 0 = 33%, Beat 1 = 67%, Beat 2 = 100%
    return currentBeat + 1
  }

  const handleResultsContinue = () => {
    if (resultsStep < 2) {
      setResultsStep(resultsStep + 1)
    }
  }

  const renderResults = () => {
    const personality = getPersonalityFromChoices(choices)
    
    return (
      <ResultsDisplay 
        personality={personality}
        choices={choices}
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
      
      <AnimatePresence mode="wait">
        {renderBeat()}
      </AnimatePresence>
    </div>
  )
}

// Main experience progress bar (3 segments)
function MainProgressBar({ currentStep }: { currentStep: number }) {
  const totalSteps = 3 // Beat 1, Beat 2, Beat 3
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

// Results experience progress bar (2 segments)
function ResultsProgressBar({ currentStep }: { currentStep: number }) {
  const totalSteps = 2 // Results 1, Results 2
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

// Beat display component
function BeatDisplay({ beatData, onChoice, beatNumber, sceneComplete, onSceneComplete }: { 
  beatData: Beat, 
  onChoice: (choice: Choice) => void,
  beatNumber: number,
  sceneComplete: boolean,
  onSceneComplete: () => void
}) {
  return (
    <motion.div
      key={beatNumber}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="min-h-screen bg-white p-8 pt-24"
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-gray-600 mb-8 tracking-wide">
            {beatData.title}
          </h1>
        </div>
        
        <div className="mb-16">
          <AnimatedText 
            text={beatData.scene}
            onComplete={onSceneComplete}
          />
        </div>
        
        <AnimatePresence>
          {sceneComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {beatData.options.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => onChoice(choice)}
                  className="w-full p-6 text-left bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-base font-light text-gray-700 leading-relaxed">{choice.label}</span>
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
    }, 15) // Even faster typing animation

    return () => clearInterval(timer)
  }, [currentIndex, text, onComplete])

  // Parse text to replace **bold** with colored spans and preserve line breaks
  const parseText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\n)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2)
        return <span key={index} className="font-medium text-gray-900">{content}</span>
      }
      if (part === '\n') {
        return <br key={index} />
      }
      return part
    })
  }

  return (
    <div className="text-lg font-light text-gray-800 leading-relaxed whitespace-pre-wrap text-left max-w-xl mx-auto">
      {parseText(displayedText)}
    </div>
  )
}

// Results display component
function ResultsDisplay({ personality, choices, step, onContinue }: {
  personality: PersonalityResult,
  choices: UserChoice[],
  step: number,
  onContinue: () => void
}) {
  const beatLabels = ['Beat 1 — The DM', 'Beat 2 — The Clause', 'Beat 3 — The Live Interview']
  
  const renderStep = () => {
    if (step === 1) {
      // Step 1: Archetype Name + Insight Paragraph
      return (
        <motion.div
          key="reveal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-12"
        >
          <div>
            <motion.h1 
              className="text-3xl font-light text-gray-900 mb-8 tracking-wide"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {personality.archetype}
            </motion.h1>
            <motion.p 
              className="text-lg font-light text-gray-800 leading-relaxed max-w-2xl mx-auto text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {personality.insight}
            </motion.p>
          </div>
          
          <motion.button
            onClick={onContinue}
            className="bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Continue
          </motion.button>
        </motion.div>
      )
    }
    
    // Step 2: Practical Application
    return (
      <motion.div
        key="practical"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-8 tracking-wide">
            {personality.archetype}
          </h1>
          <p className="text-lg font-light text-gray-600 mb-12">
            Here's how to apply this insight at work:
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          {/* What can bite you */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              What can bite you
            </h3>
            <p className="text-base font-light text-gray-700 leading-relaxed">
              {personality.whatCanBiteYou || "Data being updated..."}
            </p>
          </div>

          {/* Practical suggestion */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              One concrete move
            </h3>
            <p className="text-base font-light text-gray-700 leading-relaxed">
              {personality.practicalSuggestion || "Data being updated..."}
            </p>
          </div>
        </motion.div>
        
        <div className="text-center pt-8">
          <p className="text-gray-600 mb-6 font-light">
            Thank you for experiencing this collaboration simulation.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white p-8 overflow-y-auto pt-12">
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