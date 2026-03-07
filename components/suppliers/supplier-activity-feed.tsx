"use client"

import { useState, useMemo } from "react"
import {
  Mail,
  Send,
  Eye,
  CheckCircle,
  Clock,
  Leaf,
  Search,
  FileText,
  UserPlus,
  Link2,
  MessageSquare,
  MousePointerClick,
  Reply,
  CalendarClock,
  Building2,
  Filter,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import type { AgentTimelineEvent, AgentEventType } from "./agent-activity-drawer"

interface Supplier {
  id: string
  name: string
  location: string
  score: number
  status: "Pending" | "Active" | "Inactive"
  lastUpdated: string
  ingredients: string[]
  phone: string | null
  email: string
  website: string | null
  certifications: string[]
  description: string
}

interface SupplierActivityFeedProps {
  suppliers: Supplier[]
  agentTimelines: Record<string, AgentTimelineEvent[]>
  onViewSupplier: (supplierId: string) => void
}

const eventConfig: Record<
  AgentEventType,
  { icon: React.ElementType; dotColor: string; bgColor: string; label: string }
> = {
  ingredient_need: {
    icon: Leaf,
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50 text-emerald-700",
    label: "Ingredient Need",
  },
  supplier_match: {
    icon: Search,
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50 text-blue-700",
    label: "Supplier Match",
  },
  email_sent: {
    icon: Send,
    dotColor: "bg-sky-500",
    bgColor: "bg-sky-50 text-sky-700",
    label: "Email Sent",
  },
  email_opened: {
    icon: Eye,
    dotColor: "bg-violet-500",
    bgColor: "bg-violet-50 text-violet-700",
    label: "Email Opened",
  },
  email_clicked: {
    icon: MousePointerClick,
    dotColor: "bg-indigo-500",
    bgColor: "bg-indigo-50 text-indigo-700",
    label: "Link Clicked",
  },
  email_replied: {
    icon: Reply,
    dotColor: "bg-green-500",
    bgColor: "bg-green-50 text-green-700",
    label: "Email Replied",
  },
  follow_up_scheduled: {
    icon: CalendarClock,
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50 text-amber-700",
    label: "Follow-up Scheduled",
  },
  follow_up_sent: {
    icon: MessageSquare,
    dotColor: "bg-orange-500",
    bgColor: "bg-orange-50 text-orange-700",
    label: "Follow-up Sent",
  },
  quote_requested: {
    icon: FileText,
    dotColor: "bg-cyan-500",
    bgColor: "bg-cyan-50 text-cyan-700",
    label: "Quote Requested",
  },
  quote_received: {
    icon: FileText,
    dotColor: "bg-teal-500",
    bgColor: "bg-teal-50 text-teal-700",
    label: "Quote Received",
  },
  platform_invite: {
    icon: UserPlus,
    dotColor: "bg-rose-500",
    bgColor: "bg-rose-50 text-rose-700",
    label: "Platform Invite",
  },
  connection_established: {
    icon: Link2,
    dotColor: "bg-green-600",
    bgColor: "bg-green-50 text-green-700",
    label: "Connected",
  },
}

type FilterType = "all" | "emails" | "quotes" | "ingredients" | "connections"

export default function SupplierActivityFeed({
  suppliers,
  agentTimelines,
  onViewSupplier,
}: SupplierActivityFeedProps) {
  const [filter, setFilter] = useState<FilterType>("all")

  // Aggregate all events from all suppliers
  const aggregatedEvents = useMemo(() => {
    const events: Array<AgentTimelineEvent & { supplierId: string; supplierName: string }> = []

    for (const supplier of suppliers) {
      const timeline = agentTimelines[supplier.id] || []
      for (const event of timeline) {
        events.push({
          ...event,
          supplierId: supplier.id,
          supplierName: supplier.name,
        })
      }
    }

    // Sort by timestamp (assuming newer events have later timestamps - reverse for newest first)
    // This is a simplified sort - in production you'd parse actual dates
    return events.reverse()
  }, [suppliers, agentTimelines])

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    if (filter === "all") return aggregatedEvents

    const filterMap: Record<FilterType, AgentEventType[]> = {
      all: [],
      emails: ["email_sent", "email_opened", "email_clicked", "email_replied", "follow_up_scheduled", "follow_up_sent"],
      quotes: ["quote_requested", "quote_received"],
      ingredients: ["ingredient_need", "supplier_match"],
      connections: ["platform_invite", "connection_established"],
    }

    return aggregatedEvents.filter((e) => filterMap[filter].includes(e.type))
  }, [aggregatedEvents, filter])

  // Calculate stats
  const stats = useMemo(() => {
    const suppliersWithActivity = new Set(Object.keys(agentTimelines).filter((id) => agentTimelines[id]?.length > 0))
    const totalEvents = aggregatedEvents.length
    const emailEvents = aggregatedEvents.filter((e) =>
      ["email_sent", "email_opened", "email_clicked", "email_replied"].includes(e.type)
    ).length
    const quotesReceived = aggregatedEvents.filter((e) => e.type === "quote_received").length
    const pendingActions = aggregatedEvents.filter((e) => e.status === "active" || e.status === "pending").length

    return {
      suppliersWithActivity: suppliersWithActivity.size,
      totalEvents,
      emailEvents,
      quotesReceived,
      pendingActions,
    }
  }, [aggregatedEvents, agentTimelines])

  const filterButtons: { key: FilterType; label: string; icon: React.ElementType }[] = [
    { key: "all", label: "All Activity", icon: Zap },
    { key: "emails", label: "Emails", icon: Mail },
    { key: "quotes", label: "Quotes", icon: FileText },
    { key: "ingredients", label: "Ingredients", icon: Leaf },
    { key: "connections", label: "Connections", icon: Link2 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards - JourneyFoods style with gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">{stats.suppliersWithActivity}</span>
            <Users className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-sm text-blue-100">Active Suppliers</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">{stats.totalEvents}</span>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-sm text-teal-100">Total Actions</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">{stats.emailEvents}</span>
            <Mail className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-sm text-violet-100">Email Events</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold">{stats.pendingActions}</span>
            <Clock className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-sm text-amber-100">Pending Actions</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-500" />
        {filterButtons.map((btn) => {
          const Icon = btn.icon
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setFilter(btn.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === btn.key
                  ? "bg-slate-800 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {btn.label}
            </button>
          )
        })}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Agent Activity</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} across all suppliers
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Zap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No activity yet</p>
            <p className="text-sm text-slate-400 mt-1">Agent actions will appear here as they happen</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredEvents.map((event) => {
              const config = eventConfig[event.type]
              const Icon = config.icon

              return (
                <div
                  key={`${event.supplierId}-${event.id}`}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onViewSupplier(event.supplierId)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full ${config.dotColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800">{event.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor}`}>
                          {config.label}
                        </span>
                        {event.status === "pending" && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            Pending
                          </span>
                        )}
                        {event.status === "active" && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>

                      {/* Supplier & Timestamp */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {event.supplierName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </span>
                      </div>

                      {/* Metadata */}
                      {event.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {event.metadata.ingredient && (
                            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                              {event.metadata.ingredient}
                            </span>
                          )}
                          {event.metadata.quoteAmount && (
                            <span className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded">
                              {event.metadata.quoteAmount}
                            </span>
                          )}
                          {event.metadata.moq && (
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              MOQ: {event.metadata.moq}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* View button */}
                    <button
                      type="button"
                      className="text-teal-600 text-sm font-medium hover:text-teal-700 flex-shrink-0"
                    >
                      View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
