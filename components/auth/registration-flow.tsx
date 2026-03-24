"use client"

import { useState } from "react"
import { useUser, type RegistrationData, type OnboardingData, type SubscriptionPlan } from "@/lib/user-context"
import { Check, Sparkles, Info, ArrowLeft, Lock, Zap } from "lucide-react"

interface RegistrationFlowProps {
  onSwitchToLogin: () => void
}

type Step = "account" | "survey" | "plans" | "payment"

const COMPANY_TYPES = [
  "Food & Beverage Manufacturer",
  "Ingredient Supplier",
  "Retailer",
  "Restaurant/Food Service",
  "Startup",
  "Research Institution",
  "Consulting",
  "Other",
]

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
]

const ROLES = [
  "Product Developer",
  "R&D Manager",
  "Supply Chain Manager",
  "Marketing",
  "Executive/Founder",
  "Food Scientist",
  "Quality Assurance",
  "Other",
]

const REASONS = [
  { id: "product-dev", label: "Product development" },
  { id: "sourcing", label: "Ingredient sourcing" },
  { id: "analytics", label: "Nutrition analytics" },
  { id: "compliance", label: "Compliance & regulations" },
  { id: "ai-recommendations", label: "AI recommendations" },
  { id: "research", label: "Research" },
  { id: "collaboration", label: "Team collaboration" },
  { id: "other", label: "Other" },
]

export function RegistrationFlow({ onSwitchToLogin }: RegistrationFlowProps) {
  const { registerUser } = useUser()
  const [step, setStep] = useState<Step>("account")
  const [accountData, setAccountData] = useState<Partial<RegistrationData>>({})
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({})
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountData.email || !accountData.password || !accountData.firstName || !accountData.lastName) {
      setError("All fields are required")
      return
    }
    if (accountData.password !== accountData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError("")
    setStep("survey")
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onboardingData.role || !onboardingData.company || !onboardingData.companySize || !onboardingData.useCase) {
      setError("All fields are required")
      return
    }
    setError("")
    setStep("plans")
  }

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    setIsLoading(true)
    try {
      await registerUser({
        ...accountData,
        firstName: accountData.firstName || "",
        lastName: accountData.lastName || "",
        email: accountData.email || "",
        password: accountData.password || "",
      } as RegistrationData, {
        ...onboardingData,
        role: onboardingData.role || "",
        company: onboardingData.company || "",
        companySize: onboardingData.companySize || "",
        useCase: onboardingData.useCase || "",
        useCaseReason: onboardingData.useCaseReason || "other",
      } as OnboardingData, selectedPlan)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ── Account Details Step ─────────────────────────────────────── */}
        {step === "account" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600 mb-6">Join JourneyFoods to transform your food operations</p>
            
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={accountData.firstName || ""}
                  onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={accountData.lastName || ""}
                  onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                value={accountData.email || ""}
                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <input
                type="password"
                placeholder="Password"
                value={accountData.password || ""}
                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={accountData.confirmPassword || ""}
                onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Next: Tell Us About You
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-teal-500 font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        )}

        {/* ── Onboarding Survey Step ─────────────────────────────────────── */}
        {step === "survey" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              type="button"
              onClick={() => setStep("account")}
              className="flex items-center gap-1 text-teal-500 mb-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Tell Us About Yourself</h1>
            <p className="text-slate-600 mb-6">Help us personalize your JourneyFoods experience</p>

            <form onSubmit={handleSurveySubmit} className="space-y-5">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">What's your role?</label>
                <select
                  value={onboardingData.role || ""}
                  onChange={(e) => setOnboardingData({ ...onboardingData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Company Type</label>
                <select
                  value={onboardingData.company || ""}
                  onChange={(e) => setOnboardingData({ ...onboardingData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select company type</option>
                  {COMPANY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Company Size</label>
                <select
                  value={onboardingData.companySize || ""}
                  onChange={(e) => setOnboardingData({ ...onboardingData, companySize: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select company size</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Use Case */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">Using JourneyFoods for...</label>
                <div className="space-y-2">
                  {["personal", "team"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="useCase"
                        value={option}
                        checked={onboardingData.useCase === option}
                        onChange={(e) => setOnboardingData({ ...onboardingData, useCase: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 capitalize">{option} use</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Next: Choose a Plan
              </button>
            </form>
          </div>
        )}

        {/* ── Plans Step ─────────────────────────────────────── */}
        {step === "plans" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              type="button"
              onClick={() => setStep("survey")}
              className="flex items-center gap-1 text-teal-500 mb-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Plan</h1>
            <p className="text-slate-600 mb-6">Start free, upgrade anytime</p>

            <div className="space-y-3 mb-6">
              {["free_trial", "growth", "enterprise"].map((planId) => {
                const plans: Record<string, { name: string; price: string; features: string[] }> = {
                  free_trial: {
                    name: "Free Trial",
                    price: "$0",
                    features: ["14-day trial", "50 searches/mo", "Basic analytics"],
                  },
                  growth: {
                    name: "Growth",
                    price: "$499/mo",
                    features: ["Unlimited searches", "Advanced analytics", "3 brands", "200 searches/mo"],
                  },
                  enterprise: {
                    name: "Enterprise",
                    price: "Custom",
                    features: ["Unlimited everything", "50+ users", "Dedicated support", "Custom integrations"],
                  },
                }

                const plan = plans[planId]
                return (
                  <button
                    key={planId}
                    onClick={() => handlePlanSelect(planId as SubscriptionPlan)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan === planId
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                      <span className="text-lg font-bold text-teal-600">{plan.price}</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-teal-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setStep("payment")}
              disabled={!selectedPlan}
              className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* ── Payment Step (Mock) ─────────────────────────────────────── */}
        {step === "payment" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              type="button"
              onClick={() => setStep("plans")}
              className="flex items-center gap-1 text-teal-500 mb-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Registration</h1>
            <p className="text-slate-600 mb-6">Set up your payment method</p>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-3">Plan: <span className="font-semibold text-slate-900">{selectedPlan}</span></p>
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
                  defaultValue="4242 4242 4242 4242"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue="12/25"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue="123"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3">Demo: Use test card 4242 4242 4242 4242</p>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Create Account"}
              </button>

              <p className="text-center text-xs text-slate-600">
                This is a demo payment form. No charges will be made.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
  { id: "ingredient-sourcing", label: "Ingredient sourcing" },
  { id: "compliance", label: "Compliance & regulatory" },
  { id: "cost-optimization", label: "Cost optimization" },
  { id: "sustainability", label: "Sustainability tracking" },
  { id: "market-research", label: "Market research" },
]

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Other"]

export function RegistrationFlow({ onSwitchToLogin }: RegistrationFlowProps) {
  const { register, completeOnboarding, selectPlan } = useUser()
  const [step, setStep] = useState<Step>("account")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Account details
  const [accountData, setAccountData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
    companyType: "",
    jobTitle: "",
    phone: "",
    city: "",
    state: "",
    country: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")

  // Survey data
  const [surveyData, setSurveyData] = useState<OnboardingData>({
    role: "",
    company: "",
    companySize: "",
    useCase: "team",
    reasonsForUsing: [],
  })

  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null)
  const [isTrial, setIsTrial] = useState(false)

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (accountData.password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (accountData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      const success = await register(accountData)
      if (success) {
        setSurveyData(prev => ({ ...prev, company: accountData.company }))
        setStep("survey")
      }
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyData.role || !surveyData.companySize || surveyData.reasonsForUsing.length === 0) {
      setError("Please complete all fields")
      return
    }
    setError("")
    setStep("plans")
  }

  const handlePlanSelect = (plan: SubscriptionPlan, trial: boolean) => {
    setSelectedPlan(plan)
    setIsTrial(trial)
    
    if (trial) {
      // Skip payment for trial
      completeOnboarding(surveyData)
      selectPlan(plan, true)
    } else {
      setStep("payment")
    }
  }

  const handlePaymentComplete = () => {
    completeOnboarding(surveyData)
    selectPlan(selectedPlan, false)
  }

  const toggleReason = (reasonId: string) => {
    setSurveyData(prev => ({
      ...prev,
      reasonsForUsing: prev.reasonsForUsing.includes(reasonId)
        ? prev.reasonsForUsing.filter(r => r !== reasonId)
        : [...prev.reasonsForUsing, reasonId]
    }))
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding (hidden on survey/plans/payment) */}
      {(step === "account") && (
        <div className="hidden lg:flex lg:w-1/2 relative bg-white overflow-hidden">
          <div className="absolute top-8 left-8 z-10">
            <div className="flex items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20" stroke="url(#gradient1)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M20 12C15.582 12 12 15.582 12 20C12 24.418 15.582 28 20 28" stroke="url(#gradient2)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="5" y1="20" x2="35" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED"/>
                    <stop offset="0.5" stopColor="#06B6D4"/>
                    <stop offset="1" stopColor="#10B981"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06B6D4"/>
                    <stop offset="1" stopColor="#10B981"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-semibold text-slate-800">JourneyFoods</span>
            </div>
          </div>

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <path d="M-100 200 Q100 300 50 500 Q0 700 200 750" stroke="url(#curveGradient1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <circle cx="150" cy="500" r="120" stroke="url(#curveGradient2)" strokeWidth="4" fill="none"/>
            <path d="M150 380 Q350 350 400 500 Q450 650 600 700" stroke="url(#curveGradient3)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <defs>
              <linearGradient id="curveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="50%" stopColor="#06B6D4"/>
                <stop offset="100%" stopColor="#06B6D4"/>
              </linearGradient>
              <linearGradient id="curveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4"/>
                <stop offset="100%" stopColor="#10B981"/>
              </linearGradient>
              <linearGradient id="curveGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4"/>
                <stop offset="100%" stopColor="#10B981"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Right side / Full width for survey and plans */}
      <div className={`flex-1 flex flex-col ${step === "account" ? "bg-slate-50" : "bg-white"}`}>
        {step === "account" && (
          <>
            <div className="flex justify-end items-center p-6">
              <span className="text-sm text-slate-500 mr-2">Already have an account?</span>
              <button onClick={onSwitchToLogin} className="text-sm text-teal-500 hover:text-teal-600 font-medium">
                Login
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-semibold text-slate-800 text-center mb-8">Create Account</h1>

                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="sr-only">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        value={accountData.firstName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        value={accountData.lastName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="sr-only">Company</Label>
                      <Input
                        id="company"
                        placeholder="Company"
                        value={accountData.company}
                        onChange={(e) => setAccountData(prev => ({ ...prev, company: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyType" className="sr-only">Company Type</Label>
                      <Select value={accountData.companyType} onValueChange={(v) => setAccountData(prev => ({ ...prev, companyType: v }))}>
                        <SelectTrigger className="h-12 bg-white border-slate-200">
                          <SelectValue placeholder="Select Company Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Phone Number"
                        value={accountData.phone}
                        onChange={(e) => setAccountData(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobTitle" className="sr-only">Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="Job Title"
                        value={accountData.jobTitle}
                        onChange={(e) => setAccountData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="sr-only">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={accountData.city}
                        onChange={(e) => setAccountData(prev => ({ ...prev, city: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="sr-only">State</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={accountData.state}
                        onChange={(e) => setAccountData(prev => ({ ...prev, state: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country" className="sr-only">Country</Label>
                      <Select value={accountData.country} onValueChange={(v) => setAccountData(prev => ({ ...prev, country: v }))}>
                        <SelectTrigger className="h-12 bg-white border-slate-200">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="email" className="sr-only">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={accountData.email}
                        onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password" className="sr-only">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={accountData.password}
                        onChange={(e) => setAccountData(prev => ({ ...prev, password: e.target.value }))}
                        className="h-12 bg-white border-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="sr-only">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 bg-white border-slate-200"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-300 hover:bg-teal-400 text-white font-medium transition-colors"
                  >
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}

        {step === "survey" && (
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <button onClick={() => setStep("account")} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Step 2 of 3</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-8 py-12">
              <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-semibold text-slate-800 text-center mb-2">Tell us about yourself</h1>
                <p className="text-slate-500 text-center mb-8">Help us personalize your experience</p>

                <form onSubmit={handleSurveySubmit} className="space-y-6">
                  {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Your Role</Label>
                      <Select value={surveyData.role} onValueChange={(v) => setSurveyData(prev => ({ ...prev, role: v }))}>
                        <SelectTrigger className="h-12 bg-white border-slate-200">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Company Size</Label>
                      <Select value={surveyData.companySize} onValueChange={(v) => setSurveyData(prev => ({ ...prev, companySize: v }))}>
                        <SelectTrigger className="h-12 bg-white border-slate-200">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">How will you use Journey Foods?</Label>
                    <RadioGroup value={surveyData.useCase} onValueChange={(v: "personal" | "team") => setSurveyData(prev => ({ ...prev, useCase: v }))} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal" className="font-normal cursor-pointer">Personal use</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="team" id="team" />
                        <Label htmlFor="team" className="font-normal cursor-pointer">Team use</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">
                      What do you want to accomplish? <span className="text-slate-400">(select all that apply)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {REASONS.map(reason => (
                        <div key={reason.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={reason.id}
                            checked={surveyData.reasonsForUsing.includes(reason.id)}
                            onCheckedChange={() => toggleReason(reason.id)}
                          />
                          <Label htmlFor={reason.id} className="font-normal cursor-pointer">{reason.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium">
                    Continue to Plans
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === "plans" && (
          <PlanSelection onSelectPlan={handlePlanSelect} onBack={() => setStep("survey")} />
        )}

        {step === "payment" && (
          <MockPayment 
            plan={selectedPlan} 
            onComplete={handlePaymentComplete}
            onBack={() => setStep("plans")}
          />
        )}
      </div>
    </div>
  )
}

// Plan Selection Component
function PlanSelection({ onSelectPlan, onBack }: { onSelectPlan: (plan: SubscriptionPlan, trial: boolean) => void; onBack: () => void }) {
  const plans: { id: SubscriptionPlan; name: string; price: string; period: string; description: string; features: string[]; popular?: boolean }[] = [
    { id: "supplier", name: "Supplier", price: "$60", period: "/year", description: "Market your ingredients to CPG brands", features: ["1 user", "Supplier profile", "Get discovered by buyers"] },
    { id: "fresh", name: "Fresh", price: "$199", period: "/month", description: "Get started with 1 user and 1 brand", features: ["1 user", "1 brand", "50 searches/mo"] },
    { id: "growth", name: "Growth", price: "$499", period: "/month", description: "Support growth with 2 users and 3 brands", features: ["2 users", "3 brands", "200 searches/mo"], popular: true },
    { id: "group", name: "Group", price: "$999", period: "/month", description: "Drive performance with 10 users and 10 brands", features: ["10 users", "10 brands", "500 searches/mo"] },
    { id: "enterprise", name: "Enterprise", price: "$1999", period: "/month", description: "Automate innovation with 50 users and unlimited brands", features: ["50 users", "Unlimited brands", "Unlimited searches"] },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6 border-b flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button className="text-slate-500 hover:text-slate-700">Logout</button>
      </div>

      <div className="flex-1 px-8 py-12 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-2xl shadow-sm px-8 py-4 mb-6">
              <h1 className="text-2xl font-semibold text-teal-500">Plans</h1>
              <p className="text-slate-600">for Every Team</p>
            </div>
          </div>

          {/* Free Trial Banner */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Start Free</h3>
                <p className="text-sm text-slate-500">No credit card required</p>
                <p className="text-sm text-slate-600 mt-1">Try Journey Foods risk-free for 14 days. Get access to core features with limited credits to explore the platform.</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="text-sm">
                <p className="font-medium text-slate-700 mb-2">Free trial includes:</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>50 ingredient searches</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>10 nutrition analyses</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>20 AI recommendations</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>3 report exports</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>500 API calls</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>14-day access</span></div>
                </div>
              </div>
            </div>
            <Button onClick={() => onSelectPlan("fresh", true)} className="bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap">
              <Sparkles className="w-4 h-4 mr-2" />
              Go To Dashboard
            </Button>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative bg-white rounded-xl border ${plan.popular ? "border-teal-400 shadow-lg" : "border-slate-200"} p-6`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-slate-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-slate-800">{plan.price}</span>
                    <span className="text-slate-500 ml-1">{plan.period}</span>
                  </div>
                </div>
                <div className={`h-1 w-16 mx-auto mb-4 rounded ${plan.popular ? "bg-teal-400" : "bg-slate-200"}`} />
                <p className="text-sm text-slate-600 text-center mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <button className="flex items-center justify-center gap-1 text-sm text-teal-500 hover:text-teal-600 w-full">
                    <Info className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <Button onClick={() => onSelectPlan(plan.id, false)} variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
                    Choose plan
                  </Button>
                  {plan.id !== "supplier" && (
                    <button onClick={() => onSelectPlan(plan.id, true)} className="flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-emerald-500 w-full">
                      <Sparkles className="w-3 h-3" />
                      <span>Start 14-day free trial</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Guava Plan */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm text-center">
              <h3 className="font-semibold text-slate-800 mb-2">Guava</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-slate-800">$1299</span>
                <span className="text-slate-500 ml-1">/month</span>
              </div>
              <div className="h-1 w-16 mx-auto my-4 bg-amber-400 rounded" />
              <p className="text-sm text-slate-600 mb-4">Guava Dashboard</p>
              <Button onClick={() => onSelectPlan("guava", false)} variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
                Choose plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock Payment Component
function MockPayment({ plan, onComplete, onBack }: { plan: SubscriptionPlan; onComplete: () => void; onBack: () => void }) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [zip, setZip] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const planPrices: Record<string, string> = {
    supplier: "$60/year",
    fresh: "$199/month",
    growth: "$499/month",
    group: "$999/month",
    enterprise: "$1999/month",
    guava: "$1299/month",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onComplete()
    }, 1500)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-semibold text-slate-800 text-center mb-2">Complete Your Purchase</h1>
          <p className="text-slate-500 text-center mb-8">
            {plan && `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${planPrices[plan]}`}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-700">
                <strong>Demo Mode:</strong> This is a mock payment form. No real charges will be made. Enter any valid-looking card details to proceed.
              </p>
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium text-slate-700 mb-2 block">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="h-12 bg-white border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiry" className="text-sm font-medium text-slate-700 mb-2 block">Expiry</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                  className="h-12 bg-white border-slate-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-sm font-medium text-slate-700 mb-2 block">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  className="h-12 bg-white border-slate-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zip" className="text-sm font-medium text-slate-700 mb-2 block">Billing ZIP</Label>
                <Input
                  id="zip"
                  placeholder="12345"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  maxLength={10}
                  className="h-12 bg-white border-slate-200"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium mt-6"
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
