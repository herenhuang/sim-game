'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

interface InstagramDMProps {
  senderName: string
  senderMessage: string
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export default function InstagramDM({ senderName, senderMessage, onSendMessage, isLoading = false }: InstagramDMProps) {
  const [message, setMessage] = useState('')
  const [showSenderMessage, setShowSenderMessage] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const [showUserMessage, setShowUserMessage] = useState(false)

  useEffect(() => {
    // Animate sender's message appearing first
    const timer1 = setTimeout(() => {
      setShowSenderMessage(true)
    }, 500)

    // Then show input after sender's message
    const timer2 = setTimeout(() => {
      setShowInput(true)
    }, 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      const messageToSend = message.trim()
      setUserMessage(messageToSend)
      setShowUserMessage(true)
      setMessage('')
      
      // Small delay to show user's message, then submit
      setTimeout(() => {
        onSendMessage(messageToSend)
      }, 300)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* DM Container */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden h-[480px] flex flex-col">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">🎵</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{senderName}</div>
            <div className="text-xs text-gray-500">Music Label</div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          {/* Sender's Message */}
          <div className="flex justify-start mb-4">
            {showSenderMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-[75%]"
              >
                <div className="bg-white px-4 py-3 rounded-3xl rounded-bl-lg shadow-sm border border-gray-100">
                  <div className="text-sm text-gray-900 leading-relaxed">{senderMessage}</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* User's Message */}
          <div className="flex justify-end mb-4">
            {showUserMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-[75%]"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 rounded-3xl rounded-br-lg shadow-sm">
                  <div className="text-sm text-white leading-relaxed">{userMessage}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border-t border-gray-100 p-4"
          >
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-gray-100 rounded-3xl border border-gray-200 py-3 px-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  className="w-full resize-none outline-none text-base bg-transparent overflow-y-auto placeholder-gray-500"
                  disabled={isLoading}
                  rows={2}
                  style={{
                    lineHeight: '22px',
                    height: '44px',
                    minHeight: '44px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = '44px'
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                  }}
                />
              </div>
              
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  message.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg' 
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} className="ml-0.5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}