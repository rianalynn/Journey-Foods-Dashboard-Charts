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
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  ExternalLink,
  Leaf,
  Zap,
  DollarSign,
  BarChart3,
  Lightbulb,
  Tag,
  Globe,
  ShoppingCart,
  Share2,
  Pencil,
  Info,
  Calendar,
  Save,
  Sparkles,
  History,
  Eye,
  FileText,
  Boxes,
  Users,
  Factory,
  Clock,
  Shield,
} from "lucide-react"
import {
  ComplianceBadge,
  ComplianceSummaryRow,
  ComplianceIssueCard,
  RegionTag,
} from "@/components/compliance/compliance-components"
import {
  productComplianceData,
  type ProductComplianceStatus,
  type ComplianceStatus,
  getComplianceStatusColor,
} from "@/lib/compliance-data"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  brand: string
  company: string
  category: string
  subCategory: string
  status: "active" | "concept" | "discontinued"
  nutritionScore: number
  sustainabilityScore: number
  costScore: number
  overallScore: number
  price: number
  retailCost: number
  profitMargin: number
  currency: string
  market: string[]
  ingredients: { name: string; percentage: number }[]
  ingredientCount: number
  upc: string
  sku: string
  trend: "up" | "down" | "stable"
  trendValue: number
  starred: boolean
  alert?: string
  tags: string[]
  lastUpdated: string
  createdBy: string
  dateCreated: string
  fulfilmentDate: string
  servingSize: string
  servingUnit: string
  calories: number
  version: number
  flavor: string
  manufacturer: string
  objectives: string[]
  countryFlag: string
  type: string
}

interface ProductVersion {
  id: number
  date: string
  nutrition: "complete" | "pending" | "incomplete"
  supplyChain: "complete" | "pending" | "incomplete"
  cost: "complete" | "pending" | "incomplete"
  sustainability: "complete" | "pending" | "incomplete"
  popularity: "complete" | "pending" | "incomplete"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const productsData: Product[] = [
  {
    id: "1", name: "Organic Protein Bar — Chocolate Fudge", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Bars", type: "Retail",
    status: "active", nutritionScore: 91, sustainabilityScore: 88, costScore: 79, overallScore: 88,
    price: 3.49, retailCost: 4.99, profitMargin: 30, currency: "USD", market: ["North America", "Europe"],
    ingredients: [
      { name: "Organic Pea Protein", percentage: 35 },
      { name: "Dark Chocolate", percentage: 25 },
      { name: "Almonds", percentage: 15 },
      { name: "Dates", percentage: 12 },
      { name: "Cocoa Butter", percentage: 8 },
    ],
    ingredientCount: 8, upc: "0003003406461", sku: "JF-PRO-CHO-001",
    trend: "up", trendValue: 6.4, starred: true, tags: ["Vegan", "Gluten-Free", "Non-GMO"],
    lastUpdated: "Tue Jan 13 2026", createdBy: "Huy Lee", dateCreated: "10/28/2025", fulfilmentDate: "",
    servingSize: "60", servingUnit: "g", calories: 220, version: 1, flavor: "Chocolate Fudge", manufacturer: "JourneyFoods",
    objectives: ["High Protein", "Clean Label"], countryFlag: "🇺🇸",
  },
  {
    id: "2", name: "Green Smoothie Mix", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Powders", type: "Retail",
    status: "active", nutritionScore: 94, sustainabilityScore: 91, costScore: 83, overallScore: 91,
    price: 29.99, retailCost: 39.99, profitMargin: 25, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Organic Spinach Powder", percentage: 30 },
      { name: "Organic Kale Powder", percentage: 25 },
      { name: "Pea Protein", percentage: 20 },
      { name: "Spirulina", percentage: 10 },
    ],
    ingredientCount: 8, upc: "012345678902", sku: "JF-SMO-GRN-001",
    trend: "up", trendValue: 12.1, starred: true, tags: ["Vegan", "Keto-Friendly", "High Protein"],
    lastUpdated: "Mon Jan 12 2026", createdBy: "Huy Lee", dateCreated: "10/15/2025", fulfilmentDate: "",
    servingSize: "30", servingUnit: "g", calories: 110, version: 1, flavor: "Natural Green", manufacturer: "JourneyFoods",
    objectives: ["Superfood Blend"], countryFlag: "🇺🇸",
  },
  {
    id: "3", name: "Turmeric Ginger Latte Blend", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Latte Mix", type: "Concept",
    status: "concept", nutritionScore: 86, sustainabilityScore: 80, costScore: 74, overallScore: 82,
    price: 24.99, retailCost: 32.99, profitMargin: 24, currency: "USD", market: ["North America", "Europe"],
    ingredients: [
      { name: "Organic Turmeric", percentage: 35 },
      { name: "Ginger Root Extract", percentage: 20 },
      { name: "Coconut Milk Powder", percentage: 25 },
      { name: "Black Pepper", percentage: 2 },
    ],
    ingredientCount: 6, upc: "", sku: "JF-LAT-TUR-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Anti-Inflammatory", "Vegan", "Adaptogenic"],
    alert: "Pending regulatory review for EU market",
    lastUpdated: "Sun Jan 11 2026", createdBy: "Huy Lee", dateCreated: "10/10/2025", fulfilmentDate: "",
    servingSize: "15", servingUnit: "g", calories: 60, version: 1, flavor: "Golden Spice", manufacturer: "JourneyFoods",
    objectives: ["Wellness", "Functional"], countryFlag: "🇺🇸",
  },
  {
    id: "4", name: "Recovery Electrolyte Drink", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Electrolytes", type: "Retail",
    status: "active", nutritionScore: 88, sustainabilityScore: 85, costScore: 91, overallScore: 88,
    price: 2.99, retailCost: 3.99, profitMargin: 25, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Coconut Water Powder", percentage: 40 },
      { name: "Magnesium Citrate", percentage: 15 },
      { name: "Potassium Chloride", percentage: 10 },
      { name: "Pink Himalayan Salt", percentage: 5 },
    ],
    ingredientCount: 7, upc: "012345678904", sku: "JF-ELE-REC-001",
    trend: "up", trendValue: 3.8, starred: false, tags: ["Electrolytes", "Low Sugar", "Non-GMO"],
    lastUpdated: "Sat Jan 10 2026", createdBy: "Huy Lee", dateCreated: "10/05/2025", fulfilmentDate: "",
    servingSize: "12", servingUnit: "g", calories: 25, version: 1, flavor: "Citrus", manufacturer: "JourneyFoods",
    objectives: ["Hydration", "Athletic Performance"], countryFlag: "🇺🇸",
  },
  {
    id: "5", name: "Buckwheat Pancake Mix", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Baking", type: "Retail",
    status: "active", nutritionScore: 83, sustainabilityScore: 87, costScore: 92, overallScore: 86,
    price: 8.99, retailCost: 11.99, profitMargin: 25, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Organic Buckwheat Flour", percentage: 60 },
      { name: "Oat Flour", percentage: 20 },
      { name: "Flaxseed Meal", percentage: 10 },
      { name: "Baking Powder", percentage: 5 },
    ],
    ingredientCount: 6, upc: "012345678905", sku: "JF-PAN-BUC-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Gluten-Free", "Vegan", "High Fiber"],
    lastUpdated: "Fri Jan 09 2026", createdBy: "Huy Lee", dateCreated: "10/01/2025", fulfilmentDate: "",
    servingSize: "40", servingUnit: "g", calories: 150, version: 1, flavor: "Original", manufacturer: "JourneyFoods",
    objectives: ["Whole Grain", "Plant-Based"], countryFlag: "🇺🇸",
  },
  {
    id: "6", name: "Matcha Energy Bites", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Snacks", type: "Concept",
    status: "concept", nutritionScore: 87, sustainabilityScore: 89, costScore: 71, overallScore: 84,
    price: 12.99, retailCost: 16.99, profitMargin: 24, currency: "USD", market: ["North America", "Asia Pacific"],
    ingredients: [
      { name: "Organic Dates", percentage: 35 },
      { name: "Cashews", percentage: 25 },
      { name: "Matcha Powder", percentage: 8 },
      { name: "Coconut Oil", percentage: 10 },
    ],
    ingredientCount: 7, upc: "", sku: "JF-SNK-MAT-001",
    trend: "up", trendValue: 4.2, starred: false, tags: ["Vegan", "Antioxidant", "Non-GMO"],
    lastUpdated: "Thu Jan 22 2026", createdBy: "Huy Lee", dateCreated: "2024-02-22", fulfilmentDate: "2026-03-23",
    servingSize: "28", servingUnit: "g", calories: 120, version: 1, flavor: "Matcha Green Tea", manufacturer: "JourneyFoods",
    objectives: ["Natural Energy", "Clean Label"], countryFlag: "🇺🇸",
  },
  {
    id: "7", name: "Collagen Peptides Powder", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Supplements", type: "Retail",
    status: "active", nutritionScore: 78, sustainabilityScore: 72, costScore: 85, overallScore: 78,
    price: 34.99, retailCost: 44.99, profitMargin: 22, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Grass-Fed Collagen Peptides", percentage: 95 },
      { name: "Natural Flavoring", percentage: 3 },
      { name: "Stevia", percentage: 2 },
    ],
    ingredientCount: 3, upc: "012345678907", sku: "JF-COL-PEP-001",
    trend: "up", trendValue: 8.5, starred: false, tags: ["Grass-Fed", "Keto", "Paleo"],
    lastUpdated: "Wed Jan 08 2026", createdBy: "Huy Lee", dateCreated: "09/15/2025", fulfilmentDate: "",
    servingSize: "10", servingUnit: "g", calories: 35, version: 1, flavor: "Unflavored", manufacturer: "JourneyFoods",
    objectives: ["Skin Health", "Joint Support"], countryFlag: "🇺🇸",
  },
  {
    id: "8", name: "Adaptogenic Mushroom Blend", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Powders", type: "Concept",
    status: "concept", nutritionScore: 82, sustainabilityScore: 90, costScore: 68, overallScore: 80,
    price: 39.99, retailCost: 54.99, profitMargin: 27, currency: "USD", market: ["North America", "Europe"],
    ingredients: [
      { name: "Lion's Mane", percentage: 30 },
      { name: "Reishi", percentage: 25 },
      { name: "Chaga", percentage: 20 },
      { name: "Cordyceps", percentage: 15 },
    ],
    ingredientCount: 5, upc: "", sku: "JF-MSH-ADP-001",
    trend: "stable", trendValue: 0, starred: true, tags: ["Organic", "Adaptogenic", "Nootropic"],
    lastUpdated: "Tue Jan 07 2026", createdBy: "Admin", dateCreated: "08/20/2025", fulfilmentDate: "2026-02-15",
    servingSize: "5", servingUnit: "g", calories: 15, version: 2, flavor: "Earthy", manufacturer: "JourneyFoods",
    objectives: ["Cognitive Support", "Stress Relief"], countryFlag: "🇺🇸",
  },
  {
    id: "9", name: "Plant-Based Protein Crunch", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Cereal", type: "Retail",
    status: "active", nutritionScore: 85, sustainabilityScore: 88, costScore: 76, overallScore: 84,
    price: 7.49, retailCost: 9.99, profitMargin: 25, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Pea Protein Crisps", percentage: 45 },
      { name: "Organic Oats", percentage: 30 },
      { name: "Coconut Sugar", percentage: 10 },
      { name: "Almonds", percentage: 8 },
    ],
    ingredientCount: 7, upc: "012345678909", sku: "JF-CER-PRO-001",
    trend: "up", trendValue: 5.2, starred: false, tags: ["High Protein", "Vegan", "Low Sugar"],
    lastUpdated: "Mon Jan 06 2026", createdBy: "Huy Lee", dateCreated: "08/10/2025", fulfilmentDate: "",
    servingSize: "55", servingUnit: "g", calories: 210, version: 1, flavor: "Vanilla Almond", manufacturer: "JourneyFoods",
    objectives: ["Breakfast", "High Protein"], countryFlag: "🇺🇸",
  },
  {
    id: "10", name: "Prebiotic Fiber Gummies", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Supplements", type: "Retail",
    status: "active", nutritionScore: 79, sustainabilityScore: 82, costScore: 88, overallScore: 82,
    price: 19.99, retailCost: 27.99, profitMargin: 29, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Chicory Root Fiber", percentage: 40 },
      { name: "Pectin", percentage: 25 },
      { name: "Natural Fruit Juice", percentage: 20 },
      { name: "Citric Acid", percentage: 5 },
    ],
    ingredientCount: 6, upc: "012345678910", sku: "JF-GUM-PRE-001",
    trend: "up", trendValue: 7.8, starred: false, tags: ["Gut Health", "Vegan", "Sugar-Free"],
    lastUpdated: "Sun Jan 05 2026", createdBy: "Admin", dateCreated: "07/25/2025", fulfilmentDate: "",
    servingSize: "10", servingUnit: "g", calories: 30, version: 1, flavor: "Mixed Berry", manufacturer: "JourneyFoods",
    objectives: ["Digestive Health", "Immune Support"], countryFlag: "🇺🇸",
  },
]

const versionHistory: ProductVersion[] = [
  { id: 1, date: "02/22/24", nutrition: "complete", supplyChain: "pending", cost: "pending", sustainability: "pending", popularity: "pending" },
]

const STATUSES = ["All", "Active", "Concept", "Discontinued"]
const MARKETS = ["All", "North America", "Europe", "Asia Pacific"]

// ─── Recently Viewed Carousel ─────────────────────────────────────────────────

function RecentlyViewedCarousel({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  return (
    <div className="relative">
      <button type="button" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
        <ChevronLeft className="h-4 w-4 text-slate-600" />
      </button>
      <div className="flex gap-4 overflow-x-auto px-10 pb-2 scrollbar-hide">
        {products.slice(0, 12).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            className="flex-shrink-0 w-28 group text-left"
          >
            <div className="aspect-square rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors overflow-hidden">
              <Package className="h-10 w-10 text-slate-300" />
            </div>
            <p className="mt-2 text-xs font-medium text-slate-700 truncate text-center">{p.name.split(" ").slice(0, 2).join(" ")}...</p>
          </button>
        ))}
      </div>
      <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors">
        <ChevronRight className="h-4 w-4 text-slate-600" />
      </button>
    </div>
  )
}

// ─── Edit Product Panel ───────────────────────────────────────────────────────

function EditProductPanel({ product, onClose, isNew = false }: { product?: Product; onClose: () => void; isNew?: boolean }) {
  const [formData, setFormData] = useState({
    company: product?.company || "",
    category: product?.category || "",
    productType: product?.type || "",
    subcategory: product?.subCategory || "",
    sku: product?.sku || "",
    name: product?.name || "",
    brand: product?.brand || "",
    flavor: product?.flavor || "",
    manufacturer: product?.manufacturer || "",
    dateCreated: product?.dateCreated || "",
    fulfilmentDate: product?.fulfilmentDate || "",
    servingSize: product?.servingSize || "0",
    servingUnit: product?.servingUnit || "g",
    status: product?.status || "active",
    guavaEnabled: true,
    hasAdditives: false,
    guavaScore: "",
    upcCode: product?.upc || "",
    cost: product?.price?.toString() || "0",
    retailCost: product?.retailCost?.toString() || "0",
    profitMargin: product?.profitMargin?.toString() || "0",
    country: "United States",
    currency: "United States Dollar",
    objectives: product?.objectives?.join(", ") || "",
    notes: "",
  })

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">{isNew ? "Add Product" : "Edit Product"}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Company Row */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Company</label>
            <select
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="ss">ss</option>
              <option value="JF">JourneyFoods</option>
              <option value="WF">Whole Foods</option>
            </select>
          </div>

          {/* Category / Type / Subcategory Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Supplements">Supplements</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Type</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Product Type</option>
                <option value="Retail">Retail</option>
                <option value="Concept">Concept</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subcategory</label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Subcategory</option>
                <option value="Condiments">Condiments</option>
                <option value="Snacks">Snacks</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>
          </div>

          {/* SKU / Name / Brand Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU / Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="0003003406461"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Sauce, whole berry cranberry – Giant Eagle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
              <div className="relative">
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                >
                  <option value="Giant Eagle">Giant Eagle</option>
                  <option value="Market District">Market District</option>
                  <option value="JourneyFoods">JourneyFoods</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Flavor / Manufacturer / Date Created Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Flavor</label>
              <input
                type="text"
                value={formData.flavor}
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Manufacturer</label>
              <select
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Manufacturer</option>
                <option value="ss">ss</option>
                <option value="JourneyFoods">JourneyFoods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date Created</label>
              <input
                type="date"
                value={formData.dateCreated}
                onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Fulfilment / Serving Size / Status Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fulfilment Date</label>
              <input
                type="date"
                value={formData.fulfilmentDate}
                onChange={(e) => setFormData({ ...formData, fulfilmentDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Serving Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.servingSize}
                  onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <select
                  value={formData.servingUnit}
                  onChange={(e) => setFormData({ ...formData, servingUnit: e.target.value })}
                  className="w-16 px-2 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option>g</option>
                  <option>ml</option>
                  <option>oz</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Product["status"] })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50"
              >
                <option value="active">Active</option>
                <option value="concept">Concept</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          {/* Guava / Additives Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Guava Product</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.guavaEnabled}
                  onChange={(e) => setFormData({ ...formData, guavaEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Enable Guava features for this product</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Additives</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAdditives}
                  onChange={(e) => setFormData({ ...formData, hasAdditives: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Product contains additives</span>
              </label>
            </div>
          </div>

          {/* Guava Score / UPC Code Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Guava Score</label>
              <input
                type="text"
                value={formData.guavaScore}
                onChange={(e) => setFormData({ ...formData, guavaScore: e.target.value })}
                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter Guava Score"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">UPC Code</label>
              <input
                type="text"
                value={formData.upcCode}
                onChange={(e) => setFormData({ ...formData, upcCode: e.target.value })}
                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter UPC Code"
              />
            </div>
          </div>

          {/* Cost / Retail Cost / Profit Margin Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cost</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Retail Cost</label>
              <input
                type="number"
                value={formData.retailCost}
                onChange={(e) => setFormData({ ...formData, retailCost: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Profit Margin (%)</label>
              <input
                type="number"
                value={formData.profitMargin}
                onChange={(e) => setFormData({ ...formData, profitMargin: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50"
                readOnly
              />
            </div>
          </div>

          {/* Country / Currency Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                >
                  <option>United States Dollar</option>
                  <option>Canadian Dollar</option>
                  <option>British Pound</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ingredients</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg">
              <input
                type="text"
                className="flex-1 focus:outline-none text-sm"
                placeholder="Search Ingredient to add..."
              />
              <X className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
          </div>

          {/* Product Objectives */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Objectives</label>
            <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">Select Product Objectives</option>
              <option value="low-sugar">Low Sugar</option>
              <option value="high-protein">High Protein</option>
              <option value="organic">Organic</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              rows={4}
            />
          </div>

          <p className="text-sm text-slate-500">
            These preferences will help tailor our product suggestions and filter your live searching whilst using the app.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Detail
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Product Detail View ──────────────────────────────────────────────────────

function ProductDetailView({ product, onClose, onEdit }: { product: Product; onClose: () => void; onEdit: () => void }) {
  const [activeTab, setActiveTab] = useState<"current" | "nutrition" | "label" | "packaging" | "compliance">("current")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showComplianceDetails, setShowComplianceDetails] = useState(false)

  // Get compliance data for this product
  const complianceStatus: ProductComplianceStatus = productComplianceData[product.id] || {
    productId: product.id,
    overallStatus: "pending" as ComplianceStatus,
    regions: ["NA"],
    issues: [],
    lastChecked: new Date().toISOString(),
  }

  const tabs = [
    { id: "current", label: "Current Version" },
    { id: "nutrition", label: "Nutrition" },
    { id: "compliance", label: "Compliance" },
    { id: "label", label: "Generate Label", isAction: true },
    { id: "packaging", label: "Matched Packaging" },
  ] as const

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span><span className="font-medium text-slate-700">Company:</span> {product.company}</span>
            <span><span className="font-medium text-slate-700">Brand:</span> {product.brand}</span>
            <span><span className="font-medium text-slate-700">Version:</span> {product.version}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span><span className="font-medium text-slate-700">Created By:</span> {product.createdBy}</span>
            <span><span className="font-medium text-slate-700">Last Updated:</span> {product.lastUpdated}</span>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.type}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image + Scores Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex gap-8">
              {/* Product Image */}
              <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <Package className="h-20 w-20 text-slate-300" />
              </div>

              {/* Scores */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nutrition</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-500 text-xs">🍊</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-800">{product.nutritionScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Sustainability</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Leaf className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <span className="text-2xl font-bold text-slate-800">{product.sustainabilityScore}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Cost</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                    <span className="text-2xl font-bold text-slate-800">{product.price.toFixed(2)}/kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SKU Bar */}
            <div className="mt-6 flex items-center gap-6 px-4 py-3 bg-slate-700 rounded-lg text-sm text-white">
              <span><span className="text-slate-300">SKU/Code:</span> {product.sku}</span>
              <span><span className="text-slate-300">Date Created:</span> {product.dateCreated}</span>
              <span><span className="text-slate-300">Fulfilment Date:</span> {product.fulfilmentDate || "—"}</span>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Objectives</h3>
              <Info className="h-4 w-4 text-slate-400" />
            </div>
            {product.objectives.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.objectives.map((obj) => (
                  <span key={obj} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                    {obj}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No objectives set</p>
            )}
          </div>

          {/* Regulatory Compliance Summary */}
          <ComplianceSummaryRow
            status={complianceStatus.overallStatus}
            regions={complianceStatus.regions}
            issueCount={complianceStatus.issues.length}
            onViewDetails={() => setActiveTab("compliance")}
          />

          {/* Attributes Row */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 mb-1">Ingredients:</p>
                <p className="text-lg font-bold text-slate-800">{product.ingredientCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Flavor:</p>
                <p className="text-lg font-bold text-slate-800">{product.flavor}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Serving Size:</p>
                <p className="text-lg font-bold text-slate-800">{product.servingSize}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Profit Margin:</p>
                <p className="text-lg font-bold text-slate-800">{product.profitMargin} %</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Manufacturer:</p>
                <p className="text-lg font-bold text-slate-800">{product.manufacturer}</p>
              </div>
            </div>
          </div>

          {/* Data Source */}
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Data Source:</span>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-4">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? tab.isAction
                          ? "border-transparent"
                          : "border-slate-800 text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    } ${tab.isAction ? "bg-blue-600 text-white rounded-lg my-2 mx-1" : ""}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Search className="h-4 w-4 text-slate-500" />
                </button>
                <button type="button" onClick={onEdit} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Pencil className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {/* Current Version / Nutrition / Packaging Tab */}
              {(activeTab === "current" || activeTab === "nutrition" || activeTab === "packaging" || activeTab === "label") && (
                <>
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-slate-500">
                        <th className="text-left py-2 font-medium">Current version</th>
                        <th className="text-center py-2 font-medium">-</th>
                        <th className="text-center py-2 font-medium">-</th>
                        <th className="text-center py-2 font-medium">-</th>
                        <th className="text-center py-2 font-medium">-</th>
                        <th className="text-center py-2 font-medium">-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versionHistory.map((v) => (
                        <tr key={v.id} className="border-t border-slate-100">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-white text-[10px]">{v.id}</span>
                              </div>
                              <span className="text-xs text-slate-400">*</span>
                              <span className="text-sm text-slate-600">{v.date}</span>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                              Nutrition
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                              Supply Chain
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                              Cost
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                              Sustainability
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                              Popularity
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Version History Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className="flex items-center gap-2 mt-4 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Version History
                    {showVersionHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {showVersionHistory && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">No previous versions available</p>
                    </div>
                  )}
                </>
              )}

              {/* Compliance Tab */}
              {activeTab === "compliance" && (
                <div className="space-y-4">
                  {/* Status Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className={`h-5 w-5 ${getComplianceStatusColor(complianceStatus.overallStatus).text}`} />
                      <h3 className="font-semibold text-slate-800">Regulatory Compliance</h3>
                      <ComplianceBadge status={complianceStatus.overallStatus} />
                    </div>
                    <div className="flex items-center gap-2">
                      {complianceStatus.regions.map((r) => (
                        <RegionTag key={r} regionCode={r} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* Last Checked */}
                  <p className="text-xs text-slate-500">
                    Last checked: {new Date(complianceStatus.lastChecked).toLocaleDateString()} at {new Date(complianceStatus.lastChecked).toLocaleTimeString()}
                  </p>

                  {/* Issues List */}
                  {complianceStatus.issues.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-700">
                        {complianceStatus.issues.length} Issue{complianceStatus.issues.length !== 1 ? "s" : ""} Found
                      </h4>
                      {complianceStatus.issues.map((issue) => (
                        <ComplianceIssueCard key={issue.id} issue={issue} showAiFix={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-slate-800">All Clear</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        No regulatory compliance issues detected for this product.
                      </p>
                    </div>
                  )}

                  {/* Applicable Regulations */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Applicable Regulations</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs font-medium text-slate-600">FDA Food Labeling</span>
                        <span className="text-xs text-slate-400">21 CFR</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs font-medium text-slate-600">EFSA Standards</span>
                        <span className="text-xs text-slate-400">EU 1169/2011</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs font-medium text-slate-600">Health Canada</span>
                        <span className="text-xs text-slate-400">Food & Drugs Act</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs font-medium text-slate-600">FSANZ Code</span>
                        <span className="text-xs text-slate-400">Standard 1.2.7</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Recommendations Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <Sparkles className="h-4 w-4" />
            Generate AI Recommendations
          </button>
        </div>

        {/* Right: Recommendations + Ingredients Panel */}
        <div className="space-y-4">
          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">Recommendations:</span>
              <span className="text-sm font-bold text-blue-600">0</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 mx-auto" />
          </div>

          {/* Ingredients Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Ingredients</h3>
            <div className="space-y-3">
              {product.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center overflow-hidden">
                      <span className="text-lg">🥔</span>
                    </div>
                    <span className="text-sm text-slate-700">{ing.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{ing.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <button type="button" className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Score Ring Component ─────────────────────────────────────────────────────

function ScoreRing({ value, size = 40 }: { value: number; size?: number }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const getColor = (v: number) => v >= 85 ? "#10B981" : v >= 70 ? "#3B82F6" : v >= 50 ? "#F59E0B" : "#EF4444"

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={getColor(value)} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">{value}</span>
    </div>
  )
}

// ─── Product Grid Card ────────────────────────────────────────────────────────

function ProductGridCard({ product, onView }: { product: Product; onView: () => void }) {
  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
          <Package className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
            <div className="flex items-center gap-1 shrink-0">
              {product.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
              <ScoreRing value={product.overallScore} size={36} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{product.brand} · {product.subCategory}</p>
        </div>
      </div>

      {/* Alert */}
      {product.alert && (
        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-xs text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{product.alert}</span>
        </div>
      )}

      {/* Scores */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">{product.nutritionScore}</p>
          <p className="text-xs text-slate-400">Nutrition</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-lg font-bold text-slate-800">{product.sustainabilityScore}</p>
          <p className="text-xs text-slate-400">Sustain.</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">{product.costScore || "-"}</p>
          <p className="text-xs text-slate-400">Cost</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-md font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">{product.price > 0 ? product.price.toFixed(2) : "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            product.status === "active" ? "bg-green-100 text-green-700" :
            product.status === "concept" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
          }`}>
            {product.status}
          </span>
          {product.trend !== "stable" && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${
              product.trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
              {product.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {product.trendValue}%
            </span>
          )}
          {product.trend === "stable" && (
            <span className="text-xs text-slate-400">Stable</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Product List Row ─────────────────────────────────────────────────────────

function ProductListRow({ product, onView }: { product: Product; onView: () => void }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group" onClick={onView}>
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
        <Package className="h-5 w-5 text-blue-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
        <p className="text-xs text-slate-500">{product.brand} · {product.subCategory}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center w-16">
          <p className="text-sm font-semibold text-slate-700">{product.nutritionScore}</p>
          <p className="text-xs text-slate-400">Nutrition</p>
        </div>
        <div className="text-center w-16">
          <p className="text-sm font-semibold text-slate-700">{product.sustainabilityScore}</p>
          <p className="text-xs text-slate-400">Sustain.</p>
        </div>
        <div className="text-center w-16">
          <p className="text-sm font-semibold text-slate-700">{product.costScore || "-"}</p>
          <p className="text-xs text-slate-400">Cost</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
          product.status === "active" ? "bg-green-100 text-green-700" :
          product.status === "concept" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
        }`}>
          {product.status}
        </span>
        <ScoreRing value={product.overallScore} size={36} />
      </div>
    </div>
  )
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = productsData.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || p.status === statusFilter.toLowerCase()
    const matchCategory = categoryFilter === "All" || p.subCategory === categoryFilter
    return matchSearch && matchStatus && matchCategory
  })

  const activeCount = productsData.filter((p) => p.status === "active").length
  const conceptCount = productsData.filter((p) => p.status === "concept").length
  const totalCount = productsData.length

  const handleAddProduct = () => {
    setIsNewProduct(true)
    setShowEditPanel(true)
  }

  const handleEditProduct = () => {
    setIsNewProduct(false)
    setShowEditPanel(true)
  }

  // If a product is selected, show the detail view
  if (selectedProduct && !showEditPanel) {
    return (
      <>
        <ProductDetailView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEditProduct}
        />
        {showEditPanel && (
          <EditProductPanel
            product={isNewProduct ? undefined : selectedProduct}
            onClose={() => setShowEditPanel(false)}
            isNew={isNewProduct}
          />
        )}
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Actions Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">Product Actions</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Notifications Pending</span>
              <span className="text-sm font-semibold text-slate-800">6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Actions Pending</span>
              <span className="text-sm font-semibold text-slate-800">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Concept Products</span>
              <span className="text-sm font-semibold text-blue-600">{conceptCount}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all" 
                style={{ width: `${(activeCount / totalCount) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">{activeCount}/{totalCount} active</p>
          </div>
        </div>

        {/* Active Products Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Package className="h-20 w-20" />
          </div>
          <p className="text-sm font-medium text-green-100">Active Products</p>
          <p className="text-4xl font-bold mt-1">{activeCount}</p>
          <p className="text-sm text-green-100 mt-1">In your catalog</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-100">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-green-200 font-medium">+2.4% this period</span>
          </div>
        </div>

        {/* Concept Products Card */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-20">
            <Lightbulb className="h-20 w-20" />
          </div>
          <p className="text-sm font-medium text-slate-300">Concept Products</p>
          <p className="text-4xl font-bold mt-1">{conceptCount}</p>
          <p className="text-sm text-slate-300 mt-1">In development</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-slate-300">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-green-400 font-medium">+8% this period</span>
          </div>
        </div>
      </div>

      {/* All Products Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800">All Products</h2>
            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-medium">
              {filtered.length} items
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
            >
              <option value="All">All</option>
              <option value="Condiments">Condiments</option>
              <option value="Snacks">Snacks</option>
              <option value="Frozen">Frozen</option>
              <option value="Deli">Deli</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Filters Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="h-4 w-4 text-slate-500" />
              Filters
            </button>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>

            {/* View Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filtered.map((product) => (
              <ProductGridCard
                key={product.id}
                product={product}
                onView={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((product) => (
              <ProductListRow
                key={product.id}
                product={product}
                onView={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Panel */}
      {showEditPanel && (
        <EditProductPanel
          product={isNewProduct ? undefined : (selectedProduct || undefined)}
          onClose={() => setShowEditPanel(false)}
          isNew={isNewProduct}
        />
      )}
    </div>
  )
}
