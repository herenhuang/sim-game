'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  const handleGetStarted = () => {
    router.push('/scenarios')
  }

  return (
    <div className="h-full bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-wide">
              How do you handle chaos?
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light">
              When the pressure's on, do you move fast or dive deep?
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="border border-gray-200 rounded-lg p-6"
          >
            <p className="text-base font-light text-gray-800 leading-relaxed text-center">
              Play through a mini-scenario. See what your decisions say about you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center"
          >
            <button
              onClick={handleGetStarted}
              className="bg-orange-500 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-orange-600 transition-all duration-200"
            >
              Start the Simulation
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}