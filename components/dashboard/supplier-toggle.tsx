"use client"

import { Building2, Package } from "lucide-react"

export type SupplierView = "manufacturer" | "supplier"

interface SupplierToggleProps {
  view: SupplierView
  onChange: (view: SupplierView) => void
}

export function SupplierToggle({ view, onChange }: SupplierToggleProps) {
  return (
    <div
      className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-1"
      role="group"
      aria-label="Supplier view toggle"
    >
      <button
        type="button"
        onClick={() => onChange("manufacturer")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          view === "manufacturer"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
        aria-pressed={view === "manufacturer"}
      >
        <Building2 className="h-4 w-4" />
        Manufacturer View
      </button>
      <button
        type="button"
        onClick={() => onChange("supplier")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          view === "supplier"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
        aria-pressed={view === "supplier"}
      >
        <Package className="h-4 w-4" />
        Supplier View
      </button>
    </div>
  )
}
