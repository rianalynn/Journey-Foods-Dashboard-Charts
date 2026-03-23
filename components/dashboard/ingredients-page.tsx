"use client"

import { useState } from "react"
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Bell,
  Leaf,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  ArrowUpRight,
  ArrowLeft,
  Download,
  ExternalLink,
  ChevronRight,
  Package,
  Zap,
  Clock,
  DollarSign,
  BarChart3,
  RefreshCw,
  FileText,
  FileCheck,
  Scale,
  ShieldAlert,
  Award,
  Timer,
  Apple,
  Droplets,
  Globe,
  Shield,
  CheckCircle,
} from "lucide-react"
import {
  ComplianceBadge,
  RegionTag,
  SeverityBadge,
} from "@/components/compliance/compliance-components"
import {
  ingredientComplianceData,
  type IngredientComplianceStatus,
  type ComplianceStatus,
  getComplianceStatusColor,
  getRegionByCode,
} from "@/lib/compliance-data"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ingredient {
  id: string
  name: string
  category: string
  subCategory: string
  form: string
  supplier: string
  score: number
  nutritionScore: number
  sustainabilityScore: number
  costScore: number
  price: number
  unit: string
  status: "active" | "concept" | "flagged"
  trend: "up" | "down" | "stable"
  trendValue: number
  certifications: string[]
  allergens: string[]
  origin: string
  lastUpdated: string
  activeProducts: number
  conceptProducts: number
  starred: boolean
  alert?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ingredientsData: Ingredient[] = [
  {
    id: "1", name: "Organic Mango Puree", category: "Food", subCategory: "Fruit", form: "Puree",
    supplier: "TropiFresh Co.", score: 92, nutritionScore: 94, sustainabilityScore: 88, costScore: 84,
    price: 4.50, unit: "kg", status: "active", trend: "up", trendValue: 3.2,
    certifications: ["USDA Organic", "Non-GMO", "Fair Trade"], allergens: [],
    origin: "Mexico", lastUpdated: "2 days ago", activeProducts: 12, conceptProducts: 5, starred: true,
  },
  {
    id: "2", name: "Buckwheat Flour", category: "Food", subCategory: "Grain", form: "Powder",
    supplier: "Heartland Mills", score: 87, nutritionScore: 90, sustainabilityScore: 85, costScore: 88,
    price: 2.75, unit: "kg", status: "active", trend: "stable", trendValue: 0,
    certifications: ["Gluten-Free", "Non-GMO"], allergens: [],
    origin: "USA", lastUpdated: "1 week ago", activeProducts: 8, conceptProducts: 15, starred: false,
  },
  {
    id: "3", name: "Turmeric Extract", category: "Food", subCategory: "Spice", form: "Powder",
    supplier: "Spice Origins", score: 78, nutritionScore: 82, sustainabilityScore: 70, costScore: 65,
    price: 18.20, unit: "kg", status: "flagged", trend: "down", trendValue: -5.1,
    certifications: ["USDA Organic"], allergens: [],
    origin: "India", lastUpdated: "3 days ago", activeProducts: 25, conceptProducts: 3,
    starred: false, alert: "Supply chain disruption — 3-week delay expected",
  },
  {
    id: "4", name: "Pea Protein Isolate", category: "Food", subCategory: "Protein", form: "Powder",
    supplier: "ProGreen Labs", score: 95, nutritionScore: 97, sustainabilityScore: 93, costScore: 82,
    price: 7.20, unit: "kg", status: "active", trend: "up", trendValue: 8.4,
    certifications: ["USDA Organic", "Non-GMO", "Vegan"], allergens: [],
    origin: "Canada", lastUpdated: "5 hours ago", activeProducts: 18, conceptProducts: 9, starred: true,
  },
  {
    id: "5", name: "Coconut Sugar", category: "Food", subCategory: "Sweetener", form: "Granule",
    supplier: "Island Harvest", score: 83, nutritionScore: 78, sustainabilityScore: 89, costScore: 76,
    price: 5.80, unit: "kg", status: "active", trend: "up", trendValue: 1.4,
    certifications: ["Fair Trade", "USDA Organic"], allergens: [],
    origin: "Philippines", lastUpdated: "4 days ago", activeProducts: 6, conceptProducts: 11, starred: false,
  },
  {
    id: "6", name: "Himalayan Pink Salt", category: "Food", subCategory: "Mineral", form: "Crystal",
    supplier: "Peak Minerals", score: 88, nutritionScore: 85, sustainabilityScore: 90, costScore: 92,
    price: 1.20, unit: "kg", status: "active", trend: "stable", trendValue: 0,
    certifications: ["Natural", "Non-GMO"], allergens: [],
    origin: "Pakistan", lastUpdated: "2 weeks ago", activeProducts: 32, conceptProducts: 7, starred: false,
  },
  {
    id: "7", name: "Avocado Oil", category: "Food", subCategory: "Oil", form: "Liquid",
    supplier: "Verde Organics", score: 91, nutritionScore: 93, sustainabilityScore: 87, costScore: 72,
    price: 12.40, unit: "kg", status: "active", trend: "down", trendValue: -2.1,
    certifications: ["USDA Organic", "Non-GMO"], allergens: [],
    origin: "Mexico", lastUpdated: "1 day ago", activeProducts: 9, conceptProducts: 4, starred: true,
  },
  {
    id: "8", name: "Chicory Root Fiber", category: "Food", subCategory: "Fiber", form: "Powder",
    supplier: "FiberTech EU", score: 86, nutritionScore: 88, sustainabilityScore: 84, costScore: 80,
    price: 6.10, unit: "kg", status: "concept", trend: "up", trendValue: 4.7,
    certifications: ["Non-GMO", "EU Organic"], allergens: [],
    origin: "Belgium", lastUpdated: "6 days ago", activeProducts: 0, conceptProducts: 8, starred: false,
  },
  {
    id: "9", name: "Freeze Dried Blueberry", category: "Food", subCategory: "Fruit", form: "Granule",
    supplier: "Arctic Berry Co.", score: 89, nutritionScore: 91, sustainabilityScore: 86, costScore: 68,
    price: 22.00, unit: "kg", status: "active", trend: "up", trendValue: 2.8,
    certifications: ["USDA Organic", "Non-GMO"], allergens: [],
    origin: "USA", lastUpdated: "3 days ago", activeProducts: 14, conceptProducts: 6, starred: false,
  },
  {
    id: "10", name: "Oat Flour", category: "Food", subCategory: "Grain", form: "Powder",
    supplier: "Nordic Grains", score: 84, nutritionScore: 86, sustainabilityScore: 82, costScore: 94,
    price: 1.80, unit: "kg", status: "active", trend: "stable", trendValue: 0,
    certifications: ["Gluten-Free", "Non-GMO"], allergens: ["Oat"],
    origin: "Sweden", lastUpdated: "1 week ago", activeProducts: 21, conceptProducts: 12, starred: false,
  },
  {
    id: "11", name: "Matcha Powder", category: "Food", subCategory: "Tea", form: "Powder",
    supplier: "Kyoto Greens", score: 90, nutritionScore: 92, sustainabilityScore: 88, costScore: 61,
    price: 48.00, unit: "kg", status: "active", trend: "up", trendValue: 6.2,
    certifications: ["USDA Organic", "JAS Organic"], allergens: [],
    origin: "Japan", lastUpdated: "2 days ago", activeProducts: 7, conceptProducts: 4, starred: true,
  },
  {
    id: "12", name: "Sunflower Lecithin", category: "Food", subCategory: "Emulsifier", form: "Liquid",
    supplier: "SunBio Labs", score: 79, nutritionScore: 75, sustainabilityScore: 83, costScore: 86,
    price: 3.60, unit: "kg", status: "concept", trend: "down", trendValue: -1.3,
    certifications: ["Non-GMO", "Soy-Free"], allergens: [],
    origin: "Ukraine", lastUpdated: "2 weeks ago", activeProducts: 0, conceptProducts: 3, starred: false,
  },
]

const CATEGORIES = ["All", "Food", "Beverages", "Cosmetic", "Household", "Supplement"]
const STATUSES = ["All", "Active", "Concept", "Flagged"]
const FORMS = ["All", "Powder", "Liquid", "Puree", "Granule", "Crystal"]

// ─── Score Ring ──────────────────────────────────────────���────────────────────

function ScoreRing({ value, size = 48, label }: { value: number; size?: number; label?: string }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const fill = (value / 100) * circ
  const color = value >= 85 ? "#22c55e" : value >= 70 ? "#f59e0b" : "#ef4444"
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          className="rotate-90" style={{ transform: `rotate(90deg) translate(0, 0)`, fontSize: size < 44 ? 10 : 12, fontWeight: 700, fill: "#1e293b", transformOrigin: "center" }}>
          {value}
        </text>
      </svg>
      {label && <span className="text-[10px] text-slate-500 font-medium">{label}</span>}
    </div>
  )
}

// ─── Nutrition Data Type ──────────────────────────────────────────────────────

interface NutritionData {
  kCals: number
  totalFat: number
  saturatedFat: number
  transFat: number
  cholesterol: number
  sodium: number
  totalCarbohydrate: number
  dietaryFiber: number
  totalSugars: number
  addedSugars: number
  protein: number
  potassiumDV: number
  calciumDV: number
  ironDV: number
  vitaminCDV: number
  vitaminDDV: number
}

// Mock nutrition data for ingredients
const nutritionDataMap: Record<string, NutritionData> = {
  "1": { kCals: 60, totalFat: 0.4, saturatedFat: 0.1, transFat: 0, cholesterol: 0, sodium: 1, totalCarbohydrate: 15, dietaryFiber: 1.6, totalSugars: 14, addedSugars: 0, protein: 0.8, potassiumDV: 4, calciumDV: 1, ironDV: 1, vitaminCDV: 60, vitaminDDV: 0 },
  "2": { kCals: 343, totalFat: 3.4, saturatedFat: 0.7, transFat: 0, cholesterol: 0, sodium: 1, totalCarbohydrate: 71.5, dietaryFiber: 10, totalSugars: 0.9, addedSugars: 0, protein: 13.3, potassiumDV: 13, calciumDV: 2, ironDV: 13, vitaminCDV: 0, vitaminDDV: 0 },
  "3": { kCals: 312, totalFat: 3.3, saturatedFat: 1.8, transFat: 0, cholesterol: 0, sodium: 27, totalCarbohydrate: 67, dietaryFiber: 22.7, totalSugars: 3.2, addedSugars: 0, protein: 9.7, potassiumDV: 62, calciumDV: 17, ironDV: 307, vitaminCDV: 1, vitaminDDV: 0 },
  "4": { kCals: 370, totalFat: 2, saturatedFat: 0.4, transFat: 0, cholesterol: 0, sodium: 1230, totalCarbohydrate: 2, dietaryFiber: 1, totalSugars: 0, addedSugars: 0, protein: 80, potassiumDV: 2, calciumDV: 6, ironDV: 50, vitaminCDV: 0, vitaminDDV: 0 },
  "5": { kCals: 375, totalFat: 1.5, saturatedFat: 1.3, transFat: 0, cholesterol: 0, sodium: 45, totalCarbohydrate: 92.1, dietaryFiber: 0, totalSugars: 92.1, addedSugars: 0, protein: 1.1, potassiumDV: 30, calciumDV: 3, ironDV: 5, vitaminCDV: 0, vitaminDDV: 0 },
  "6": { kCals: 0, totalFat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 36840, totalCarbohydrate: 0, dietaryFiber: 0, totalSugars: 0, addedSugars: 0, protein: 0, potassiumDV: 1, calciumDV: 2, ironDV: 2, vitaminCDV: 0, vitaminDDV: 0 },
  "7": { kCals: 884, totalFat: 100, saturatedFat: 12, transFat: 0, cholesterol: 0, sodium: 0, totalCarbohydrate: 0, dietaryFiber: 0, totalSugars: 0, addedSugars: 0, protein: 0, potassiumDV: 0, calciumDV: 0, ironDV: 0, vitaminCDV: 0, vitaminDDV: 0 },
  "8": { kCals: 17, totalFat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 14, totalCarbohydrate: 0, dietaryFiber: 0, totalSugars: 0, addedSugars: 0, protein: 0, potassiumDV: 0, calciumDV: 3, ironDV: 1, vitaminCDV: 0, vitaminDDV: 0 },
  "9": { kCals: 325, totalFat: 4.5, saturatedFat: 0.3, transFat: 0, cholesterol: 0, sodium: 3, totalCarbohydrate: 77, dietaryFiber: 13, totalSugars: 55, addedSugars: 0, protein: 1.5, potassiumDV: 7, calciumDV: 2, ironDV: 5, vitaminCDV: 80, vitaminDDV: 0 },
  "10": { kCals: 404, totalFat: 9.1, saturatedFat: 1.6, transFat: 0, cholesterol: 0, sodium: 19, totalCarbohydrate: 65.7, dietaryFiber: 6.5, totalSugars: 0.8, addedSugars: 0, protein: 14.7, potassiumDV: 11, calciumDV: 5, ironDV: 26, vitaminCDV: 0, vitaminDDV: 0 },
  "11": { kCals: 324, totalFat: 5.3, saturatedFat: 1.1, transFat: 0, cholesterol: 0, sodium: 9, totalCarbohydrate: 38.5, dietaryFiber: 38.5, totalSugars: 0, addedSugars: 0, protein: 30.4, potassiumDV: 40, calciumDV: 42, ironDV: 97, vitaminCDV: 10, vitaminDDV: 0 },
  "12": { kCals: 763, totalFat: 97, saturatedFat: 22, transFat: 0, cholesterol: 0, sodium: 2, totalCarbohydrate: 0, dietaryFiber: 0, totalSugars: 0, addedSugars: 0, protein: 0, potassiumDV: 0, calciumDV: 0, ironDV: 0, vitaminCDV: 0, vitaminDDV: 0 },
}

// ─── Full Page Ingredient Detail View ─────────────────────────────────────────

function IngredientFullPageView({ ingredient, onBack }: { ingredient: Ingredient; onBack: () => void }) {
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [nutritionExpanded, setNutritionExpanded] = useState(true)
  const [sustainabilityExpanded, setSustainabilityExpanded] = useState(false)
  const [costExpanded, setCostExpanded] = useState(false)
  const [regulatoryExpanded, setRegulatoryExpanded] = useState(false)
  
  const nutritionData = nutritionDataMap[ingredient.id] || nutritionDataMap["1"]

  // Get compliance data for this ingredient
  const complianceStatus: IngredientComplianceStatus = ingredientComplianceData[ingredient.id] || {
    ingredientId: ingredient.id,
    overallStatus: "pending" as ComplianceStatus,
    regionStatuses: [{ regionCode: "NA", status: "pending" as ComplianceStatus, issues: [] }],
    lastChecked: new Date().toISOString(),
  }

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "EU", name: "European Union", flag: "🇪🇺" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
  ]

  const selectedCountryData = countries.find(c => c.code === selectedCountry)

  // Value color helper
  const getValueColor = (value: number) => {
    if (value === 0) return "text-slate-400"
    return "text-violet-600"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <button 
            type="button" 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ingredients
          </button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-800">{ingredient.name}</h1>
                  {ingredient.starred && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    ingredient.status === "active" ? "bg-green-100 text-green-700" :
                    ingredient.status === "flagged" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {ingredient.status.charAt(0).toUpperCase() + ingredient.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{ingredient.subCategory} · {ingredient.form} · {ingredient.origin}</p>
                <p className="text-xs text-slate-400 mt-0.5">Last updated {ingredient.lastUpdated}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4 text-slate-500" />
              </button>
              <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <ExternalLink className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      {ingredient.alert && (
        <div className="mx-6 mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Supply Alert</p>
            <p className="text-sm text-red-700 mt-0.5">{ingredient.alert}</p>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Large ingredient photo placeholder */}
          <div className="aspect-square max-h-80 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-100 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-2xl bg-white/60 border border-green-200/50 flex items-center justify-center shadow-sm">
                <Leaf className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-sm text-green-600 mt-4 font-medium">{ingredient.name}</p>
              <p className="text-xs text-green-500 mt-1">{ingredient.form} form</p>
            </div>
          </div>

          {/* Country selector */}
          <div className="relative">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
              Region
            </label>
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{selectedCountryData?.flag}</span>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Ingredient info label */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-slate-400" />
              Ingredient info
            </h3>
          </div>

          {/* Documents section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Documents</h4>
            <div className="flex gap-3">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Datasheet</span>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                <FileCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Claim</span>
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                <Scale className="h-4 w-4" />
                <span className="text-sm font-medium">Regulation</span>
              </button>
            </div>
          </div>

          {/* Allergen Statements */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Allergen Statements</h4>
            {ingredient.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredient.allergens.map((allergen) => (
                  <span key={allergen} className="px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-medium">
                    {allergen}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg w-fit">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-600 font-medium">Not Available</span>
              </div>
            )}
          </div>

          {/* Certification */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Certification</h4>
            {ingredient.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ingredient.certifications.map((cert) => (
                  <span key={cert} className="px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg w-fit">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-600 font-medium">Not Available</span>
              </div>
            )}
          </div>

          {/* Shelf Life */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Shelf Life</h4>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg w-fit">
              <Timer className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-600 font-medium">Not Available</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Score summary row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Apple className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-xs text-slate-500 font-medium">Nutrition</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{ingredient.nutritionScore}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Leaf className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-xs text-slate-500 font-medium">Sustainability</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{ingredient.sustainabilityScore > 0 ? ingredient.sustainabilityScore : "0"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-xs text-slate-500 font-medium">Cost</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{ingredient.costScore > 0 ? `$${ingredient.price.toFixed(2)}` : "N/A"}</p>
            </div>
          </div>

          {/* Nutrition analysis accordion - open by default */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setNutritionExpanded(!nutritionExpanded)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <span className="font-semibold text-slate-800">Nutrition analysis</span>
              </div>
              {nutritionExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {nutritionExpanded && (
              <div className="p-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {/* Left column */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">kCals</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.kCals)}`}>{nutritionData.kCals}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Total fat</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.totalFat)}`}>{nutritionData.totalFat}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Saturated fat</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.saturatedFat)}`}>{nutritionData.saturatedFat}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Trans fat</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.transFat)}`}>{nutritionData.transFat}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Cholesterol</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.cholesterol)}`}>{nutritionData.cholesterol}mg</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Sodium</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.sodium)}`}>{nutritionData.sodium}mg</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Total carbohydrate</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.totalCarbohydrate)}`}>{nutritionData.totalCarbohydrate}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Dietary fiber</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.dietaryFiber)}`}>{nutritionData.dietaryFiber}g</span>
                    </div>
                  </div>
                  {/* Right column */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Total sugars</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.totalSugars)}`}>{nutritionData.totalSugars}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Added sugars</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.addedSugars)}`}>{nutritionData.addedSugars}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Protein</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.protein)}`}>{nutritionData.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Potassium %DV</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.potassiumDV)}`}>{nutritionData.potassiumDV}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Calcium %DV</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.calciumDV)}`}>{nutritionData.calciumDV}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Iron %DV</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.ironDV)}`}>{nutritionData.ironDV}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Vitamin C %DV</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.vitaminCDV)}`}>{nutritionData.vitaminCDV}%</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-600">Vitamin D %DV</span>
                      <span className={`text-sm font-semibold ${getValueColor(nutritionData.vitaminDDV)}`}>{nutritionData.vitaminDDV}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sustainability analysis accordion - collapsed by default */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setSustainabilityExpanded(!sustainabilityExpanded)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Droplets className="h-5 w-5 text-green-500" />
                </div>
                <span className="font-semibold text-slate-800">Sustainability analysis</span>
              </div>
              {sustainabilityExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {sustainabilityExpanded && (
              <div className="p-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Carbon Footprint</p>
                    <p className="text-lg font-semibold text-green-700 mt-1">2.4 kg CO2e</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Water Usage</p>
                    <p className="text-lg font-semibold text-blue-700 mt-1">120 L/kg</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Land Use</p>
                    <p className="text-lg font-semibold text-amber-700 mt-1">3.2 m²/kg</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Overall Score</p>
                    <p className="text-lg font-semibold text-purple-700 mt-1">{ingredient.sustainabilityScore}/100</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost prediction accordion - collapsed by default */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setCostExpanded(!costExpanded)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <span className="font-semibold text-slate-800">Cost prediction</span>
              </div>
              {costExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {costExpanded && (
              <div className="p-4 border-t border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Current Price</span>
                    <span className="text-lg font-semibold text-slate-800">${ingredient.price.toFixed(2)}/{ingredient.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">30-Day Forecast</span>
                    <span className={`text-sm font-semibold ${ingredient.trend === "up" ? "text-red-600" : ingredient.trend === "down" ? "text-green-600" : "text-slate-600"}`}>
                      {ingredient.trend === "up" ? "+" : ingredient.trend === "down" ? "-" : ""}{Math.abs(ingredient.trendValue)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Market Trend</span>
                    <div className="flex items-center gap-1">
                      {ingredient.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : ingredient.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                      <span className="text-sm font-medium capitalize text-slate-700">{ingredient.trend}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Supplier: {ingredient.supplier}</p>
                    <p className="text-xs text-slate-500 mt-1">Origin: {ingredient.origin}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Regulatory compliance accordion */}
          <div className={`border rounded-xl overflow-hidden ${getComplianceStatusColor(complianceStatus.overallStatus).border}`}>
            <button
              type="button"
              onClick={() => setRegulatoryExpanded(!regulatoryExpanded)}
              className={`w-full flex items-center justify-between p-4 ${getComplianceStatusColor(complianceStatus.overallStatus).bg} hover:brightness-95 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${complianceStatus.overallStatus === "compliant" ? "bg-green-100" : complianceStatus.overallStatus === "review-needed" ? "bg-amber-100" : complianceStatus.overallStatus === "blocked" ? "bg-red-100" : "bg-slate-100"}`}>
                  <Shield className={`h-5 w-5 ${complianceStatus.overallStatus === "compliant" ? "text-green-500" : complianceStatus.overallStatus === "review-needed" ? "text-amber-500" : complianceStatus.overallStatus === "blocked" ? "text-red-500" : "text-slate-500"}`} />
                </div>
                <span className="font-semibold text-slate-800">Regulatory compliance</span>
                <ComplianceBadge status={complianceStatus.overallStatus} size="sm" />
              </div>
              {regulatoryExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {regulatoryExpanded && (
              <div className="p-4 border-t border-slate-200 bg-white">
                {/* Region compliance grid */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status by Region</p>
                  {complianceStatus.regionStatuses.map((regionStatus) => {
                    const region = getRegionByCode(regionStatus.regionCode)
                    const statusColors = getComplianceStatusColor(regionStatus.status)
                    return (
                      <div key={regionStatus.regionCode} className={`flex items-center justify-between p-3 rounded-lg border ${statusColors.border} ${statusColors.bg}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{region?.flag}</span>
                          <span className="text-sm font-medium text-slate-700">{region?.name || regionStatus.regionCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ComplianceBadge status={regionStatus.status} size="sm" />
                          {regionStatus.issues.length > 0 && (
                            <span className="text-xs text-slate-500">({regionStatus.issues.length} issue{regionStatus.issues.length !== 1 ? "s" : ""})</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Issues if any */}
                {complianceStatus.regionStatuses.some(rs => rs.issues.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Issues Detected</p>
                    <div className="space-y-2">
                      {complianceStatus.regionStatuses.flatMap(rs => rs.issues).map((issue) => (
                        <div key={issue.id} className={`p-3 rounded-lg border ${getComplianceStatusColor(issue.status).border} ${getComplianceStatusColor(issue.status).bg}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-800">{issue.ruleName}</span>
                            <SeverityBadge severity={issue.severity} size="sm" />
                          </div>
                          <p className="text-xs text-slate-600">{issue.description}</p>
                          {issue.aiFix && (
                            <div className="mt-2 pt-2 border-t border-slate-200/50">
                              <p className="text-xs text-blue-600 flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                AI Fix: {issue.aiFix}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All clear message if no issues */}
                {complianceStatus.overallStatus === "compliant" && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    No regulatory issues detected for this ingredient.
                  </div>
                )}

                {/* Last checked */}
                <p className="mt-4 text-xs text-slate-400">
                  Last checked: {new Date(complianceStatus.lastChecked).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Product usage summary */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Product Usage</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{ingredient.activeProducts + ingredient.conceptProducts}</p>
                  <p className="text-xs text-slate-500">Total products</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-green-600">{ingredient.activeProducts}</p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-amber-600">{ingredient.conceptProducts}</p>
                  <p className="text-xs text-slate-500">Concept</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Ingredient Detail Drawer ─────────────────────────────────────────────────

function IngredientDetailDrawer({ ingredient, onClose }: { ingredient: Ingredient; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "nutrition" | "supply" | "products">("overview")

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center">
              <Leaf className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">{ingredient.name}</h2>
                {ingredient.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
              </div>
              <p className="text-sm text-slate-500">{ingredient.subCategory} · {ingredient.form} · {ingredient.origin}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ingredient.status === "active" ? "bg-green-100 text-green-700" :
                  ingredient.status === "flagged" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {ingredient.status.charAt(0).toUpperCase() + ingredient.status.slice(1)}
                </span>
                <span className="text-xs text-slate-400">Updated {ingredient.lastUpdated}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Alert banner */}
        {ingredient.alert && (
          <div className="mx-6 mt-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{ingredient.alert}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 mt-4">
          {(["overview", "nutrition", "supply", "products"] as const).map((tab) => (
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
              {/* Score row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Overall", value: ingredient.score },
                  { label: "Nutrition", value: ingredient.nutritionScore },
                  { label: "Sustain.", value: ingredient.sustainabilityScore },
                  { label: "Cost", value: ingredient.costScore },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 flex flex-col items-center gap-1">
                    <ScoreRing value={value} size={56} />
                    <span className="text-xs text-slate-500 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><DollarSign className="h-3 w-3" />Price per {ingredient.unit}</p>
                  <p className="text-2xl font-bold text-slate-800">${ingredient.price.toFixed(2)}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${ingredient.trend === "up" ? "text-red-500" : ingredient.trend === "down" ? "text-green-500" : "text-slate-400"}`}>
                    {ingredient.trend === "up" ? <TrendingUp className="h-3 w-3" /> : ingredient.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                    {ingredient.trendValue !== 0 ? `${Math.abs(ingredient.trendValue)}% vs last period` : "No change"}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Package className="h-3 w-3" />Product usage</p>
                  <p className="text-2xl font-bold text-slate-800">{ingredient.activeProducts + ingredient.conceptProducts}</p>
                  <p className="text-xs text-slate-500 mt-1">{ingredient.activeProducts} active · {ingredient.conceptProducts} concept</p>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Certifications</p>
                <div className="flex flex-wrap gap-1.5">
                  {ingredient.certifications.map((c) => (
                    <span key={c} className="px-2.5 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              {ingredient.allergens.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Allergens</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ingredient.allergens.map((a) => (
                      <span key={a} className="px-2.5 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplier */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Supplier</p>
                <p className="text-sm font-semibold text-slate-800">{ingredient.supplier}</p>
                <p className="text-xs text-slate-500 mt-0.5">Origin: {ingredient.origin}</p>
              </div>
            </>
          )}

          {activeTab === "nutrition" && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Nutritional Profile</p>
                {[
                  { label: "Nutrition Score", value: ingredient.nutritionScore, max: 100 },
                  { label: "Sustainability Score", value: ingredient.sustainabilityScore, max: 100 },
                  { label: "Processing Level", value: 25, max: 100, invert: true },
                  { label: "Bioavailability", value: 78, max: 100 },
                ].map(({ label, value }) => (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{label}</span><span className="font-semibold">{value}/100</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full">
                      <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[["Calories", "342 kcal/100g"], ["Protein", "4.2g / 100g"], ["Carbohydrates", "78g / 100g"], ["Fat", "1.1g / 100g"], ["Fiber", "6.3g / 100g"], ["Sodium", "12mg / 100g"]].map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">{k}</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "supply" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Clock, label: "Lead Time", value: "14–21 days" },
                  { icon: RefreshCw, label: "Reorder Point", value: "500 kg" },
                  { icon: BarChart3, label: "Stock Level", value: "2,340 kg" },
                  { icon: TrendingUp, label: "Demand Trend", value: "+12% MoM" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><Icon className="h-3.5 w-3.5 text-slate-400" /><p className="text-xs text-slate-500">{label}</p></div>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Supply History</p>
                <div className="space-y-2">
                  {["Mar 2026 — On time delivery", "Feb 2026 — On time delivery", "Jan 2026 — Minor delay (+3 days)", "Dec 2025 — On time delivery"].map((entry) => (
                    <div key={entry} className="flex items-center gap-2 text-sm">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${entry.includes("delay") ? "bg-amber-400" : "bg-green-400"}`} />
                      <span className="text-slate-600">{entry}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Used in {ingredient.activeProducts + ingredient.conceptProducts} Products</p>
              {[
                { name: "Organic Protein Bar", status: "active", role: "Primary protein source", qty: "28g/serving" },
                { name: "Green Smoothie Mix", status: "active", role: "Flavor base", qty: "15g/serving" },
                { name: "Recovery Shake", status: "concept", role: "Secondary ingredient", qty: "10g/serving" },
                { name: "Breakfast Bowl", status: "active", role: "Topping component", qty: "8g/serving" },
                { name: "Energy Bites", status: "concept", role: "Binding agent", qty: "12g/serving" },
              ].slice(0, ingredient.activeProducts + ingredient.conceptProducts).map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.role} · {p.qty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.status}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex gap-3">
          <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
            <Zap className="h-4 w-4" />
            Find Alternatives
          </button>
          <button type="button" className="px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Ingredient Grid Card ─────────────────────────────────────────────────────

function IngredientGridCard({ ingredient, onView }: { ingredient: Ingredient; onView: () => void }) {
  const scoreColor = ingredient.score >= 85 ? "text-green-600" : ingredient.score >= 70 ? "text-amber-600" : "text-red-600"
  const scoreBg = ingredient.score >= 85 ? "bg-green-50 border-green-200" : ingredient.score >= 70 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group" onClick={onView}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
            <Leaf className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate leading-tight">{ingredient.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{ingredient.subCategory} · {ingredient.form}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {ingredient.starred && <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${scoreBg} ${scoreColor}`}>
            {ingredient.score}
          </span>
        </div>
      </div>

      {ingredient.alert && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-1.5">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span className="truncate">{ingredient.alert}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Nutrition", value: ingredient.nutritionScore },
          { label: "Sustain.", value: ingredient.sustainabilityScore },
          { label: "Cost", value: ingredient.costScore },
        ].map(({ label, value }) => (
          <div key={label} className="text-center bg-slate-50 rounded-lg py-2">
            <p className="text-xs font-bold text-slate-700">{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
          ${ingredient.price.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/{ingredient.unit}</span>
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-medium ${
          ingredient.trend === "up" ? "text-red-500" : ingredient.trend === "down" ? "text-green-500" : "text-slate-400"
        }`}>
          {ingredient.trend === "up" ? <TrendingUp className="h-3 w-3" /> : ingredient.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
          {ingredient.trendValue !== 0 ? `${Math.abs(ingredient.trendValue)}%` : "Stable"}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Package className="h-3 w-3" />{ingredient.activeProducts} active</span>
        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{ingredient.conceptProducts} concept</span>
        <span className="ml-auto text-slate-400">{ingredient.origin}</span>
      </div>
    </div>
  )
}

// ─── Ingredient List Row ──────────────────────────────────────────────────────

function IngredientListRow({ ingredient, onView }: { ingredient: Ingredient; onView: () => void }) {
  const scoreColor = ingredient.score >= 85 ? "text-green-600 bg-green-50" : ingredient.score >= 70 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50"

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group" onClick={onView}>
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
        <Leaf className="h-4 w-4 text-green-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{ingredient.name}</p>
          {ingredient.starred && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />}
          {ingredient.alert && <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />}
        </div>
        <p className="text-xs text-slate-500">{ingredient.subCategory} · {ingredient.form} · {ingredient.supplier}</p>
      </div>

      <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 shrink-0">
        <div className="text-center w-14">
          <p className="text-[10px] text-slate-400">Nutrition</p>
          <p className="font-semibold">{ingredient.nutritionScore}</p>
        </div>
        <div className="text-center w-14">
          <p className="text-[10px] text-slate-400">Sustain.</p>
          <p className="font-semibold">{ingredient.sustainabilityScore}</p>
        </div>
        <div className="text-center w-14">
          <p className="text-[10px] text-slate-400">Cost</p>
          <p className="font-semibold">{ingredient.costScore}</p>
        </div>
        <div className="text-right w-20">
          <p className="text-[10px] text-slate-400">Price/kg</p>
          <p className="font-semibold">${ingredient.price.toFixed(2)}</p>
        </div>
        <div className="text-center w-16">
          <p className="text-[10px] text-slate-400">Products</p>
          <p className="font-semibold">{ingredient.activeProducts + ingredient.conceptProducts}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${scoreColor}`}>{ingredient.score}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          ingredient.status === "active" ? "bg-green-100 text-green-700" :
          ingredient.status === "flagged" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
        }`}>{ingredient.status}</span>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  )
}

// ─── Main IngredientsPage ─────────────────────────────────────────────────────

export function IngredientsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [formFilter, setFormFilter] = useState("All")
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [showFullPage, setShowFullPage] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const filtered = ingredientsData.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "All" || i.category === categoryFilter
    const matchStatus = statusFilter === "All" || i.status === statusFilter.toLowerCase()
    const matchForm = formFilter === "All" || i.form === formFilter
    return matchSearch && matchCategory && matchStatus && matchForm
  })

  const displayed = showAll ? filtered : filtered.slice(0, 9)

  const alerts = ingredientsData.filter((i) => i.alert || i.status === "flagged")
  const flaggedCount = ingredientsData.filter((i) => i.status === "flagged").length
  const activeCount = ingredientsData.filter((i) => i.status === "active").length

  const handleViewIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setShowFullPage(true)
  }

  const handleBackToList = () => {
    setShowFullPage(false)
    setSelectedIngredient(null)
  }

  // Show full page view when ingredient is selected
  if (showFullPage && selectedIngredient) {
    return <IngredientFullPageView ingredient={selectedIngredient} onBack={handleBackToList} />
  }

  return (
    <div className="space-y-6">
      {/* Hero stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Actions card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" />Ingredient Actions
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Notifications Pending</span>
              <span className="font-semibold text-slate-800">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Actions Pending</span>
              <span className="font-semibold text-slate-800">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Flagged Ingredients</span>
              <span className="font-semibold text-red-600">{flaggedCount}</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${(activeCount / ingredientsData.length) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeCount}/{ingredientsData.length} active</p>
        </div>

        {/* Active Products stat */}
        <div className="rounded-xl p-5 text-white flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}>
          <div>
            <p className="text-blue-200 text-xs font-medium mb-1">Active Ingredients</p>
            <p className="text-4xl font-bold">{activeCount}</p>
            <p className="text-blue-200 text-xs mt-1">Across all products</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-300 font-medium">
              <TrendingUp className="h-3 w-3" />+12% this period
            </div>
          </div>
          <Leaf className="h-12 w-12 text-blue-300 opacity-50" />
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />Ingredient Alerts
          </h3>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-400">No active alerts</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-start gap-2 text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full mt-1 shrink-0 ${a.status === "flagged" ? "bg-red-500" : "bg-amber-500"}`} />
                  <div>
                    <p className="font-medium text-slate-700">{a.name}</p>
                    <p className="text-slate-500">{a.alert ?? "Status: " + a.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* List/Grid section */}
      <div className="bg-white rounded-xl border border-slate-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-slate-800">All Ingredients</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{filtered.length} items</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredients..."
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Form filter */}
            <div className="relative">
              <select
                value={formFilter} onChange={(e) => setFormFilter(e.target.value)}
                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
              >
                {FORMS.map((f) => <option key={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            <button
              type="button" onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
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

        {/* List header (list view only) */}
        {viewMode === "list" && (
          <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <span className="w-9" />
            <span>Ingredient</span>
            <div className="flex items-center gap-6 pr-16">
              <span className="w-14 text-center">Nutrition</span>
              <span className="w-14 text-center">Sustain.</span>
              <span className="w-14 text-center">Cost</span>
              <span className="w-20 text-right">Price/kg</span>
              <span className="w-16 text-center">Products</span>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {displayed.map((ingredient) => (
              <IngredientGridCard key={ingredient.id} ingredient={ingredient} onView={() => handleViewIngredient(ingredient)} />
            ))}
          </div>
        ) : (
          <div>
            {displayed.map((ingredient) => (
              <IngredientListRow key={ingredient.id} ingredient={ingredient} onView={() => handleViewIngredient(ingredient)} />
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
          <p className="text-sm text-slate-600">Monitor ingredient alerts for supply chain issues, price changes, and quality score updates. Set up notifications to stay ahead of potential disruptions.</p>
        </div>
      </div>

    </div>
  )
}
