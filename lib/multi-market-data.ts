// ─── Multi-Market Regulatory Types ───────────────────────────────────────────

export type MarketStatus = "approved" | "restricted" | "disclosure-required" | "banned" | "pending-review"

export interface MENAMarket {
  code: string
  name: string
  flag: string
  regulatoryBody: string
}

export interface IngredientMarketStatus {
  ingredientId: string
  ingredientName: string
  marketStatuses: {
    marketCode: string
    status: MarketStatus
    notes?: string
    maxAllowedPercentage?: number
    disclosureRequirements?: string[]
    documentRequired?: string
    lastUpdated: string
  }[]
}

export interface RecipeMarketComparison {
  recipeId: string
  recipeName: string
  ingredientStatuses: IngredientMarketStatus[]
  overallMarketStatus: Record<string, MarketStatus>
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getMarketStatusColor(status: MarketStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case "approved":
      return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" }
    case "restricted":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
    case "disclosure-required":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" }
    case "banned":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
    case "pending-review":
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" }
  }
}

export function getMarketStatusLabel(status: MarketStatus): string {
  switch (status) {
    case "approved": return "Approved"
    case "restricted": return "Restricted"
    case "disclosure-required": return "Disclosure Req."
    case "banned": return "Banned"
    case "pending-review": return "Pending Review"
    default: return status
  }
}

// ─── MENA Markets ─────────────────────────────────────────────────────────────

export const menaMarkets: MENAMarket[] = [
  { code: "MA", name: "Morocco", flag: "MA", regulatoryBody: "ONSSA" },
  { code: "DZ", name: "Algeria", flag: "DZ", regulatoryBody: "Ministry of Commerce" },
  { code: "TN", name: "Tunisia", flag: "TN", regulatoryBody: "ANCSEP" },
  { code: "AE", name: "UAE", flag: "AE", regulatoryBody: "ESMA" },
  { code: "SA", name: "Saudi Arabia", flag: "SA", regulatoryBody: "SFDA" },
]

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const ingredientMarketData: Record<string, IngredientMarketStatus> = {
  "whey-protein": {
    ingredientId: "whey-protein",
    ingredientName: "Whey Protein Isolate",
    marketStatuses: [
      { marketCode: "MA", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "DZ", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "TN", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "AE", status: "approved", notes: "Halal certification required", lastUpdated: "2026-02-01" },
      { marketCode: "SA", status: "approved", notes: "Halal certification required", lastUpdated: "2026-02-01" },
    ],
  },
  "red-40": {
    ingredientId: "red-40",
    ingredientName: "Red 40 (Allura Red)",
    marketStatuses: [
      { marketCode: "MA", status: "banned", notes: "Synthetic colorants not permitted", lastUpdated: "2025-06-01" },
      { marketCode: "DZ", status: "restricted", maxAllowedPercentage: 0.01, notes: "Very low limits permitted", lastUpdated: "2025-08-15" },
      { marketCode: "TN", status: "disclosure-required", disclosureRequirements: ["Label must state 'Contains synthetic colorants'"], lastUpdated: "2026-01-01" },
      { marketCode: "AE", status: "approved", maxAllowedPercentage: 0.03, lastUpdated: "2025-12-01" },
      { marketCode: "SA", status: "approved", maxAllowedPercentage: 0.025, lastUpdated: "2025-11-15" },
    ],
  },
  "vanilla-extract": {
    ingredientId: "vanilla-extract",
    ingredientName: "Madagascar Vanilla Extract",
    marketStatuses: [
      { marketCode: "MA", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "DZ", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "TN", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "AE", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "SA", status: "disclosure-required", disclosureRequirements: ["Alcohol content must be declared if >0.5%"], lastUpdated: "2026-02-15" },
    ],
  },
  "pork-gelatin": {
    ingredientId: "pork-gelatin",
    ingredientName: "Pork Gelatin",
    marketStatuses: [
      { marketCode: "MA", status: "banned", notes: "Non-halal ingredients prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "DZ", status: "banned", notes: "Non-halal ingredients prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "TN", status: "banned", notes: "Non-halal ingredients prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "AE", status: "banned", notes: "Non-halal ingredients prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "SA", status: "banned", notes: "Non-halal ingredients prohibited", lastUpdated: "2025-01-01" },
    ],
  },
  "stevia": {
    ingredientId: "stevia",
    ingredientName: "Stevia Extract",
    marketStatuses: [
      { marketCode: "MA", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "DZ", status: "pending-review", notes: "Under regulatory review", lastUpdated: "2026-03-01" },
      { marketCode: "TN", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "AE", status: "approved", maxAllowedPercentage: 4.0, lastUpdated: "2026-01-15" },
      { marketCode: "SA", status: "approved", maxAllowedPercentage: 4.0, lastUpdated: "2026-01-15" },
    ],
  },
  "caffeine": {
    ingredientId: "caffeine",
    ingredientName: "Caffeine Anhydrous",
    marketStatuses: [
      { marketCode: "MA", status: "restricted", maxAllowedPercentage: 0.015, notes: "Max 150mg per serving", lastUpdated: "2026-02-01" },
      { marketCode: "DZ", status: "restricted", maxAllowedPercentage: 0.02, notes: "Max 200mg per serving", lastUpdated: "2026-02-01" },
      { marketCode: "TN", status: "disclosure-required", disclosureRequirements: ["High caffeine content warning required >75mg"], lastUpdated: "2026-01-15" },
      { marketCode: "AE", status: "restricted", maxAllowedPercentage: 0.032, notes: "Max 320mg per unit", lastUpdated: "2026-01-01" },
      { marketCode: "SA", status: "restricted", maxAllowedPercentage: 0.02, notes: "Max 200mg per serving, warning label required", lastUpdated: "2025-12-15" },
    ],
  },
  "palm-oil": {
    ingredientId: "palm-oil",
    ingredientName: "Palm Oil",
    marketStatuses: [
      { marketCode: "MA", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "DZ", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "TN", status: "approved", lastUpdated: "2026-01-15" },
      { marketCode: "AE", status: "disclosure-required", disclosureRequirements: ["Must specify 'Contains Palm Oil' on label"], lastUpdated: "2026-03-01" },
      { marketCode: "SA", status: "approved", lastUpdated: "2026-01-15" },
    ],
  },
  "cbd": {
    ingredientId: "cbd",
    ingredientName: "CBD (Cannabidiol)",
    marketStatuses: [
      { marketCode: "MA", status: "banned", notes: "Cannabis derivatives prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "DZ", status: "banned", notes: "Cannabis derivatives prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "TN", status: "banned", notes: "Cannabis derivatives prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "AE", status: "banned", notes: "Cannabis derivatives prohibited", lastUpdated: "2025-01-01" },
      { marketCode: "SA", status: "banned", notes: "Cannabis derivatives prohibited", lastUpdated: "2025-01-01" },
    ],
  },
}

// Product-level market comparison
export const productMarketComparison: Record<string, RecipeMarketComparison> = {
  "1": {
    recipeId: "1",
    recipeName: "Organic Protein Bar",
    ingredientStatuses: [
      ingredientMarketData["whey-protein"],
      ingredientMarketData["vanilla-extract"],
      ingredientMarketData["stevia"],
    ],
    overallMarketStatus: {
      "MA": "approved",
      "DZ": "approved",
      "TN": "approved",
      "AE": "disclosure-required",
      "SA": "disclosure-required",
    },
  },
  "2": {
    recipeId: "2",
    recipeName: "Green Smoothie Mix",
    ingredientStatuses: [
      ingredientMarketData["red-40"],
      ingredientMarketData["stevia"],
    ],
    overallMarketStatus: {
      "MA": "banned",
      "DZ": "restricted",
      "TN": "disclosure-required",
      "AE": "approved",
      "SA": "approved",
    },
  },
  "3": {
    recipeId: "3",
    recipeName: "Keto Snack Bar",
    ingredientStatuses: [
      ingredientMarketData["palm-oil"],
      ingredientMarketData["caffeine"],
    ],
    overallMarketStatus: {
      "MA": "restricted",
      "DZ": "restricted",
      "TN": "disclosure-required",
      "AE": "disclosure-required",
      "SA": "restricted",
    },
  },
}

// Get market comparison for a product
export function getProductMarketComparison(productId: string): RecipeMarketComparison | null {
  return productMarketComparison[productId] || null
}

// Get all ingredient market statuses
export function getAllIngredientMarketStatuses(): IngredientMarketStatus[] {
  return Object.values(ingredientMarketData)
}
