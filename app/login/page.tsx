"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = await login(email, password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "An unknown error occurred")
      }
    } catch (err) {
      setError("Failed to connect to authentication service")
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

      {/* Login container */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="flex items-center text-[#00aaff] hover:text-[#00ffaa] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffaa] to-[#00aaff]">
            PROJECT CATALYST
          </div>
        </div>

        <div className="bg-[#0a1215] border border-[#00aaff30] rounded-2xl p-8 backdrop-blur-md shadow-xl shadow-[#00aaff20]">
          <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-500/50 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-[#ffffff10] border-[#00aaff30] text-white focus-visible:ring-[#00aaff] focus-visible:ring-offset-0 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ffffff60] hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-[#00aaff] hover:text-[#00ffaa] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] hover:from-[#00c3ff] hover:to-[#00ffbb] border-0 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#ffffff80]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#00aaff] hover:text-[#00ffaa] transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#ffffff20]">
            <Button
              variant="outline"
              className="w-full bg-transparent border-[#00aaff30] text-white hover:bg-[#ffffff10] hover:text-white"
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => {
                  login("azure@example.com", "password", true)
                  router.push("/dashboard")
                }, 1500)
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="none">
                    <path d="M1 1h10v10H1V1zm0 11h10v10H1V12zm11-11h10v10H12V1zm0 11h10v10H12V12z" fill="#00a4ef" />
                  </svg>
                  Sign in with Microsoft
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

