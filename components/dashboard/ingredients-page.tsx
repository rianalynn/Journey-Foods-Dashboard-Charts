"use client"

import { useState } from "react"
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  X,
  Leaf,
  Star,
  DollarSign,
  ArrowRight,
  FileText,
  Shield,
  AlertCircle,
  Clock,
  Share2,
  Edit3,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface Ingredient {
  id: string
  name: string
  supplier: string
  lastUpdated: string
  verified: boolean
  nutritionScore: number
  sustainabilityScore: number
  cost: string
  country: string
  countryFlag: string
  manufacturer: string
  pricePerUnit: string
  roi: string
  starred: boolean
  nutrition: NutritionData
  documents: { datasheet: boolean; claim: boolean; regulation: boolean }
  allergenStatements: string
  certification: string
  shelfLife: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ingredientsData: Ingredient[] = [
  {
    id: "1",
    name: "simply orange orange juice",
    supplier: "General",
    lastUpdated: "Wed Jan 21 2026",
    verified: false,
    nutritionScore: 73.74,
    sustainabilityScore: 0,
    cost: "NA",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$2.50/L",
    roi: "Coming Soon",
    starred: false,
    nutrition: {
      kCals: 68.6,
      totalFat: 0.02,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 1.4,
      totalCarbohydrate: 17.56,
      dietaryFiber: 3.08,
      totalSugars: 11.9,
      addedSugars: 0,
      protein: 1.27,
      potassiumDV: 232.4,
      calciumDV: 60.2,
      ironDV: 0.182,
      vitaminCDV: 82.74,
      vitaminDDV: 0,
    },
    documents: { datasheet: true, claim: true, regulation: true },
    allergenStatements: "",
    certification: "",
    shelfLife: "",
  },
  {
    id: "2",
    name: "cod",
    supplier: "General",
    lastUpdated: "Tue Jan 06 2026",
    verified: false,
    nutritionScore: 74.14,
    sustainabilityScore: 0,
    cost: "NA",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$12.00/kg",
    roi: "Coming Soon",
    starred: false,
    nutrition: {
      kCals: 189,
      totalFat: 0.3,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 99,
      sodium: 140.4,
      totalCarbohydrate: 0,
      dietaryFiber: 0,
      totalSugars: 0,
      addedSugars: 0,
      protein: 41.09,
      potassiumDV: 439.2,
      calciumDV: 25.2,
      ironDV: 0.882,
      vitaminCDV: 1.8,
      vitaminDDV: 2.16,
    },
    documents: { datasheet: true, claim: true, regulation: true },
    allergenStatements: "",
    certification: "",
    shelfLife: "",
  },
  {
    id: "3",
    name: "#1 Fine Dark Brown",
    supplier: "General",
    lastUpdated: "1 week ago",
    verified: true,
    nutritionScore: 65,
    sustainabilityScore: 45,
    cost: "$3.20/kg",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$3.20/kg",
    roi: "Coming Soon",
    starred: false,
    nutrition: {
      kCals: 380,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 40,
      totalCarbohydrate: 98,
      dietaryFiber: 0,
      totalSugars: 97,
      addedSugars: 97,
      protein: 0,
      potassiumDV: 133,
      calciumDV: 83,
      ironDV: 0.71,
      vitaminCDV: 0,
      vitaminDDV: 0,
    },
    documents: { datasheet: true, claim: false, regulation: true },
    allergenStatements: "",
    certification: "",
    shelfLife: "",
  },
  {
    id: "4",
    name: "#1 Fine Organic Farro Bulgur Wheat",
    supplier: "General",
    lastUpdated: "3 days ago",
    verified: true,
    nutritionScore: 78,
    sustainabilityScore: 82,
    cost: "$4.50/kg",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$4.50/kg",
    roi: "Coming Soon",
    starred: true,
    nutrition: {
      kCals: 340,
      totalFat: 2.5,
      saturatedFat: 0.5,
      transFat: 0,
      cholesterol: 0,
      sodium: 5,
      totalCarbohydrate: 71,
      dietaryFiber: 10,
      totalSugars: 2,
      addedSugars: 0,
      protein: 12,
      potassiumDV: 250,
      calciumDV: 33,
      ironDV: 2.5,
      vitaminCDV: 0,
      vitaminDDV: 0,
    },
    documents: { datasheet: true, claim: true, regulation: true },
    allergenStatements: "Contains wheat",
    certification: "USDA Organic",
    shelfLife: "18 months",
  },
  {
    id: "5",
    name: "#1 Fine Organic Freekeh Bulgur Wheat",
    supplier: "General",
    lastUpdated: "5 days ago",
    verified: true,
    nutritionScore: 80,
    sustainabilityScore: 85,
    cost: "$5.20/kg",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$5.20/kg",
    roi: "Coming Soon",
    starred: false,
    nutrition: {
      kCals: 330,
      totalFat: 2,
      saturatedFat: 0.3,
      transFat: 0,
      cholesterol: 0,
      sodium: 8,
      totalCarbohydrate: 67,
      dietaryFiber: 16,
      totalSugars: 1,
      addedSugars: 0,
      protein: 14,
      potassiumDV: 280,
      calciumDV: 40,
      ironDV: 3.2,
      vitaminCDV: 0,
      vitaminDDV: 0,
    },
    documents: { datasheet: true, claim: true, regulation: true },
    allergenStatements: "Contains wheat",
    certification: "USDA Organic",
    shelfLife: "18 months",
  },
  {
    id: "6",
    name: "#1 Fine Traditional Bulgur Wheat",
    supplier: "General",
    lastUpdated: "1 week ago",
    verified: true,
    nutritionScore: 72,
    sustainabilityScore: 70,
    cost: "$2.80/kg",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$2.80/kg",
    roi: "Coming Soon",
    starred: false,
    nutrition: {
      kCals: 342,
      totalFat: 1.3,
      saturatedFat: 0.2,
      transFat: 0,
      cholesterol: 0,
      sodium: 17,
      totalCarbohydrate: 76,
      dietaryFiber: 18,
      totalSugars: 0.4,
      addedSugars: 0,
      protein: 12,
      potassiumDV: 410,
      calciumDV: 35,
      ironDV: 2.5,
      vitaminCDV: 0,
      vitaminDDV: 0,
    },
    documents: { datasheet: true, claim: false, regulation: true },
    allergenStatements: "Contains wheat",
    certification: "",
    shelfLife: "24 months",
  },
  {
    id: "7",
    name: "#1 Liquid Sucrose -67.5%",
    supplier: "General",
    lastUpdated: "2 weeks ago",
    verified: true,
    nutritionScore: 40,
    sustainabilityScore: 35,
    cost: "$1.50/L",
    country: "US",
    countryFlag: "🇺🇸",
    manufacturer: "General",
    pricePerUnit: "$1.50/L",
    roi: "Coming Soon",
    starred: false,
    nutrition: {
      kCals: 269,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 10,
      totalCarbohydrate: 67.5,
      dietaryFiber: 0,
      totalSugars: 67.5,
      addedSugars: 67.5,
      protein: 0,
      potassiumDV: 2,
      calciumDV: 2,
      ironDV: 0.1,
      vitaminCDV: 0,
      vitaminDDV: 0,
    },
    documents: { datasheet: true, claim: false, regulation: true },
    allergenStatements: "",
    certification: "",
    shelfLife: "12 months",
  },
]

const recentlyViewed = ingredientsData.slice(0, 12)

// ─── Ingredient Detail View ───────────────────────────────────────────────────

function IngredientDetailView({
  ingredient,
  onBack,
}: {
  ingredient: Ingredient
  onBack: () => void
}) {
  const [nutritionExpanded, setNutritionExpanded] = useState(true)
  const [sustainabilityExpanded, setSustainabilityExpanded] = useState(false)
  const [costExpanded, setCostExpanded] = useState(false)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Ingredients
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{ingredient.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Supplier: <span className="text-slate-700">{ingredient.supplier}</span></p>
          <p className="text-sm text-slate-500">Last Updated: <span className="text-slate-700">{ingredient.lastUpdated}</span></p>
        </div>
        <div className="flex items-center gap-3">
          {!ingredient.verified && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              Not Verified
            </div>
          )}
          <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Edit3 className="h-5 w-5 text-slate-500" />
          </button>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="retailer">Retailer</option>
            <option value="manufacturer">Manufacturer</option>
          </select>
          <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Share2 className="h-5 w-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side */}
        <div className="space-y-6">
          {/* Ingredient image */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="aspect-square max-w-xs mx-auto bg-slate-50 rounded-xl flex items-center justify-center">
              <Leaf className="h-24 w-24 text-slate-300" />
            </div>

            {/* Ingredient info */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Ingredient info:</span>
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm">
                {ingredient.countryFlag} {ingredient.country}
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* Document buttons */}
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Document</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    ingredient.documents.datasheet
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Datasheet
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    ingredient.documents.claim
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Claim
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    ingredient.documents.regulation
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Regulation
                </button>
              </div>
            </div>

            {/* Allergen Statements */}
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Allergen Statements</p>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-500">
                <AlertCircle className="h-4 w-4 text-red-400" />
                {ingredient.allergenStatements || "Statements Not Available"}
              </div>
            </div>

            {/* Certification */}
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Certification</p>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-500">
                <AlertCircle className="h-4 w-4 text-red-400" />
                {ingredient.certification || "Certification Not Available"}
              </div>
            </div>

            {/* Shelf life */}
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Shelf life</p>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-500">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                {ingredient.shelfLife || "Shelf Life Not Available"}
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Score cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Nutrition</p>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold text-slate-800">{ingredient.nutritionScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Sustainability</p>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-teal-500" />
                  <span className="text-2xl font-bold text-slate-800">{ingredient.sustainabilityScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Cost</p>
                <span className="text-2xl font-bold text-slate-800">{ingredient.cost}</span>
              </div>
            </div>
          </div>

          {/* Nutrition analysis accordion */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setNutritionExpanded(!nutritionExpanded)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Nutrition analysis</span>
              {nutritionExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {nutritionExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                  {/* Left column */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">kCals</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.kCals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total fat (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.totalFat}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Saturated fat (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.saturatedFat}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Trans fat (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.transFat}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Cholesterol (mg)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.cholesterol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Sodium (mg)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.sodium}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total carbohydrate (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.totalCarbohydrate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Dietary fiber (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.dietaryFiber}</span>
                    </div>
                  </div>
                  {/* Right column */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total sugars (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.totalSugars}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Added sugars (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.addedSugars}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Protein (g)</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.protein}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Potassium %DV</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.potassiumDV}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Calcium %DV</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.calciumDV}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Iron %DV</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.ironDV}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Vitamin C %DV</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.vitaminCDV}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Vitamin D %DV</span>
                      <span className="text-blue-600 font-medium">{ingredient.nutrition.vitaminDDV}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sustainability analysis accordion */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setSustainabilityExpanded(!sustainabilityExpanded)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Sustainability analysis</span>
              {sustainabilityExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {sustainabilityExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <p className="text-sm text-slate-500 mt-4">Sustainability data not available for this ingredient.</p>
              </div>
            )}
          </div>

          {/* Cost prediction accordion */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setCostExpanded(!costExpanded)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">Cost prediction</span>
              {costExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
            {costExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <p className="text-sm text-slate-500 mt-4">Cost prediction data not available for this ingredient.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main IngredientsPage ─────────────────────────────────────────────────────

export function IngredientsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [search, setSearch] = useState("")
  const [showStarred, setShowStarred] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredIngredients = ingredientsData.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(search.toLowerCase())
    const matchesStarred = !showStarred || ing.starred
    return matchesSearch && matchesStarred
  })

  // If viewing an ingredient detail
  if (selectedIngredient) {
    return (
      <IngredientDetailView
        ingredient={selectedIngredient}
        onBack={() => setSelectedIngredient(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Recently Viewed Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recently Viewed</h2>
        <div className="relative">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 px-1">
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            {recentlyViewed.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex-shrink-0 w-28 cursor-pointer group"
                onClick={() => setSelectedIngredient(ingredient)}
              >
                <div className="aspect-square rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors overflow-hidden">
                  <Leaf className="h-10 w-10 text-slate-300" />
                </div>
                <p className="mt-2 text-xs text-slate-700 truncate text-center">{ingredient.name}</p>
              </div>
            ))}
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Header with count */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">
          All Ingredients:<span className="text-blue-600">76739</span>
        </h1>
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

      {/* Search and filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters:
        </div>
        {["Cost", "Plant Based", "Allergen", "Category"].map((filter) => (
          <button
            key={filter}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            {filter}
            <ChevronDown className="h-3 w-3" />
          </button>
        ))}
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={showStarred}
            onChange={(e) => setShowStarred(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded"
          />
          show starred ingredients
        </label>
      </div>

      {/* Ingredients table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="w-12 px-4 py-3">
                <Star className="h-4 w-4 text-amber-400 mx-auto" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Manufacturer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price/Unit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                <div className="flex items-center gap-1">
                  ROI
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">i</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIngredients.map((ingredient) => (
              <tr key={ingredient.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-slate-400" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-slate-800">{ingredient.name}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <Star className={`h-4 w-4 mx-auto ${ingredient.starred ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{ingredient.manufacturer}</td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  <Share2 className="h-4 w-4 text-slate-400" />
                </td>
                <td className="px-4 py-4 text-sm text-slate-500">{ingredient.roi}</td>
                <td className="px-4 py-4 text-lg">{ingredient.countryFlag}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedIngredient(ingredient)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button type="button" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button type="button" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
