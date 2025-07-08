'use client'

import { motion } from 'framer-motion'

export default function Home() {
  const handleGetStarted = () => {
    window.location.href = '/story'
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-12"
        >
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-wide">
              What's Your Workstyle?
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light">
              Measure your actions, not your answers.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="border border-gray-200 rounded-lg p-6"
          >
            <p className="text-base font-light text-gray-800 leading-relaxed text-center">
              Hi Betaworks team! Here's my 4-minute video: <a href="https://youtu.be/sBgVSjPhCf8" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://youtu.be/sBgVSjPhCf8</a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-8 text-base font-light">
              Takes 1 minute • 64 different personality insights • Discover your collaboration style
            </p>
            
            <button
              onClick={handleGetStarted}
              className="bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              Start Story
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}