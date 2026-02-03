"use client"

import React from "react"

import { useState } from "react"
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Truck,
  ChevronRight,
  Clock,
  X,
} from "lucide-react"

type AlertType = "supply" | "score" | "price" | "delivery"
type AlertSeverity = "critical" | "warning" | "info"

interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  ingredient: string
  timestamp: string
  change?: {
    from: number | string
    to: number | string
    unit?: string
  }
}

interface AlertsCardProps {
  title: string
  alerts: Alert[]
  className?: string
}

function AlertItem({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const typeIcons: Record<AlertType, React.ReactNode> = {
    supply: <Truck className="h-3.5 w-3.5" />,
    score: <TrendingDown className="h-3.5 w-3.5" />,
    price: <DollarSign className="h-3.5 w-3.5" />,
    delivery: <Clock className="h-3.5 w-3.5" />,
  }

  const typeLabels: Record<AlertType, string> = {
    supply: "Supply Chain",
    score: "Score Change",
    price: "Price Change",
    delivery: "Delivery",
  }

  const severityStyles: Record<AlertSeverity, { bg: string; border: string; iconBg: string; text: string; badge: string }> = {
    critical: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      text: "text-red-700",
      badge: "bg-red-500 text-white",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      text: "text-amber-700",
      badge: "bg-amber-500 text-white",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      text: "text-blue-700",
      badge: "bg-blue-500 text-white",
    },
  }

  const styles = severityStyles[alert.severity]

  const isPriceIncrease = alert.type === "price" && Number(alert.change?.to) > Number(alert.change?.from)
  const isScoreDecrease = alert.type === "score" && Number(alert.change?.to) < Number(alert.change?.from)
  const isNegativeChange = isPriceIncrease || isScoreDecrease

  return (
    <div className={`relative p-3 rounded-lg border transition-all hover:shadow-sm ${styles.bg} ${styles.border}`}>
      <button
        type="button"
        onClick={() => onDismiss(alert.id)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="h-3 w-3 text-slate-400" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className={`p-1.5 rounded-lg ${styles.iconBg} ${styles.text}`}>
          {typeIcons[alert.type]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${styles.badge}`}>
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-500">{typeLabels[alert.type]}</span>
          </div>

          <p className="text-xs font-medium text-slate-800 truncate">{alert.ingredient}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{alert.description}</p>

          {alert.change && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-500">From:</span>
                <span className="font-medium text-slate-700">
                  {alert.change.from}{alert.change.unit}
                </span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-500">To:</span>
                <span className={`font-medium ${isNegativeChange ? "text-red-600" : "text-green-600"}`}>
                  {alert.change.to}{alert.change.unit}
                </span>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-400 mt-1.5">{alert.timestamp}</p>
        </div>
      </div>
    </div>
  )
}

export function AlertsCard({ title, alerts: initialAlerts, className = "" }: AlertsCardProps) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState<AlertType | "all">("all")

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter((a) => a.type === filter)

  const criticalCount = alerts.filter((a) => a.severity === "critical").length
  const warningCount = alerts.filter((a) => a.severity === "warning").length

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const filterOptions: Array<{ key: AlertType | "all"; label: string }> = [
    { key: "all", label: "All" },
    { key: "supply", label: "Supply" },
    { key: "price", label: "Price" },
    { key: "score", label: "Score" },
  ]

  return (
    <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {criticalCount > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {warningCount} warning
              </span>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                filter === option.key
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[240px]">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} onDismiss={handleDismiss} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-green-100 rounded-full mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">All clear!</p>
            <p className="text-xs text-slate-500 mt-1">No alerts in this category</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all alerts
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}
