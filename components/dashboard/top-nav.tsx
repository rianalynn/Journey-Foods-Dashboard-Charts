"use client"

import { useState } from "react"
import {
  Home,
  Zap,
  Leaf,
  Package,
  Box,
  ImageIcon,
  BarChart3,
  Link2,
  Search,
  Bell,
  ChevronDown,
  User,
  Check,
  LogOut,
  BookOpen,
} from "lucide-react"

export type PageType = "overview" | "generate" | "ingredients" | "products" | "suppliers" | "packaging" | "knowledge-hub"

const mainNav: Array<{ name: string; id: PageType; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
  { name: "Overview", id: "overview", icon: Home },
  { name: "Generate", id: "generate", icon: Zap },
  { name: "Ingredients", id: "ingredients", icon: Leaf, badge: "10+" },
  { name: "Products", id: "products", icon: Package },
  { name: "Suppliers", id: "suppliers", icon: Box },
  { name: "Packaging", id: "packaging", icon: ImageIcon },
]

const supportNav = [
  { name: "Analytics", icon: BarChart3 },
  { name: "Integrations", icon: Link2 },
]

interface TopNavProps {
  activePage: PageType
  onNavigate: (page: PageType) => void
  isSupplierMode: boolean
  onToggleSupplierMode: () => void
}

export function TopNav({ activePage, onNavigate, isSupplierMode, onToggleSupplierMode }: TopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Brand + Search + User row */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">J</span>
          </div>
          <span className="font-semibold text-slate-800 text-base">JourneyFoods</span>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ingredients, suppliers, and more"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Box className="h-4 w-4" />
            All brands
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Supplier Mode pill — visible when active */}
          {isSupplierMode && (
            <button
              type="button"
              onClick={onToggleSupplierMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-pink-600 bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              Supplier Mode
            </button>
          )}

          <button
            type="button"
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              10
            </span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                RL
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">Riana Lynn</p>
                <p className="text-xs text-slate-500">
                  {isSupplierMode ? "Supplier view" : "Manufacturer view"}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-2">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">Natalie</p>
                    <p className="text-xs text-slate-500">natalie@journeyfoods.io</p>
                  </div>

                  {/* Profile link */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Profile
                  </button>

                  {/* Knowledge Hub link */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      onNavigate("knowledge-hub")
                      setProfileOpen(false)
                    }}
                  >
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    Knowledge Hub
                  </button>

                  {/* Toggle supplier mode */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      onToggleSupplierMode()
                      setProfileOpen(false)
                    }}
                  >
                    {isSupplierMode ? (
                      <Check className="h-4 w-4 text-slate-700" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                    <Box className="h-4 w-4 text-slate-400" />
                    View Supplier Mode
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LogOut className="h-4 w-4 text-slate-400" />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab navigation row */}
      <nav className="flex items-center gap-1 px-6 overflow-x-auto" aria-label="Main navigation">
        {mainNav
          .filter((item) => {
            // Hide Products, Suppliers, Packaging tabs in Supplier Mode
            if (isSupplierMode && (item.id === "products" || item.id === "suppliers" || item.id === "packaging")) {
              return false
            }
            return true
          })
          .map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-slate-800 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}

        <div className="ml-auto flex items-center gap-1 pl-4 border-l border-slate-100 shrink-0">
          {supportNav.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                type="button"
                className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-slate-400 hover:text-slate-600 whitespace-nowrap transition-colors border-b-2 border-transparent"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
