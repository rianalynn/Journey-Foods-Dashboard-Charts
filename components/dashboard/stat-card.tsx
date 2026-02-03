"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react"

type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  chartData?: Record<TimeRange, Array<{ name: string; value: number }>>
  chartColor?: string
  gradientFrom?: string
  gradientTo?: string
  icon?: React.ReactNode
  tooltip?: string
  className?: string
  variant?: "primary" | "secondary" | "accent"
}

const timeRangesList: Array<{ key: TimeRange; label: string }> = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "1y", label: "1Y" },
]

function SparklineChart({
  data,
  color,
  gradientId,
}: {
  data: Array<{ value: number }>
  color: string
  gradientId: string
}) {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return null

    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const width = 100
    const height = 100
    const padding = 2

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width
      const y = height - padding - ((val - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })

    const linePath = `M ${points.join(" L ")}`
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`

    return { linePath, areaPath }
  }, [data])

  if (!pathData) return null

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={pathData.areaPath} fill={`url(#${gradientId})`} />
      <path
        d={pathData.linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  chartData,
  chartColor = "#3b82f6",
  gradientFrom = "#1e3a5f",
  gradientTo = "#2563eb",
  icon,
  tooltip,
  className = "",
  variant = "primary",
}: StatCardProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7d")

  const isPrimary = variant === "primary"
  const isSecondary = variant === "secondary"

  const background = isSecondary 
    ? "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"
    : `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`

  const chartStroke = isSecondary ? "#fef3c7" : chartColor

  const currentChartData = chartData ? chartData[selectedRange] : []
  const gradientId = `spark-${title.replace(/\s/g, "")}-${selectedRange}`

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 min-h-[160px] flex flex-col shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
      style={{ background }}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && <div className="shrink-0 text-white">{icon}</div>}
          <h3 className="text-xs font-medium truncate text-white/70">
            {title}
          </h3>
          {tooltip && (
            <span title={tooltip} className="cursor-help">
              <Info className="h-3 w-3 shrink-0 text-white/70" />
            </span>
          )}
        </div>

        {/* Time Range Selector */}
        {chartData && (
          <div className="flex items-center gap-0.5 shrink-0">
            {timeRangesList.map((range) => (
              <button
                type="button"
                key={range.key}
                onClick={() => setSelectedRange(range.key)}
                className={`px-1.5 py-0.5 text-[10px] font-medium rounded transition-all text-white ${
                  selectedRange === range.key
                    ? "bg-white/30"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Value and Trend Row */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold tracking-tight text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend && (
          <div
            className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              trend.isPositive
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-red-500/20 text-red-200"
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="h-2.5 w-2.5" />
            ) : (
              <ArrowDownRight className="h-2.5 w-2.5" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[10px] text-white/70">{subtitle}</p>
      )}

      {/* Chart - Takes up remaining space */}
      {currentChartData && currentChartData.length > 0 && (
        <div className="flex-1 mt-2 -mx-4 -mb-4 min-h-[60px]">
          <SparklineChart
            data={currentChartData}
            color={chartStroke}
            gradientId={gradientId}
          />
        </div>
      )}
    </div>
  )
}
