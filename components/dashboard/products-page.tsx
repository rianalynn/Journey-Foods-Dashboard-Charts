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
} from "lucide-react"

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
    id: "1", name: "Sauce, whole berry cranberry", brand: "Giant Eagle", company: "ss", category: "Food", subCategory: "Condiments", type: "Retail",
    status: "active", nutritionScore: 60, sustainabilityScore: 50, costScore: 0, overallScore: 50,
    price: 0, retailCost: 0, profitMargin: 0, currency: "USD", market: ["North America", "Europe"],
    ingredients: [
      { name: "potatoes", percentage: 65 },
      { name: "Peanut Oil", percentage: 20 },
      { name: "sugar", percentage: 5 },
      { name: "FRUCTOSE", percentage: 3 },
      { name: "molasses", percentage: 2 },
    ],
    ingredientCount: 8, upc: "0003003406461", sku: "0003003406461",
    trend: "up", trendValue: 6.4, starred: false, tags: ["Retail"],
    lastUpdated: "Tue Jan 13 2026", createdBy: "Huy Lee", dateCreated: "10/28/2025", fulfilmentDate: "",
    servingSize: "28", servingUnit: "g", calories: 220, version: 1, flavor: "N/A", manufacturer: "ss",
    objectives: [], countryFlag: "🇺🇸",
  },
  {
    id: "2", name: "Egg Salad", brand: "Giant Eagle", company: "ss", category: "Food", subCategory: "Deli", type: "Retail",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costScore: 0, overallScore: 50,
    price: 0, retailCost: 0, profitMargin: 0, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Eggs", percentage: 45 },
      { name: "Mayonnaise", percentage: 30 },
      { name: "Celery", percentage: 10 },
    ],
    ingredientCount: 6, upc: "012345678902", sku: "GE-EGG-SAL-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Retail"],
    lastUpdated: "Mon Jan 12 2026", createdBy: "Huy Lee", dateCreated: "10/15/2025", fulfilmentDate: "",
    servingSize: "100", servingUnit: "g", calories: 280, version: 1, flavor: "-", manufacturer: "ss",
    objectives: [], countryFlag: "🇺🇸",
  },
  {
    id: "3", name: "Jasmine White Rice", brand: "Giant Eagle", company: "ss", category: "Food", subCategory: "Grains", type: "Retail",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costScore: 0, overallScore: 50,
    price: 0, retailCost: 0, profitMargin: 0, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Jasmine Rice", percentage: 100 },
    ],
    ingredientCount: 1, upc: "012345678903", sku: "GE-RIC-JAS-001",
    trend: "up", trendValue: 2.1, starred: false, tags: ["Retail"],
    lastUpdated: "Sun Jan 11 2026", createdBy: "Huy Lee", dateCreated: "10/10/2025", fulfilmentDate: "",
    servingSize: "45", servingUnit: "g", calories: 160, version: 1, flavor: "-", manufacturer: "ss",
    objectives: [], countryFlag: "🇺🇸",
  },
  {
    id: "4", name: "Maraschino Cherries With Stems", brand: "Giant Eagle", company: "ss", category: "Food", subCategory: "Fruit", type: "Retail",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costScore: 0, overallScore: 50,
    price: 0, retailCost: 0, profitMargin: 0, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Cherries", percentage: 70 },
      { name: "Sugar Syrup", percentage: 30 },
    ],
    ingredientCount: 4, upc: "012345678904", sku: "GE-CHR-MAR-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Retail"],
    lastUpdated: "Sat Jan 10 2026", createdBy: "Huy Lee", dateCreated: "10/05/2025", fulfilmentDate: "",
    servingSize: "30", servingUnit: "g", calories: 90, version: 1, flavor: "-", manufacturer: "ss",
    objectives: [], countryFlag: "🇺🇸",
  },
  {
    id: "5", name: "Pasta sauce, vodka", brand: "Market District", company: "ss", category: "Food", subCategory: "Sauces", type: "Retail",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costScore: 0, overallScore: 50,
    price: 0, retailCost: 0, profitMargin: 0, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Tomatoes", percentage: 50 },
      { name: "Cream", percentage: 20 },
      { name: "Vodka", percentage: 5 },
    ],
    ingredientCount: 8, upc: "012345678905", sku: "MD-SAU-VOD-001",
    trend: "up", trendValue: 4.2, starred: false, tags: ["Retail"],
    lastUpdated: "Fri Jan 09 2026", createdBy: "Huy Lee", dateCreated: "10/01/2025", fulfilmentDate: "",
    servingSize: "125", servingUnit: "g", calories: 140, version: 1, flavor: "-", manufacturer: "ss",
    objectives: [], countryFlag: "🇺🇸",
  },
  {
    id: "6", name: "Jimmy Chips", brand: "Jimmy John's", company: "ss", category: "Food", subCategory: "Snacks", type: "Retail",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costScore: 0, overallScore: 50,
    price: 0, retailCost: 0, profitMargin: 0, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "potatoes", percentage: 65 },
      { name: "Peanut Oil", percentage: 20 },
      { name: "sugar", percentage: 5 },
      { name: "FRUCTOSE", percentage: 3 },
      { name: "molasses", percentage: 2 },
    ],
    ingredientCount: 8, upc: "37578800800", sku: "37578800800",
    trend: "up", trendValue: 8.9, starred: false, tags: ["Retail"],
    lastUpdated: "Thu Jan 22 2026", createdBy: "Đỗ Dương", dateCreated: "2024-02-22", fulfilmentDate: "2026-03-23",
    servingSize: "28", servingUnit: "g", calories: 150, version: 1, flavor: "N/A", manufacturer: "ss",
    objectives: [], countryFlag: "🇺🇸",
  },
  {
    id: "7", name: "Ice cream, vanilla", brand: "JourneyFoods", company: "JF", category: "Food", subCategory: "Frozen", type: "Concept",
    status: "concept", nutritionScore: 65, sustainabilityScore: 70, costScore: 75, overallScore: 70,
    price: 5.99, retailCost: 7.99, profitMargin: 25, currency: "USD", market: ["North America"],
    ingredients: [
      { name: "Milk", percentage: 40 },
      { name: "Cream", percentage: 30 },
      { name: "Sugar", percentage: 15 },
      { name: "Vanilla Extract", percentage: 2 },
    ],
    ingredientCount: 6, upc: "", sku: "JF-ICE-VAN-001",
    trend: "stable", trendValue: 0, starred: false, tags: ["Concept"],
    lastUpdated: "Wed Jan 08 2026", createdBy: "Huy Lee", dateCreated: "09/15/2025", fulfilmentDate: "",
    servingSize: "100", servingUnit: "g", calories: 207, version: 1, flavor: "Vanilla", manufacturer: "JourneyFoods",
    objectives: ["Low Sugar", "Premium Quality"], countryFlag: "🇺🇸",
  },
  {
    id: "8", name: "Organic Rotini Pasta", brand: "Whole Foods", company: "WF", category: "Food", subCategory: "Pasta", type: "Retail",
    status: "active", nutritionScore: 72, sustainabilityScore: 85, costScore: 68, overallScore: 75,
    price: 3.49, retailCost: 4.99, profitMargin: 30, currency: "USD", market: ["North America", "Europe"],
    ingredients: [
      { name: "Organic Durum Wheat", percentage: 100 },
    ],
    ingredientCount: 1, upc: "012345678908", sku: "WF-PAS-ROT-001",
    trend: "up", trendValue: 3.5, starred: true, tags: ["Organic", "Retail"],
    lastUpdated: "Tue Jan 07 2026", createdBy: "Admin", dateCreated: "08/20/2025", fulfilmentDate: "2026-02-15",
    servingSize: "85", servingUnit: "g", calories: 310, version: 2, flavor: "-", manufacturer: "Whole Foods",
    objectives: ["Organic Certified"], countryFlag: "🇺🇸",
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
  const [activeTab, setActiveTab] = useState<"current" | "nutrition" | "label" | "packaging">("current")
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const tabs = [
    { id: "current", label: "Current Version" },
    { id: "nutrition", label: "Nutrition" },
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

            {/* Version Table */}
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500">
                    <th className="text-left py-2 font-medium">Current version</th>
                    <th className="text-center py-2 font-medium">—</th>
                    <th className="text-center py-2 font-medium">—</th>
                    <th className="text-center py-2 font-medium">—</th>
                    <th className="text-center py-2 font-medium">—</th>
                    <th className="text-center py-2 font-medium">—</th>
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
                          <span className="text-xs text-slate-400">⚡</span>
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

// ─── Product List Row ─────────────────────────────────────────────────────────

function ProductListRow({ product, onView }: { product: Product; onView: () => void }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group" onClick={onView}>
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
        <Package className="h-5 w-5 text-slate-300" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
      </div>

      <div className="w-28 text-sm text-slate-600 truncate">{product.brand}</div>
      <div className="w-16 text-sm text-slate-500 text-center">-</div>
      <div className="w-16 text-sm text-slate-500 text-center">-</div>
      <div className="w-14 text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-indigo-700 text-xs font-medium">
          v{product.version}
        </span>
      </div>
      <div className="w-12 text-center text-lg">{product.countryFlag}</div>
      <div className="w-16 text-center">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          product.status === "active" ? "bg-blue-100 text-blue-700" :
          product.status === "concept" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
        }`}>
          {product.type.toUpperCase()}
        </span>
      </div>
      <div className="w-14 text-center text-sm font-medium text-slate-700">{product.overallScore}%</div>
      <div className="w-20">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View
        </button>
      </div>
    </div>
  )
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [marketFilter, setMarketFilter] = useState("All")
  const [brandFilter, setBrandFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeChip, setActiveChip] = useState<"retail" | "concept" | "updates" | "ai" | null>("retail")

  const filtered = productsData.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || p.status === statusFilter.toLowerCase()
    const matchMarket = marketFilter === "All" || p.market.includes(marketFilter)
    const matchChip = activeChip === null ||
      (activeChip === "retail" && p.type === "Retail") ||
      (activeChip === "concept" && p.status === "concept")
    return matchSearch && matchStatus && matchMarket && matchChip
  })

  const activeCount = productsData.filter((p) => p.status === "active").length

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
      {/* Recently Viewed */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <RecentlyViewedCarousel products={productsData} onSelect={setSelectedProduct} />
      </div>

      {/* Active Products Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Active Products</h2>
          <span className="text-xl font-bold text-blue-600">{activeCount.toLocaleString()}</span>

          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === "retail" ? null : "retail")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeChip === "retail" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Retail
            </button>
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === "concept" ? null : "concept")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeChip === "concept" ? "bg-amber-500 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Concept
            </button>
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === "updates" ? null : "updates")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeChip === "updates" ? "bg-red-500 text-white" : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              Latest updates
            </button>
            <button
              type="button"
              onClick={() => setActiveChip(activeChip === "ai" ? null : "ai")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeChip === "ai" ? "bg-emerald-500 text-white" : "bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Journey AI
            </button>
          </div>
        </div>

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

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>
        <select
          value={marketFilter}
          onChange={(e) => setMarketFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
        >
          <option value="All">Ma...</option>
          {MARKETS.slice(1).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
        >
          <option value="All">Bra...</option>
          <option value="Giant Eagle">Giant Eagle</option>
          <option value="JourneyFoods">JourneyFoods</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
        >
          <option value="All">Type</option>
          <option value="Retail">Retail</option>
          <option value="Concept">Concept</option>
        </select>
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 text-sm">
          <button type="button" className="px-3 py-1 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button type="button" className="px-3 py-1 text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <div className="w-10">IMAGE</div>
          <div className="flex-1">PRODUCT NAME</div>
          <div className="w-28">BRAND</div>
          <div className="w-16 text-center">TYPE</div>
          <div className="w-16 text-center">FLAVOR</div>
          <div className="w-14 text-center">VERSION</div>
          <div className="w-12 text-center">COUNTRY</div>
          <div className="w-16 text-center">STATUS</div>
          <div className="w-14 text-center">SCORE</div>
          <div className="w-20 text-center">ACTIONS</div>
        </div>

        {/* Table Body */}
        {filtered.map((product) => (
          <ProductListRow
            key={product.id}
            product={product}
            onView={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        type="button"
        onClick={handleAddProduct}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

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
