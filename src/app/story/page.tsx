'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function StoryPage() {
  const [textComplete, setTextComplete] = useState(false)
  
  const handleContinue = () => {
    window.location.href = '/simulation'
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center mb-12">
            <h1 className="text-2xl font-light text-gray-600 mb-8 tracking-wide">
              The Setup
            </h1>
          </div>
          
          <div className="mb-16">
            <AnimatedText 
              text={`You and two friends—**Maya** (producer) and **Jonah** (mix engineer)—have been passing stems back and forth for weeks, polishing a lo-fi track that samples an obscure 1970s spoken-word record. None of you bothered with agreements; it was a fun quarantine experiment.

Late one night, you wake to **300 push notifications**: the track leaked on TikTok, went viral, and is now climbing SoundCloud's charts under Maya's solo account. Somehow the credits read *"Written & Produced by Maya."* Jonah hasn't replied to your texts. Your stomach does cartwheels.`}
              onComplete={() => setTextComplete(true)}
            />
          </div>

          {textComplete && (
            <div className="text-center">
              <motion.button
                onClick={handleContinue}
                className="bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Continue
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
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
    }, 15) // Fast typing animation

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