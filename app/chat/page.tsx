"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Menu, X, Settings, Search, Bot, User, Plus, MoreVertical, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function ChatInterface() {
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
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
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
  const handleSendMessage = async () => {
    if (input.trim() === "") return
    
    // Clear any previous errors
    setError(null)

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

    try {
      // Send message to Python AutoGen API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          conversation_id: conversationId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      // Save conversation ID if it's the first message
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      // Add AI response
      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setIsTyping(false)
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error sending message:', err);
    }
  }

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-[#050a0a] text-white overflow-hidden relative">
      {/* Enhanced background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a0a] to-[#0a1520] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48cGF0aCBkPSJNMTIgMTJ2Nmg2di02aC02em02IDZ2Nmg2di02aC02em0tNiAwaDZ2NmgtNnYtNnptMTIgMGg2djZoLTZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5 z-0"></div>
      {/* Sidebar */}
      <motion.div
        className={cn(
          "h-full bg-[#0a121580] backdrop-blur-md border-r border-[#00aaff30] flex flex-col z-20 rounded-r-2xl",
          sidebarOpen ? "w-80" : "w-0"
        )}
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 border-b border-[#00aaff30] flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-[#00aaff] to-[#00ffaa] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#050a0a]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00aaff50] to-[#00ffaa50] blur-sm -z-10" />
            </div>
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffaa] to-[#00aaff]">
              Project Catalyst
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-[#ffffff15] md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffffff60] h-4 w-4" />
            <Input 
              placeholder="Search conversations" 
              className="pl-9 bg-[#ffffff10] border-[#00aaff30] text-white focus-visible:ring-[#00aaff] focus-visible:ring-offset-0 rounded-lg"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-2 text-[#00ffaa] hover:bg-[#00ffaa20] rounded-xl"
              onClick={() => {
                setConversationId(null);
                setMessages([{
                  id: 1,
                  text: "Hello! I'm Project Catalyst, your AI assistant for Xero. How can I help you today?",
                  sender: "ai",
                  timestamp: new Date(),
                }]);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Button>

            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={cn(
                    "w-full p-3 text-left rounded-xl flex items-start hover:bg-[#ffffff15] transition-colors",
                    activeConversation === conversation.id && "bg-[#ffffff15]"
                  )}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 border-2 border-[#00aaff40]">
                      <AvatarFallback className="bg-gradient-to-br from-[#00aaff30] to-[#00ffaa30] text-white">
                        {conversation.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00ffaa]"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-[#ffffff60]">
                        {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-[#ffffff80] truncate">{conversation.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#00aaff30]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-[#00aaff40]">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-br from-[#00aaff30] to-[#00ffaa30] text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-[#ffffff60]">Premium Account</p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#ffffff15] rounded-full">
                    <Settings className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat header */}
        <div className="h-16 border-b border-[#00aaff30] flex items-center justify-between px-4 bg-[#0a121580] backdrop-blur-md">
          <div className="flex items-center">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2 text-white hover:bg-[#ffffff15]"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center">
              <Avatar className="h-8 w-8 border-2 border-[#00aaff40]">
                <AvatarFallback className="bg-gradient-to-br from-[#00aaff30] to-[#00ffaa30] text-white">
                  PC
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h2 className="font-medium">
                  {conversations.find(c => c.id === activeConversation)?.name || "Project Catalyst"}
                </h2>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#00ffaa] mr-2"></span>
                  <span className="text-xs text-[#ffffff60]">Python AutoGen 0.4.9</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#ffffff15]">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>More options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={`web-${i}`}
                className="absolute top-1/2 left-1/2 w-full h-full border border-[#00ffaa] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  width: `${100 - i * 5}%`, 
                  height: `${100 - i * 5}%`,
                  opacity: 1 - i * 0.08,
                  animation: `spin ${120 + i * 20}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}, pulse 8s ease-in-out infinite alternate-reverse`
                }}
              />
            ))}
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={`line-${i}`}
                className="absolute top-1/2 left-1/2 w-[50%] h-[1px] bg-[#00aaff] opacity-30"
                style={{ 
                  transformOrigin: "0 0",
                  transform: `rotate(${i * 15}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Add floating particles to the chat interface */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-[#00aaff] to-[#00ffaa]"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                filter: "blur(1px)",
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] shadow-lg shadow-[#00aaff30]"
                    : "bg-[#ffffff15] backdrop-blur-sm text-white shadow-lg shadow-[#00000020]"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === "ai" ? (
                    <Bot className="w-4 h-4 mr-2" />
                  ) : (
                    <User className="w-4 h-4 mr-2" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.sender === "ai" ? "Project Catalyst" : "You"}
                  </span>
                  <span className="text-xs opacity-50 ml-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          
          {/* AI typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#ffffff15] backdrop-blur-sm text-white shadow-lg shadow-[#00000020]">
                <div className="flex items-center mb-1">
                  <Bot className="w-4 h-4 mr-2" />
                  <span className="text-xs opacity-70">Project Catalyst</span>
                </div>
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00aaff]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00aaff]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00aaff]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-4 border-t border-[#00aaff30] bg-[#0a121580] backdrop-blur-md z-10 rounded-b-2xl">
          <div className="flex items-end">
            <div className="flex-1 bg-[#ffffff10] rounded-lg border border-[#00aaff30] focus-within:ring-1 focus-within:ring-[#00aaff] overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full bg-transparent border-0 focus:ring-0 text-white resize-none p-3 max-h-32 min-h-[2.5rem]"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
              />
              <div className="flex items-center px-3 py-2 border-t border-[#00aaff30]">
                <span className="text-xs text-[#ffffff80]">Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              className="ml-2 bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] hover:from-[#00c3ff] hover:to-[#00ffbb] h-10 w-10 rounded-full flex items-center justify-center shadow-lg shadow-[#00aaff30]"
              disabled={input.trim() === "" || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

