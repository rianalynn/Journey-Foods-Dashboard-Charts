"use client"

import { useState } from "react"
import {
  Bell,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Truck,
  Package,
  CheckCircle,
  ChevronRight,
  Search,
  Filter,
  Archive,
  Trash2,
  MailOpen,
  Clock,
  Settings,
  X,
  Shield,
  Sparkles,
} from "lucide-react"
import { 
  type Notification, 
  type NotificationType, 
  type NotificationSeverity,
  notificationsData 
} from "./top-nav"
import {
  ComplianceBadge,
  SeverityBadge,
  RegionTag,
} from "@/components/compliance/compliance-components"
import {
  getAllComplianceIssues,
  getComplianceStatusColor,
  getSeverityColor,
  type ComplianceIssue,
} from "@/lib/compliance-data"

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "supply": return <Truck className="h-4 w-4" />
    case "price": return <DollarSign className="h-4 w-4" />
    case "score": return <TrendingUp className="h-4 w-4" />
    case "delivery": return <Package className="h-4 w-4" />
    case "action": return <AlertTriangle className="h-4 w-4" />
    default: return <Bell className="h-4 w-4" />
  }
}

function getNotificationStyle(severity: NotificationSeverity) {
  switch (severity) {
    case "critical": return { bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100", iconColor: "text-red-600", dot: "bg-red-500", badge: "bg-red-100 text-red-700" }
    case "warning": return { bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" }
    case "success": return { bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-100", iconColor: "text-green-600", dot: "bg-green-500", badge: "bg-green-100 text-green-700" }
    default: return { bg: "bg-blue-50", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600", dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" }
  }
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

type FilterType = "all" | NotificationType
type StatusFilter = "all" | "unread" | "read" | "action-required"

const typeFilters: Array<{ key: FilterType; label: string; icon: React.ReactNode }> = [
  { key: "all", label: "All", icon: <Bell className="h-4 w-4" /> },
  { key: "supply", label: "Supply Chain", icon: <Truck className="h-4 w-4" /> },
  { key: "price", label: "Price", icon: <DollarSign className="h-4 w-4" /> },
  { key: "score", label: "Score Changes", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "delivery", label: "Delivery", icon: <Package className="h-4 w-4" /> },
  { key: "action", label: "Actions", icon: <AlertTriangle className="h-4 w-4" /> },
]

const statusFilters: Array<{ key: StatusFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "action-required", label: "Action Required" },
]

// ─── Notification Card Component ──────────────────────────────────────────────

function NotificationCard({ 
  notification, 
  onMarkRead, 
  onArchive,
  onDelete,
  isSelected,
  onSelect
}: { 
  notification: Notification
  onMarkRead: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const style = getNotificationStyle(notification.severity)
  
  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
        notification.read ? "bg-white border-slate-200" : `${style.bg} ${style.border}`
      } ${isSelected ? "ring-2 ring-blue-500" : ""} hover:shadow-md`}
    >
      <div className="flex gap-4">
        {/* Selection checkbox */}
        <div className="shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(notification.id)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Icon */}
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          notification.read ? "bg-slate-100 text-slate-400" : `${style.iconBg} ${style.iconColor}`
        }`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => onMarkRead(notification.id)}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-sm font-semibold ${notification.read ? "text-slate-600" : "text-slate-800"}`}>
                {notification.title}
              </h3>
              {!notification.read && (
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.badge}`}>
                {notification.severity}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {notification.timestamp}
              </span>
            </div>
          </div>
          
          <p className={`text-sm mt-1 ${notification.read ? "text-slate-500" : "text-slate-600"}`}>
            {notification.description}
          </p>
          
          {/* Related item */}
          {(notification.ingredient || notification.product) && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">Related:</span>
              <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg">
                {notification.ingredient || notification.product}
              </span>
            </div>
          )}

          {/* Change indicator */}
          {notification.change && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-white/50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500">Change:</span>
              <span className="text-sm font-medium text-slate-600">
                {notification.change.from}{notification.change.unit}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className={`text-sm font-semibold ${
                Number(notification.change.to) > Number(notification.change.from) ? "text-red-600" : "text-green-600"
              }`}>
                {notification.change.to}{notification.change.unit}
              </span>
            </div>
          )}

          {/* Action required badge */}
          {notification.actionRequired && (
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                Action required
              </span>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Take action
              </button>
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MailOpen className="h-3.5 w-3.5" />
              {notification.read ? "Mark unread" : "Mark read"}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onArchive(notification.id); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Archive className="h-3.5 w-3.5" />
              Archive
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Notifications Page ──────────────────────────────────────────────────

type MainTab = "all" | "compliance"

export function NotificationsPage() {
  const [mainTab, setMainTab] = useState<MainTab>("all")
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Get compliance issues
  const complianceIssues = getAllComplianceIssues()
  const criticalComplianceCount = complianceIssues.filter(i => i.severity === "critical").length
  const warningComplianceCount = complianceIssues.filter(i => i.severity === "warning").length

  // Filter notifications
  const filtered = notifications.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()) ||
      (n.ingredient && n.ingredient.toLowerCase().includes(search.toLowerCase())) ||
      (n.product && n.product.toLowerCase().includes(search.toLowerCase()))
    const matchType = typeFilter === "all" || n.type === typeFilter
    const matchStatus = 
      statusFilter === "all" ||
      (statusFilter === "unread" && !n.read) ||
      (statusFilter === "read" && n.read) ||
      (statusFilter === "action-required" && n.actionRequired)
    return matchSearch && matchType && matchStatus
  })

  // Counts
  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.severity === "critical" && !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length

  // Handlers
  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleArchive = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map(n => n.id))
    }
  }

  const handleBulkMarkRead = () => {
    setNotifications(prev => prev.map(n => 
      selectedIds.includes(n.id) ? { ...n, read: true } : n
    ))
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)))
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay updated with alerts, changes, and action items
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setMainTab("all")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            mainTab === "all"
              ? "border-slate-800 text-slate-800"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Bell className="h-4 w-4" />
          All Notifications
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{unreadCount}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMainTab("compliance")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            mainTab === "compliance"
              ? "border-slate-800 text-slate-800"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Shield className="h-4 w-4" />
          Compliance
          {complianceIssues.length > 0 && (
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
              criticalComplianceCount > 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
            }`}>
              {complianceIssues.length}
            </span>
          )}
        </button>
      </div>

      {/* All Notifications Tab */}
      {mainTab === "all" && (
        <>
          {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{notifications.length}</p>
              <p className="text-xs text-slate-500">Total notifications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MailOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{unreadCount}</p>
              <p className="text-xs text-slate-500">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{criticalCount}</p>
              <p className="text-xs text-slate-500">Critical</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{actionRequiredCount}</p>
              <p className="text-xs text-slate-500">Action required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <div className="flex gap-1 overflow-x-auto">
              {typeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setTypeFilter(filter.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    typeFilter === filter.key
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {statusFilters.map((filter) => (
              <option key={filter.key} value={filter.key}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.length} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkMarkRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <MailOpen className="h-4 w-4" />
              Mark as read
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="ml-auto p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <X className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.length === filtered.length && filtered.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-500">
            {filtered.length} notifications
          </span>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onArchive={handleArchive}
              onDelete={handleDelete}
              isSelected={selectedIds.includes(notification.id)}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No notifications found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
        </>
      )}

      {/* Compliance Tab */}
      {mainTab === "compliance" && (
        <div className="space-y-6">
          {/* Compliance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{criticalComplianceCount}</p>
                  <p className="text-xs text-slate-500">Critical Issues</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{warningComplianceCount}</p>
                  <p className="text-xs text-slate-500">Warnings</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{complianceIssues.length}</p>
                  <p className="text-xs text-slate-500">Total Issues</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issues List Grouped by Severity */}
          {complianceIssues.length > 0 ? (
            <div className="space-y-4">
              {/* Critical Issues */}
              {criticalComplianceCount > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    Critical Issues ({criticalComplianceCount})
                  </h3>
                  <div className="space-y-3">
                    {complianceIssues.filter(i => i.severity === "critical").map((issue) => (
                      <ComplianceIssueNotificationCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Issues */}
              {warningComplianceCount > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    Warnings ({warningComplianceCount})
                  </h3>
                  <div className="space-y-3">
                    {complianceIssues.filter(i => i.severity === "warning").map((issue) => (
                      <ComplianceIssueNotificationCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}

              {/* Info Issues */}
              {complianceIssues.filter(i => i.severity === "info").length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4" />
                    Informational ({complianceIssues.filter(i => i.severity === "info").length})
                  </h3>
                  <div className="space-y-3">
                    {complianceIssues.filter(i => i.severity === "info").map((issue) => (
                      <ComplianceIssueNotificationCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">All Clear</h3>
              <p className="text-sm text-slate-500 mt-1">
                No regulatory compliance issues detected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Compliance Issue Notification Card ───────────────────────────────────────

function ComplianceIssueNotificationCard({ issue }: { issue: ComplianceIssue }) {
  const [showFix, setShowFix] = useState(false)
  const severityColors = getSeverityColor(issue.severity)
  const statusColors = getComplianceStatusColor(issue.status)

  return (
    <div className={`p-4 rounded-xl border ${severityColors.border} ${severityColors.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={issue.severity} size="sm" />
            <span className="text-xs text-slate-500">{issue.source}</span>
            <RegionTag regionCode={issue.region} size="sm" />
            <ComplianceBadge status={issue.status} size="sm" />
          </div>
          <h4 className="font-medium text-slate-800 mt-2">{issue.ruleName}</h4>
          <p className="text-sm text-slate-600 mt-1">{issue.description}</p>

          {(issue.currentValue || issue.allowedValue) && (
            <div className="flex items-center gap-4 mt-3 text-sm">
              {issue.currentValue && (
                <div>
                  <span className="text-slate-500">Current: </span>
                  <span className="font-medium text-red-600">{issue.currentValue}</span>
                </div>
              )}
              {issue.allowedValue && (
                <div>
                  <span className="text-slate-500">Allowed: </span>
                  <span className="font-medium text-green-600">{issue.allowedValue}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span>Affected: {issue.affectedItem}</span>
            <span>|</span>
            <span>Detected: {new Date(issue.detectedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {issue.aiFix && (
        <div className="mt-3 pt-3 border-t border-slate-200/50">
          <button
            type="button"
            onClick={() => setShowFix(!showFix)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            AI Suggested Fix
            <ChevronRight className={`h-4 w-4 transition-transform ${showFix ? "rotate-90" : ""}`} />
          </button>
          {showFix && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              {issue.aiFix}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
