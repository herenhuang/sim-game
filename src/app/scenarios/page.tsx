'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AVAILABLE_SCENARIOS } from '@/lib/scenarios'

export default function ScenariosPage() {
  const router = useRouter()
  
  const handleScenarioSelect = (scenarioPath: string) => {
    // Clear any existing state when starting a new simulation
    localStorage.removeItem('remix-simulation-state')
    localStorage.removeItem('remix-conclusion-text')
    
    // Navigate to the first page of the simulation
    if (scenarioPath === '/remix-simulation') {
      router.push('/remix-simulation/1/1')
    } else {
      router.push(scenarioPath)
    }
  }

  return (
    <div className="h-full bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
              Choose Your Simulation
            </h1>
            <p className="text-base text-gray-600 mb-2 font-light">
              Step into a high-stakes moment.
            </p>
            <p className="text-base text-gray-600 mb-6 font-light">
              Make real decisions. See what they reveal.
            </p>
          </div>

          <div className="space-y-3">
            {AVAILABLE_SCENARIOS.map((scenario, index) => {
              const isRemix = scenario.title.includes('Remix')
              return (
                <motion.div
                  key={scenario.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    borderColor: isRemix ? ['#e5e7eb', '#f97316', '#e5e7eb'] : '#e5e7eb'
                  }}
                  transition={{ 
                    delay: 0.2 * (index + 1), 
                    duration: 0.6,
                    borderColor: isRemix ? { 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    } : {}
                  }}
                  className={`border rounded-lg p-3 hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    isRemix 
                      ? 'border-orange-300 bg-orange-50 hover:border-orange-400' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                  onClick={() => handleScenarioSelect(scenario.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h2 className={`text-lg font-light mb-2 ${
                    isRemix ? 'text-orange-900' : 'text-gray-900'
                  }`}>
                    {scenario.title}
                  </h2>
                  <p className={`text-sm font-light leading-relaxed ${
                    isRemix ? 'text-orange-800' : 'text-gray-600'
                  }`}>
                    {scenario.description}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs font-medium ${
                      isRemix ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      Click to start →
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => router.push('/')}
              className="text-xs text-gray-400 hover:text-gray-600 font-light"
            >
              ← Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}