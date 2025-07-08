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
              The Collab Track That Went Viral
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light">
              Navigate credit disputes when your music goes unexpectedly viral
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="border border-gray-200 rounded-lg p-8"
          >
            <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
              What you'll navigate:
            </h2>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-light text-xs">1</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 text-base">The DM:</span>
                  <span className="text-gray-600 ml-2 text-base font-light">Your collaborator reaches out after the track explodes</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-light text-xs">2</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 text-base">The Clause:</span>
                  <span className="text-gray-600 ml-2 text-base font-light">A record label offers a deal with disputed revenue splits</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-light text-xs">3</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 text-base">The Live Interview:</span>
                  <span className="text-gray-600 ml-2 text-base font-light">Handle public credit in front of 20k viewers</span>
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
            <p className="text-gray-600 mb-8 text-base font-light">
              Takes 3 minutes • 64 different personality insights • Discover your collaboration style
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