'use client'

import { motion } from 'framer-motion'

export default function Home() {
  const handleGetStarted = () => {
    window.location.href = '/setup'
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-12"
        >
          <div>
            <h1 className="text-5xl font-bold text-text mb-8 tracking-tight">
              Leadership Under Pressure
            </h1>
            <p className="text-2xl text-text-secondary mb-8 font-light">
              Discover how you make decisions when everything goes wrong
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-surface rounded-2xl p-10 shadow-xl border border-gray-100"
          >
            <h2 className="text-3xl font-semibold text-text mb-8">
              What you'll experience:
            </h2>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <span className="font-semibold text-text text-lg">The Crisis:</span>
                  <span className="text-text-secondary ml-2 text-lg">A critical bug is discovered 48 hours before your product launch</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <span className="font-semibold text-text text-lg">The Fallout:</span>
                  <span className="text-text-secondary ml-2 text-lg">Deal with the immediate consequences of your decision</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <span className="font-semibold text-text text-lg">The Confrontation:</span>
                  <span className="text-text-secondary ml-2 text-lg">Face your most important stakeholder with your leadership approach</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-text-secondary mb-8 text-lg">
              Takes 3 minutes • Personalized to your situation • Discover your leadership archetype
            </p>
            
            <button
              onClick={handleGetStarted}
              className="bg-primary text-white px-10 py-4 text-xl font-semibold rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}