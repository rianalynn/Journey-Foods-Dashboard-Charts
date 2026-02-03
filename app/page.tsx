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
  LayoutGrid,
  List,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Users,
  Send,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react"

type PageType = "overview" | "ingredients" | "products" | "suppliers"
type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y"
type AlertType = "supply" | "score" | "price" | "delivery"
type AlertSeverity = "critical" | "warning" | "info"
type ViewMode = "grid" | "list"

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

interface Supplier {
  id: string
  name: string
  location: string
  score: number
  status: "Pending" | "Active" | "Inactive"
  lastUpdated: string
  ingredients: string[]
  phone: string | null
  email: string
  website: string | null
  certifications: string[]
  description: string
}

const suppliersData: Supplier[] = [
  { id: "1", name: "Journey Foods Test", location: "Unknown Location", score: 72.73, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Blueberry", "Papaya", "hibiscus flow", "Mango", "Acai", "Spirulina", "Chlorella", "Matcha"], phone: null, email: "contact@journeyfoods.com", website: "journeyfoods.com", certifications: ["USDA Organic", "Non-GMO"], description: "A leading supplier of organic superfoods and functional ingredients." },
  { id: "2", name: "check12345", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: [], phone: null, email: "check@example.com", website: null, certifications: [], description: "New supplier pending verification." },
  { id: "3", name: "abhi34", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: [], phone: null, email: "abhi@example.com", website: null, certifications: [], description: "New supplier pending verification." },
  { id: "4", name: "LinkOne Ingredient Solutions", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Oils", "Eggs", "Nuts", "Seeds", "Dairy", "Proteins", "Flavors", "Colors", "Preservatives", "Emulsifiers", "Stabilizers"], phone: "+1 417-236-9602", email: "info@linkone.com", website: "linkone.com", certifications: ["FDA Approved", "GFSI"], description: "Comprehensive ingredient solutions for food manufacturers." },
  { id: "5", name: "Pharmore Ingredients Inc", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Chondroitin Sulfate Sodium", "Glucosamine HCl", "Glucosamine Sulfate 2KCl", "MSM", "Collagen", "Hyaluronic Acid"], phone: "+1 801-446-8188", email: "sales@pharmore.com", website: "pharmore.com", certifications: ["GMP Certified", "NSF"], description: "Specialty ingredients for nutraceuticals and dietary supplements." },
  { id: "6", name: "HPS Food & Ingredients Inc.", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Hulled Hempseeds", "Roasted Whole Hempseed", "Cold Pressed Hempseed Oil", "Hemp Protein Powder", "Hemp Flour", "Hemp Hearts"], phone: "+1 844-436-7477", email: "info@hpsfoods.com", website: "hpsfoods.com", certifications: ["Organic", "Kosher", "Halal"], description: "Premium hemp-based ingredients for food and beverage applications." },
  { id: "7", name: "SIGNO Food Ingredients", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Amino Acids", "Nucleotides for Infant Formula", "Phosphates", "Vitamins", "Minerals"], phone: "+1 832-406-7165", email: "contact@signofoods.com", website: "signofoods.com", certifications: ["ISO 22000", "FSSC 22000"], description: "Specialized ingredients for infant nutrition and functional foods." },
  { id: "8", name: "Del-Val Food Ingredients", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Clean Label Initiatives", "Taste Indulgence", "Health/Wellness Promotion", "Texture Enhancement", "Shelf Life Extension"], phone: "+1 856-778-6623", email: "sales@delval.com", website: "delval.com", certifications: ["SQF Certified", "Kosher"], description: "Innovative ingredient solutions for clean label products." },
  { id: "9", name: "Tisdale Food Ingredients", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Sweeteners", "Starches", "Fibers"], phone: null, email: "info@tisdale.com", website: "tisdale.com", certifications: ["BRC Certified"], description: "Quality ingredients for bakery and confectionery applications." },
  { id: "10", name: "Ingredients Corporation of America", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Flavorings", "Seasonings", "Spice Blends"], phone: null, email: "contact@icafoods.com", website: "icafoods.com", certifications: ["FDA Registered"], description: "Custom flavor and seasoning solutions." },
  { id: "11", name: "Alexandra Foods", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Dried Fruits", "Nuts", "Seeds"], phone: null, email: "info@alexandrafoods.com", website: "alexandrafoods.com", certifications: ["Organic", "Fair Trade"], description: "Premium dried fruits and nuts from sustainable sources." },
  { id: "12", name: "Nexcel Natural Ingredients", location: "Unknown Location", score: 90, status: "Pending", lastUpdated: "Invalid Date", ingredients: ["Plant Extracts", "Botanicals", "Essential Oils"], phone: null, email: "sales@nexcel.com", website: "nexcel.com", certifications: ["USDA Organic", "Non-GMO Project Verified"], description: "Natural and organic plant-based ingredients." },
]

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

function SupplierCard({ supplier, onConnect, viewMode }: { supplier: Supplier; onConnect: (supplier: Supplier) => void; viewMode: ViewMode }) {
  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    return `https://wa.me/${cleaned}`
  }

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
          <Box className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 truncate">{supplier.name}</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">{supplier.status}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="h-3 w-3" />
            {supplier.location}
          </div>
        </div>
        <div className="text-sm text-slate-600">Score: {supplier.score}/100</div>
        <div className="flex items-center gap-2">
          {supplier.phone && (
            <a
              href={formatWhatsAppLink(supplier.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
            >
              <Phone className="h-3 w-3" />
              WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => onConnect(supplier)}
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
          <Box className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 leading-tight">{supplier.name}</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 shrink-0">{supplier.status}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin className="h-3 w-3" />
            {supplier.location}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm">
          <span className="text-slate-600">Score: </span>
          <span className="font-semibold text-slate-800">{supplier.score}/100</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          Last updated: {supplier.lastUpdated}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1.5">Ingredients:</p>
        {supplier.ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {supplier.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {ing}
              </span>
            ))}
            {supplier.ingredients.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                +{supplier.ingredients.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400">N/A</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {supplier.phone ? (
          <a
            href={formatWhatsAppLink(supplier.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{supplier.phone}</span>
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Phone className="h-3.5 w-3.5" />
            N/A
          </span>
        )}
        <button
          type="button"
          onClick={() => onConnect(supplier)}
          className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Connect
        </button>
      </div>
    </div>
  )
}

function SupplierDetailModal({ supplier, onClose, onSendEmail }: { supplier: Supplier; onClose: () => void; onSendEmail: (supplier: Supplier) => void }) {
  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    return `https://wa.me/${cleaned}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Box className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800">{supplier.name}</h2>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">{supplier.status}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  {supplier.location}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Quality Score</p>
              <p className="text-2xl font-bold text-slate-800">{supplier.score}/100</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-slate-800">{supplier.lastUpdated}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">About</h3>
            <p className="text-sm text-slate-600">{supplier.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Ingredients Supplied</h3>
            {supplier.ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.ingredients.map((ing, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {ing}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No ingredients listed</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Certifications</h3>
            {supplier.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full border border-green-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No certifications listed</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{supplier.email}</span>
              </div>
              {supplier.phone && (
                <a
                  href={formatWhatsAppLink(supplier.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">{supplier.phone}</span>
                  <span className="ml-auto text-xs font-medium text-green-600">Open WhatsApp</span>
                </a>
              )}
              {supplier.website && (
                <a
                  href={`https://${supplier.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-blue-600">{supplier.website}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={() => onSendEmail(supplier)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Outreach Email
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

interface EmailTracking {
  id: string
  supplierName: string
  sentAt: string
  opened: boolean
  openedAt: string | null
  clicked: boolean
  replied: boolean
}

function EmailOutreachModal({ supplier, onClose, onSend }: { supplier: Supplier; onClose: () => void; onSend: (supplier: Supplier, subject: string, body: string) => void }) {
  const [subject, setSubject] = useState(`Partnership Inquiry - JourneyFoods`)
  const [body, setBody] = useState(
    `Hi ${supplier.name} Team,\n\nI hope this message finds you well. My name is Riana Lynn from JourneyFoods, and I'm reaching out because we're impressed with your ingredient offerings.\n\nWe're currently looking for suppliers who can provide high-quality ingredients for our food manufacturing partners. Based on your profile, we believe there could be a great opportunity for collaboration.\n\nWould you be interested in setting up a call to discuss potential partnership opportunities?\n\nAdditionally, we'd love to invite you to create a supplier profile on our platform, which will help streamline communication and enable us to better match your products with our clients' needs.\n\nLooking forward to hearing from you.\n\nBest regards,\nRiana Lynn\nJourneyFoods`
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Send Outreach Email</h2>
                <p className="text-sm text-slate-500">To: {supplier.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Email Tracking Enabled</h3>
                <p className="text-xs text-slate-600 mt-1">
                  You'll be notified when the recipient opens this email. The email includes an invitation for the supplier to sign up for a profile on JourneyFoods.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={() => onSend(supplier, subject, body)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Email
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function EmailTrackingPanel({ emails }: { emails: EmailTracking[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-slate-600" />
        <h3 className="font-semibold text-slate-800">Email Outreach Tracking</h3>
      </div>
      {emails.length > 0 ? (
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-slate-800">{email.supplierName}</span>
                <span className="text-xs text-slate-500">{email.sentAt}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {email.opened ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-300" />
                  )}
                  <span className={`text-xs ${email.opened ? "text-green-600" : "text-slate-400"}`}>
                    {email.opened ? `Opened ${email.openedAt}` : "Not opened"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {email.clicked ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-300" />
                  )}
                  <span className={`text-xs ${email.clicked ? "text-green-600" : "text-slate-400"}`}>
                    {email.clicked ? "Clicked link" : "No clicks"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {email.replied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-300" />
                  )}
                  <span className={`text-xs ${email.replied ? "text-green-600" : "text-slate-400"}`}>
                    {email.replied ? "Replied" : "No reply"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Mail className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No emails sent yet</p>
          <p className="text-xs text-slate-400 mt-1">Connect with suppliers to start outreach</p>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<PageType>("suppliers")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTracking, setEmailTracking] = useState<EmailTracking[]>([])

  const handleConnectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
  }

  const handleSendEmail = (supplier: Supplier) => {
    setShowEmailModal(true)
  }

  const handleEmailSent = (supplier: Supplier, subject: string, body: string) => {
    const newTracking: EmailTracking = {
      id: `email-${Date.now()}`,
      supplierName: supplier.name,
      sentAt: new Date().toLocaleString(),
      opened: false,
      openedAt: null,
      clicked: false,
      replied: false,
    }
    setEmailTracking((prev) => [newTracking, ...prev])
    setShowEmailModal(false)
    setSelectedSupplier(null)
  }

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
                        if (["overview", "ingredients", "products", "suppliers"].includes(item.name.toLowerCase())) {
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
          {/* Stats Grid - Only show for non-supplier pages */}
          {activePage !== "suppliers" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {(activePage === "ingredients" || activePage === "overview") && (
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
          </div>
          )}

          {/* Suppliers Page Content */}
          {activePage === "suppliers" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Supplier List</h1>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suppliersData.map((supplier) => (
                        <SupplierCard key={supplier.id} supplier={supplier} onConnect={handleConnectSupplier} viewMode={viewMode} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suppliersData.map((supplier) => (
                        <SupplierCard key={supplier.id} supplier={supplier} onConnect={handleConnectSupplier} viewMode={viewMode} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="lg:col-span-1">
                  <EmailTrackingPanel emails={emailTracking} />
                </div>
              </div>
            </>
          )}

          {/* Non-Suppliers Content */}
          {activePage !== "suppliers" && (
            <>
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
                      {activePage === "overview" && "Welcome to JourneyFoods! Use the navigation menu to explore ingredients, products, and suppliers in your network."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && !showEmailModal && (
        <SupplierDetailModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onSendEmail={handleSendEmail}
        />
      )}

      {/* Email Outreach Modal */}
      {showEmailModal && selectedSupplier && (
        <EmailOutreachModal
          supplier={selectedSupplier}
          onClose={() => {
            setShowEmailModal(false)
            setSelectedSupplier(null)
          }}
          onSend={handleEmailSent}
        />
      )}
    </div>
  )
}
