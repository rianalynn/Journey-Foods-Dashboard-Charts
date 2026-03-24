"use client"

import { useState } from "react"
import { useUser, type OnboardingData, type SubscriptionPlan } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Sparkles, Info, ArrowRight } from "lucide-react"

type Step = "survey" | "plans" | "payment"

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
  { id: "ingredient-sourcing", label: "Ingredient sourcing" },
  { id: "compliance", label: "Compliance & regulatory" },
  { id: "cost-optimization", label: "Cost optimization" },
  { id: "sustainability", label: "Sustainability tracking" },
  { id: "market-research", label: "Market research" },
]

export function OnboardingSurvey() {
  const { user, completeOnboarding, selectPlan, logout } = useUser()
  const [step, setStep] = useState<Step>("survey")
  const [error, setError] = useState("")

  const [surveyData, setSurveyData] = useState<OnboardingData>({
    role: user?.role || "",
    company: user?.company || "",
    companySize: user?.companySize || "",
    useCase: user?.useCase || "team",
    reasonsForUsing: user?.reasonsForUsing || [],
  })

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(null)

  const toggleReason = (reasonId: string) => {
    setSurveyData(prev => ({
      ...prev,
      reasonsForUsing: prev.reasonsForUsing.includes(reasonId)
        ? prev.reasonsForUsing.filter(r => r !== reasonId)
        : [...prev.reasonsForUsing, reasonId]
    }))
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyData.role || !surveyData.companySize || surveyData.reasonsForUsing.length === 0) {
      setError("Please complete all required fields")
      return
    }
    setError("")
    setStep("plans")
  }

  const handlePlanSelect = (plan: SubscriptionPlan, isTrial: boolean) => {
    setSelectedPlan(plan)
    completeOnboarding(surveyData)
    selectPlan(plan, isTrial)
  }

  const handlePaymentComplete = () => {
    completeOnboarding(surveyData)
    selectPlan(selectedPlan, false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="text-lg font-semibold text-slate-800">JourneyFoods</span>
          </div>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-700">
            Logout
          </button>
        </div>
      </header>

      {step === "survey" && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Welcome to Journey Foods!</h1>
            <p className="text-slate-500">Let us know a bit about you to personalize your experience</p>
          </div>

          <form onSubmit={handleSurveySubmit} className="space-y-6">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Your Role *</Label>
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
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Company Size *</Label>
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
              <Label className="text-sm font-medium text-slate-700 mb-3 block">How will you use Journey Foods? *</Label>
              <RadioGroup value={surveyData.useCase} onValueChange={(v: "personal" | "team") => setSurveyData(prev => ({ ...prev, useCase: v }))} className="flex gap-6">
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
                What do you want to accomplish? * <span className="text-slate-400 font-normal">(select all that apply)</span>
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
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      )}

      {step === "plans" && (
        <PlanSelection onSelectPlan={handlePlanSelect} />
      )}

      {step === "payment" && (
        <MockPayment 
          plan={selectedPlan} 
          onComplete={handlePaymentComplete}
          onBack={() => setStep("plans")}
        />
      )}
    </div>
  )
}

// Plan Selection Component
function PlanSelection({ onSelectPlan }: { onSelectPlan: (plan: SubscriptionPlan, trial: boolean) => void }) {
  const plans: { id: SubscriptionPlan; name: string; price: string; period: string; description: string; features: string[]; popular?: boolean }[] = [
    { id: "supplier", name: "Supplier", price: "$60", period: "/year", description: "Market your ingredients to CPG brands", features: ["1 user", "Supplier profile", "Get discovered by buyers"] },
    { id: "fresh", name: "Fresh", price: "$199", period: "/month", description: "Get started with 1 user and 1 brand", features: ["1 user", "1 brand", "50 searches/mo"] },
    { id: "growth", name: "Growth", price: "$499", period: "/month", description: "Support growth with 2 users and 3 brands", features: ["2 users", "3 brands", "200 searches/mo"], popular: true },
    { id: "group", name: "Group", price: "$999", period: "/month", description: "Drive performance with 10 users and 10 brands", features: ["10 users", "10 brands", "500 searches/mo"] },
    { id: "enterprise", name: "Enterprise", price: "$1999", period: "/month", description: "Automate innovation with 50 users and unlimited brands", features: ["50 users", "Unlimited brands", "Unlimited searches"] },
  ]

  return (
    <div className="px-8 py-12 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl shadow-sm border px-8 py-4 mb-6">
            <h1 className="text-2xl font-semibold text-teal-500">Plans</h1>
            <p className="text-slate-600">for Every Team</p>
          </div>
        </div>

        {/* Free Trial Banner */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Start Free</h3>
              <p className="text-sm text-slate-500">No credit card required</p>
              <p className="text-sm text-slate-600 mt-1">Try Journey Foods risk-free for 14 days.</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
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
  )
}

// Mock Payment Component (reused from registration)
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
    <div className="max-w-lg mx-auto px-6 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6">
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span>Back to Plans</span>
      </button>

      <h1 className="text-2xl font-semibold text-slate-800 text-center mb-2">Complete Your Purchase</h1>
      <p className="text-slate-500 text-center mb-8">
        {plan && `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${planPrices[plan]}`}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-700">
            <strong>Demo Mode:</strong> This is a mock payment form. No real charges will be made.
          </p>
        </div>

        <div>
          <Label htmlFor="cardNumber" className="text-sm font-medium text-slate-700 mb-2 block">Card Number</Label>
          <input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expiry" className="text-sm font-medium text-slate-700 mb-2 block">Expiry</Label>
            <input
              id="expiry"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              maxLength={5}
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="cvv" className="text-sm font-medium text-slate-700 mb-2 block">CVV</Label>
            <input
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="zip" className="text-sm font-medium text-slate-700 mb-2 block">ZIP</Label>
            <input
              id="zip"
              placeholder="12345"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              maxLength={10}
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
  )
}
