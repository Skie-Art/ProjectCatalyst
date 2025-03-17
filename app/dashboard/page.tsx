"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050a0a] flex flex-col">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,100,0.15),rgba(0,0,0,0)_70%)]" />

      {/* Header */}
      <header className="relative z-10 border-b border-[#00aaff30] bg-[#0a121580] backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffaa] to-[#00aaff]"
          >
            PROJECT CATALYST
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-white">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00aaff] to-[#00ffaa] flex items-center justify-center mr-2">
                <User className="w-4 h-4 text-[#050a0a]" />
              </div>
              <span>{user?.email}</span>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#ffffff15]"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0a1215] border border-[#00aaff30] rounded-2xl p-8 backdrop-blur-md shadow-xl shadow-[#00aaff20]"
          >
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
            <p className="text-[#ffffff80] mb-6">
              Welcome to your Project Catalyst dashboard. This is a protected page that requires authentication.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#ffffff10] rounded-xl p-6 border border-[#00aaff20]">
                <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#ffffff60]">Email:</span>
                    <span className="text-white">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ffffff60]">Account Type:</span>
                    <span className="text-white">Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ffffff60]">Authentication:</span>
                    <span className="text-white">{user?.provider === "azure" ? "Microsoft" : "Email"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#ffffff10] rounded-xl p-6 border border-[#00aaff20]">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-[#00ffaa] mt-2 mr-2"></div>
                    <div>
                      <p className="text-white">Logged in successfully</p>
                      <p className="text-[#ffffff60] text-sm">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-[#00aaff] mt-2 mr-2"></div>
                    <div>
                      <p className="text-white">Profile updated</p>
                      <p className="text-[#ffffff60] text-sm">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                className="bg-gradient-to-r from-[#00aaff] to-[#00ffaa] text-[#050a0a] hover:from-[#00c3ff] hover:to-[#00ffbb]"
                asChild
              >
                <Link href="/chat">Go to Chat Interface</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

