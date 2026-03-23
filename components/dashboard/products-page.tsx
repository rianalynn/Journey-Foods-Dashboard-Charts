"use client"

import { useState } from "react"
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  Star,
  Leaf,
  DollarSign,
  ArrowRight,
  Plus,
  ShoppingCart,
  Lightbulb,
  Bell,
  Calendar,
  Save,
  Share2,
  FileText,
  TrendingUp,
  ChevronUp,
  Edit3,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  brand: string
  company: string
  category: string
  type: string
  subCategory: string
  flavor: string
  status: "active" | "concept" | "discontinued"
  nutritionScore: number
  sustainabilityScore: number
  costPerKg: number
  version: number
  country: string
  countryFlag: string
  ingredients: { name: string; percentage: number }[]
  ingredientCount: number
  upc: string
  sku: string
  servingSize: number
  profitMargin: number
  manufacturer: string
  dateCreated: string
  fulfillmentDate: string
  lastUpdated: string
  createdBy: string
  guavaEnabled: boolean
  guavaScore: number
  retailCost: number
  cost: number
  currency: string
  notes: string
  objectives: string[]
  hasAdditives: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const productsData: Product[] = [
  {
    id: "1", name: "Sauce, whole berry cranberry", brand: "Giant Eagle", company: "ss",
    category: "Food", type: "Sauce", subCategory: "Condiments", flavor: "",
    status: "active", nutritionScore: 60, sustainabilityScore: 50, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [
      { name: "potatoes", percentage: 65 },
      { name: "Peanut Oil", percentage: 20 },
      { name: "sugar", percentage: 5 },
      { name: "FRUCTOSE", percentage: 3 },
      { name: "molasses", percentage: 2 },
    ],
    ingredientCount: 0, upc: "0003003406461", sku: "0003003406461",
    servingSize: 0, profitMargin: 0, manufacturer: "",
    dateCreated: "2025-10-28", fulfillmentDate: "", lastUpdated: "Tue Jan 13 2026",
    createdBy: "Huy Lee", guavaEnabled: true, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
  {
    id: "2", name: "Jimmy Chips", brand: "Jimmy John's", company: "ss",
    category: "Food", type: "Snack", subCategory: "Chips", flavor: "",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [
      { name: "potatoes", percentage: 65 },
      { name: "Peanut Oil", percentage: 20 },
      { name: "sugar", percentage: 5 },
      { name: "FRUCTOSE", percentage: 3 },
      { name: "molasses", percentage: 2 },
    ],
    ingredientCount: 8, upc: "37578800800", sku: "37578800800",
    servingSize: 28, profitMargin: 0, manufacturer: "ss",
    dateCreated: "2024-02-22", fulfillmentDate: "2026-03-23", lastUpdated: "Thu Jan 22 2026",
    createdBy: "Đỗ Dương", guavaEnabled: true, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
  {
    id: "3", name: "Egg Salad", brand: "Giant Eagle", company: "ss",
    category: "Food", type: "Prepared", subCategory: "Salads", flavor: "",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [], ingredientCount: 5, upc: "", sku: "",
    servingSize: 0, profitMargin: 0, manufacturer: "",
    dateCreated: "2025-08-15", fulfillmentDate: "", lastUpdated: "2 days ago",
    createdBy: "Admin", guavaEnabled: false, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
  {
    id: "4", name: "Jasmine White Rice", brand: "Giant Eagle", company: "ss",
    category: "Food", type: "Grain", subCategory: "Rice", flavor: "",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [], ingredientCount: 1, upc: "", sku: "",
    servingSize: 0, profitMargin: 0, manufacturer: "",
    dateCreated: "2025-06-10", fulfillmentDate: "", lastUpdated: "1 week ago",
    createdBy: "Admin", guavaEnabled: false, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
  {
    id: "5", name: "Maraschino Cherries With Stems", brand: "Giant Eagle", company: "ss",
    category: "Food", type: "Fruit", subCategory: "Preserved", flavor: "",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [], ingredientCount: 4, upc: "", sku: "",
    servingSize: 0, profitMargin: 0, manufacturer: "",
    dateCreated: "2025-05-20", fulfillmentDate: "", lastUpdated: "3 days ago",
    createdBy: "Admin", guavaEnabled: false, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
  {
    id: "6", name: "Pasta sauce, vodka", brand: "Market District", company: "ss",
    category: "Food", type: "Sauce", subCategory: "Pasta", flavor: "",
    status: "active", nutritionScore: 50, sustainabilityScore: 50, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [], ingredientCount: 12, upc: "", sku: "",
    servingSize: 0, profitMargin: 0, manufacturer: "",
    dateCreated: "2025-04-15", fulfillmentDate: "", lastUpdated: "5 days ago",
    createdBy: "Admin", guavaEnabled: false, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
  {
    id: "7", name: "Ice cream, vanilla", brand: "JourneyFoods", company: "ss",
    category: "Food", type: "Frozen", subCategory: "Dessert", flavor: "Vanilla",
    status: "concept", nutritionScore: 45, sustainabilityScore: 60, costPerKg: 0,
    version: 1, country: "US", countryFlag: "🇺🇸",
    ingredients: [], ingredientCount: 8, upc: "", sku: "",
    servingSize: 0, profitMargin: 0, manufacturer: "",
    dateCreated: "2025-03-01", fulfillmentDate: "", lastUpdated: "2 weeks ago",
    createdBy: "Admin", guavaEnabled: false, guavaScore: 0,
    retailCost: 0, cost: 0, currency: "USD", notes: "",
    objectives: [], hasAdditives: false,
  },
]

const recentlyViewed = productsData.slice(0, 12)

// ─── Product Edit Modal ───────────────────────────────────────────────────────

function ProductEditModal({
  product,
  onClose,
  onSave,
  isNew,
}: {
  product: Product | null
  onClose: () => void
  onSave: (product: Product) => void
  isNew: boolean
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      brand: "",
      company: "",
      category: "",
      type: "",
      subCategory: "",
      flavor: "",
      status: "active",
      sku: "",
      manufacturer: "",
      dateCreated: new Date().toISOString().split("T")[0],
      fulfillmentDate: "",
      servingSize: 0,
      guavaEnabled: false,
      guavaScore: 0,
      hasAdditives: false,
      upc: "",
      cost: 0,
      retailCost: 0,
      profitMargin: 0,
      country: "US",
      currency: "USD",
      notes: "",
      objectives: [],
    }
  )

  const handleSubmit = () => {
    onSave(formData as Product)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {isNew ? "Add Product" : "Edit Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Company</label>
            <select
              value={formData.company || ""}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ss">ss</option>
              <option value="JourneyFoods">JourneyFoods</option>
            </select>
          </div>

          {/* Category row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={formData.type || ""}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product Type</option>
                <option value="Snack">Snack</option>
                <option value="Sauce">Sauce</option>
                <option value="Prepared">Prepared</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subcategory</label>
              <select
                value={formData.subCategory || ""}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subcategory</option>
                <option value="Chips">Chips</option>
                <option value="Condiments">Condiments</option>
              </select>
            </div>
          </div>

          {/* SKU / Product Name / Brand */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU / Code</label>
              <input
                type="text"
                value={formData.sku || ""}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
              <select
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                <option value="Giant Eagle">Giant Eagle</option>
                <option value="JourneyFoods">JourneyFoods</option>
                <option value="Market District">Market District</option>
              </select>
            </div>
          </div>

          {/* Flavor / Manufacturer / Date Created */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Flavor</label>
              <input
                type="text"
                value={formData.flavor || ""}
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter flavor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Manufacturer</label>
              <select
                value={formData.manufacturer || ""}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={formData.dateCreated || ""}
                onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fulfillment Date / Serving Size / Product Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fulfillment Date</label>
              <input
                type="date"
                value={formData.fulfillmentDate || ""}
                onChange={(e) => setFormData({ ...formData, fulfillmentDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Serving Size</label>
              <div className="flex">
                <input
                  type="number"
                  value={formData.servingSize || 0}
                  onChange={(e) => setFormData({ ...formData, servingSize: Number(e.target.value) })}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-3 py-2.5 bg-slate-50 border border-l-0 border-slate-200 rounded-r-lg text-sm text-slate-500">g</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Status</label>
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Product["status"] })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="concept">Concept</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          {/* Guava Product / Additives */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Guava Product</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.guavaEnabled || false}
                  onChange={(e) => setFormData({ ...formData, guavaEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Enable Guava features for this product</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Additives</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAdditives || false}
                  onChange={(e) => setFormData({ ...formData, hasAdditives: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Product contains additives</span>
              </label>
            </div>
          </div>

          {/* Guava Score / UPC Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Guava Score</label>
              <input
                type="text"
                value={formData.guavaScore || ""}
                onChange={(e) => setFormData({ ...formData, guavaScore: Number(e.target.value) })}
                placeholder="Enter Guava Score"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 placeholder:text-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">UPC Code</label>
              <input
                type="text"
                value={formData.upc || ""}
                onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
                placeholder="Enter UPC Code"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 placeholder:text-blue-400"
              />
            </div>
          </div>

          {/* Cost / Retail Cost / Profit Margin */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cost</label>
              <input
                type="number"
                value={formData.cost || 0}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Retail Cost</label>
              <input
                type="number"
                value={formData.retailCost || 0}
                onChange={(e) => setFormData({ ...formData, retailCost: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Profit Margin (%)</label>
              <input
                type="number"
                value={formData.profitMargin || 0}
                onChange={(e) => setFormData({ ...formData, profitMargin: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                readOnly
              />
            </div>
          </div>

          {/* Country / Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
              <select
                value={formData.country || "US"}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="DE">Germany</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
              <select
                value={formData.currency || "USD"}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">United States Dollar</option>
                <option value="CAD">Canadian Dollar</option>
                <option value="EUR">Euro</option>
                <option value="GBP">British Pound</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ingredients</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-4 py-2.5">
              <input
                type="text"
                placeholder="Search Ingredient to add..."
                className="flex-1 text-sm focus:outline-none"
              />
              <X className="h-4 w-4 text-slate-400 cursor-pointer" />
            </div>
          </div>

          {/* Product Objectives */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Objectives</label>
            <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Product Objectives</option>
              <option value="health">Health & Wellness</option>
              <option value="sustainability">Sustainability</option>
              <option value="cost">Cost Optimization</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
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

function ProductDetailView({
  product,
  onBack,
  onEdit,
}: {
  product: Product
  onBack: () => void
  onEdit: (product: Product) => void
}) {
  const [activeTab, setActiveTab] = useState<"version" | "nutrition" | "label" | "packaging">("version")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{product.name}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span>Company: <span className="text-slate-700">{product.company}</span></span>
            <span>Brand: <span className="text-slate-700">{product.brand}</span></span>
            <span>Version: <span className="text-slate-700">{product.version}</span></span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span>Created By: <span className="text-slate-700">{product.createdBy}</span></span>
            <span>Last Updated: <span className="text-slate-700">{product.lastUpdated}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit3 className="h-5 w-5 text-slate-500" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.status === "active" ? "Retail" : "Concept"}
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: product image and info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex gap-6">
              {/* Product image */}
              <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Package className="h-16 w-16 text-slate-300" />
              </div>

              {/* Scores */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Nutrition</p>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-orange-500" />
                      <span className="text-2xl font-bold text-slate-800">{product.nutritionScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Sustainability</p>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-teal-500" />
                      <span className="text-2xl font-bold text-slate-800">{product.sustainabilityScore}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Cost</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-slate-500" />
                    <span className="text-2xl font-bold text-slate-800">{product.costPerKg.toFixed(2)}/kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SKU bar */}
            <div className="mt-6 flex items-center gap-4 px-4 py-3 bg-slate-700 rounded-lg text-sm text-white">
              <span>SKU/Code: <span className="font-medium">{product.sku}</span></span>
              <span>Date Created: <span className="font-medium">{product.dateCreated}</span></span>
              <span>Fulfillment Date: <span className="font-medium">{product.fulfillmentDate || "N/A"}</span></span>
            </div>

            {/* Objectives */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium text-slate-800">Objectives</h3>
                <button type="button" className="p-1 hover:bg-slate-100 rounded-full">
                  <span className="sr-only">Info</span>
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Metrics row */}
            <div className="mt-6 grid grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-500">Ingredients:</p>
                <p className="text-lg font-semibold text-slate-800">{product.ingredientCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Flavor:</p>
                <p className="text-lg font-semibold text-slate-800">{product.flavor || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Serving Size:</p>
                <p className="text-lg font-semibold text-slate-800">{product.servingSize || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Profit Margin:</p>
                <p className="text-lg font-semibold text-slate-800">{product.profitMargin} %</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Manufacturer:</p>
                <p className="text-lg font-semibold text-slate-800">{product.manufacturer || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Data Source + Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Share2 className="h-4 w-4" />
                Data Source:
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {[
                { id: "version", label: "Current Version" },
                { id: "nutrition", label: "Nutrition" },
                { id: "label", label: "Generate Label", highlight: true },
                { id: "packaging", label: "Matched Packaging" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? tab.highlight
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-800"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg">
                  <Search className="h-4 w-4 text-slate-500" />
                </button>
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg">
                  <Edit3 className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Version table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Current version</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">—</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">—</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">—</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">—</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">—</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <input type="radio" checked readOnly className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-800">1</span>
                        <span className="text-sm text-slate-500">{product.dateCreated?.slice(5)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium border border-blue-200">
                        Nutrition
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" className="px-4 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-sm font-medium border border-teal-200">
                        Supply Chain
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-sm font-medium border border-amber-200">
                        Cost
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" className="px-4 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-200">
                        Sustainability
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium border border-purple-200">
                        Popularity
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Version History */}
            <button type="button" className="flex items-center gap-2 mt-4 text-sm text-slate-600 hover:text-slate-800">
              Version History
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: recommendations + ingredients */}
        <div className="space-y-6">
          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <button
              type="button"
              onClick={() => setExpandedSection(expandedSection === "recommendations" ? null : "recommendations")}
              className="flex items-center justify-between w-full"
            >
              <span className="font-medium text-slate-800">Recommendations: <span className="text-blue-600">0</span></span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expandedSection === "recommendations" ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Ingredient percentages */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-medium text-slate-800 mb-4">Top Ingredients</h3>
            <div className="space-y-3">
              {product.ingredients.slice(0, 5).map((ing, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-700">{ing.name}</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{ing.percentage}%</span>
                </div>
              ))}
            </div>
            <button type="button" className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "retail" | "concept" | "latest" | "ai">("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = productsData.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "retail" && p.status === "active") ||
      (activeFilter === "concept" && p.status === "concept")
    return matchesSearch && matchesFilter
  })

  // If viewing a product detail
  if (selectedProduct) {
    return (
      <>
        <ProductDetailView
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onEdit={(p) => setEditingProduct(p)}
        />
        {editingProduct && (
          <ProductEditModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={() => {}}
            isNew={false}
          />
        )}
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recently Viewed Carousel */}
      <div className="relative">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 px-1">
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>
          {recentlyViewed.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-28 cursor-pointer group"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-square rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors overflow-hidden">
                <Package className="h-10 w-10 text-slate-300" />
              </div>
              <p className="mt-2 text-xs text-slate-700 truncate text-center">{product.name}</p>
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

      {/* Header with count and filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">
            Active Products <span className="text-blue-600 font-normal">488008</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("retail")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "retail"
                  ? "bg-slate-800 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Retail
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("concept")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "concept"
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-teal-200 text-teal-600 hover:bg-teal-50"
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              Concept
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              <Bell className="h-4 w-4" />
              Latest updates
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Star className="h-4 w-4" />
              Journey AI
            </button>
          </div>
        </div>
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

      {/* Filters row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters:
        </div>
        {["Market", "Brand", "Type"].map((filter) => (
          <button
            key={filter}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            {filter.slice(0, 2)}...
            <ChevronDown className="h-3 w-3" />
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2">
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

      {/* Products table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Flavor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Version</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-slate-800">{product.name}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{product.brand}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{product.type || "-"}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{product.flavor || "-"}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">v{product.version}</span>
                </td>
                <td className="px-4 py-4 text-lg">{product.countryFlag}</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium uppercase ${
                    product.status === "active"
                      ? "bg-slate-800 text-white"
                      : product.status === "concept"
                        ? "bg-teal-100 text-teal-700"
                        : "bg-slate-100 text-slate-600"
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{product.nutritionScore}%</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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

      {/* Floating Add button */}
      <button
        type="button"
        onClick={() => setIsAddingNew(true)}
        className="fixed bottom-8 right-8 p-4 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add/Edit Modal */}
      {(isAddingNew || editingProduct) && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setIsAddingNew(false)
            setEditingProduct(null)
          }}
          onSave={() => {}}
          isNew={isAddingNew}
        />
      )}
    </div>
  )
}
