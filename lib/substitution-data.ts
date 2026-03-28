// ─── Substitution Types ───────────────────────────────────────────────────────

export type SubstitutionReason = "supply-constraint" | "cost" | "regulation" | "sustainability" | "allergen"

export interface ImpactMetric {
  name: string
  originalValue: number
  newValue: number
  unit: string
  changePercent: number
  direction: "positive" | "negative" | "neutral"
}

export interface SupplierOption {
  id: string
  name: string
  country: string
  countryFlag: string
  leadTime: string
  moq: string
  pricePerKg: number
  certifications: string[]
  inStock: boolean
}

export interface IngredientSubstitution {
  id: string
  originalIngredient: {
    id: string
    name: string
    supplier: string
    pricePerKg: number
    percentage: number // in formulation
  }
  suggestedSubstitute: {
    id: string
    name: string
    pricePerKg: number
    matchScore: number // 0-100 similarity score
  }
  reason: SubstitutionReason
  reasonDetail: string
  impact: {
    taste: ImpactMetric
    texture: ImpactMetric
    nutrition: ImpactMetric
    cost: ImpactMetric
  }
  suppliers: SupplierOption[]
  confidence: number // AI confidence 0-100
  aiNotes: string
  createdAt: string
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getReasonColor(reason: SubstitutionReason): { bg: string; text: string; border: string; icon: string } {
  switch (reason) {
    case "supply-constraint":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" }
    case "cost":
      return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "text-green-500" }
    case "regulation":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500" }
    case "sustainability":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-500" }
    case "allergen":
      return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-500" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: "text-slate-500" }
  }
}

export function getReasonLabel(reason: SubstitutionReason): string {
  switch (reason) {
    case "supply-constraint": return "Supply Constraint"
    case "cost": return "Cost Optimization"
    case "regulation": return "Regulatory Compliance"
    case "sustainability": return "Sustainability"
    case "allergen": return "Allergen-Free"
    default: return reason
  }
}

export function getImpactColor(direction: "positive" | "negative" | "neutral"): string {
  switch (direction) {
    case "positive": return "text-green-600"
    case "negative": return "text-red-600"
    case "neutral": return "text-slate-500"
    default: return "text-slate-500"
  }
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const substitutionsByProduct: Record<string, IngredientSubstitution[]> = {
  "1": [ // Organic Protein Bar
    {
      id: "sub-1",
      originalIngredient: {
        id: "ing-12",
        name: "Whey Protein Isolate",
        supplier: "DairyPure Inc.",
        pricePerKg: 18.50,
        percentage: 25,
      },
      suggestedSubstitute: {
        id: "ing-alt-1",
        name: "Pea Protein Isolate",
        pricePerKg: 12.75,
        matchScore: 87,
      },
      reason: "cost",
      reasonDetail: "Pea protein offers comparable amino acid profile at 31% lower cost, with growing consumer preference for plant-based options.",
      impact: {
        taste: { name: "Taste", originalValue: 85, newValue: 82, unit: "/100", changePercent: -3.5, direction: "negative" },
        texture: { name: "Texture", originalValue: 90, newValue: 85, unit: "/100", changePercent: -5.6, direction: "negative" },
        nutrition: { name: "Protein Content", originalValue: 92, newValue: 88, unit: "g/100g", changePercent: -4.3, direction: "negative" },
        cost: { name: "Cost", originalValue: 18.50, newValue: 12.75, unit: "/kg", changePercent: -31.1, direction: "positive" },
      },
      suppliers: [
        { id: "sup-1", name: "PurePlant Foods", country: "USA", countryFlag: "US", leadTime: "2 weeks", moq: "500 kg", pricePerKg: 12.75, certifications: ["USDA Organic", "Non-GMO"], inStock: true },
        { id: "sup-2", name: "EuroProtein GmbH", country: "Germany", countryFlag: "DE", leadTime: "3 weeks", moq: "1000 kg", pricePerKg: 11.90, certifications: ["EU Organic"], inStock: true },
        { id: "sup-3", name: "GreenGrow Asia", country: "Thailand", countryFlag: "TH", leadTime: "4 weeks", moq: "2000 kg", pricePerKg: 10.25, certifications: ["Non-GMO"], inStock: false },
      ],
      confidence: 92,
      aiNotes: "Strong functional match. Minor texture adjustment may be needed. Recommend blend testing at 50/50 ratio first.",
      createdAt: "2026-03-15T10:30:00Z",
    },
    {
      id: "sub-2",
      originalIngredient: {
        id: "ing-8",
        name: "Madagascar Vanilla Extract",
        supplier: "SpiceWorld Ltd.",
        pricePerKg: 485.00,
        percentage: 0.5,
      },
      suggestedSubstitute: {
        id: "ing-alt-2",
        name: "Tahitian Vanilla Extract",
        pricePerKg: 420.00,
        matchScore: 94,
      },
      reason: "supply-constraint",
      reasonDetail: "Madagascar vanilla supply disrupted due to cyclone season. Tahitian vanilla offers similar flavor profile with stable supply chain.",
      impact: {
        taste: { name: "Taste", originalValue: 95, newValue: 93, unit: "/100", changePercent: -2.1, direction: "neutral" },
        texture: { name: "Texture", originalValue: 100, newValue: 100, unit: "/100", changePercent: 0, direction: "neutral" },
        nutrition: { name: "Nutrition", originalValue: 100, newValue: 100, unit: "/100", changePercent: 0, direction: "neutral" },
        cost: { name: "Cost", originalValue: 485.00, newValue: 420.00, unit: "/kg", changePercent: -13.4, direction: "positive" },
      },
      suppliers: [
        { id: "sup-4", name: "Pacific Spice Co.", country: "USA", countryFlag: "US", leadTime: "1 week", moq: "50 kg", pricePerKg: 420.00, certifications: ["Fair Trade", "Organic"], inStock: true },
        { id: "sup-5", name: "Tahiti Direct", country: "France", countryFlag: "FR", leadTime: "2 weeks", moq: "25 kg", pricePerKg: 445.00, certifications: ["AOC Certified"], inStock: true },
      ],
      confidence: 96,
      aiNotes: "Excellent flavor match. Tahitian vanilla has slightly more floral notes which may enhance the product profile.",
      createdAt: "2026-03-20T14:15:00Z",
    },
  ],
  "2": [ // Green Smoothie Mix
    {
      id: "sub-3",
      originalIngredient: {
        id: "ing-15",
        name: "Red 40 (Allura Red)",
        supplier: "ColorTech Industries",
        pricePerKg: 28.00,
        percentage: 0.02,
      },
      suggestedSubstitute: {
        id: "ing-alt-3",
        name: "Beetroot Powder",
        pricePerKg: 15.50,
        matchScore: 78,
      },
      reason: "regulation",
      reasonDetail: "Red 40 requires warning label in EU markets and is banned in Morocco. Beetroot powder provides natural coloring compliant across all target markets.",
      impact: {
        taste: { name: "Taste", originalValue: 100, newValue: 95, unit: "/100", changePercent: -5.0, direction: "negative" },
        texture: { name: "Texture", originalValue: 100, newValue: 98, unit: "/100", changePercent: -2.0, direction: "neutral" },
        nutrition: { name: "Nutrition", originalValue: 0, newValue: 15, unit: "added benefit", changePercent: 100, direction: "positive" },
        cost: { name: "Cost", originalValue: 28.00, newValue: 15.50, unit: "/kg", changePercent: -44.6, direction: "positive" },
      },
      suppliers: [
        { id: "sup-6", name: "NaturColor USA", country: "USA", countryFlag: "US", leadTime: "1 week", moq: "100 kg", pricePerKg: 15.50, certifications: ["USDA Organic", "Kosher"], inStock: true },
        { id: "sup-7", name: "BioColori Italia", country: "Italy", countryFlag: "IT", leadTime: "2 weeks", moq: "200 kg", pricePerKg: 14.25, certifications: ["EU Organic", "Halal"], inStock: true },
      ],
      confidence: 88,
      aiNotes: "Clean label upgrade. May require dosage adjustment for consistent color. Adds subtle earthy note - recommend consumer testing.",
      createdAt: "2026-03-18T09:45:00Z",
    },
  ],
  "3": [ // Keto Snack Bar
    {
      id: "sub-4",
      originalIngredient: {
        id: "ing-20",
        name: "Palm Oil",
        supplier: "TropOils Malaysia",
        pricePerKg: 1.85,
        percentage: 12,
      },
      suggestedSubstitute: {
        id: "ing-alt-4",
        name: "Shea Butter",
        pricePerKg: 4.50,
        matchScore: 82,
      },
      reason: "sustainability",
      reasonDetail: "Palm oil raises deforestation concerns affecting ESG scores. Shea butter offers similar functionality with better sustainability credentials.",
      impact: {
        taste: { name: "Taste", originalValue: 88, newValue: 86, unit: "/100", changePercent: -2.3, direction: "neutral" },
        texture: { name: "Texture", originalValue: 92, newValue: 88, unit: "/100", changePercent: -4.3, direction: "negative" },
        nutrition: { name: "Nutrition", originalValue: 65, newValue: 72, unit: "/100", changePercent: 10.8, direction: "positive" },
        cost: { name: "Cost", originalValue: 1.85, newValue: 4.50, unit: "/kg", changePercent: 143.2, direction: "negative" },
      },
      suppliers: [
        { id: "sup-8", name: "Ghana Shea Collective", country: "Ghana", countryFlag: "GH", leadTime: "3 weeks", moq: "500 kg", pricePerKg: 4.50, certifications: ["Fair Trade", "Organic"], inStock: true },
        { id: "sup-9", name: "West Africa Foods", country: "Burkina Faso", countryFlag: "BF", leadTime: "4 weeks", moq: "1000 kg", pricePerKg: 3.95, certifications: ["Fair Trade"], inStock: true },
      ],
      confidence: 79,
      aiNotes: "Significant cost increase but major sustainability improvement. Consider partial substitution (50%) to balance cost and ESG goals.",
      createdAt: "2026-03-22T11:00:00Z",
    },
  ],
}

// Get substitutions for a product
export function getSubstitutionsForProduct(productId: string): IngredientSubstitution[] {
  return substitutionsByProduct[productId] || []
}

// Get all substitutions across products
export function getAllSubstitutions(): IngredientSubstitution[] {
  return Object.values(substitutionsByProduct).flat()
}
