"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type SubscriptionStatus = "none" | "trial" | "active" | "expired"
export type SubscriptionPlan = "supplier" | "fresh" | "growth" | "group" | "enterprise" | "guava" | null

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  companyType?: string
  companySize?: string
  role?: string
  jobTitle?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  useCase?: "personal" | "team"
  useCaseReason?: string
  subscriptionStatus: SubscriptionStatus
  subscriptionPlan: SubscriptionPlan
  trialEndsAt?: string
  onboardingCompleted: boolean
  createdAt: string
}

export interface OnboardingData {
  role: string
  company: string
  companySize: string
  useCase: "personal" | "team"
  useCaseReason: string
}

export interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  company: string
  companyType: string
  jobTitle: string
  phone: string
  city: string
  state: string
  country: string
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegistrationData) => Promise<boolean>
  completeOnboarding: (data: OnboardingData) => void
  selectPlan: (plan: SubscriptionPlan, isTrial: boolean) => void
  updateUser: (updates: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = "journeyfoods_user"

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }
  }, [user])

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Mock login - in production this would call an API
    // For demo, we check if there's a stored user with this email
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.email === email) {
        setUser(parsed)
        return true
      }
    }
    
    // For demo purposes, allow any login and create a user if needed
    const newUser: User = {
      id: generateId(),
      email,
      firstName: email.split("@")[0],
      lastName: "",
      subscriptionStatus: "none",
      subscriptionPlan: null,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const register = useCallback(async (data: RegistrationData): Promise<boolean> => {
    const newUser: User = {
      id: generateId(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      companyType: data.companyType,
      jobTitle: data.jobTitle,
      phone: data.phone,
      city: data.city,
      state: data.state,
      country: data.country,
      subscriptionStatus: "none",
      subscriptionPlan: null,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    return true
  }, [])

  const completeOnboarding = useCallback((data: OnboardingData) => {
    setUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        role: data.role,
        company: data.company || prev.company,
        companySize: data.companySize,
        useCase: data.useCase,
        useCaseReason: data.useCaseReason,
        onboardingCompleted: true,
      }
    })
  }, [])

  const selectPlan = useCallback((plan: SubscriptionPlan, isTrial: boolean) => {
    setUser((prev) => {
      if (!prev) return prev
      const trialEndsAt = isTrial
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        : undefined
      return {
        ...prev,
        subscriptionPlan: plan,
        subscriptionStatus: isTrial ? "trial" : "active",
        trialEndsAt,
        onboardingCompleted: true,
      }
    })
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      return { ...prev, ...updates }
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        completeOnboarding,
        selectPlan,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
