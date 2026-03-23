"use client"

import { useState } from "react"
import {
  Tv,
  ChevronDown,
  ScanBarcode,
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Leaf,
  ShoppingCart,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"

// Sample scan data
const recentScans = [
  { id: 1, product: "Organic Oat Milk", brand: "Oatly", upc: "7394376615574", score: 87, costScore: 72, location: "Austin, TX", store: "Whole Foods", time: "2 min ago", ingredients: ["Oats", "Water", "Rapeseed Oil"] },
  { id: 2, product: "Greek Yogurt", brand: "Chobani", upc: "818290014568", score: 92, costScore: 85, location: "Denver, CO", store: "Kroger", time: "5 min ago", ingredients: ["Milk", "Live Cultures", "Fruit"] },
  { id: 3, product: "Almond Butter", brand: "Justin's", upc: "894455000117", score: 78, costScore: 65, location: "Seattle, WA", store: "Target", time: "8 min ago", ingredients: ["Almonds", "Palm Oil", "Salt"] },
  { id: 4, product: "Coconut Water", brand: "Vita Coco", upc: "898999010014", score: 95, costScore: 88, location: "Miami, FL", store: "Publix", time: "12 min ago", ingredients: ["Coconut Water", "Vitamin C"] },
  { id: 5, product: "Plant Protein Bar", brand: "RXBAR", upc: "857777004040", score: 81, costScore: 70, location: "Chicago, IL", store: "Costco", time: "15 min ago", ingredients: ["Egg Whites", "Dates", "Nuts"] },
  { id: 6, product: "Sparkling Water", brand: "LaCroix", upc: "073360100000", score: 98, costScore: 95, location: "Portland, OR", store: "Safeway", time: "18 min ago", ingredients: ["Carbonated Water", "Natural Flavor"] },
]

// Demographics data
const ageGroups = [
  { range: "18-24", percentage: 18, color: "bg-blue-500" },
  { range: "25-34", percentage: 32, color: "bg-teal-500" },
  { range: "35-44", percentage: 25, color: "bg-emerald-500" },
  { range: "45-54", percentage: 15, color: "bg-amber-500" },
  { range: "55+", percentage: 10, color: "bg-orange-500" },
]

const budgetRanges = [
  { range: "$0-50/wk", percentage: 12, color: "bg-slate-400" },
  { range: "$50-100/wk", percentage: 28, color: "bg-slate-500" },
  { range: "$100-150/wk", percentage: 35, color: "bg-slate-600" },
  { range: "$150-200/wk", percentage: 18, color: "bg-slate-700" },
  { range: "$200+/wk", percentage: 7, color: "bg-slate-800" },
]

const storePreferences = [
  { name: "Whole Foods", type: "Grocery", scans: 2847, percentage: 24 },
  { name: "Kroger", type: "Grocery", scans: 2156, percentage: 18 },
  { name: "Target", type: "General", scans: 1823, percentage: 15 },
  { name: "Costco", type: "Warehouse", scans: 1654, percentage: 14 },
  { name: "Trader Joe's", type: "Grocery", scans: 1432, percentage: 12 },
  { name: "Sephora", type: "Cosmetic", scans: 987, percentage: 8 },
  { name: "Ulta Beauty", type: "Cosmetic", scans: 654, percentage: 5 },
  { name: "CVS", type: "Pharmacy", scans: 487, percentage: 4 },
]

const topIngredients = [
  { name: "Oats", scans: 4523, trend: 12 },
  { name: "Almond", scans: 3876, trend: 8 },
  { name: "Coconut", scans: 3654, trend: 15 },
  { name: "Pea Protein", scans: 2987, trend: 22 },
  { name: "Quinoa", scans: 2654, trend: 5 },
  { name: "Chia Seeds", scans: 2432, trend: -3 },
  { name: "Turmeric", scans: 2187, trend: 18 },
  { name: "Matcha", scans: 1965, trend: 25 },
]

const scannerLocations = [
  { city: "Austin, TX", active: true, scans: 3456, lat: 30.27, lng: -97.74 },
  { city: "Denver, CO", active: true, scans: 2876, lat: 39.74, lng: -104.99 },
  { city: "Seattle, WA", active: true, scans: 2543, lat: 47.61, lng: -122.33 },
  { city: "Miami, FL", active: true, scans: 2187, lat: 25.76, lng: -80.19 },
  { city: "Chicago, IL", active: true, scans: 1987, lat: 41.88, lng: -87.63 },
  { city: "Portland, OR", active: false, scans: 1654, lat: 45.52, lng: -122.68 },
  { city: "New York, NY", active: true, scans: 4321, lat: 40.71, lng: -74.01 },
  { city: "Los Angeles, CA", active: true, scans: 3987, lat: 34.05, lng: -118.24 },
]

export function GuavaPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [brandFilter, setBrandFilter] = useState("all")

  const totalScans = 24567
  const uniqueProducts = 1847
  const activeScanners = scannerLocations.filter(s => s.active).length
  const avgNutritionScore = 86.4
  const avgCostScore = 78.2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
            <Tv className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Guava Dashboard</h1>
            <p className="text-sm text-slate-500">Consumer insights and product discovery analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Brands</option>
            <option value="owned">My Brands</option>
            <option value="competitors">Competitors</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <ScanBarcode className="h-5 w-5 opacity-80" />
            <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3" /> 12%
            </span>
          </div>
          <p className="text-3xl font-bold">{totalScans.toLocaleString()}</p>
          <p className="text-sm opacity-80">Total Scans</p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="h-5 w-5 opacity-80" />
            <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3" /> 8%
            </span>
          </div>
          <p className="text-3xl font-bold">{uniqueProducts.toLocaleString()}</p>
          <p className="text-sm opacity-80">Unique Products</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="h-5 w-5 opacity-80" />
            <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              {activeScanners} live
            </span>
          </div>
          <p className="text-3xl font-bold">{scannerLocations.length}</p>
          <p className="text-sm opacity-80">Scanner Locations</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <Leaf className="h-5 w-5 opacity-80" />
            <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3" /> 3%
            </span>
          </div>
          <p className="text-3xl font-bold">{avgNutritionScore}</p>
          <p className="text-sm opacity-80">Avg. Nutrition Score</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 opacity-80" />
            <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              <ArrowDownRight className="h-3 w-3" /> 2%
            </span>
          </div>
          <p className="text-3xl font-bold">{avgCostScore}</p>
          <p className="text-sm opacity-80">Avg. Cost Score</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans Table - 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Recent Scans</h2>
              <p className="text-xs text-slate-500">Live product scans from consumers</p>
            </div>
            <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Product</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Scores</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Location</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Store</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">Ingredients</th>
                  <th className="text-right px-5 py-3 font-medium text-slate-500">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-slate-800">{scan.product}</p>
                        <p className="text-xs text-slate-400">{scan.brand} &bull; {scan.upc}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${scan.score >= 90 ? "bg-emerald-100 text-emerald-700" : scan.score >= 80 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                          N: {scan.score}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${scan.costScore >= 85 ? "bg-emerald-100 text-emerald-700" : scan.costScore >= 70 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                          C: {scan.costScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="h-3 w-3" />
                        {scan.location}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{scan.store}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {scan.ingredients.slice(0, 2).map((ing, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{ing}</span>
                        ))}
                        {scan.ingredients.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">+{scan.ingredients.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-slate-400">
                        <Clock className="h-3 w-3" />
                        {scan.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scanner Locations - 1 col */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Scanner Locations</h2>
            <span className="text-xs text-emerald-600 font-medium">{activeScanners} live</span>
          </div>
          {/* Simple map placeholder */}
          <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
            {scannerLocations.slice(0, 5).map((loc, i) => (
              <div
                key={loc.city}
                className="absolute"
                style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
              >
                <div className={`h-3 w-3 rounded-full ${loc.active ? "bg-emerald-500" : "bg-slate-400"} ${loc.active ? "animate-pulse" : ""}`} />
              </div>
            ))}
            <p className="text-sm text-slate-400 z-10">US Coverage Map</p>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {scannerLocations.map((loc) => (
              <div key={loc.city} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${loc.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-700">{loc.city}</span>
                </div>
                <span className="text-xs text-slate-500">{loc.scans.toLocaleString()} scans</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Groups */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Age Demographics</h2>
          <div className="space-y-3">
            {ageGroups.map((group) => (
              <div key={group.range}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">{group.range}</span>
                  <span className="font-medium text-slate-800">{group.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${group.color} h-2 rounded-full transition-all`} style={{ width: `${group.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Ranges */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Weekly Budget</h2>
          <div className="space-y-3">
            {budgetRanges.map((budget) => (
              <div key={budget.range}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">{budget.range}</span>
                  <span className="font-medium text-slate-800">{budget.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${budget.color} h-2 rounded-full transition-all`} style={{ width: `${budget.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Ingredients */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Top Scanned Ingredients</h2>
          <div className="space-y-2.5">
            {topIngredients.slice(0, 6).map((ing, i) => (
              <div key={ing.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">{i + 1}</span>
                  <span className="text-sm text-slate-700">{ing.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{ing.scans.toLocaleString()}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${ing.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {ing.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(ing.trend)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-800">Store Preferences</h2>
            <p className="text-xs text-slate-500">Where consumers scan your products</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">Grocery</span>
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Cosmetic</span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">General</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {storePreferences.map((store) => (
            <div key={store.name} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                  store.type === "Grocery" ? "bg-emerald-100 text-emerald-700" :
                  store.type === "Cosmetic" ? "bg-purple-100 text-purple-700" :
                  store.type === "Pharmacy" ? "bg-amber-100 text-amber-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {store.type}
                </span>
                <span className="text-xs font-medium text-slate-500">{store.percentage}%</span>
              </div>
              <p className="font-medium text-slate-800">{store.name}</p>
              <p className="text-xs text-slate-500">{store.scans.toLocaleString()} scans</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Deploy Product Updates</h3>
          <p className="text-sm text-slate-300">Use consumer insights to update formulations across your portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
            View Recommendations
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
            Sync to Platform
          </button>
        </div>
      </div>
    </div>
  )
}
