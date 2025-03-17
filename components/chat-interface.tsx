"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X, Bot, User } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm Project Catalyst, your AI assistant for Xero. How can I help you today?",
    sender: "ai",
    timestamp: new Date(),
  },
]

export function ChatInterface({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "I can help you with that! Let me analyze your Xero data to provide insights.",
        "Based on your recent transactions, I recommend optimizing your cash flow by adjusting payment terms.",
        "I've detected an opportunity to save on expenses. Would you like me to generate a detailed report?",
        "Your quarterly tax filing is coming up. I can prepare the necessary documentation based on your Xero data.",
        "I notice some invoices are overdue. Would you like me to draft follow-up emails to your clients?",
      ]

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, aiMessage])
    }, 1500)
  }

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-2xl h-[600px] bg-[#0a1215] border border-[#00aaff40] rounded-xl overflow-hidden shadow-2xl shadow-[#00aaff30]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00aaff20] to-[#00ffaa20] border-b border-[#00aaff40]">
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-[#00aaff] to-[#00ffaa] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#050a0a]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00aaff50] to-[#00ffaa50] blur-sm -z-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Project Catalyst</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-[#ffffff15]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat messages */}
        <div className="flex flex-col h-[calc(100%-128px)] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a]"
                    : "bg-[#ffffff15] text-white"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === "ai" ? <Bot className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  <span className="text-xs opacity-70">{message.sender === "ai" ? "Project Catalyst" : "You"}</span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          {/* AI typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#ffffff15] text-white">
                <div className="flex items-center mb-1">
                  <Bot className="w-4 h-4 mr-2" />
                  <span className="text-xs opacity-70">Project Catalyst</span>
                </div>
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00aaff]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00aaff]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00aaff]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a1215] border-t border-[#00aaff40]">
          <div className="flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-[#ffffff10] border-[#00aaff40] text-white focus-visible:ring-[#00aaff] focus-visible:ring-offset-0"
            />
            <Button
              onClick={handleSendMessage}
              className="ml-2 bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] hover:from-[#00c3ff] hover:to-[#00ffbb]"
              disabled={input.trim() === ""}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

