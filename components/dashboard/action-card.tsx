"use client"

import type React from "react"
import { Bell, ChevronRight, CheckCircle2 } from "lucide-react"

interface ActionItem {
  id: string
  label: string
  count: number
  priority?: "high" | "medium" | "low"
}

interface ActionCardProps {
  title: string
  icon?: React.ReactNode
  actions: ActionItem[]
  completedCount?: number
  totalCount?: number
  className?: string
}

export function ActionCard({
  title,
  icon,
  actions,
  completedCount = 0,
  totalCount = 0,
  className = "",
}: ActionCardProps) {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const hasActions = actions.some((a) => a.count > 0)

  const getPriorityStyles = (priority?: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            {icon || <Bell className="h-4 w-4" />}
          </div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {totalCount > 0 && (
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
            {completedCount}/{totalCount}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              action.count > 0
                ? getPriorityStyles(action.priority)
                : "bg-slate-50/50 text-slate-400 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                  action.count > 0
                    ? "bg-white/80 shadow-sm"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {action.count}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </div>
            <button
              type="button"
              className={`flex items-center text-xs font-medium px-2 py-1 rounded hover:bg-black/5 transition-colors ${
                action.count === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={action.count === 0}
            >
              View all
              <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!hasActions && (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-500">No pending actions</p>
        </div>
      )}
    </div>
  )
}
