"use client"

import { useState } from "react"
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  Plus,
  ChevronDown,
  X,
  Bell,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  ExternalLink,
  ChevronRight,
  Leaf,
  Zap,
  DollarSign,
  BarChart3,
  Lightbulb,
  Tag,
  Globe,
  ShoppingCart,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  brand: string
  category: string
  subCategory: string
  status: "active" | "concept" | "discontinued"
  nutritionScore: number
  sustainabilityScore: number
  costScore: number
  overallScore: number
  price: number
  currency: string
  market: string[]
  ingredients: string[]
  ingredientCount: number
  upc: string
  sku: string
  trend: "up" | "down" | "stable"
  trendValue: number
  starred: boolean
  alert?: string
  tags: string[]
  lastUpdated: string
  servingSize: string
  calories: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const productsData: Product[] = [
  {
    id: "1", name: "Organic Protein Bar — Chocolate Fudge", brand: "JourneyFoods", category: "Food", subCategory: "Bars",
    status: "active", nutritionScore: 91, sustainabilityScore: 88, costScore: 79, overallScore: 88,
    price: 3.49, currency: "USD", market: ["North America", "Europe"],
    ingredients: ["Pea Protein Isolate", "Organic Mango Puree", "Coconut Sugar", "Oat Flour", "Avocado Oil"],
    ingredientCount: 14, upc: "012345678901", sku: "JF-BAR-CHF-001",
    trend: "up", trendValue: 6.4, starred: true, tags: ["Vegan", "Gluten-Free", "Non-GMO"],
    lastUpdated: "1 day ago", servingSize: "60g", calories: 220,
  },
  {
    id: "2", name: "Green Smoothie Mix", brand: "JourneyFoods", category: "Beverages", subCategory: "Powders",
    status: "active", nutritionScore: 94, sustainabilityScore: 91, costScore: 83, overallScore: 91,
    price: 29.99, currency: "USD", market: ["North America"],
    ingredients: ["Matcha Powder", "Pea Protein Isolate", "Chicory Root Fiber"],
    ingredientCount: 9, upc: "012345678902", sku: "JF-SMO-GRN-001",
    trend: "up", trendValue: 12.1, starred: true, tags: ["Vegan", "Keto-Friendly", "High Protein"],
    lastUpdated: "3 hours ago", servingSize: "30g", calories: 120,
  },
  {
    id: "3", name: "Turmeric Ginger Latte Blend", brand: "JourneyFoods", category: "Beverages", subCategory: "Latte Mix",
    status: "concept", nutritionScore: 86, sustainabilityScore: 80, costScore: 74, overallScore: 82,
    price: 24.99, currency: "USD", market: ["North America", "Europe", "Asia Pacific"],
    ingredients: ["Turmeric Extract", "Coconut Sugar", "Himalayan Pink Salt"],
    ingredientCount: 7, upc: "", sku: "JF-LAT-TGI-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Anti-Inflammatory", "Vegan", "Adaptogenic"],
    lastUpdated: "1 week ago", servingSize: "15g", calories: 60,
    alert: "Pending regulatory review for EU market",
  },
  {
    id: "4", name: "Recovery Electrolyte Drink", brand: "JourneyFoods", category: "Beverages", subCategory: "Electrolytes",
    status: "active", nutritionScore: 88, sustainabilityScore: 85, costScore: 91, overallScore: 88,
    price: 2.99, currency: "USD", market: ["North America"],
    ingredients: ["Himalayan Pink Salt", "Coconut Sugar", "Freeze Dried Blueberry"],
    ingredientCount: 6, upc: "012345678904", sku: "JF-ELC-RCV-001",
    trend: "up", trendValue: 3.8, starred: false, tags: ["Electrolytes", "Low Sugar", "Non-GMO"],
    lastUpdated: "2 days ago", servingSize: "20g", calories: 80,
  },
  {
    id: "5", name: "Buckwheat Pancake Mix", brand: "JourneyFoods", category: "Food", subCategory: "Baking",
    status: "active", nutritionScore: 83, sustainabilityScore: 87, costScore: 92, overallScore: 86,
    price: 8.99, currency: "USD", market: ["North America", "Europe"],
    ingredients: ["Buckwheat Flour", "Oat Flour", "Himalayan Pink Salt", "Sunflower Lecithin"],
    ingredientCount: 8, upc: "012345678905", sku: "JF-BAK-PCK-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Gluten-Free", "Vegan", "High Fiber"],
    lastUpdated: "5 days ago", servingSize: "45g", calories: 170,
  },
  {
    id: "6", name: "Matcha Energy Bites", brand: "JourneyFoods", category: "Food", subCategory: "Snacks",
    status: "concept", nutritionScore: 87, sustainabilityScore: 89, costScore: 71, overallScore: 84,
    price: 12.99, currency: "USD", market: ["North America", "Asia Pacific"],
    ingredients: ["Matcha Powder", "Coconut Sugar", "Oat Flour", "Avocado Oil"],
    ingredientCount: 10, upc: "", sku: "JF-SNK-MEB-001",
    trend: "up", trendValue: 4.2, starred: false, tags: ["Vegan", "Antioxidant", "Non-GMO"],
    lastUpdated: "2 weeks ago", servingSize: "35g", calories: 140,
  },
  {
    id: "7", name: "Blueberry Antioxidant Smoothie", brand: "JourneyFoods", category: "Beverages", subCategory: "Ready-to-Mix",
    status: "active", nutritionScore: 93, sustainabilityScore: 90, costScore: 76, overallScore: 90,
    price: 34.99, currency: "USD", market: ["North America"],
    ingredients: ["Freeze Dried Blueberry", "Pea Protein Isolate", "Chicory Root Fiber"],
    ingredientCount: 7, upc: "012345678907", sku: "JF-SMO-BLB-001",
    trend: "up", trendValue: 8.9, starred: true, tags: ["Antioxidant", "High Protein", "Vegan"],
    lastUpdated: "6 hours ago", servingSize: "30g", calories: 130,
  },
  {
    id: "8", name: "Coconut Avocado Dressing", brand: "JourneyFoods", category: "Food", subCategory: "Condiments",
    status: "active", nutritionScore: 85, sustainabilityScore: 88, costScore: 80, overallScore: 85,
    price: 7.49, currency: "USD", market: ["North America", "Europe"],
    ingredients: ["Avocado Oil", "Coconut Sugar", "Himalayan Pink Salt"],
    ingredientCount: 5, upc: "012345678908", sku: "JF-CON-CAD-001",
    trend: "down", trendValue: -1.4, starred: false, tags: ["Keto-Friendly", "Paleo", "Vegan"],
    lastUpdated: "3 days ago", servingSize: "30ml", calories: 110,
  },
  {
    id: "9", name: "Pea Protein Powder — Vanilla", brand: "JourneyFoods", category: "Supplements", subCategory: "Protein",
    status: "active", nutritionScore: 96, sustainabilityScore: 93, costScore: 82, overallScore: 93,
    price: 44.99, currency: "USD", market: ["North America", "Europe", "Asia Pacific"],
    ingredients: ["Pea Protein Isolate", "Coconut Sugar", "Sunflower Lecithin"],
    ingredientCount: 6, upc: "012345678909", sku: "JF-PRO-VAN-001",
    trend: "up", trendValue: 14.3, starred: true, tags: ["Vegan", "High Protein", "Non-GMO"],
    lastUpdated: "1 day ago", servingSize: "35g", calories: 130,
  },
  {
    id: "10", name: "Overnight Oat Mix — Berry", brand: "JourneyFoods", category: "Food", subCategory: "Breakfast",
    status: "concept", nutritionScore: 84, sustainabilityScore: 86, costScore: 88, overallScore: 85,
    price: 11.99, currency: "USD", market: ["North America"],
    ingredients: ["Oat Flour", "Freeze Dried Blueberry", "Coconut Sugar", "Buckwheat Flour"],
    ingredientCount: 8, upc: "", sku: "JF-BRK-OOB-001",
    trend: "up", trendValue: 2.1, starred: false, tags: ["High Fiber", "Vegan", "Gluten-Free"],
    lastUpdated: "4 days ago", servingSize: "60g", calories: 230,
  },
]

const CATEGORIES = ["All", "Food", "Beverages", "Supplements"]
const STATUSES = ["All", "Active", "Concept", "Discontinued"]
const MARKETS = ["All", "North America", "Europe", "Asia Pacific"]

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ value, label, color = "#22c55e" }: { value: number; label: string; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span><span className="font-semibold text-slate-700">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

// ─── Product Detail Drawer ────────────────────────────────────────────────────

function ProductDetailDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "nutrition" | "ingredients" | "markets">("overview")

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200 flex items-center justify-center">
              <Package className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 leading-tight">{product.name}</h2>
                {product.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 shrink-0" />}
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{product.brand} · {product.subCategory}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  product.status === "active" ? "bg-green-100 text-green-700" :
                  product.status === "concept" ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                }`}>{product.status}</span>
                {product.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Alert */}
        {product.alert && (
          <div className="mx-6 mt-4 flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{product.alert}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 mt-4">
          {(["overview", "nutrition", "ingredients", "markets"] as const).map((tab) => (
            <button key={tab} type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors ${
                activeTab === tab ? "border-slate-800 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === "overview" && (
            <>
              {/* Scores */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scores</p>
                <ScoreBar value={product.overallScore} label="Overall Score" color="#3b82f6" />
                <ScoreBar value={product.nutritionScore} label="Nutrition Score" color="#22c55e" />
                <ScoreBar value={product.sustainabilityScore} label="Sustainability Score" color="#10b981" />
                <ScoreBar value={product.costScore} label="Cost Score" color="#f59e0b" />
              </div>

              {/* Key info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><DollarSign className="h-3 w-3" />Price</p>
                  <p className="text-2xl font-bold text-slate-800">${product.price.toFixed(2)}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                    product.trend === "up" ? "text-green-500" : product.trend === "down" ? "text-red-500" : "text-slate-400"
                  }`}>
                    {product.trend === "up" ? <TrendingUp className="h-3 w-3" /> : product.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                    {product.trendValue !== 0 ? `${Math.abs(product.trendValue)}% vs last period` : "No change"}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><BarChart3 className="h-3 w-3" />Serving</p>
                  <p className="text-2xl font-bold text-slate-800">{product.calories}</p>
                  <p className="text-xs text-slate-500 mt-1">kcal · {product.servingSize}/serving</p>
                </div>
              </div>

              {/* IDs */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Product IDs</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">SKU</span>
                  <span className="font-mono font-medium text-slate-700">{product.sku}</span>
                </div>
                {product.upc && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">UPC</span>
                    <span className="font-mono font-medium text-slate-700">{product.upc}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="text-slate-700">{product.lastUpdated}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "nutrition" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Calories", `${product.calories} kcal`],
                  ["Serving Size", product.servingSize],
                  ["Nutrition Score", `${product.nutritionScore}/100`],
                  ["Processing Level", "Minimally processed"],
                  ["Protein", "12g / serving"],
                  ["Carbohydrates", "24g / serving"],
                  ["Fat", "8g / serving"],
                  ["Fiber", "6g / serving"],
                  ["Sugar", "8g / serving"],
                  ["Sodium", "140mg / serving"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">{k}</p>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score Breakdown</p>
                <ScoreBar value={product.nutritionScore} label="Nutrition" color="#22c55e" />
                <ScoreBar value={product.sustainabilityScore} label="Sustainability" color="#10b981" />
                <ScoreBar value={product.costScore} label="Cost Efficiency" color="#f59e0b" />
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{product.ingredientCount} Ingredients</p>
              {product.ingredients.map((name) => (
                <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{name}</p>
                      <p className="text-xs text-slate-500">Primary ingredient</p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </div>
              ))}
              {product.ingredientCount > product.ingredients.length && (
                <button type="button" className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2">
                  +{product.ingredientCount - product.ingredients.length} more ingredients
                </button>
              )}
            </div>
          )}

          {activeTab === "markets" && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Markets ({product.market.length})</p>
              {product.market.map((m) => (
                <div key={m} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{m}</p>
                      <p className="text-xs text-slate-500">Distribution active</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Live</span>
                </div>
              ))}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800">Expand to new markets</p>
                  <p className="text-xs text-blue-600 mt-0.5">Your product meets requirements for 3 more regions</p>
                </div>
                <button type="button" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">Explore</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex gap-3">
          <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
            <Zap className="h-4 w-4" />
            Edit Product
          </button>
          <button type="button" className="px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Product Grid Card ────────────────────────────────────────────────────────

function ProductGridCard({ product, onView }: { product: Product; onView: () => void }) {
  const scoreColor = product.overallScore >= 85 ? "text-green-600 bg-green-50 border-green-200" :
    product.overallScore >= 70 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200"

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group" onClick={onView}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate leading-tight">{product.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{product.brand} · {product.subCategory}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {product.starred && <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${scoreColor}`}>
            {product.overallScore}
          </span>
        </div>
      </div>

      {product.alert && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span className="truncate">{product.alert}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Nutrition", value: product.nutritionScore },
          { label: "Sustain.", value: product.sustainabilityScore },
          { label: "Cost", value: product.costScore },
        ].map(({ label, value }) => (
          <div key={label} className="text-center bg-slate-50 rounded-lg py-2">
            <p className="text-xs font-bold text-slate-700">{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {product.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />{product.price.toFixed(2)}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            product.status === "active" ? "bg-green-100 text-green-700" :
            product.status === "concept" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
          }`}>{product.status}</span>
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            product.trend === "up" ? "text-green-500" : product.trend === "down" ? "text-red-500" : "text-slate-400"
          }`}>
            {product.trend === "up" ? <TrendingUp className="h-3 w-3" /> : product.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
            {product.trendValue !== 0 ? `${Math.abs(product.trendValue)}%` : "Stable"}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Product List Row ─────────────────────────────────────────────────────────

function ProductListRow({ product, onView }: { product: Product; onView: () => void }) {
  const scoreColor = product.overallScore >= 85 ? "text-green-600 bg-green-50" :
    product.overallScore >= 70 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50"

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group" onClick={onView}>
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200 flex items-center justify-center shrink-0">
        <Package className="h-4 w-4 text-blue-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
          {product.starred && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />}
          {product.alert && <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />}
        </div>
        <p className="text-xs text-slate-500">{product.brand} · {product.subCategory} · {product.sku}</p>
      </div>

      <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 shrink-0">
        <div className="text-center w-14">
          <p className="text-[10px] text-slate-400">Nutrition</p>
          <p className="font-semibold">{product.nutritionScore}</p>
        </div>
        <div className="text-center w-14">
          <p className="text-[10px] text-slate-400">Sustain.</p>
          <p className="font-semibold">{product.sustainabilityScore}</p>
        </div>
        <div className="text-center w-14">
          <p className="text-[10px] text-slate-400">Cost</p>
          <p className="font-semibold">{product.costScore}</p>
        </div>
        <div className="text-right w-16">
          <p className="text-[10px] text-slate-400">Price</p>
          <p className="font-semibold">${product.price.toFixed(2)}</p>
        </div>
        <div className="text-center w-16">
          <p className="text-[10px] text-slate-400">Ingred.</p>
          <p className="font-semibold">{product.ingredientCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${scoreColor}`}>{product.overallScore}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          product.status === "active" ? "bg-green-100 text-green-700" :
          product.status === "concept" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
        }`}>{product.status}</span>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  )
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [marketFilter, setMarketFilter] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const filtered = productsData.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "All" || p.category === categoryFilter
    const matchStatus = statusFilter === "All" || p.status === statusFilter.toLowerCase()
    const matchMarket = marketFilter === "All" || p.market.includes(marketFilter)
    return matchSearch && matchCategory && matchStatus && matchMarket
  })

  const displayed = showAll ? filtered : filtered.slice(0, 9)
  const activeCount = productsData.filter((p) => p.status === "active").length
  const conceptCount = productsData.filter((p) => p.status === "concept").length
  const alerts = productsData.filter((p) => p.alert)

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" />Product Actions
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Notifications Pending</span>
              <span className="font-semibold text-slate-800">6</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Actions Pending</span>
              <span className="font-semibold text-slate-800">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Concept Products</span>
              <span className="font-semibold text-amber-600">{conceptCount}</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
            <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${(activeCount / productsData.length) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeCount}/{productsData.length} active</p>
        </div>

        {/* Active Products */}
        <div className="rounded-xl p-5 text-white flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}>
          <div>
            <p className="text-blue-200 text-xs font-medium mb-1">Active Products</p>
            <p className="text-4xl font-bold">{activeCount}</p>
            <p className="text-blue-200 text-xs mt-1">In your catalog</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-300 font-medium">
              <TrendingUp className="h-3 w-3" />+2.4% this period
            </div>
          </div>
          <Package className="h-12 w-12 text-blue-300 opacity-50" />
        </div>

        {/* Concept Products */}
        <div className="rounded-xl p-5 text-white flex items-center justify-between" style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" }}>
          <div>
            <p className="text-amber-100 text-xs font-medium mb-1">Concept Products</p>
            <p className="text-4xl font-bold">{conceptCount}</p>
            <p className="text-amber-100 text-xs mt-1">In development</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-white font-medium">
              <TrendingUp className="h-3 w-3" />+8% this period
            </div>
          </div>
          <Lightbulb className="h-12 w-12 text-amber-200 opacity-50" />
        </div>
      </div>

      {/* List/Grid section */}
      <div className="bg-white rounded-xl border border-slate-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-800">All Products</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{filtered.length} items</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Market filter */}
            <div className="relative">
              <select value={marketFilter} onChange={(e) => setMarketFilter(e.target.value)}
                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white">
                {MARKETS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-3.5 w-3.5" />Filters
            </button>

            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors">
              <Plus className="h-3.5 w-3.5" />Add
            </button>

            {/* View toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button type="button" onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        {showFilters && (
          <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${categoryFilter === c ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        {/* List header */}
        {viewMode === "list" && (
          <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <span className="w-9" />
            <span>Product</span>
            <div className="flex items-center gap-6 pr-20">
              <span className="w-14 text-center">Nutrition</span>
              <span className="w-14 text-center">Sustain.</span>
              <span className="w-14 text-center">Cost</span>
              <span className="w-16 text-right">Price</span>
              <span className="w-16 text-center">Ingred.</span>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {displayed.map((product) => (
              <ProductGridCard key={product.id} product={product} onView={() => setSelectedProduct(product)} />
            ))}
          </div>
        ) : (
          <div>
            {displayed.map((product) => (
              <ProductListRow key={product.id} product={product} onView={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}

        {/* Show more */}
        {filtered.length > 9 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {displayed.length} of {filtered.length}</p>
            <button type="button" onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {showAll ? "Show less" : `Show all ${filtered.length}`}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* Quick tip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg shrink-0">
          <Zap className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Quick Tip</h3>
          <p className="text-sm text-slate-600">Use concept products to experiment with formulations before moving them to production. Track ingredient costs and nutritional data in real-time.</p>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedProduct && (
        <ProductDetailDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
