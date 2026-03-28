"use client"

import { useState } from "react"
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Truck,
  DollarSign,
  Shield,
  Leaf,
  Sparkles,
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Clock,
  FlaskConical,
  ShieldCheck,
  Ban,
  FileText,
  HelpCircle,
} from "lucide-react"

import {
  type IngredientSubstitution,
  type SubstitutionReason,
  getReasonColor,
  getReasonLabel,
  getImpactColor,
} from "@/lib/substitution-data"

import {
  type MENAMarket,
  type MarketStatus,
  type RecipeMarketComparison,
  type IngredientMarketStatus,
  menaMarkets,
  getMarketStatusColor,
  getMarketStatusLabel,
} from "@/lib/multi-market-data"

import {
  type UserRole,
  type RolePriorityData,
  roleConfigs,
  getStockStatusColor,
  getVolatilityColor,
} from "@/lib/role-data"

// ─── Substitution Card ────────────────────────────────────────────────────────

interface SubstitutionCardProps {
  substitution: IngredientSubstitution
  onApply?: (substitution: IngredientSubstitution) => void
  onDismiss?: (substitution: IngredientSubstitution) => void
}

export function SubstitutionCard({ substitution, onApply, onDismiss }: SubstitutionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showSuppliers, setShowSuppliers] = useState(false)
  const reasonColors = getReasonColor(substitution.reason)

  const getReasonIcon = (reason: SubstitutionReason) => {
    switch (reason) {
      case "supply-constraint": return <Truck className="h-4 w-4" />
      case "cost": return <DollarSign className="h-4 w-4" />
      case "regulation": return <Shield className="h-4 w-4" />
      case "sustainability": return <Leaf className="h-4 w-4" />
      case "allergen": return <AlertTriangle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getImpactIcon = (direction: "positive" | "negative" | "neutral") => {
    switch (direction) {
      case "positive": return <TrendingUp className="h-3.5 w-3.5" />
      case "negative": return <TrendingDown className="h-3.5 w-3.5" />
      case "neutral": return <Minus className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className={`bg-white rounded-xl border ${reasonColors.border} overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 ${reasonColors.bg} border-b ${reasonColors.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg bg-white/80 ${reasonColors.text}`}>
              {getReasonIcon(substitution.reason)}
            </div>
            <div>
              <span className={`text-xs font-semibold uppercase tracking-wide ${reasonColors.text}`}>
                {getReasonLabel(substitution.reason)}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-medium text-slate-800">
                  {substitution.suggestedSubstitute.matchScore}% Match
                </span>
                <span className="text-xs text-slate-500">
                  AI Confidence: {substitution.confidence}%
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-slate-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Ingredient Swap */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Original</p>
            <p className="font-medium text-slate-800">{substitution.originalIngredient.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {substitution.originalIngredient.supplier} - ${substitution.originalIngredient.pricePerKg.toFixed(2)}/kg
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">Suggested</p>
            <p className="font-medium text-slate-800">{substitution.suggestedSubstitute.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              ${substitution.suggestedSubstitute.pricePerKg.toFixed(2)}/kg
            </p>
          </div>
        </div>

        {/* Reason Detail */}
        <p className="text-sm text-slate-600 mb-4">{substitution.reasonDetail}</p>

        {/* Impact Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {Object.entries(substitution.impact).map(([key, metric]) => (
            <div key={key} className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">{metric.name}</p>
              <div className={`flex items-center justify-center gap-1 ${getImpactColor(metric.direction)}`}>
                {getImpactIcon(metric.direction)}
                <span className="text-sm font-semibold">
                  {metric.changePercent > 0 ? "+" : ""}{metric.changePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* AI Notes */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1">AI Recommendation</p>
                <p className="text-sm text-blue-800">{substitution.aiNotes}</p>
              </div>
            </div>

            {/* Supplier Availability */}
            <div>
              <button
                type="button"
                onClick={() => setShowSuppliers(!showSuppliers)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                <Package className="h-4 w-4" />
                Supplier Availability ({substitution.suppliers.length})
                <ChevronRight className={`h-4 w-4 transition-transform ${showSuppliers ? "rotate-90" : ""}`} />
              </button>

              {showSuppliers && (
                <div className="mt-3 space-y-2">
                  {substitution.suppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className={`p-3 rounded-lg border ${
                        supplier.inStock ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{supplier.countryFlag === "US" ? "🇺🇸" : supplier.countryFlag === "DE" ? "🇩🇪" : supplier.countryFlag === "TH" ? "🇹🇭" : supplier.countryFlag === "FR" ? "🇫🇷" : supplier.countryFlag === "IT" ? "🇮🇹" : supplier.countryFlag === "GH" ? "🇬🇭" : supplier.countryFlag === "BF" ? "🇧🇫" : "🌍"}</span>
                          <div>
                            <p className="font-medium text-slate-800">{supplier.name}</p>
                            <p className="text-xs text-slate-500">{supplier.country}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">${supplier.pricePerKg.toFixed(2)}/kg</p>
                          <p className="text-xs text-slate-500">Lead: {supplier.leadTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1">
                          {supplier.certifications.map((cert) => (
                            <span key={cert} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          supplier.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {supplier.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onApply?.(substitution)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Substitution
          </button>
          <button
            type="button"
            onClick={() => onDismiss?.(substitution)}
            className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Multi-Market Regulatory Comparison ───────────────────────────────────────

interface MultiMarketComparisonProps {
  comparison: RecipeMarketComparison
  compact?: boolean
}

export function MultiMarketComparison({ comparison, compact = false }: MultiMarketComparisonProps) {
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null)

  const getStatusIcon = (status: MarketStatus) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "restricted": return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "disclosure-required": return <FileText className="h-4 w-4 text-blue-600" />
      case "banned": return <Ban className="h-4 w-4 text-red-600" />
      case "pending-review": return <HelpCircle className="h-4 w-4 text-slate-500" />
      default: return <HelpCircle className="h-4 w-4 text-slate-400" />
    }
  }

  const getFlagEmoji = (code: string) => {
    switch (code) {
      case "MA": return "🇲🇦"
      case "DZ": return "🇩🇿"
      case "TN": return "🇹🇳"
      case "AE": return "🇦🇪"
      case "SA": return "🇸🇦"
      default: return "🌍"
    }
  }

  if (compact) {
    // Compact summary view
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-500" />
            MENA Market Status
          </h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            {menaMarkets.map((market) => {
              const status = comparison.overallMarketStatus[market.code]
              const colors = getMarketStatusColor(status)
              return (
                <div
                  key={market.code}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${colors.border} ${colors.bg}`}
                  title={`${market.name}: ${getMarketStatusLabel(status)}`}
                >
                  <span className="text-base">{getFlagEmoji(market.code)}</span>
                  {getStatusIcon(status)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Full table view
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Shield className="h-4 w-4 text-slate-500" />
          Multi-Market Regulatory Comparison
        </h3>
        <span className="text-xs text-slate-500">5 MENA Markets</span>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide w-48">
                Ingredient
              </th>
              {menaMarkets.map((market) => (
                <th key={market.code} className="text-center px-3 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{getFlagEmoji(market.code)}</span>
                    <span>{market.code}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.ingredientStatuses.map((ingredient) => (
              <>
                <tr
                  key={ingredient.ingredientId}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setExpandedIngredient(
                    expandedIngredient === ingredient.ingredientId ? null : ingredient.ingredientId
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${
                        expandedIngredient === ingredient.ingredientId ? "rotate-90" : ""
                      }`} />
                      <span className="font-medium text-slate-800">{ingredient.ingredientName}</span>
                    </div>
                  </td>
                  {menaMarkets.map((market) => {
                    const marketStatus = ingredient.marketStatuses.find(ms => ms.marketCode === market.code)
                    const status = marketStatus?.status || "pending-review"
                    const colors = getMarketStatusColor(status)
                    return (
                      <td key={market.code} className="text-center px-3 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-medium`}>
                          {getStatusIcon(status)}
                          <span className="hidden sm:inline">{getMarketStatusLabel(status)}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
                {expandedIngredient === ingredient.ingredientId && (
                  <tr className="bg-slate-50">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="grid grid-cols-5 gap-3">
                        {menaMarkets.map((market) => {
                          const marketStatus = ingredient.marketStatuses.find(ms => ms.marketCode === market.code)
                          if (!marketStatus) return null
                          return (
                            <div key={market.code} className="text-xs text-slate-600">
                              <p className="font-semibold text-slate-700 mb-1">{market.name}</p>
                              {marketStatus.notes && <p className="mb-1">{marketStatus.notes}</p>}
                              {marketStatus.maxAllowedPercentage && (
                                <p className="text-amber-600">Max: {marketStatus.maxAllowedPercentage}%</p>
                              )}
                              {marketStatus.disclosureRequirements && (
                                <ul className="list-disc list-inside text-blue-600">
                                  {marketStatus.disclosureRequirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              )}
                              <p className="text-slate-400 mt-1">Updated: {marketStatus.lastUpdated}</p>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
          {/* Overall Status Footer */}
          <tfoot>
            <tr className="bg-slate-100 border-t-2 border-slate-200">
              <td className="px-4 py-3 font-semibold text-slate-700">Overall Status</td>
              {menaMarkets.map((market) => {
                const status = comparison.overallMarketStatus[market.code]
                const colors = getMarketStatusColor(status)
                return (
                  <td key={market.code} className="text-center px-3 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${colors.bg} ${colors.text} text-xs font-semibold border ${colors.border}`}>
                      {getStatusIcon(status)}
                      {getMarketStatusLabel(status)}
                    </div>
                  </td>
                )
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Role-Based Dashboard Switch ──────────────────────────────────────────────

interface RoleSwitchProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

export function RoleSwitch({ currentRole, onRoleChange }: RoleSwitchProps) {
  const roles: UserRole[] = ["rd", "procurement", "quality"]

  return (
    <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
      {roles.map((role) => {
        const config = roleConfigs[role]
        const isActive = currentRole === role

        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              isActive
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {role === "rd" && <FlaskConical className="h-4 w-4" />}
            {role === "procurement" && <Truck className="h-4 w-4" />}
            {role === "quality" && <ShieldCheck className="h-4 w-4" />}
            {config.shortName}
          </button>
        )
      })}
    </div>
  )
}

// ─── Role-Based Priority Panel ────────────────────────────────────────────────

interface RolePriorityPanelProps {
  role: UserRole
  data: RolePriorityData
}

export function RolePriorityPanel({ role, data }: RolePriorityPanelProps) {
  const config = roleConfigs[role]

  if (role === "rd") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <FlaskConical className="h-4 w-4 text-blue-500" />
          R&D Priority Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Nutrition Score</p>
            <p className="text-2xl font-bold text-slate-800">{data.rdPriority.nutritionScore}<span className="text-sm text-slate-500">/100</span></p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Taste Profile</p>
            <p className="text-2xl font-bold text-slate-800">{data.rdPriority.tasteProfile}<span className="text-sm text-slate-500">/100</span></p>
          </div>
          <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-2">Functional Claims</p>
            <div className="flex flex-wrap gap-2">
              {data.rdPriority.functionalClaims.map((claim) => (
                <span key={claim} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {claim}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Ingredients</p>
            <p className="text-lg font-semibold text-slate-800">{data.rdPriority.formulation.ingredients}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Version</p>
            <p className="text-lg font-semibold text-slate-800">v{data.rdPriority.formulation.version}</p>
          </div>
        </div>
      </div>
    )
  }

  if (role === "procurement") {
    const stockColors = getStockStatusColor(data.procurementPriority.stockStatus)
    const volatilityColors = getVolatilityColor(data.procurementPriority.priceVolatility)

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <Truck className="h-4 w-4 text-amber-500" />
          Procurement Priority Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Cost/kg</p>
            <p className="text-2xl font-bold text-slate-800">${data.procurementPriority.costPerKg.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Suppliers</p>
            <p className="text-2xl font-bold text-slate-800">{data.procurementPriority.supplierCount}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Lead Time</p>
            <p className="text-lg font-semibold text-slate-800">{data.procurementPriority.leadTime}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">MOQ</p>
            <p className="text-lg font-semibold text-slate-800">{data.procurementPriority.moq}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Price Volatility</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${volatilityColors.bg} ${volatilityColors.text}`}>
              {data.procurementPriority.priceVolatility.charAt(0).toUpperCase() + data.procurementPriority.priceVolatility.slice(1)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Stock Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockColors.bg} ${stockColors.text}`}>
              {data.procurementPriority.stockStatus === "in-stock" ? "In Stock" : data.procurementPriority.stockStatus === "low" ? "Low Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (role === "quality") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          Quality Priority Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Compliance Score</p>
            <p className="text-2xl font-bold text-slate-800">{data.qualityPriority.complianceScore}<span className="text-sm text-slate-500">/100</span></p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Tests Pending</p>
            <p className={`text-2xl font-bold ${data.qualityPriority.testsPending > 0 ? "text-amber-600" : "text-green-600"}`}>
              {data.qualityPriority.testsPending}
            </p>
          </div>
          <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-2">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {data.qualityPriority.certifications.map((cert) => (
                <span key={cert} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Last Audit</p>
            <p className="text-sm font-semibold text-slate-800">{data.qualityPriority.lastAuditDate}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Non-Conformances</p>
            <p className={`text-lg font-semibold ${data.qualityPriority.nonConformances > 0 ? "text-red-600" : "text-green-600"}`}>
              {data.qualityPriority.nonConformances}
            </p>
          </div>
          <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Shelf Life</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-semibold text-slate-800">{data.qualityPriority.shelfLife}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
