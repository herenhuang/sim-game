'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// Main experience progress bar (4 segments)
function MainProgressBar({ currentStep }: { currentStep: number }) {
  const totalSteps = 4 // Setup, Turn 1, Turn 2, Turn 3
  
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

export default function Setup() {
  const [projectContext, setProjectContext] = useState('')
  const [stakeholder, setStakeholder] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProjectContext(value)
    validateForm(value, stakeholder)
  }

  const handleStakeholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStakeholder(value)
    validateForm(projectContext, value)
  }

  const validateForm = (project: string, stakeholder: string) => {
    setIsValid(project.length >= 3 && stakeholder.length >= 3)
  }

  const handleStart = () => {
    if (isValid) {
      // Store context for the simulation
      const context = { project: projectContext, stakeholder }
      sessionStorage.setItem('simulationContext', JSON.stringify(context))
      // Navigate to simulation page
      window.location.href = `/simulation?project=${encodeURIComponent(projectContext)}&stakeholder=${encodeURIComponent(stakeholder)}`
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      {/* Progress Bar */}
      <MainProgressBar currentStep={1} />
      
      <div className="w-full max-w-mobile">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text mb-6 tracking-tight">
              Let's personalize your simulation
            </h1>
            <p className="text-xl text-text-secondary font-light">
              Answer two quick questions to make this feel real
            </p>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="block text-xl font-semibold text-text mb-4">
                What project are you racing to launch?
              </label>
              <input
                type="text"
                value={projectContext}
                onChange={handleProjectChange}
                placeholder="e.g., new customer loyalty dashboard"
                maxLength={100}
                className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all duration-200 bg-white shadow-sm focus:shadow-md"
              />
              <div className="text-sm text-text-secondary mt-2">
                {projectContext.length}/100 characters
              </div>
            </div>

            <div>
              <label className="block text-xl font-semibold text-text mb-4">
                Who is the most important person you need to keep happy?
              </label>
              <input
                type="text"
                value={stakeholder}
                onChange={handleStakeholderChange}
                placeholder="e.g., the CEO, the head of sales, your manager"
                maxLength={80}
                className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all duration-200 bg-white shadow-sm focus:shadow-md"
              />
              <div className="text-sm text-text-secondary mt-2">
                {stakeholder.length}/80 characters
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!isValid}
            className={`w-full py-5 px-8 text-xl font-semibold rounded-xl transition-all duration-200 ${
              isValid
                ? 'bg-primary text-white hover:bg-blue-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Simulation
          </button>

          <div className="text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-text-secondary hover:text-text text-lg transition-colors"
            >
              ← Back to overview
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}