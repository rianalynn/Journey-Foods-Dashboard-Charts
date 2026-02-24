"use client"

import React from "react"
import IntegrationsPage from "@/components/integrations/integrations-page"
import AgentActivityDrawer, { type AgentTimelineEvent } from "@/components/suppliers/agent-activity-drawer"

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
  Star,
  SlidersHorizontal,
  Filter,
  Plus,
  ShoppingCart,
  Heart,
  ArrowRight,
  Lock,
  Settings,
  Palette,
  Droplets,
  BoxIcon,
  Activity,
} from "lucide-react"

type PageType = "overview" | "ingredients" | "products" | "suppliers" | "integrations"
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
  { name: "Overview", icon: Home, locked: false },
  { name: "Generate", icon: Zap, locked: false },
  { name: "Ingredients", icon: Leaf, badge: "10+", locked: false },
  { name: "Products", icon: Package, locked: false },
  { name: "Suppliers", icon: Box, locked: false },
  { name: "Packaging", icon: ImageIcon, locked: true },
  { name: "Cosmetics", icon: Palette, locked: true },
  { name: "Guava", icon: Droplets, locked: true },
  ]
  
 const supportNav = [
  { name: "Analytics", icon: BarChart3, locked: true },
  { name: "Integrations", icon: Link2, locked: false },
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

const seedAgentTimeline: Record<string, AgentTimelineEvent[]> = {
  "1": [
    {
      id: "evt-1",
      type: "ingredient_need",
      timestamp: "Jan 15, 10:23 AM",
      title: "Ingredient need detected: Blueberry Powder",
      description: "Agent identified a gap in the product formulation for organic blueberry powder based on current product pipeline requirements.",
      metadata: { ingredient: "Blueberry Powder" },
      status: "completed",
    },
    {
      id: "evt-2",
      type: "ingredient_need",
      timestamp: "Jan 15, 10:24 AM",
      title: "Ingredient need detected: Spirulina",
      description: "Superfood blend requires high-quality spirulina source. Current supplier coverage is insufficient.",
      metadata: { ingredient: "Spirulina" },
      status: "completed",
    },
    {
      id: "evt-3",
      type: "supplier_match",
      timestamp: "Jan 15, 11:05 AM",
      title: "Matched Journey Foods Test for Blueberry Powder",
      description: "Agent matched this supplier based on ingredient catalog, certifications (USDA Organic, Non-GMO), and compatibility score.",
      metadata: { ingredient: "Blueberry Powder", score: 72.73 },
      status: "completed",
    },
    {
      id: "evt-4",
      type: "email_sent",
      timestamp: "Jan 16, 9:00 AM",
      title: "Outreach email sent",
      description: "Partnership inquiry email sent to contact@journeyfoods.com with platform invitation link.",
      metadata: { emailSubject: "Partnership Inquiry - JourneyFoods" },
      status: "completed",
    },
    {
      id: "evt-5",
      type: "email_opened",
      timestamp: "Jan 16, 2:34 PM",
      title: "Email opened by recipient",
      description: "The outreach email was opened. Recipient viewed the message and platform invitation details.",
      status: "completed",
    },
    {
      id: "evt-6",
      type: "email_clicked",
      timestamp: "Jan 16, 2:41 PM",
      title: "Platform invitation link clicked",
      description: "Recipient clicked the supplier profile signup link in the email.",
      status: "completed",
    },
    {
      id: "evt-7",
      type: "follow_up_scheduled",
      timestamp: "Jan 17, 9:00 AM",
      title: "Automated follow-up scheduled",
      description: "A 48-hour follow-up has been scheduled to check on supplier response and platform signup status.",
      status: "completed",
    },
    {
      id: "evt-8",
      type: "quote_requested",
      timestamp: "Jan 18, 10:15 AM",
      title: "Quote requested for Blueberry Powder",
      description: "RFQ sent for organic blueberry powder -- 500kg initial order with monthly recurring needs.",
      metadata: { ingredient: "Blueberry Powder", moq: "500 kg" },
      status: "active",
    },
    {
      id: "evt-9",
      type: "platform_invite",
      timestamp: "Jan 18, 10:16 AM",
      title: "Supplier invited to JourneyFoods platform",
      description: "Platform invitation sent to create a full supplier profile for streamlined ordering and communication.",
      status: "active",
    },
    {
      id: "evt-10",
      type: "follow_up_sent",
      timestamp: "Jan 20, 9:00 AM",
      title: "Follow-up email sent",
      description: "Automated follow-up sent regarding the pending quote request and platform profile creation.",
      metadata: { emailSubject: "Following up - Blueberry Powder Quote & Platform Profile" },
      status: "completed",
    },
    {
      id: "evt-11",
      type: "quote_received",
      timestamp: "Jan 22, 3:45 PM",
      title: "Quote received for Blueberry Powder",
      description: "Supplier responded with pricing for organic blueberry powder. Competitive rates with flexible MOQ.",
      metadata: { ingredient: "Blueberry Powder", quoteAmount: "$28.50/kg", moq: "250 kg", leadTime: "2-3 weeks" },
      status: "completed",
    },
    {
      id: "evt-12",
      type: "connection_established",
      timestamp: "Pending",
      title: "Awaiting full platform connection",
      description: "Supplier has engaged via email but has not yet completed their platform profile. Monitoring for signup.",
      status: "pending",
    },
  ],
}

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

// --- Ingredients & Products Data ---
interface Ingredient {
  id: string
  name: string
  starred: boolean
  manufacturer: string
  pricePerUnit: string | null
  roi: string
  country: string
}

const ingredientsListData: Ingredient[] = [
  { id: "1", name: "#1 Fine Dark Brown Bulgur Wheat Test", starred: true, manufacturer: "General", pricePerUnit: "$0.98", roi: "Coming Soon", country: "US" },
  { id: "2", name: "#1 Fine Organic Bulgur Wheat", starred: false, manufacturer: "General", pricePerUnit: null, roi: "Coming Soon", country: "US" },
  { id: "3", name: "#1 Fine Organic Farro Bulgur Wheat", starred: true, manufacturer: "General", pricePerUnit: "$1.35", roi: "Coming Soon", country: "US" },
  { id: "4", name: "#1 Fine Organic Freekeh Bulgur Wheat", starred: false, manufacturer: "General", pricePerUnit: "$1.25", roi: "Coming Soon", country: "US" },
  { id: "5", name: "#1 Fine Organic Kamut Khorasan Bulgur Wheat", starred: false, manufacturer: "General", pricePerUnit: null, roi: "Coming Soon", country: "US" },
  { id: "6", name: "#1 Fine Traditional Bulgur Wheat", starred: false, manufacturer: "General", pricePerUnit: null, roi: "Coming Soon", country: "US" },
  { id: "7", name: "#1 Liquid Sucrose -67.5%", starred: false, manufacturer: "General", pricePerUnit: null, roi: "Coming Soon", country: "US" },
  { id: "8", name: "#2 Medium Traditional Bulgur Wheat", starred: false, manufacturer: "General", pricePerUnit: null, roi: "Coming Soon", country: "US" },
]

interface Product {
  id: string
  name: string
  brand: string
  type: string
  flavor: string
  version: string
  country: string
  status: "RETAIL" | "CONCEPT"
  score: string
}

const productsListData: Product[] = [
  { id: "1", name: "Long Grain White Rice - Giant Eagle", brand: "Giant Eagle", type: "-", flavor: "-", version: "v1", country: "US", status: "RETAIL", score: "50%" },
  { id: "2", name: "Ice cream, denali original churned moose tracks - Giant Eagle", brand: "Giant Eagle", type: "-", flavor: "-", version: "v1", country: "US", status: "RETAIL", score: "50%" },
  { id: "3", name: "Sauce, whole berry cranberry - Giant Eagle", brand: "Giant Eagle", type: "-", flavor: "-", version: "v1", country: "US", status: "RETAIL", score: "50%" },
  { id: "4", name: "Jellied sauce, cranberry - Giant Eagle", brand: "Giant Eagle", type: "-", flavor: "-", version: "v1", country: "US", status: "RETAIL", score: "50%" },
  { id: "5", name: "Biscuits, buttermilk - Giant Eagle", brand: "Giant Eagle", type: "-", flavor: "-", version: "v1", country: "US", status: "RETAIL", score: "50%" },
  { id: "6", name: "Organic Protein Brownie Mix", brand: "JourneyFoods", type: "Snack", flavor: "Chocolate", version: "v2", country: "US", status: "CONCEPT", score: "78%" },
  { id: "7", name: "Plant-Based Cheese Alternative", brand: "JourneyFoods", type: "Dairy Alt", flavor: "Cheddar", version: "v1", country: "US", status: "CONCEPT", score: "65%" },
]

type ProductTab = "retail" | "concept" | "latest" | "journey-ai"

function FeatureGateModal({ feature, onClose }: { feature: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{feature} is a Premium Feature</h2>
          <p className="text-sm text-slate-500 mb-6">
            Upgrade your subscription to unlock {feature} and get access to advanced analytics, expanded categories, and more powerful tools for your business.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">What you get with Premium:</h3>
            <ul className="space-y-2">
              {[
                "Full access to " + feature,
                "Advanced analytics and reporting",
                "Priority supplier matching",
                "Custom ingredient recommendations",
                "Dedicated support",
              ].map((perk, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Maybe Later
            </button>
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreferencesModal({ onClose }: { onClose: () => void }) {
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(["Plant-Based"])
  const [allergens, setAllergens] = useState<string[]>(["Gluten-Free"])
  const [categories, setCategories] = useState<string[]>(["Functional Foods"])
  const [certPref, setCertPref] = useState<string[]>(["USDA Organic"])
  const [priceRange, setPriceRange] = useState("mid")
  const [saved, setSaved] = useState(false)

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => onClose(), 1200)
  }

  const dietaryOptions = ["Plant-Based", "Vegan", "Vegetarian", "Keto", "Paleo", "Low Sugar", "High Protein", "Whole30"]
  const allergenOptions = ["Gluten-Free", "Dairy-Free", "Nut-Free", "Soy-Free", "Egg-Free", "Shellfish-Free", "Sesame-Free", "Corn-Free"]
  const categoryOptions = ["Functional Foods", "Snacks", "Beverages", "Bakery", "Confectionery", "Dairy Alternatives", "Meat Alternatives", "Supplements"]
  const certOptions = ["USDA Organic", "Non-GMO", "Fair Trade", "Kosher", "Halal", "Rainforest Alliance", "B Corp", "Regenerative"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Set Your Preferences</h2>
                <p className="text-sm text-slate-500">Personalize recommendations and insights</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Dietary Focus</h3>
            <p className="text-xs text-slate-500 mb-3">Select the dietary trends relevant to your products</p>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleItem(dietaryPrefs, setDietaryPrefs, opt)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    dietaryPrefs.includes(opt) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Allergen Avoidance</h3>
            <p className="text-xs text-slate-500 mb-3">Filter out ingredients with these allergens</p>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleItem(allergens, setAllergens, opt)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    allergens.includes(opt) ? "bg-red-100 text-red-700 ring-1 ring-red-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Product Categories</h3>
            <p className="text-xs text-slate-500 mb-3">Which product categories are you focused on?</p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleItem(categories, setCategories, opt)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categories.includes(opt) ? "bg-green-100 text-green-700 ring-1 ring-green-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Certification Preferences</h3>
            <p className="text-xs text-slate-500 mb-3">Prioritize suppliers with these certifications</p>
            <div className="flex flex-wrap gap-2">
              {certOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleItem(certPref, setCertPref, opt)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    certPref.includes(opt) ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Price Sensitivity</h3>
            <p className="text-xs text-slate-500 mb-3">Set your ingredient sourcing budget preference</p>
            <div className="flex gap-2">
              {[
                { key: "low", label: "Budget-Friendly" },
                { key: "mid", label: "Mid-Range" },
                { key: "premium", label: "Premium" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPriceRange(opt.key)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    priceRange === opt.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          {saved ? (
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium">
              <CheckCircle className="h-5 w-5" />
              Preferences Saved!
            </div>
          ) : (
            <>
              <button type="button" onClick={onClose} className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterDropdown({ label, options, selected, onSelect }: {
  label: string
  options: string[]
  selected: string | null
  onSelect: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm transition-colors ${
          selected ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        {selected || label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
          >
            All ({label})
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onSelect(opt); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                selected === opt ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function IngredientsListSection() {
  const [listViewMode, setListViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [showStarred, setShowStarred] = useState(false)
  const [costFilter, setCostFilter] = useState<string | null>(null)
  const [plantFilter, setPlantFilter] = useState<string | null>(null)
  const [allergenFilter, setAllergenFilter] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const filtered = ingredientsListData.filter((ing) => {
    if (showStarred && !ing.starred) return false
    if (searchQuery && !ing.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          All Ingredients:<span className="text-blue-600">59653</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setListViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${listViewMode === "grid" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setListViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${listViewMode === "list" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-medium">Filters:</span>
        </div>
        <FilterDropdown
          label="Cost"
          options={["Under $0.50", "$0.50 - $1.00", "$1.00 - $2.00", "$2.00 - $5.00", "$5.00 - $10.00", "Over $10.00"]}
          selected={costFilter}
          onSelect={setCostFilter}
        />
        <FilterDropdown
          label="Plant Based"
          options={["Plant-Based Only", "Vegan", "Vegetarian", "Contains Dairy", "Contains Animal"]}
          selected={plantFilter}
          onSelect={setPlantFilter}
        />
        <FilterDropdown
          label="Allergen"
          options={["Gluten-Free", "Dairy-Free", "Nut-Free", "Soy-Free", "Egg-Free", "Shellfish-Free", "Sesame-Free", "Corn-Free", "Contains Major Allergens"]}
          selected={allergenFilter}
          onSelect={setAllergenFilter}
        />
        <FilterDropdown
          label="Category"
          options={["Grains & Cereals", "Sweeteners", "Proteins", "Fats & Oils", "Dairy", "Fruits & Vegetables", "Nuts & Seeds", "Spices & Seasonings", "Additives", "Vitamins & Minerals", "Fibers", "Emulsifiers", "Preservatives", "Colors", "Flavors"]}
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
        <label className="flex items-center gap-2 ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={showStarred}
            onChange={(e) => setShowStarred(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600">show starred ingredients</span>
        </label>
      </div>

      {listViewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-12 px-4 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="w-12 px-4 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Manufacturer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price/Unit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">ROI <Info className="h-3 w-3 text-blue-500" /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ing) => (
                <tr key={ing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-slate-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{ing.name}</td>
                  <td className="px-4 py-3">
                    <Star className={`h-4 w-4 ${ing.starred ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ing.manufacturer}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ing.pricePerUnit || <span className="text-slate-300">-</span>}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{ing.roi}</td>
                  <td className="px-4 py-3 text-sm">
                    <span role="img" aria-label="US flag">🇺🇸</span>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((ing) => (
            <div key={ing.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="aspect-square rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:border-blue-200 transition-colors">
                <Package className="h-10 w-10 text-slate-300" />
              </div>
              <div className="flex items-start justify-between gap-1">
                <p className="text-sm font-medium text-slate-800 line-clamp-2">{ing.name}</p>
                <Star className={`h-4 w-4 shrink-0 ${ing.starred ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
              </div>
              <p className="text-xs text-slate-500 mt-1">{ing.manufacturer}</p>
              {ing.pricePerUnit && <p className="text-xs font-medium text-slate-700 mt-1">{ing.pricePerUnit}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductsListSection() {
  const [listViewMode, setListViewMode] = useState<ViewMode>("list")
  const [activeTab, setActiveTab] = useState<ProductTab>("retail")
  const [currentPage, setCurrentPage] = useState(1)
  const [marketFilter, setMarketFilter] = useState<string | null>(null)
  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const tabs: Array<{ key: ProductTab; label: string; icon: React.ReactNode; color: string }> = [
    { key: "retail", label: "Retail", icon: <ShoppingCart className="h-4 w-4" />, color: "bg-blue-600 text-white" },
    { key: "concept", label: "Concept", icon: <Lightbulb className="h-4 w-4" />, color: "bg-green-600 text-white" },
    { key: "latest", label: "Latest updates", icon: <Bell className="h-4 w-4" />, color: "bg-red-500 text-white" },
    { key: "journey-ai", label: "Journey AI", icon: <Sparkles className="h-4 w-4" />, color: "bg-slate-700 text-white" },
  ]

  const filtered = productsListData.filter((p) => {
    if (activeTab === "retail") return p.status === "RETAIL"
    if (activeTab === "concept") return p.status === "CONCEPT"
    return true
  })

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-slate-800">
            Active Products <span className="text-blue-600">488009</span>
          </h2>
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.key ? tab.color : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setListViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${listViewMode === "grid" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setListViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${listViewMode === "list" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <List className="h-5 w-5" />
          </button>
          <button type="button" className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-medium">Filters:</span>
        </div>
        <FilterDropdown
          label="Market"
          options={["US Domestic", "European Union", "Asia Pacific", "Latin America", "Middle East", "Global"]}
          selected={marketFilter}
          onSelect={setMarketFilter}
        />
        <FilterDropdown
          label="Brand"
          options={["Giant Eagle", "JourneyFoods", "Private Label", "Whole Foods", "Trader Joe's", "Kroger"]}
          selected={brandFilter}
          onSelect={setBrandFilter}
        />
        <FilterDropdown
          label="Type"
          options={["Snack", "Beverage", "Bakery", "Dairy", "Frozen", "Confectionery", "Cereal", "Condiment", "Meat Alternative", "Supplement"]}
          selected={typeFilter}
          onSelect={setTypeFilter}
        />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              currentPage === page ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button type="button" className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors">
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {listViewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Flavor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Version</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 max-w-[200px]">
                    <span className="line-clamp-2">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.brand}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.flavor}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">{product.version}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span role="img" aria-label="US flag">🇺🇸</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      product.status === "RETAIL" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.score}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="aspect-square rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:border-blue-200 transition-colors">
                <Package className="h-10 w-10 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-800 line-clamp-2">{product.name}</p>
              <p className="text-xs text-slate-500 mt-1">{product.brand}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  product.status === "RETAIL" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {product.status}
                </span>
                <span className="text-xs text-slate-500">{product.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SupplierCard({ supplier, onConnect, viewMode, onViewActivity, activityCount }: { supplier: Supplier; onConnect: (supplier: Supplier) => void; viewMode: ViewMode; onViewActivity: (supplierId: string) => void; activityCount: number }) {
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
            onClick={() => onViewActivity(supplier.id)}
            className="relative flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <Activity className="h-3.5 w-3.5" />
            Activity
            {activityCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activityCount > 9 ? "9+" : activityCount}
              </span>
            )}
          </button>
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewActivity(supplier.id)}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Activity className="h-3.5 w-3.5" />
            Activity
            {activityCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activityCount > 9 ? "9+" : activityCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onConnect(supplier)}
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Connect
          </button>
        </div>
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
  const [activePage, setActivePage] = useState<PageType>("overview")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTracking, setEmailTracking] = useState<EmailTracking[]>([])
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  const [featureGateTarget, setFeatureGateTarget] = useState<string | null>(null)
  const [agentDrawerOpen, setAgentDrawerOpen] = useState(false)
  const [agentDrawerSupplierId, setAgentDrawerSupplierId] = useState<string | null>(null)
  const [agentTimelines, setAgentTimelines] = useState<Record<string, AgentTimelineEvent[]>>(seedAgentTimeline)

  const openAgentDrawer = (supplierId: string) => {
    setAgentDrawerSupplierId(supplierId)
    setAgentDrawerOpen(true)
  }

  const closeAgentDrawer = () => {
    setAgentDrawerOpen(false)
  }

  const addAgentEvent = (supplierId: string, event: AgentTimelineEvent) => {
    setAgentTimelines((prev) => ({
      ...prev,
      [supplierId]: [...(prev[supplierId] || []), event],
    }))
  }

  const handleRequestQuote = () => {
    if (!agentDrawerSupplierId) return
    const supplier = suppliersData.find((s) => s.id === agentDrawerSupplierId)
    if (!supplier) return
    const ingredient = supplier.ingredients[0] || "General Ingredients"
    addAgentEvent(agentDrawerSupplierId, {
      id: `evt-${Date.now()}`,
      type: "quote_requested",
      timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      title: `Quote requested for ${ingredient}`,
      description: `RFQ sent to ${supplier.name} for ${ingredient}. Awaiting supplier response with pricing and availability.`,
      metadata: { ingredient },
      status: "active",
    })
  }

  const handleInviteToPlatform = () => {
    if (!agentDrawerSupplierId) return
    const supplier = suppliersData.find((s) => s.id === agentDrawerSupplierId)
    if (!supplier) return
    addAgentEvent(agentDrawerSupplierId, {
      id: `evt-${Date.now()}`,
      type: "platform_invite",
      timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      title: `Supplier invited to JourneyFoods platform`,
      description: `Platform invitation sent to ${supplier.email}. Supplier will be able to create a profile and manage orders directly.`,
      status: "active",
    })
  }

  const handleScheduleFollowUp = () => {
    if (!agentDrawerSupplierId) return
    const supplier = suppliersData.find((s) => s.id === agentDrawerSupplierId)
    if (!supplier) return
    addAgentEvent(agentDrawerSupplierId, {
      id: `evt-${Date.now()}`,
      type: "follow_up_scheduled",
      timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      title: "Follow-up scheduled",
      description: `A 48-hour follow-up has been queued for ${supplier.name} to check on outstanding requests and engagement.`,
      status: "completed",
    })
  }

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
    // Also push to agent timeline
    addAgentEvent(supplier.id, {
      id: `evt-${Date.now()}`,
      type: "email_sent",
      timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      title: "Outreach email sent",
      description: `Email sent to ${supplier.email} with subject "${subject}".`,
      metadata: { emailSubject: subject },
      status: "completed",
    })
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
                        if (item.locked) {
                          setFeatureGateTarget(item.name)
                        } else if (["overview", "ingredients", "products", "suppliers", "integrations"].includes(item.name.toLowerCase())) {
                          setActivePage(item.name.toLowerCase() as PageType)
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        item.locked ? "text-slate-400 hover:bg-slate-50 cursor-not-allowed" : isActive ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${item.locked ? "opacity-50" : ""}`} />
                      {item.name}
                      {item.locked && <Lock className="h-3.5 w-3.5 ml-auto text-slate-400" />}
                      {item.badge && !item.locked && (
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
                  const isSupportActive = item.name.toLowerCase() === activePage
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.locked) {
                            setFeatureGateTarget(item.name)
                          } else if (["integrations"].includes(item.name.toLowerCase())) {
                            setActivePage(item.name.toLowerCase() as PageType)
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          item.locked ? "text-slate-400 hover:bg-slate-50 cursor-not-allowed" : isSupportActive ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${item.locked ? "opacity-50" : ""}`} />
                        {item.name}
                        {item.locked && <Lock className="h-3.5 w-3.5 ml-auto text-slate-400" />}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Welcome Section */}
          {activePage === "overview" && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Welcome Back, Riana</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your offerings and track their usage.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Ingredient Tips</h3>
                  <p className="text-sm text-slate-500 mt-1">Swap Protein Brownie recommended for you</p>
                  <button type="button" className="flex items-center gap-1 text-sm font-medium text-blue-600 mt-3 hover:text-blue-700 transition-colors">
                    View Swap <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Add New Product</h3>
                  <p className="text-sm text-slate-500 mt-1">Launch your next product with recommendations.</p>
                  <button type="button" className="flex items-center gap-1 text-sm font-medium text-blue-600 mt-3 hover:text-blue-700 transition-colors">
                    Add Product <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">AI Insights Report</h3>
                  <p className="text-sm text-slate-500 mt-1">Review analytics to stay on track</p>
                  <button type="button" className="flex items-center gap-1 text-sm font-medium text-blue-600 mt-3 hover:text-blue-700 transition-colors">
                    Create Report <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div
                className="bg-white rounded-xl border border-slate-200 p-5 mt-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setShowPreferencesModal(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") setShowPreferencesModal(true) }}
              >
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                  <Settings className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Set Your Preferences</h3>
                <p className="text-sm text-slate-500 mt-1">Personalize your ingredient and product recommendations by setting dietary focus, allergens, certifications, and more.</p>
                <span className="flex items-center gap-1 text-sm font-medium text-blue-600 mt-3">
                  Open Settings <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">New Whitepapers</h3>
                    <p className="text-sm text-slate-500">Dive into the findings that can transform your approach and drive success in your field.</p>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <button type="button" className="shrink-0 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors z-10">
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <div className="flex-1 overflow-x-auto flex gap-4 px-3 pb-2 scroll-smooth snap-x snap-mandatory">
                    {[
                      { src: "/images/whitepaper-1.jpg", title: "The Future of Functional Ingredients", date: "Jan 2026" },
                      { src: "/images/whitepaper-2.jpg", title: "Supply Chain Resilience in Food Manufacturing", date: "Dec 2025" },
                      { src: "/images/whitepaper-3.jpg", title: "AI-Driven Product Development", date: "Nov 2025" },
                      { src: "/images/whitepaper-4.jpg", title: "Clean Label Trends 2026", date: "Oct 2025" },
                      { src: "/images/whitepaper-5.jpg", title: "Sustainable Sourcing Strategies", date: "Sep 2025" },
                    ].map((wp, i) => (
                      <div key={i} className="flex-shrink-0 w-44 snap-start group cursor-pointer">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-300 transition-all">
                          <img
                            src={wp.src}
                            alt={`Cover of whitepaper: ${wp.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors">{wp.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{wp.date}</p>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="shrink-0 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors z-10">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <Heart className="h-6 w-6 text-pink-500" />
                <h2 className="text-xl font-bold text-slate-800">Top Recommendation for You</h2>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm text-slate-500">Latest Activity</span>
                  <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Filter className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid - Only show for non-supplier pages */}
          {activePage !== "suppliers" && activePage !== "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {activePage === "ingredients" && (
              <>
                <ActionCard
                  title="Ingredient Actions"
                  icon={<Bell className="h-4 w-4" />}
                  completed={0}
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
                <div className="relative overflow-hidden rounded-xl p-5 min-h-[160px] flex flex-col items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" }}>
                  <Star className="h-10 w-10 text-white/80 mb-2" />
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Starred Ingredients</p>
                  <p className="text-4xl font-bold text-white mt-1">19</p>
                  <p className="text-xs text-white/70 mt-1">Saved to your profile</p>
                </div>
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

              <div className="mb-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliersData.map((supplier) => (
                      <SupplierCard
                        key={supplier.id}
                        supplier={supplier}
                        onConnect={handleConnectSupplier}
                        viewMode={viewMode}
                        onViewActivity={openAgentDrawer}
                        activityCount={(agentTimelines[supplier.id] || []).length}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suppliersData.map((supplier) => (
                      <SupplierCard
                        key={supplier.id}
                        supplier={supplier}
                        onConnect={handleConnectSupplier}
                        viewMode={viewMode}
                        onViewActivity={openAgentDrawer}
                        activityCount={(agentTimelines[supplier.id] || []).length}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Non-Suppliers Content */}
          {(activePage === "ingredients" || activePage === "products") && (
            <>
              {/* Recently Viewed */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Recently Viewed</h2>
                <div className="relative flex gap-4 overflow-x-auto pb-2 items-center">
                  <button type="button" className="shrink-0 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <div className="flex-1 flex gap-6 justify-center">
                    {(activePage === "ingredients"
                      ? ["#1 Fine Dark Chocolate", "Freeze Dried Blueberry", "Blueberry Powder", "Filets De Salmon"]
                      : ["Korean Dumpling Mix", "Plant Based Protein", "Low Cost Chocolate", "FRUTi Twist Berry"]
                    ).map((name, i) => (
                      <div key={i} className="flex-shrink-0 w-36 group cursor-pointer">
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-rose-50 to-amber-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                          <Package className="h-10 w-10 text-slate-300" />
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-700 truncate text-center">{name}</p>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="shrink-0 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Data List Section */}
              {activePage === "ingredients" && <IngredientsListSection />}
              {activePage === "products" && <ProductsListSection />}
            </>
          )}

          {/* Overview Content */}
          {activePage === "overview" && (
            <>
              {/* Recently Viewed */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Recently Viewed</h2>
                <div className="relative flex gap-4 overflow-x-auto pb-2 items-center">
                  <button type="button" className="shrink-0 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <div className="flex-1 flex gap-6 justify-center">
                    {["#1 Fine Dark Chocolate", "Freeze Dried Blueberry", "Blueberry Powder", "Filets De Salmon"].map((name, i) => (
                      <div key={i} className="flex-shrink-0 w-36 group cursor-pointer">
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-rose-50 to-amber-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                          <Package className="h-10 w-10 text-slate-300" />
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-700 truncate text-center">{name}</p>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="shrink-0 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Quick Tip */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Quick Tip</h3>
                    <p className="text-sm text-slate-600">
                      Welcome to JourneyFoods! Use the navigation menu to explore ingredients, products, and suppliers in your network.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Integrations Page */}
          {activePage === "integrations" && <IntegrationsPage />}
        </main>
      </div>

      {/* Agent Activity Drawer */}
      {agentDrawerSupplierId && (
        <AgentActivityDrawer
          supplier={suppliersData.find((s) => s.id === agentDrawerSupplierId) || suppliersData[0]}
          timeline={agentTimelines[agentDrawerSupplierId] || []}
          open={agentDrawerOpen}
          onClose={closeAgentDrawer}
          onSendEmail={() => {
            const supplier = suppliersData.find((s) => s.id === agentDrawerSupplierId)
            if (supplier) {
              setSelectedSupplier(supplier)
              setShowEmailModal(true)
            }
          }}
          onRequestQuote={handleRequestQuote}
          onInviteToPlatform={handleInviteToPlatform}
          onScheduleFollowUp={handleScheduleFollowUp}
        />
      )}

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

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <PreferencesModal onClose={() => setShowPreferencesModal(false)} />
      )}

      {/* Feature Gate Modal */}
      {featureGateTarget && (
        <FeatureGateModal feature={featureGateTarget} onClose={() => setFeatureGateTarget(null)} />
      )}
    </div>
  )
}
