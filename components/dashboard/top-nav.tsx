"use client"

import { useState } from "react"
import {
  Home,
  Zap,
  Leaf,
  Package,
  Box,
  ImageIcon,
  BarChart3,
  Link2,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  User,
  Check,
  LogOut,
  BookOpen,
  Tv,
  Settings,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Clock,
  CheckCircle,
  X,
  Archive,
  Eye,
} from "lucide-react"

export type PageType = "overview" | "generate" | "ingredients" | "products" | "suppliers" | "packaging" | "knowledge-hub" | "analytics" | "integrations" | "guava" | "account" | "notifications"

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType = "supply" | "price" | "score" | "delivery" | "system" | "action"
export type NotificationSeverity = "critical" | "warning" | "info" | "success"

export interface Notification {
  id: string
  type: NotificationType
  severity: NotificationSeverity
  title: string
  description: string
  timestamp: string
  read: boolean
  ingredient?: string
  product?: string
  actionRequired?: boolean
  change?: { from: number | string; to: number | string; unit?: string }
}

// ─── Mock Notifications Data ──────────────────────────────────────────────────

export const notificationsData: Notification[] = [
  { id: "1", type: "supply", severity: "critical", title: "Supply Shortage Alert", description: "Supplier reports 3-week delay due to shipping constraints", ingredient: "Organic Blueberry Powder", timestamp: "2 hours ago", read: false, actionRequired: true },
  { id: "2", type: "price", severity: "warning", title: "Price Increase", description: "Market price increased by 15% this month", ingredient: "Madagascar Vanilla Extract", timestamp: "5 hours ago", read: false, change: { from: 42.5, to: 48.9, unit: "/kg" } },
  { id: "3", type: "score", severity: "warning", title: "Quality Score Drop", description: "Sustainability score decreased after supplier audit", ingredient: "Palm Oil (RSPO)", timestamp: "1 day ago", read: false, change: { from: 85, to: 72, unit: "/100" } },
  { id: "4", type: "price", severity: "info", title: "Price Decrease", description: "Bulk pricing now available from new supplier", ingredient: "Oat Flour", timestamp: "2 days ago", read: true, change: { from: 3.2, to: 2.85, unit: "/kg" } },
  { id: "5", type: "delivery", severity: "success", title: "Delivery Confirmed", description: "Shipment arrived at warehouse on schedule", ingredient: "Cocoa Powder", timestamp: "2 days ago", read: true },
  { id: "6", type: "action", severity: "warning", title: "Review Required", description: "New regulatory compliance document needs approval", product: "Organic Protein Bar", timestamp: "3 days ago", read: false, actionRequired: true },
  { id: "7", type: "system", severity: "info", title: "Report Generated", description: "Monthly sustainability report is ready for download", timestamp: "3 days ago", read: true },
  { id: "8", type: "supply", severity: "warning", title: "Low Stock Warning", description: "Inventory levels below reorder point", ingredient: "Almond Butter", timestamp: "4 days ago", read: true, actionRequired: true },
  { id: "9", type: "price", severity: "info", title: "Price Stabilized", description: "Market volatility has decreased for this commodity", ingredient: "Coconut Oil", timestamp: "5 days ago", read: true },
  { id: "10", type: "score", severity: "success", title: "Score Improved", description: "Nutrition score increased after reformulation", product: "Green Smoothie Mix", timestamp: "1 week ago", read: true, change: { from: 78, to: 91, unit: "/100" } },
]

const mainNav: Array<{ name: string; id: PageType; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
  { name: "Overview", id: "overview", icon: Home },
  { name: "Generate", id: "generate", icon: Zap },
  { name: "Ingredients", id: "ingredients", icon: Leaf, badge: "10+" },
  { name: "Products", id: "products", icon: Package },
  { name: "Suppliers", id: "suppliers", icon: Box },
  { name: "Packaging", id: "packaging", icon: ImageIcon },
]

const supportNav = [
  { name: "Analytics", icon: BarChart3 },
  { name: "Integrations", icon: Link2 },
]

interface TopNavProps {
  activePage: PageType
  onNavigate: (page: PageType) => void
  isSupplierMode: boolean
  onToggleSupplierMode: () => void
}

// ─── Notification Helper Functions ────────────────────────────────────────────

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
    case "critical": return { bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100", iconColor: "text-red-600", dot: "bg-red-500" }
    case "warning": return { bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600", dot: "bg-amber-500" }
    case "success": return { bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-100", iconColor: "text-green-600", dot: "bg-green-500" }
    default: return { bg: "bg-blue-50", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600", dot: "bg-blue-500" }
  }
}

// ─── Notification Item Component ──────────────────────────────────────────────

function NotificationItem({ notification, onMarkRead, compact = false }: { 
  notification: Notification
  onMarkRead: (id: string) => void
  compact?: boolean
}) {
  const style = getNotificationStyle(notification.severity)
  
  return (
    <div 
      className={`relative p-3 rounded-lg border transition-colors cursor-pointer ${
        notification.read ? "bg-white border-slate-100" : `${style.bg} ${style.border}`
      } hover:shadow-sm`}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className="flex gap-3">
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          notification.read ? "bg-slate-100 text-slate-400" : `${style.iconBg} ${style.iconColor}`
        }`}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium ${notification.read ? "text-slate-600" : "text-slate-800"}`}>
                {notification.title}
              </p>
              {!notification.read && (
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
              )}
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">{notification.timestamp}</span>
          </div>
          {!compact && (
            <p className={`text-xs mt-0.5 ${notification.read ? "text-slate-400" : "text-slate-600"}`}>
              {notification.description}
            </p>
          )}
          {(notification.ingredient || notification.product) && (
            <p className="text-xs text-slate-500 mt-1">
              {notification.ingredient && <span className="font-medium">{notification.ingredient}</span>}
              {notification.product && <span className="font-medium">{notification.product}</span>}
            </p>
          )}
          {notification.change && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-slate-500">{notification.change.from}{notification.change.unit}</span>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className={`text-xs font-medium ${
                Number(notification.change.to) > Number(notification.change.from) ? "text-red-600" : "text-green-600"
              }`}>
                {notification.change.to}{notification.change.unit}
              </span>
            </div>
          )}
          {notification.actionRequired && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              <AlertTriangle className="h-3 w-3" />
              Action required
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Dropdown ───────────────────────────────────────────────────

function NotificationsDropdown({ 
  isOpen, 
  onClose, 
  onViewAll,
  notifications,
  onMarkRead,
  onMarkAllRead
}: { 
  isOpen: boolean
  onClose: () => void
  onViewAll: () => void
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}) {
  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.read).length
  const displayNotifications = notifications.slice(0, 5)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-2">
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkRead={onMarkRead}
                compact
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No new notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onViewAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View all notifications
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

export function TopNav({ activePage, onNavigate, isSupplierMode, onToggleSupplierMode }: TopNavProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleViewAllNotifications = () => {
    setNotificationsOpen(false)
    onNavigate("notifications")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Brand + Search + User row */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">J</span>
          </div>
          <span className="font-semibold text-slate-800 text-base">JourneyFoods</span>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ingredients, suppliers, and more"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Box className="h-4 w-4" />
            All brands
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Supplier Mode pill — visible when active */}
          {isSupplierMode && (
            <button
              type="button"
              onClick={onToggleSupplierMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-pink-600 bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              Supplier Mode
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(prev => !prev)}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationsDropdown
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              onViewAll={handleViewAllNotifications}
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
            />
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                RL
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">Riana Lynn</p>
                <p className="text-xs text-slate-500">
                  {isSupplierMode ? "Supplier view" : "Manufacturer view"}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-2">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">Natalie</p>
                    <p className="text-xs text-slate-500">natalie@journeyfoods.io</p>
                  </div>

                  {/* Profile link */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Profile
                  </button>

                  {/* Account Settings link */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      onNavigate("account")
                      setProfileOpen(false)
                    }}
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Account Settings
                  </button>

                  {/* Knowledge Hub link */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      onNavigate("knowledge-hub")
                      setProfileOpen(false)
                    }}
                  >
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    Knowledge Hub
                  </button>

                  {/* Toggle supplier mode */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      onToggleSupplierMode()
                      setProfileOpen(false)
                    }}
                  >
                    {isSupplierMode ? (
                      <Check className="h-4 w-4 text-slate-700" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                    <Box className="h-4 w-4 text-slate-400" />
                    View Supplier Mode
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LogOut className="h-4 w-4 text-slate-400" />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab navigation row */}
      <nav className="flex items-center gap-1 px-6 overflow-x-auto" aria-label="Main navigation">
        {mainNav
          .filter((item) => {
            // Hide Products, Suppliers, Packaging tabs in Supplier Mode
            if (isSupplierMode && (item.id === "products" || item.id === "suppliers" || item.id === "packaging")) {
              return false
            }
            return true
          })
          .map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-slate-800 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}

        <div className="ml-auto flex items-center gap-1 pl-4 border-l border-slate-100 shrink-0">
          {/* Analytics - clickable */}
          <button
            type="button"
            onClick={() => onNavigate("analytics")}
            className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activePage === "analytics"
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
          {/* Integrations - clickable */}
          <button
            type="button"
            onClick={() => onNavigate("integrations")}
            className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activePage === "integrations"
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Link2 className="h-4 w-4" />
            Integrations
          </button>
          {/* Guava - clickable */}
          <button
            type="button"
            onClick={() => onNavigate("guava")}
            className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activePage === "guava"
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Tv className="h-4 w-4" />
            Guava
          </button>
        </div>
      </nav>
    </header>
  )
}
