"use client"

import { StatCard } from "./stat-card"
import { ActionCard } from "./action-card"
import { AlertsCard } from "./alerts-card"
import {
  Package,
  Leaf,
  Lightbulb,
  Bell,
  Sparkles,
  Box,
} from "lucide-react"

type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y"

// Generate trend data for different time ranges
function generateTrendData(baseValue: number, days: number) {
  const data = []
  for (let i = 0; i < Math.min(days, 30); i++) {
    data.push({
      name: String(i + 1),
      value: Math.floor(baseValue + (Math.random() - 0.3) * baseValue * 0.2),
    })
  }
  return data
}

function generateChartDataForRanges(baseValue: number): Record<TimeRange, Array<{ name: string; value: number }>> {
  return {
    "7d": generateTrendData(baseValue, 7),
    "30d": generateTrendData(baseValue, 30),
    "3m": generateTrendData(baseValue, 12),
    "6m": generateTrendData(baseValue, 24),
    "1y": generateTrendData(baseValue, 12),
  }
}

// Sample alerts data
const ingredientAlerts = [
  {
    id: "1",
    type: "supply" as const,
    severity: "critical" as const,
    title: "Supply Shortage",
    description: "Supplier reports 3-week delay due to shipping constraints",
    ingredient: "Organic Blueberry Powder",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "price" as const,
    severity: "warning" as const,
    title: "Price Increase",
    description: "Market price increased by 15% this month",
    ingredient: "Madagascar Vanilla Extract",
    timestamp: "5 hours ago",
    change: { from: 42.50, to: 48.90, unit: "/kg" },
  },
  {
    id: "3",
    type: "score" as const,
    severity: "warning" as const,
    title: "Quality Score Drop",
    description: "Sustainability score decreased after supplier audit",
    ingredient: "Palm Oil (RSPO)",
    timestamp: "1 day ago",
    change: { from: 85, to: 72, unit: "/100" },
  },
  {
    id: "4",
    type: "price" as const,
    severity: "info" as const,
    title: "Price Decrease",
    description: "Bulk pricing now available from new supplier",
    ingredient: "Oat Flour",
    timestamp: "2 days ago",
    change: { from: 3.20, to: 2.85, unit: "/kg" },
  },
]

interface DashboardStatsProps {
  type: "ingredients" | "products" | "suppliers"
}

export function DashboardStats({ type }: DashboardStatsProps) {
  if (type === "ingredients") {
    return <IngredientStats />
  }

  if (type === "products") {
    return <ProductStats />
  }

  if (type === "suppliers") {
    return <SupplierStats />
  }

  return null
}

function IngredientStats() {
  const ingredientChartData = generateChartDataForRanges(92)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ActionCard
        title="Ingredient Actions"
        icon={<Bell className="h-4 w-4" />}
        completedCount={8}
        totalCount={10}
        actions={[
          {
            id: "notifications",
            label: "Notifications Pending",
            count: 0,
            priority: "medium",
          },
          {
            id: "actions",
            label: "Actions Pending",
            count: 0,
            priority: "high",
          },
        ]}
      />

      <StatCard
        title="Active Product Ingredients"
        value={92}
        subtitle="Across all products"
        trend={{
          value: 12,
          label: "vs last period",
          isPositive: true,
        }}
        chartData={ingredientChartData}
        chartColor="#ffffff"
        gradientFrom="#1e40af"
        gradientTo="#3b82f6"
        icon={<Leaf className="h-4 w-4" />}
        tooltip="Total number of unique ingredients currently being used in your active product formulations"
        variant="primary"
      />

      <AlertsCard
        title="Ingredient Alerts"
        alerts={ingredientAlerts}
      />
    </div>
  )
}

function ProductStats() {
  const productChartData = generateChartDataForRanges(488009)
  const conceptChartData = generateChartDataForRanges(172)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ActionCard
        title="Product Actions"
        icon={<Bell className="h-4 w-4" />}
        completedCount={4}
        totalCount={10}
        actions={[
          {
            id: "notifications",
            label: "Notifications Pending",
            count: 6,
            priority: "medium",
          },
          {
            id: "actions",
            label: "Actions Pending",
            count: 0,
            priority: "high",
          },
        ]}
      />

      <StatCard
        title="Active Products"
        value={488009}
        subtitle="In your catalog"
        trend={{
          value: 2.4,
          label: "vs last period",
          isPositive: true,
        }}
        chartData={productChartData}
        chartColor="#ffffff"
        gradientFrom="#1e40af"
        gradientTo="#3b82f6"
        icon={<Package className="h-4 w-4" />}
        tooltip="Total number of products currently active in your portfolio"
        variant="primary"
      />

      <StatCard
        title="Concept Products"
        value={172}
        subtitle="In development"
        trend={{
          value: 8,
          label: "vs last period",
          isPositive: true,
        }}
        chartData={conceptChartData}
        chartColor="#ffffff"
        gradientFrom="#d97706"
        gradientTo="#f59e0b"
        icon={<Lightbulb className="h-4 w-4" />}
        tooltip="Products currently in concept or development phase"
        variant="secondary"
      />
    </div>
  )
}

function SupplierStats() {
  const supplierChartData = generateChartDataForRanges(42)
  const activeChartData = generateChartDataForRanges(28)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ActionCard
        title="Supplier Actions"
        icon={<Bell className="h-4 w-4" />}
        completedCount={7}
        totalCount={10}
        actions={[
          {
            id: "reviews",
            label: "Reviews Pending",
            count: 3,
            priority: "medium",
          },
          {
            id: "updates",
            label: "Profile Updates",
            count: 2,
            priority: "low",
          },
        ]}
      />

      <StatCard
        title="Total Suppliers"
        value={42}
        subtitle="In your network"
        trend={{
          value: 5,
          label: "vs last period",
          isPositive: true,
        }}
        chartData={supplierChartData}
        chartColor="#ffffff"
        gradientFrom="#1e40af"
        gradientTo="#3b82f6"
        icon={<Box className="h-4 w-4" />}
        tooltip="Total number of suppliers in your network"
        variant="primary"
      />

      <StatCard
        title="Active Partnerships"
        value={28}
        subtitle="Currently engaged"
        trend={{
          value: 3,
          label: "vs last period",
          isPositive: true,
        }}
        chartData={activeChartData}
        chartColor="#ffffff"
        gradientFrom="#059669"
        gradientTo="#10b981"
        icon={<Sparkles className="h-4 w-4" />}
        tooltip="Suppliers with active orders or ongoing relationships"
        variant="primary"
      />
    </div>
  )
}

export { IngredientStats, ProductStats, SupplierStats }
