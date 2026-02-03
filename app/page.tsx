"use client"

import React from "react"

import { useState, useMemo } from "react"
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
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Truck,
  Clock,
  X,
  Lightbulb,
  Sparkles,
} from "lucide-react"

type PageType = "ingredients" | "products" | "suppliers"
type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y"
type AlertType = "supply" | "score" | "price" | "delivery"
type AlertSeverity = "critical" | "warning" | "info"

interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  ingredient: string
  timestamp: string
  change?: { from: number | string; to: number | string; unit?: string }
}

const navigation = [
  { name: "Overview", icon: Home },
  { name: "Generate", icon: Zap },
  { name: "Ingredients", icon: Leaf, badge: "10+" },
  { name: "Products", icon: Package },
  { name: "Suppliers", icon: Box },
  { name: "Packaging", icon: ImageIcon },
]

const supportNav = [
  { name: "Analytics", icon: BarChart3 },
  { name: "Integrations", icon: Link2 },
]

const timeRanges: Array<{ key: TimeRange; label: string }> = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "1y", label: "1Y" },
]

const filterOptions: Array<{ key: AlertType | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "supply", label: "Supply" },
  { key: "price", label: "Price" },
  { key: "score", label: "Score" },
]

const ingredientAlerts: Alert[] = [
  { id: "1", type: "supply", severity: "critical", title: "Supply Shortage", description: "Supplier reports 3-week delay due to shipping constraints", ingredient: "Organic Blueberry Powder", timestamp: "2 hours ago" },
  { id: "2", type: "price", severity: "warning", title: "Price Increase", description: "Market price increased by 15% this month", ingredient: "Madagascar Vanilla Extract", timestamp: "5 hours ago", change: { from: 42.5, to: 48.9, unit: "/kg" } },
  { id: "3", type: "score", severity: "warning", title: "Quality Score Drop", description: "Sustainability score decreased after supplier audit", ingredient: "Palm Oil (RSPO)", timestamp: "1 day ago", change: { from: 85, to: 72, unit: "/100" } },
  { id: "4", type: "price", severity: "info", title: "Price Decrease", description: "Bulk pricing now available from new supplier", ingredient: "Oat Flour", timestamp: "2 days ago", change: { from: 3.2, to: 2.85, unit: "/kg" } },
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateTrendData(baseValue: number, count: number, seed: number = 0) {
  const data: Array<{ value: number }> = []
  for (let i = 0; i < count; i++) {
    const random = seededRandom(seed + i + baseValue)
    data.push({ value: Math.floor(baseValue + (random - 0.3) * baseValue * 0.2) })
  }
  return data
}

function SparklineChart({ data, color, id }: { data: Array<{ value: number }>; color: string; id: string }) {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return null
    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * 100
      const y = 100 - 2 - ((val - min) / range) * 96
      return `${x},${y}`
    })
    return { line: `M ${points.join(" L ")}`, area: `M ${points.join(" L ")} L 100,100 L 0,100 Z` }
  }, [data])

  if (!pathData) return null

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={pathData.area} fill={`url(#${id})`} />
      <path d={pathData.line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function StatCard({ title, value, subtitle, trend, icon, gradientFrom, gradientTo, chartColor }: {
  title: string
  value: number
  subtitle: string
  trend: { value: number; isPositive: boolean }
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  chartColor: string
}) {
  const [range, setRange] = useState<TimeRange>("7d")
  const data = useMemo(() => {
    const count = range === "7d" ? 7 : range === "30d" ? 30 : 12
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return generateTrendData(value, count, seed)
  }, [value, range, title])

  return (
    <div
      className="relative overflow-hidden rounded-xl p-4 min-h-[160px] flex flex-col shadow-lg hover:shadow-xl transition-shadow"
      style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="shrink-0 text-white">{icon}</div>
          <h3 className="text-xs font-medium truncate text-white/70">{title}</h3>
          <Info className="h-3 w-3 shrink-0 text-white/70" />
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {timeRanges.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`px-1.5 py-0.5 text-[10px] font-medium rounded text-white transition-colors ${
                range === r.key ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-white">{value.toLocaleString()}</span>
        <div
          className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            trend.isPositive ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"
          }`}
        >
          {trend.isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
          <span>{trend.value}%</span>
        </div>
      </div>
      <p className="text-[10px] text-white/70">{subtitle}</p>
      <div className="flex-1 mt-2 -mx-4 -mb-4 min-h-[60px]">
        <SparklineChart data={data} color={chartColor} id={`chart-${title.replace(/\s/g, "")}-${range}`} />
      </div>
    </div>
  )
}

function ActionCard({ title, icon, actions, completed, total }: {
  title: string
  icon: React.ReactNode
  actions: Array<{ id: string; label: string; count: number; priority: string }>
  completed: number
  total: number
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const getPriorityStyle = (p: string, count: number) => {
    if (count === 0) return "bg-slate-50/50 text-slate-400 border-slate-100"
    if (p === "high") return "bg-red-50 text-red-700 border-red-200"
    if (p === "medium") return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-blue-50 text-blue-700 border-blue-200"
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
          {completed}/{total}
        </span>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="space-y-3">
        {actions.map((a) => (
          <div key={a.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${getPriorityStyle(a.priority, a.count)}`}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${a.count > 0 ? "bg-white/80 shadow-sm" : "bg-slate-100 text-slate-400"}`}>
                {a.count}
              </div>
              <span className="text-sm font-medium">{a.label}</span>
            </div>
            <button
              type="button"
              className={`flex items-center text-xs font-medium px-2 py-1 rounded hover:bg-black/5 transition-colors ${a.count === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={a.count === 0}
            >
              View all
              <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        ))}
      </div>
      {actions.every((a) => a.count === 0) && (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-500">No pending actions</p>
        </div>
      )}
    </div>
  )
}

function AlertsCard({ title, alerts: initialAlerts }: { title: string; alerts: Alert[] }) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState<AlertType | "all">("all")

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter)
  const criticalCount = alerts.filter((a) => a.severity === "critical").length
  const warningCount = alerts.filter((a) => a.severity === "warning").length

  const getSeverityStyle = (s: AlertSeverity) => {
    if (s === "critical") return { bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100", text: "text-red-700", badge: "bg-red-500 text-white" }
    if (s === "warning") return { bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", text: "text-amber-700", badge: "bg-amber-500 text-white" }
    return { bg: "bg-blue-50", border: "border-blue-200", iconBg: "bg-blue-100", text: "text-blue-700", badge: "bg-blue-500 text-white" }
  }

  const getTypeIcon = (t: AlertType) => {
    if (t === "supply") return <Truck className="h-3.5 w-3.5" />
    if (t === "price") return <DollarSign className="h-3.5 w-3.5" />
    if (t === "score") return <TrendingDown className="h-3.5 w-3.5" />
    return <Clock className="h-3.5 w-3.5" />
  }

  const getTypeLabel = (t: AlertType) => {
    if (t === "supply") return "Supply Chain"
    if (t === "price") return "Price Change"
    if (t === "score") return "Score Change"
    return "Delivery"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {criticalCount > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {warningCount} warning
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {filterOptions.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setFilter(o.key)}
              className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                filter === o.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[240px]">
        {filtered.length > 0 ? (
          filtered.map((alert) => {
            const style = getSeverityStyle(alert.severity)
            const isNeg =
              (alert.type === "price" && Number(alert.change?.to) > Number(alert.change?.from)) ||
              (alert.type === "score" && Number(alert.change?.to) < Number(alert.change?.from))
            return (
              <div key={alert.id} className={`relative p-3 rounded-lg border transition-shadow hover:shadow-sm ${style.bg} ${style.border}`}>
                <button
                  type="button"
                  onClick={() => setAlerts((p) => p.filter((a) => a.id !== alert.id))}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-3 w-3 text-slate-400" />
                </button>
                <div className="flex items-start gap-3 pr-6">
                  <div className={`p-1.5 rounded-lg ${style.iconBg} ${style.text}`}>{getTypeIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${style.badge}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500">{getTypeLabel(alert.type)}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 truncate">{alert.ingredient}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{alert.description}</p>
                    {alert.change && (
                      <div className="flex items-center gap-2 mt-2 text-[10px]">
                        <span className="text-slate-500">
                          From: <span className="font-medium text-slate-700">{alert.change.from}{alert.change.unit}</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-500">
                          To: <span className={`font-medium ${isNeg ? "text-red-600" : "text-green-600"}`}>{alert.change.to}{alert.change.unit}</span>
                        </span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1.5">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-green-100 rounded-full mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">All clear!</p>
            <p className="text-xs text-slate-500 mt-1">No alerts in this category</p>
          </div>
        )}
      </div>
      {alerts.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
          <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all alerts
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<PageType>("ingredients")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-semibold text-slate-800 text-lg">JourneyFoods</span>
          </div>
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ingredients, suppliers, and more"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Box className="h-4 w-4" />
              All brands
              <ChevronDown className="h-3 w-3" />
            </button>
            <button type="button" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">8</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-medium">RL</div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700">Riana Lynn</p>
                <p className="text-xs text-slate-500">Manufacturer view</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-65px)] sticky top-[65px]">
          <nav className="p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Menu</p>
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = item.name.toLowerCase() === activePage
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => {
                        if (["ingredients", "products", "suppliers"].includes(item.name.toLowerCase())) {
                          setActivePage(item.name.toLowerCase() as PageType)
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                      {item.badge && (
                        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isActive ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-600"}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-slate-200 mt-4 pt-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Support</p>
              <ul className="space-y-1">
                {supportNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {activePage === "ingredients" && (
              <>
                <ActionCard
                  title="Ingredient Actions"
                  icon={<Bell className="h-4 w-4" />}
                  completed={8}
                  total={10}
                  actions={[
                    { id: "n", label: "Notifications Pending", count: 0, priority: "medium" },
                    { id: "a", label: "Actions Pending", count: 0, priority: "high" },
                  ]}
                />
                <StatCard
                  title="Active Product Ingredients"
                  value={92}
                  subtitle="Across all products"
                  trend={{ value: 12, isPositive: true }}
                  icon={<Leaf className="h-4 w-4" />}
                  gradientFrom="#1e40af"
                  gradientTo="#3b82f6"
                  chartColor="#ffffff"
                />
                <AlertsCard title="Ingredient Alerts" alerts={ingredientAlerts} />
              </>
            )}
            {activePage === "products" && (
              <>
                <ActionCard
                  title="Product Actions"
                  icon={<Bell className="h-4 w-4" />}
                  completed={4}
                  total={10}
                  actions={[
                    { id: "n", label: "Notifications Pending", count: 6, priority: "medium" },
                    { id: "a", label: "Actions Pending", count: 0, priority: "high" },
                  ]}
                />
                <StatCard
                  title="Active Products"
                  value={488009}
                  subtitle="In your catalog"
                  trend={{ value: 2.4, isPositive: true }}
                  icon={<Package className="h-4 w-4" />}
                  gradientFrom="#1e40af"
                  gradientTo="#3b82f6"
                  chartColor="#ffffff"
                />
                <StatCard
                  title="Concept Products"
                  value={172}
                  subtitle="In development"
                  trend={{ value: 8, isPositive: true }}
                  icon={<Lightbulb className="h-4 w-4" />}
                  gradientFrom="#d97706"
                  gradientTo="#f59e0b"
                  chartColor="#fef3c7"
                />
              </>
            )}
            {activePage === "suppliers" && (
              <>
                <ActionCard
                  title="Supplier Actions"
                  icon={<Bell className="h-4 w-4" />}
                  completed={7}
                  total={10}
                  actions={[
                    { id: "r", label: "Reviews Pending", count: 3, priority: "medium" },
                    { id: "u", label: "Profile Updates", count: 2, priority: "low" },
                  ]}
                />
                <StatCard
                  title="Total Suppliers"
                  value={42}
                  subtitle="In your network"
                  trend={{ value: 5, isPositive: true }}
                  icon={<Box className="h-4 w-4" />}
                  gradientFrom="#1e40af"
                  gradientTo="#3b82f6"
                  chartColor="#ffffff"
                />
                <StatCard
                  title="Active Partnerships"
                  value={28}
                  subtitle="Currently engaged"
                  trend={{ value: 3, isPositive: true }}
                  icon={<Sparkles className="h-4 w-4" />}
                  gradientFrom="#059669"
                  gradientTo="#10b981"
                  chartColor="#ffffff"
                />
              </>
            )}
          </div>

          {/* Recently Viewed */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recently Viewed</h2>
            <div className="relative flex gap-4 overflow-x-auto pb-2">
              <button type="button" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
              {["#1 Fine Dark Chocolate", "Freeze Dried Blueberry", "Blueberry Powder", "Filets De Salmon"].map((name, i) => (
                <div key={i} className="flex-shrink-0 w-40 group cursor-pointer">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                    <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-slate-400" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-700 truncate text-center">{name}</p>
                </div>
              ))}
              <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Quick Tip</h3>
                <p className="text-sm text-slate-600">
                  {activePage === "ingredients" && "Monitor ingredient alerts for supply chain issues, price changes, and quality score updates. Set up notifications to stay ahead of potential disruptions."}
                  {activePage === "products" && "Use concept products to experiment with formulations before moving them to production. Track ingredient costs and nutritional data in real-time."}
                  {activePage === "suppliers" && "Keep your supplier profiles updated to ensure accurate pricing and lead time estimates. Rate suppliers after each order to build your quality database."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
