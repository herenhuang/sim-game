'use client'

import { motion } from 'framer-motion'

export default function StoryPage() {
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
          
          <div className="space-y-8">
            <p className="text-lg font-light text-gray-800 leading-relaxed">
              You and two friends—<span className="font-medium text-gray-900">Maya</span> (producer) and <span className="font-medium text-gray-900">Jonah</span> (mix engineer)—have been passing stems back and forth for weeks, polishing a lo-fi track that samples an obscure 1970s spoken-word record. None of you bothered with agreements; it was a fun quarantine experiment.
            </p>
            
            <p className="text-lg font-light text-gray-800 leading-relaxed">
              Late one night, you wake to <span className="font-medium text-gray-900">300 push notifications</span>: the track leaked on TikTok, went viral, and is now climbing SoundCloud's charts under Maya's solo account. Somehow the credits read <em>"Written & Produced by Maya."</em> Jonah hasn't replied to your texts. Your stomach does cartwheels.
            </p>
          </div>

          <div className="text-center">
            <motion.button
              onClick={handleContinue}
              className="bg-gray-900 text-white px-8 py-3 text-base font-light rounded-lg hover:bg-gray-800 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}