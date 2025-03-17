"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
type User = {
  id: string
  email: string
  name?: string
  provider: "email" | "azure"
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, useAzure?: boolean) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
    provider: "email" as const,
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    provider: "email" as const,
  },
]

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Mock login function
  const login = async (
    email: string,
    password: string,
    useAzure = false,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (useAzure) {
      // Mock successful Azure login
      const azureUser: User = {
        id: "azure-123",
        email: email || "azure@example.com",
        name: "Azure User",
        provider: "azure",
      }
      setUser(azureUser)
      localStorage.setItem("auth_user", JSON.stringify(azureUser))
      return { success: true }
    }

    // Check credentials against mock users
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return {
      success: false,
      error: "Invalid email or password",
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

