'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AVAILABLE_SCENARIOS } from '@/lib/scenarios'

export default function ScenariosPage() {
  const router = useRouter()
  
  const handleScenarioSelect = (scenarioPath: string) => {
    // Navigate to the story page for this scenario
    router.push(`/story${scenarioPath}`)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-12"
        >
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-wide">
              Choose Your Simulation
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light">
              Each scenario tests different aspects of your decision-making style.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {AVAILABLE_SCENARIOS.map((scenario, index) => (
              <motion.div
                key={scenario.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
                className="border border-gray-200 rounded-lg p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => handleScenarioSelect(scenario.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="text-2xl font-light text-gray-900 mb-4">
                  {scenario.title}
                </h2>
                <p className="text-gray-600 font-light leading-relaxed">
                  {scenario.description}
                </p>
                <div className="mt-6">
                  <span className="text-sm text-gray-500 font-light">
                    Click to start →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 font-light underline"
            >
              ← Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}