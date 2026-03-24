"use client"

import { Lock, Sparkles, ArrowRight } from "lucide-react"
import { PAGE_LABELS, PAGE_DESCRIPTIONS, type PageType } from "@/lib/feature-gates"
import { useUser } from "@/lib/user-context"

interface FeatureGateOverlayProps {
  feature: PageType
  children: React.ReactNode
}

export function FeatureGateOverlay({ feature, children }: FeatureGateOverlayProps) {
  const { selectPlan } = useUser()
  
  const handleStartTrial = () => {
    selectPlan("fresh", true)
  }

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="blur-sm opacity-50 pointer-events-none scale-[1.02]">
          {children}
        </div>
      </div>

      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Unlock {PAGE_LABELS[feature]}
          </h2>

          <p className="text-slate-500 mb-6">
            {PAGE_DESCRIPTIONS[feature]}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-slate-700 mb-2">Upgrade to access:</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Full access to {PAGE_LABELS[feature]}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Unlimited features
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Priority support
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleStartTrial}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Now
            </button>
            <button 
              className="w-full h-12 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => window.location.href = '/account'}
            >
              View Plans
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Upgrade to continue using this feature
          </p>
        </div>
      </div>
    </div>
  )
}

interface GatedContentProps {
  feature: PageType
  isLocked: boolean
  children: React.ReactNode
}

export function GatedContent({ feature, isLocked, children }: GatedContentProps) {
  if (isLocked) {
    return <FeatureGateOverlay feature={feature}>{children}</FeatureGateOverlay>
  }
  return <>{children}</>
}
