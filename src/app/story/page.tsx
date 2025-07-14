'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function StoryPage() {
  const router = useRouter()
  const [textComplete, setTextComplete] = useState(false)
  
  const handleContinue = () => {
    router.push('/story/crisis-simulation')
  }

  return (
    <div className="min-h-screen bg-white p-8 pt-16 flex justify-center">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center mb-12">
            <h1 className="text-2xl font-light text-gray-600 mb-8 tracking-wide">
              The 9 AM Catastrophe
            </h1>
          </div>
          
          <div className="mb-16">
            <AnimatedText 
              text={`**Project Orion** has been your team's flagship initiative for months. After countless late nights, code reviews, and stakeholder meetings, today is finally launch day. The announcement went live at 9:00 AM sharp.

You're watching the real-time analytics when your stomach drops. The main dashboard lights up with **red alerts**. Simultaneously, the #customer-support channel explodes with activity.

A lead support agent tags you directly: **"@here - We're getting flooded with tickets. Users are saying they can't log in to their new accounts after creation. This is a P0 issue."**

The next few minutes will test everything you know about crisis management. How do you handle pressure? Do you act fast or think first? The choices you make will reveal your true problem-solving style.`}
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
    }, 5) // Fast typing animation

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