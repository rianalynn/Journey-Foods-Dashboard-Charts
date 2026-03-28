// ─── Role-Based Dashboard Types ───────────────────────────────────────────────

export type UserRole = "rd" | "procurement" | "quality"

export interface RoleConfig {
  id: UserRole
  name: string
  shortName: string
  description: string
  icon: string
  priorityMetrics: string[]
  hiddenSections: string[]
  defaultSort: string
}

export interface RolePriorityData {
  rdPriority: {
    nutritionScore: number
    tasteProfile: number
    functionalClaims: string[]
    formulation: { ingredients: number; version: number }
  }
  procurementPriority: {
    costPerKg: number
    supplierCount: number
    leadTime: string
    moq: string
    priceVolatility: "low" | "medium" | "high"
    stockStatus: "in-stock" | "low" | "out-of-stock"
  }
  qualityPriority: {
    complianceScore: number
    certifications: string[]
    testsPending: number
    lastAuditDate: string
    nonConformances: number
    shelfLife: string
  }
}

// ─── Role Configurations ──────────────────────────────────────────────────────

export const roleConfigs: Record<UserRole, RoleConfig> = {
  rd: {
    id: "rd",
    name: "R&D",
    shortName: "R&D",
    description: "Research & Development focus on formulation and nutrition",
    icon: "flask",
    priorityMetrics: ["Nutrition Score", "Taste Profile", "Functional Claims", "Ingredient Count"],
    hiddenSections: ["pricing", "supplier-details", "procurement-metrics"],
    defaultSort: "nutritionScore",
  },
  procurement: {
    id: "procurement",
    name: "Procurement",
    shortName: "Proc",
    description: "Procurement focus on cost, supply chain, and sourcing",
    icon: "truck",
    priorityMetrics: ["Cost/kg", "Lead Time", "MOQ", "Supplier Count", "Stock Status"],
    hiddenSections: ["nutrition-details", "taste-profile", "formulation-history"],
    defaultSort: "costPerKg",
  },
  quality: {
    id: "quality",
    name: "Quality",
    shortName: "QA",
    description: "Quality Assurance focus on compliance and certifications",
    icon: "shield-check",
    priorityMetrics: ["Compliance Score", "Certifications", "Pending Tests", "Non-Conformances"],
    hiddenSections: ["cost-breakdown", "supplier-pricing", "market-trends"],
    defaultSort: "complianceScore",
  },
}

// ─── Mock Role-Specific Data for Products ─────────────────────────────────────

export const productRoleData: Record<string, RolePriorityData> = {
  "1": { // Organic Protein Bar
    rdPriority: {
      nutritionScore: 87,
      tasteProfile: 92,
      functionalClaims: ["High Protein", "Low Sugar", "Gluten-Free"],
      formulation: { ingredients: 12, version: 3 },
    },
    procurementPriority: {
      costPerKg: 8.45,
      supplierCount: 4,
      leadTime: "2-3 weeks",
      moq: "500 kg",
      priceVolatility: "low",
      stockStatus: "in-stock",
    },
    qualityPriority: {
      complianceScore: 94,
      certifications: ["USDA Organic", "Non-GMO", "Kosher"],
      testsPending: 0,
      lastAuditDate: "2026-02-15",
      nonConformances: 0,
      shelfLife: "18 months",
    },
  },
  "2": { // Green Smoothie Mix
    rdPriority: {
      nutritionScore: 91,
      tasteProfile: 88,
      functionalClaims: ["High Fiber", "Vitamin Rich", "Vegan"],
      formulation: { ingredients: 15, version: 5 },
    },
    procurementPriority: {
      costPerKg: 12.30,
      supplierCount: 6,
      leadTime: "3-4 weeks",
      moq: "250 kg",
      priceVolatility: "medium",
      stockStatus: "low",
    },
    qualityPriority: {
      complianceScore: 78,
      certifications: ["Vegan Certified", "Non-GMO"],
      testsPending: 2,
      lastAuditDate: "2026-01-20",
      nonConformances: 1,
      shelfLife: "12 months",
    },
  },
  "3": { // Keto Snack Bar
    rdPriority: {
      nutritionScore: 85,
      tasteProfile: 90,
      functionalClaims: ["Low Carb", "High Fat", "Keto-Friendly"],
      formulation: { ingredients: 10, version: 2 },
    },
    procurementPriority: {
      costPerKg: 9.75,
      supplierCount: 3,
      leadTime: "2 weeks",
      moq: "1000 kg",
      priceVolatility: "high",
      stockStatus: "in-stock",
    },
    qualityPriority: {
      complianceScore: 88,
      certifications: ["Keto Certified", "Gluten-Free"],
      testsPending: 1,
      lastAuditDate: "2026-03-01",
      nonConformances: 0,
      shelfLife: "15 months",
    },
  },
  "4": { // Functional Beverage
    rdPriority: {
      nutritionScore: 82,
      tasteProfile: 85,
      functionalClaims: ["Energy Boost", "Vitamin B Complex", "Natural Caffeine"],
      formulation: { ingredients: 8, version: 4 },
    },
    procurementPriority: {
      costPerKg: 6.20,
      supplierCount: 5,
      leadTime: "1-2 weeks",
      moq: "2000 kg",
      priceVolatility: "low",
      stockStatus: "in-stock",
    },
    qualityPriority: {
      complianceScore: 92,
      certifications: ["Natural Certified", "Sugar-Free"],
      testsPending: 0,
      lastAuditDate: "2026-02-28",
      nonConformances: 0,
      shelfLife: "24 months",
    },
  },
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfigs[role]
}

export function getProductRoleData(productId: string): RolePriorityData | null {
  return productRoleData[productId] || null
}

export function getStockStatusColor(status: "in-stock" | "low" | "out-of-stock"): { bg: string; text: string } {
  switch (status) {
    case "in-stock": return { bg: "bg-green-100", text: "text-green-700" }
    case "low": return { bg: "bg-amber-100", text: "text-amber-700" }
    case "out-of-stock": return { bg: "bg-red-100", text: "text-red-700" }
    default: return { bg: "bg-slate-100", text: "text-slate-700" }
  }
}

export function getVolatilityColor(volatility: "low" | "medium" | "high"): { bg: string; text: string } {
  switch (volatility) {
    case "low": return { bg: "bg-green-100", text: "text-green-700" }
    case "medium": return { bg: "bg-amber-100", text: "text-amber-700" }
    case "high": return { bg: "bg-red-100", text: "text-red-700" }
    default: return { bg: "bg-slate-100", text: "text-slate-700" }
  }
}
