'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [projectContext, setProjectContext] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProjectContext(value)
    setIsValid(value.length >= 3)
  }

  const handleStart = () => {
    if (isValid) {
      // Store context for the simulation
      sessionStorage.setItem('projectContext', projectContext)
      // Navigate to simulation page
      window.location.href = `/simulation?context=${encodeURIComponent(projectContext)}`
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-mobile">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            What project are you racing to launch?
          </h1>
          
          <div className="mb-8">
            <input
              type="text"
              value={projectContext}
              onChange={handleInputChange}
              placeholder="e.g., AI-powered expense tracker"
              maxLength={150}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
            <div className="text-sm text-gray-500 mt-2">
              {projectContext.length}/150 characters
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!isValid}
            className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all ${
              isValid
                ? 'bg-primary text-white hover:bg-blue-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Simulation
          </button>
        </motion.div>
      </div>
    </div>
  )
}