"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful password reset email
      setSuccess(true)
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050a0a] flex flex-col items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,100,0.15),rgba(0,0,0,0)_70%)]" />

      {/* Background web pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`web-${i}`}
              className="absolute top-1/2 left-1/2 w-full h-full border border-[#00ffaa] rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${100 - i * 5}%`,
                height: `${100 - i * 5}%`,
                opacity: 1 - i * 0.08,
                animation: `spin ${120 + i * 20}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
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

      {/* Forgot password container */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/login" className="flex items-center text-[#00aaff] hover:text-[#00ffaa] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffaa] to-[#00aaff]">
            PROJECT CATALYST
          </div>
        </div>

        <div className="bg-[#0a1215] border border-[#00aaff30] rounded-2xl p-8 backdrop-blur-md shadow-xl shadow-[#00aaff20]">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-[#ffffff80] mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-500/50 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-900/30 border-green-500/50 text-white">
              <Check className="h-4 w-4" />
              <AlertDescription>
                If an account exists with this email, you will receive password reset instructions shortly.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="bg-[#ffffff10] border-[#00aaff30] text-white focus-visible:ring-[#00aaff] focus-visible:ring-offset-0"
                disabled={success}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] hover:from-[#00c3ff] hover:to-[#00ffbb] border-0 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {success && (
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full bg-transparent border-[#00aaff30] text-white hover:bg-[#ffffff10] hover:text-white"
                asChild
              >
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

