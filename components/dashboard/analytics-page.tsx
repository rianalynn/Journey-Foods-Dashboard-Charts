"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  Package,
  Leaf,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Target,
  Award,
  Sparkles,
  Timer,
  PiggyBank,
  BarChart3,
  LineChart,
} from "lucide-react"

type AnalyticsTab = "analytics" | "scores" | "markets"
type TimeRange = "Last 6 Months" | "Last 3 Months" | "Last Year"

// Hero stat cards data
const heroStats = [
  {
    label: "Total Ingredients",
    value: "33",
    icon: Leaf,
    bgClass: "bg-slate-100",
    textClass: "text-slate-800",
  },
  {
    label: "Total Products",
    value: "488,186",
    icon: Package,
    bgClass: "bg-gradient-to-br from-teal-400 to-teal-600",
    textClass: "text-white",
  },
  {
    label: "Total Users",
    value: "247",
    icon: Users,
    bgClass: "bg-gradient-to-br from-blue-400 to-blue-600",
    textClass: "text-white",
  },
  {
    label: "Manufacturers",
    value: "14",
    icon: Package,
    bgClass: "bg-gradient-to-br from-purple-400 to-purple-600",
    textClass: "text-white",
  },
]

// Time/cost savings callouts (DoorDash/Instacart style)
const savingsCallouts = [
  {
    icon: Timer,
    label: "Hours Saved This Month",
    value: "127",
    subtext: "vs manual sourcing",
    trend: "+23%",
    trendUp: true,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    icon: PiggyBank,
    label: "Cost Savings",
    value: "$48,230",
    subtext: "ingredient optimization",
    trend: "+18%",
    trendUp: true,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: Zap,
    label: "Faster Time-to-Market",
    value: "3.2x",
    subtext: "avg. product launch",
    trend: "+0.4x",
    trendUp: true,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    icon: Target,
    label: "Formulation Accuracy",
    value: "94.7%",
    subtext: "first-pass success rate",
    trend: "+5.2%",
    trendUp: true,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
]

// Quick insights
const quickInsights = [
  { label: "Avg. ingredient cost reduction", value: "12.4%", icon: DollarSign },
  { label: "Supplier response time", value: "2.3 days", icon: Clock },
  { label: "Sustainability score improvement", value: "+18 pts", icon: Leaf },
  { label: "Products launched this quarter", value: "23", icon: Package },
]

// Chart data for Time Saved
const timeSavedData = [
  { month: "Oct", hours: 12, projected: 15 },
  { month: "Nov", hours: 18, projected: 22 },
  { month: "Dec", hours: 24, projected: 28 },
  { month: "Jan", hours: 32, projected: 38 },
  { month: "Feb", hours: 42, projected: 48 },
  { month: "Mar", hours: 52, projected: 58 },
]

// Chart data for Product Changes
const productChangesData = [
  { month: "Oct", changes: 8, target: 10 },
  { month: "Nov", changes: 12, target: 14 },
  { month: "Dec", changes: 18, target: 20 },
  { month: "Jan", changes: 22, target: 24 },
  { month: "Feb", changes: 26, target: 28 },
  { month: "Mar", changes: 28, target: 30 },
]

// Chart data for Sustainability
const sustainabilityData = [
  { month: "Oct", score: 24 },
  { month: "Nov", score: 32 },
  { month: "Dec", score: 45 },
  { month: "Jan", score: 58 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 76 },
]

// Chart data for Cost Savings
const costSavingsData = [
  { month: "Oct", savings: 8200 },
  { month: "Nov", savings: 12400 },
  { month: "Dec", savings: 18600 },
  { month: "Jan", savings: 28200 },
  { month: "Feb", savings: 38400 },
  { month: "Mar", savings: 48230 },
]

function SimpleLineChart({ 
  data, 
  dataKey, 
  color, 
  fillColor,
  height = 180 
}: { 
  data: Array<Record<string, number | string>>
  dataKey: string
  secondaryKey?: string
  color: string
  fillColor?: string
  height?: number
}) {
  const values = data.map(d => Number(d[dataKey]))
  const max = Math.max(...values) * 1.2
  const min = 0

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((Number(d[dataKey]) - min) / (max - min)) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.3" strokeDasharray="2,2" />
        ))}
        {/* Fill area */}
        {fillColor && (
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={fillColor}
            opacity="0.3"
          />
        )}
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((Number(d[dataKey]) - min) / (max - min)) * 100
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill="white"
              stroke={color}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        {data.map((d, i) => (
          <span key={i}>{d.month}</span>
        ))}
      </div>
    </div>
  )
}

function TimeRangeSelect({ value, onChange }: { value: TimeRange; onChange: (v: TimeRange) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option>Last 6 Months</option>
        <option>Last 3 Months</option>
        <option>Last Year</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  )
}

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("analytics")
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 6 Months")

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {(["analytics", "scores", "markets"] as AnalyticsTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Hero stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {heroStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`rounded-xl p-5 ${stat.bgClass}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-3xl font-bold ${stat.textClass}`}>{stat.value}</span>
                <Icon className={`h-5 w-5 ${stat.textClass} opacity-70`} />
              </div>
              <p className={`text-sm ${stat.textClass} opacity-80`}>{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Savings callouts - DoorDash/Instacart style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {savingsCallouts.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className={`rounded-xl border ${item.borderColor} ${item.bgColor} p-5 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${item.trendUp ? "text-emerald-600" : "text-red-500"}`}>
                  {item.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {item.trend}
                </span>
              </div>
              <p className={`text-3xl font-bold mt-3 ${item.color}`}>{item.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{item.label}</p>
              <p className="text-xs text-slate-500">{item.subtext}</p>
            </div>
          )
        })}
      </div>

      {/* Quick insights bar */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-800">Quick Insights</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickInsights.map((insight) => {
            const Icon = insight.icon
            return (
              <div key={insight.label} className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">{insight.value}</p>
                  <p className="text-xs text-slate-500">{insight.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Saved */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Time Saved</h3>
              <p className="text-xs text-slate-500">for product development over time</p>
            </div>
            <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
          </div>
          <SimpleLineChart
            data={timeSavedData}
            dataKey="hours"
            color="#10b981"
            fillColor="#10b981"
          />
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Hours saved</span>
          </div>
        </div>

        {/* Product Changes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Product Changes</h3>
              <p className="text-xs text-slate-500">Compared month-on-month</p>
            </div>
            <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
          </div>
          <SimpleLineChart
            data={productChangesData}
            dataKey="changes"
            color="#f59e0b"
            fillColor="#f59e0b"
          />
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Changes</span>
          </div>
        </div>

        {/* Sustainability */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Sustainability</h3>
              <p className="text-xs text-slate-500">for product development over time</p>
            </div>
            <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
          </div>
          <SimpleLineChart
            data={sustainabilityData}
            dataKey="score"
            color="#8b5cf6"
            fillColor="#8b5cf6"
          />
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />Score</span>
          </div>
        </div>

        {/* Cost Savings Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Cost Savings</h3>
              <p className="text-xs text-slate-500">for product development over time</p>
            </div>
            <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
          </div>
          <SimpleLineChart
            data={costSavingsData}
            dataKey="savings"
            color="#3b82f6"
            fillColor="#3b82f6"
          />
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Savings ($)</span>
          </div>
        </div>
      </div>

      {/* Bottom summary row */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold">Your ROI Summary</h3>
            <p className="text-sm text-slate-300">Based on your usage over the past 6 months</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">$48,230</p>
              <p className="text-xs text-slate-400">Total Saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">127 hrs</p>
              <p className="text-xs text-slate-400">Time Saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">23</p>
              <p className="text-xs text-slate-400">Products Launched</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">94.7%</p>
              <p className="text-xs text-slate-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
