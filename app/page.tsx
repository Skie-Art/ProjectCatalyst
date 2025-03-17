"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

type Conversation = {
  id: number
  name: string
  lastMessage: string
  timestamp: Date
  unread: boolean
}

export default function ProjectCatalyst() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showChat, setShowChat] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()

  // Motion values for smooth animations
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Add spring physics for smoother motion
  const springConfig = { damping: 40, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // For the orb movement
  const orbX = useTransform(springX, (latest) => latest / 20)
  const orbY = useTransform(springY, (latest) => latest / 20)

  // For the web pattern rotation
  const webRotate = useTransform(springX, [-300, 300], [-5, 5])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const x = e.clientX - centerX
        const y = e.clientY - centerY
        setMousePosition({ x, y })
        mouseX.set(x)
        mouseY.set(y)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Project Catalyst, your AI assistant for Xero. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeConversation, setActiveConversation] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Project Catalyst",
      lastMessage: "How can I help you today?",
      timestamp: new Date(),
      unread: false,
    },
    {
      id: 2,
      name: "Financial Analysis",
      lastMessage: "I've analyzed your Q2 reports",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      unread: true,
    },
    {
      id: 3,
      name: "Invoice Assistant",
      lastMessage: "3 invoices require attention",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      unread: false,
    },
    {
      id: 4,
      name: "Tax Planning",
      lastMessage: "Your tax estimate is ready",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unread: false,
    },
  ]

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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#050a0a] flex flex-col items-center justify-center"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,100,0.15),rgba(0,0,0,0)_70%)]" />

      {/* Main content container with improved layout */}
      <div className="container mx-auto px-4 py-8 relative z-30 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Text content - moved to the left side for better readability */}
        <motion.div
          className="w-full lg:w-1/2 text-left z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Project Catalyst title - now horizontal and prominent */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#00ffaa] to-[#00aaff] drop-shadow-[0_0_5px_rgba(0,255,170,0.7)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            PROJECT CATALYST
          </motion.h2>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_10px_rgba(0,170,255,0.5)]">
            Agentic AI for Xero
          </h1>

          <p className="text-lg md:text-xl text-[#a0e0ff] mb-8 max-w-xl">
            Intelligent automation that transforms how businesses interact with Xero's financial platform
          </p>

          {/* Key features list - added for better information hierarchy */}
          <ul className="space-y-3 mb-8">
            {[
              "Autonomous financial insights",
              "Intelligent workflow automation",
              "Proactive business recommendations",
            ].map((item, i) => (
              <motion.li
                key={i}
                className="flex items-center text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              >
                <div className="w-2 h-2 rounded-full bg-[#00ffaa] mr-3"></div>
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] hover:from-[#00c3ff] hover:to-[#00ffbb] border-0 rounded-full px-6 py-6 text-lg font-medium"
              asChild
            >
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                <span className="flex items-center">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Visual element - moved to the right side */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <motion.div
            className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
            style={{ rotate: webRotate }}
          >
            {/* Outer web pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={`web-${i}`}
                    className="absolute top-1/2 left-1/2 w-full h-full border border-[#00ffaa20] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: `${100 - i * 3}%`,
                      height: `${100 - i * 3}%`,
                      opacity: 1 - i * 0.04,
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 120 + i * 5,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Inner web pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[90%] h-[90%]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`inner-web-${i}`}
                    className="absolute top-1/2 left-1/2 w-full h-full border-[0.5px] border-[#00aaff30] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: `${100 - i * 6}%`,
                      height: `${100 - i * 6}%`,
                      opacity: 1 - i * 0.08,
                    }}
                    animate={{
                      rotate: [360, 0],
                    }}
                    transition={{
                      duration: 100 - i * 3,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Radial lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute top-1/2 left-1/2 w-[50%] h-[1px] bg-gradient-to-r from-[#00ffaa10] via-[#00aaff40] to-transparent"
                    style={{
                      transformOrigin: "0 0",
                      rotate: `${i * 15}deg`,
                      translateX: 0,
                      translateY: 0,
                    }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 3 + (i % 5),
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Central orb */}
            <motion.div
              className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full bg-gradient-to-br from-[#00aaff] to-[#00ffaa] flex items-center justify-center z-10"
              style={{
                x: orbX,
                y: orbY,
                boxShadow: "0 0 40px rgba(0, 170, 255, 0.6), inset 0 0 20px rgba(0, 255, 170, 0.4)",
              }}
            >
              <motion.div
                className="w-[80%] h-[80%] rounded-full bg-[#050a0a] opacity-30"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00aaff50] to-[#00ffaa50] blur-sm" />
              <div className="absolute top-0 left-[30%] w-[40%] h-[5px] bg-white rounded-full blur-[2px] opacity-70 transform rotate-[30deg]" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-[#00aaff] to-[#00ffaa]"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

