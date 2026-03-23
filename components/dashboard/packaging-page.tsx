"use client"

import { useState } from "react"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  Zap,
  Eye,
  Link,
  X,
  Check,
  TrendingUp,
  Box,
  ShoppingBag,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PackageItem {
  id: string
  name: string
  type: string
  market: string
  material: string
  score: number | null
  costVariance: string | null
  tag: "Retail" | "Food Service" | "E-Commerce" | "Industrial"
  associatedProducts: string[]
}

interface Product {
  id: string
  name: string
  sku: string
  status: "Active" | "Concept"
  packagingId: string | null
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const packagesData: PackageItem[] = [
  { id: "p1", name: "Rollstock for Form/Fill/Seal (pouching)", type: "Flexible Pouch", market: "Europe, North America", material: "Multi-layer LDPE", score: 72, costVariance: null, tag: "Retail", associatedProducts: ["prod-1", "prod-3"] },
  { id: "p2", name: "PRO-POUCH: Spouted", type: "Stand-Up Pouch", market: "Europe, North America", material: "PET/Foil/PE", score: 68, costVariance: "-$0.08", tag: "Retail", associatedProducts: ["prod-2"] },
  { id: "p3", name: "PRO-POUCH: Shaped", type: "Stand-Up Pouch", market: "Europe, North America", material: "OPP/PE", score: 74, costVariance: "+$0.12", tag: "Retail", associatedProducts: [] },
  { id: "p4", name: "PRO-POUCH: Side Gusset", type: "Side Gusset Bag", market: "Europe, North America", material: "Kraft/PE", score: 80, costVariance: null, tag: "Retail", associatedProducts: ["prod-4"] },
  { id: "p5", name: "PRO-POUCH: Inserted Gusset Stand Up Pouch", type: "Stand-Up Pouch", market: "Europe, North America", material: "BOPP/Metalized PET", score: 66, costVariance: "+$0.22", tag: "Retail", associatedProducts: [] },
  { id: "p6", name: "PRO-POUCH: Plow Bottom Stand Up Pouch", type: "Stand-Up Pouch", market: "Europe, North America", material: "Clear PET/PE", score: 71, costVariance: "-$0.05", tag: "Retail", associatedProducts: [] },
  { id: "p7", name: "Biodegradable Kraft Box", type: "Rigid Box", market: "North America", material: "FSC Certified Kraft", score: 92, costVariance: "+$0.35", tag: "Retail", associatedProducts: ["prod-5"] },
  { id: "p8", name: "Glass Jar 8oz", type: "Glass Container", market: "North America, APAC", material: "Borosilicate Glass", score: 88, costVariance: "+$0.55", tag: "Retail", associatedProducts: [] },
  { id: "p9", name: "Compostable Sleeve", type: "Sleeve Label", market: "Europe", material: "PLA-based Film", score: 95, costVariance: "+$0.18", tag: "Retail", associatedProducts: ["prod-2", "prod-3"] },
  { id: "p10", name: "Bulk Corrugated Shipper", type: "Corrugated Box", market: "North America", material: "Recycled Corrugated", score: 85, costVariance: "-$0.40", tag: "Food Service", associatedProducts: ["prod-4"] },
  { id: "p11", name: "Retort Pouch", type: "Retort Pouch", market: "Global", material: "Foil/Nylon/PP", score: 58, costVariance: null, tag: "Food Service", associatedProducts: [] },
  { id: "p12", name: "Mailer Box — DTC", type: "Mailer Box", market: "North America", material: "White Clay-Coated Board", score: 78, costVariance: "+$0.10", tag: "E-Commerce", associatedProducts: ["prod-1"] },
]

const productsData: Product[] = [
  { id: "prod-1", name: "Mango Turmeric Blend", sku: "SKU-1042", status: "Active", packagingId: "p1" },
  { id: "prod-2", name: "Buckwheat Protein Bar", sku: "SKU-2017", status: "Active", packagingId: "p2" },
  { id: "prod-3", name: "Spirulina Energy Shot", sku: "SKU-3301", status: "Concept", packagingId: null },
  { id: "prod-4", name: "Oat Fiber Powder", sku: "SKU-0889", status: "Active", packagingId: "p4" },
  { id: "prod-5", name: "Pea Protein Isolate Mix", sku: "SKU-5512", status: "Concept", packagingId: null },
]

const sustainabilityPoints = [
  { month: "Sept", value: 10 },
  { month: "Oct", value: 22 },
  { month: "Nov", value: 30 },
  { month: "Dec", value: 42 },
  { month: "Jan", value: 55 },
  { month: "Feb", value: 52 },
]

const ITEMS_PER_PAGE = 6

// ─── Sub-components ───────────────────────────────────────────────────────────

function SustainabilityMiniChart() {
  const max = 76.5
  const h = 80
  const w = 280

  const pts = sustainabilityPoints.map((p, i) => {
    const x = (i / (sustainabilityPoints.length - 1)) * (w - 20) + 10
    const y = h - 10 - (p.value / max) * (h - 20)
    return { x, y, ...p }
  })

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`

  const yLines = [0, 26, 51, 76.5]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-end gap-3 mb-3">
        <span className="text-4xl font-bold text-slate-800">80</span>
        <div className="flex items-center gap-1 mb-1">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-600">+6 pts</span>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-3">Sustainability Improvement</p>
      <div className="relative" style={{ height: h }}>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {yLines.map((v) => {
            const cy = h - 10 - (v / max) * (h - 20)
            return <line key={v} x1="0" y1={cy} x2={w} y2={cy} stroke="#e2e8f0" strokeWidth="1" />
          })}
          <path d={areaPath} fill="url(#sustGrad)" />
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" />
          {pts.map((p) => (
            <circle key={p.month} cx={p.x} cy={p.y} r="3" fill="#10b981" />
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          {sustainabilityPoints.map((p) => (
            <span key={p.month} className="text-[10px] text-slate-400">{p.month}</span>
          ))}
        </div>
        <div className="absolute top-0 right-full pr-1 flex flex-col justify-between h-full">
          {[76.5, 51, 26, 0].map((v) => (
            <span key={v} className="text-[10px] text-slate-400 leading-none">{v}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-slate-400">—</span>
  const color =
    score >= 85 ? "bg-emerald-100 text-emerald-700" :
    score >= 70 ? "bg-amber-100 text-amber-700" :
    "bg-red-100 text-red-700"
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}
    </span>
  )
}

// ─── Associate Package Modal ───────────────────────────────────────────────────

function AssociateModal({
  pkg,
  products,
  onClose,
  onSave,
}: {
  pkg: PackageItem
  products: Product[]
  onClose: () => void
  onSave: (pkgId: string, productIds: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(pkg.associatedProducts)

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">Associate Products</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight max-w-xs">{pkg.name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        <div className="p-5 space-y-2 max-h-72 overflow-y-auto">
          {products.map((prod) => {
            const checked = selected.includes(prod.id)
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => toggle(prod.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                  checked ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  checked ? "bg-blue-600 border-blue-600" : "border-slate-300"
                }`}>
                  {checked && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                  <p className="text-xs text-slate-500">{prod.sku}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                  prod.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {prod.status}
                </span>
              </button>
            )
          })}
        </div>
        <div className="p-5 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={() => onSave(pkg.id, selected)}
            className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
          >
            Save Associations
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Package Detail Drawer ────────────────────────────────────────────────────

function PackageDrawer({
  pkg,
  products,
  onClose,
  onAssociate,
}: {
  pkg: PackageItem
  products: Product[]
  onClose: () => void
  onAssociate: () => void
}) {
  const associated = products.filter((p) => pkg.associatedProducts.includes(p.id))

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 leading-snug">{pkg.name}</h3>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{pkg.tag}</span>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Type", value: pkg.type },
              { label: "Material", value: pkg.material },
              { label: "Market", value: pkg.market },
              { label: "Cost Variance", value: pkg.costVariance ?? "No data" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* Packaging Score */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500">Packaging Score</p>
              <ScoreBadge score={pkg.score} />
            </div>
            {pkg.score !== null && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${pkg.score >= 85 ? "bg-emerald-500" : pkg.score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${pkg.score}%` }}
                />
              </div>
            )}
          </div>

          {/* Associated Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-800">Associated Products</p>
              <button
                type="button"
                onClick={onAssociate}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Link className="h-3.5 w-3.5" />
                Manage
              </button>
            </div>
            {associated.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No products associated yet.</p>
            ) : (
              <div className="space-y-2">
                {associated.map((prod) => (
                  <div key={prod.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                      <p className="text-xs text-slate-500">{prod.sku}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      prod.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {prod.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PackagingPage() {
  const [packages, setPackages] = useState<PackageItem[]>(packagesData)
  const [products] = useState<Product[]>(productsData)
  const [page, setPage] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null)
  const [associatingPkg, setAssociatingPkg] = useState<PackageItem | null>(null)

  const displayed = showAll ? packages : packages.filter((p) => p.tag === "Retail")
  const totalPages = Math.ceil(displayed.length / ITEMS_PER_PAGE)
  const paginated = displayed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const unmatchedActive = products.filter((p) => p.status === "Active" && !p.packagingId).length
  const unmatchedConcept = products.filter((p) => p.status === "Concept" && !p.packagingId).length

  const handleSaveAssociations = (pkgId: string, productIds: string[]) => {
    setPackages((prev) =>
      prev.map((p) => p.id === pkgId ? { ...p, associatedProducts: productIds } : p)
    )
    setAssociatingPkg(null)
    if (selectedPkg?.id === pkgId) {
      setSelectedPkg((prev) => prev ? { ...prev, associatedProducts: productIds } : null)
    }
  }

  return (
    <div>
      {/* Top panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Packaging Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-slate-800">Packaging Actions</span>
            <Bell className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {[
              { label: "Notifications Pending", count: 0 },
              { label: "Actions Pending", count: 0 },
            ].map(({ label, count }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-800">{count}</span>
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
                <button type="button" className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View all &gt;&gt;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Unmatched Products */}
        <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)" }}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{unmatchedActive}</span>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-0.5">
                <Box className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">Unmatched</p>
                <p className="text-xs font-semibold">Active Products</p>
              </div>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{unmatchedConcept}</span>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-0.5">
                <Package className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">Unmatched</p>
                <p className="text-xs font-semibold">Concept Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability chart */}
        <SustainabilityMiniChart />
      </div>

      {/* Packaging Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800">Packaging Recommendations</h2>
            <span className="text-sm font-medium text-blue-600">{displayed.length} Matched Packages</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Pagination */}
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    page === n ? "bg-slate-800 text-white" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Show All toggle */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={showAll}
            onClick={() => { setShowAll((v) => !v); setPage(1) }}
            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
              showAll ? "bg-slate-800 border-slate-800" : "border-slate-300 bg-white"
            }`}
          >
            {showAll && <Check className="h-2.5 w-2.5 text-white" />}
          </button>
          <span className="text-sm text-slate-600">Show All Packages</span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-slate-500 border-b border-slate-100">
          <span className="col-span-1" />
          <span className="col-span-4">Package Name</span>
          <span className="col-span-2 text-right">Cost Variance</span>
          <span className="col-span-2">Market</span>
          <span className="col-span-1">Material</span>
          <span className="col-span-1 text-center">Score</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100">
          {paginated.map((pkg) => {
            const assocCount = pkg.associatedProducts.length
            return (
              <div
                key={pkg.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                </div>

                {/* Name + tag */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-800">{pkg.name}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                      pkg.tag === "Retail" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      pkg.tag === "Food Service" ? "bg-orange-50 text-orange-700 border-orange-200" :
                      pkg.tag === "E-Commerce" ? "bg-purple-50 text-purple-700 border-purple-200" :
                      "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {pkg.tag}
                    </span>
                  </div>
                  {assocCount > 0 && (
                    <p className="text-xs text-emerald-600 mt-0.5 font-medium">
                      {assocCount} product{assocCount > 1 ? "s" : ""} linked
                    </p>
                  )}
                </div>

                {/* Cost Variance */}
                <div className="col-span-2 text-right">
                  {pkg.costVariance ? (
                    <span className={`text-sm font-semibold ${
                      pkg.costVariance.startsWith("+") ? "text-red-600" : "text-emerald-600"
                    }`}>
                      {pkg.costVariance}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">—</span>
                  )}
                </div>

                {/* Market */}
                <div className="col-span-2">
                  <span className="text-xs text-slate-600">{pkg.market}</span>
                </div>

                {/* Material */}
                <div className="col-span-1">
                  <span className="text-xs text-slate-500 leading-tight line-clamp-2">{pkg.material}</span>
                </div>

                {/* Score */}
                <div className="col-span-1 flex justify-center">
                  <ScoreBadge score={pkg.score} />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    title="Associate products"
                    onClick={() => setAssociatingPkg(pkg)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Link className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPkg(pkg)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alerts callout */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            {unmatchedActive + unmatchedConcept} products have no packaging assigned
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Use the <span className="font-semibold">link</span> icon or View panel to associate packaging with your products and unlock cost and sustainability insights.
          </p>
        </div>
        <button type="button" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors shrink-0">
          <Zap className="h-3.5 w-3.5" />
          Auto-Match
        </button>
      </div>

      {/* Package detail drawer */}
      {selectedPkg && (
        <PackageDrawer
          pkg={selectedPkg}
          products={products}
          onClose={() => setSelectedPkg(null)}
          onAssociate={() => setAssociatingPkg(selectedPkg)}
        />
      )}

      {/* Associate modal */}
      {associatingPkg && (
        <AssociateModal
          pkg={associatingPkg}
          products={products}
          onClose={() => setAssociatingPkg(null)}
          onSave={handleSaveAssociations}
        />
      )}
    </div>
  )
}
