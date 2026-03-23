"use client"

import { useState } from "react"
import {
  LayoutGrid,
  List,
  MapPin,
  Phone,
  Clock,
  X,
  Sparkles,
  Box,
  Star,
  Mail,
  Send,
  Globe,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Zap,
  Target,
  ArrowRight,
  ArrowLeft,
  Bell,
  RefreshCw,
  Upload,
  Link2,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Plus,
  Leaf,
  Download,
  Package,
  DollarSign,
  Truck,
  Award,
  BarChart3,
} from "lucide-react"
import { DataSourceBadge } from "@/components/compliance/compliance-components"

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list"

type DataSource = "sap" | "oracle" | "netsuite" | "excel" | "csv" | "manual" | "api"

type PipelineStage = 
  | "ingredient-need"
  | "supplier-match"
  | "email-sent"
  | "quote-requested"
  | "platform-invite"
  | "connected"

interface Supplier {
  id: string
  name: string
  location: string
  score: number
  status: "Pending" | "Active" | "Inactive" | "Connected"
  lastUpdated: string
  ingredients: string[]
  phone: string | null
  email: string
  website: string | null
  certifications: string[]
  description: string
  categories?: string[]
  minOrder?: string
  leadTime?: string
  pipelineStage?: PipelineStage
  agentStats?: {
    emails: number
    quotes: number
    pending: number
    invited: boolean
  }
  dataSource?: DataSource
}

interface AgentActivity {
  id: string
  type: "ingredient-need" | "supplier-match" | "email-sent" | "quote-response" | "data-update"
  title: string
  description: string
  timestamp: string
  expanded?: boolean
  details?: string
}

interface InboundOpportunity {
  id: string
  brandName: string
  brandLogo?: string
  ingredient: string
  quantity: string
  timeline: string
  status: "new" | "reviewing" | "responded" | "matched"
  receivedAt: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const suppliersData: Supplier[] = [
  { 
    id: "1", 
    name: "Journey Foods Test", 
    location: "Austin, TX", 
    score: 72.73, 
    status: "Pending", 
    lastUpdated: "Mar 20, 2026", 
    ingredients: ["Blueberry", "Papaya", "hibiscus flow", "Mango", "Acai", "Spirulina", "Chlorella", "Matcha"], 
    phone: null, 
    email: "contact@journeyfoods.com", 
    website: "journeyfoods.com", 
    certifications: ["USDA Organic", "Non-GMO"], 
    description: "A leading supplier of organic superfoods and functional ingredients.",
    pipelineStage: "email-sent",
    agentStats: { emails: 2, quotes: 1, pending: 1, invited: false },
    dataSource: "sap"
  },
  { 
    id: "2", 
    name: "check12345", 
    location: "Unknown Location", 
    score: 90, 
    status: "Pending", 
    lastUpdated: "Mar 18, 2026", 
    ingredients: [], 
    phone: null, 
    email: "check@example.com", 
    website: null, 
    certifications: [], 
    description: "New supplier pending verification.",
    pipelineStage: "ingredient-need",
    agentStats: { emails: 0, quotes: 0, pending: 0, invited: false },
    dataSource: "manual"
  },
  { 
    id: "3", 
    name: "abhi34", 
    location: "Unknown Location", 
    score: 90, 
    status: "Pending", 
    lastUpdated: "Mar 17, 2026", 
    ingredients: [], 
    phone: null, 
    email: "abhi@example.com", 
    website: null, 
    certifications: [], 
    description: "New supplier pending verification.",
    pipelineStage: "supplier-match",
    agentStats: { emails: 0, quotes: 0, pending: 1, invited: false },
    dataSource: "excel"
  },
  { 
    id: "4", 
    name: "LinkOne Ingredient Solutions", 
    location: "Springfield, MO", 
    score: 24.24, 
    status: "Pending", 
    lastUpdated: "Mar 16, 2026", 
    ingredients: ["Oils", "Eggs", "Nuts", "Seeds", "Dairy"], 
    phone: "+1 417-236-9602", 
    email: "info@linkone.com", 
    website: "linkone.com", 
    certifications: ["FDA Approved", "GFSI"], 
    description: "Comprehensive ingredient solutions for food manufacturers.",
    pipelineStage: "quote-requested",
    agentStats: { emails: 1, quotes: 1, pending: 1, invited: false },
    dataSource: "sap"
  },
  { 
    id: "5", 
    name: "Pharmore Ingredients Inc", 
    location: "Salt Lake City, UT", 
    score: 90, 
    status: "Pending", 
    lastUpdated: "Mar 15, 2026", 
    ingredients: ["Chondroitin Sulfate Sodium", "Glucosamine HCl"], 
    phone: "+1 801-446-8188", 
    email: "sales@pharmore.com", 
    website: "pharmore.com", 
    certifications: ["GMP Certified", "NSF"], 
    description: "Specialty ingredients for nutraceuticals and dietary supplements.",
    pipelineStage: "platform-invite",
    agentStats: { emails: 3, quotes: 2, pending: 0, invited: true },
    dataSource: "oracle"
  },
  { 
    id: "6", 
    name: "HPS Food & Ingredients Inc.", 
    location: "Boulder, CO", 
    score: 90, 
    status: "Connected", 
    lastUpdated: "Mar 15, 2026", 
    ingredients: ["Hulled Hempseeds", "Roasted Whole Hempseed", "Cold Pressed Hempseed Oil"], 
    phone: "+1 844-436-7477", 
    email: "info@hpsfoods.com", 
    website: "hpsfoods.com", 
    certifications: ["Organic", "Kosher", "Halal"], 
    description: "Premium hemp-based ingredients for food and beverage applications.",
    pipelineStage: "connected",
    agentStats: { emails: 5, quotes: 3, pending: 0, invited: true },
    dataSource: "sap"
  },
]

const agentActivities: AgentActivity[] = [
  {
    id: "1",
    type: "ingredient-need",
    title: "Ingredient need detected: Blueberry Powder",
    description: "Agent identified a gap in the product formulation for organic blueberry powder based on current product pipeline requirements.",
    timestamp: "Jan 15, 10:23 AM",
    details: "The AI agent analyzed your upcoming Q2 product launches and found that 3 new SKUs require organic blueberry powder. Current supplier inventory shows limited availability. Recommended action: Connect with suppliers who can fulfill 500kg+ orders.",
  },
  {
    id: "2",
    type: "ingredient-need",
    title: "Ingredient need detected: Spirulina",
    description: "Superfood blend requires high quality spirulina powder for the wellness line expansion.",
    timestamp: "Jan 15, 10:24 AM",
    details: "Based on your product development roadmap, spirulina is needed for 2 new superfood blend SKUs launching in Q3.",
  },
  {
    id: "3",
    type: "supplier-match",
    title: "Supplier match found: HPS Foods",
    description: "High compatibility score (92%) for hemp protein requirements.",
    timestamp: "Jan 14, 3:45 PM",
    details: "HPS Foods has been identified as a strong match based on: certifications (Organic, Kosher), pricing competitiveness, lead time reliability, and ingredient quality scores.",
  },
  {
    id: "4",
    type: "email-sent",
    title: "Outreach email sent to Pharmore",
    description: "Initial partnership inquiry sent. Tracking enabled.",
    timestamp: "Jan 14, 2:30 PM",
  },
  {
    id: "5",
    type: "quote-response",
    title: "Quote received from LinkOne",
    description: "Competitive pricing received for bulk oils order.",
    timestamp: "Jan 13, 11:15 AM",
  },
]

const inboundOpportunities: InboundOpportunity[] = [
  {
    id: "1",
    brandName: "GreenVita Foods",
    ingredient: "Organic Mango Puree",
    quantity: "2,000 kg/month",
    timeline: "Q2 2026",
    status: "new",
    receivedAt: "2 hours ago",
  },
  {
    id: "2",
    brandName: "NutriBlend Co",
    ingredient: "Pea Protein Isolate",
    quantity: "5,000 kg/month",
    timeline: "Ongoing",
    status: "reviewing",
    receivedAt: "1 day ago",
  },
  {
    id: "3",
    brandName: "CleanLabel Snacks",
    ingredient: "Turmeric Extract",
    quantity: "500 kg/quarter",
    timeline: "Q3 2026",
    status: "responded",
    receivedAt: "3 days ago",
  },
]

// ─── Pipeline Progress Component ──────────────────────────────────────────────

const pipelineStages: { key: PipelineStage; label: string }[] = [
  { key: "ingredient-need", label: "Ingredient\nNeed" },
  { key: "supplier-match", label: "Supplier\nMatch" },
  { key: "email-sent", label: "Email Sent" },
  { key: "quote-requested", label: "Quote\nRequested" },
  { key: "platform-invite", label: "Platform\nInvite" },
  { key: "connected", label: "Connected" },
]

function PipelineProgress({ currentStage, percentage }: { currentStage: PipelineStage; percentage: number }) {
  const currentIndex = pipelineStages.findIndex(s => s.key === currentStage)
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">Pipeline Progress</span>
        <span className="text-sm font-semibold text-slate-800">{percentage}%</span>
      </div>
      <div className="flex items-center gap-1">
        {pipelineStages.map((stage, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-slate-300"
                } ${isCurrent ? "ring-2 ring-green-200" : ""}`}
              >
                {isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </div>
              <span className={`text-[9px] text-center mt-1.5 leading-tight whitespace-pre-line ${
                isCompleted ? "text-slate-700 font-medium" : "text-slate-400"
              }`}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center mt-2">
        <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Agent Stats Component ────────────────────────────────────────────────────

function AgentStats({ stats }: { stats: { emails: number; quotes: number; pending: number; invited: boolean } }) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      <div className="text-center p-3 bg-slate-50 rounded-lg">
        <div className="text-xl font-bold text-slate-800">{stats.emails}</div>
        <div className="text-[10px] text-slate-500">Emails</div>
      </div>
      <div className="text-center p-3 bg-slate-50 rounded-lg">
        <div className="text-xl font-bold text-slate-800">{stats.quotes}</div>
        <div className="text-[10px] text-slate-500">Quotes</div>
      </div>
      <div className="text-center p-3 bg-slate-50 rounded-lg">
        <div className={`text-xl font-bold ${stats.pending > 0 ? "text-red-500" : "text-slate-800"}`}>{stats.pending}</div>
        <div className="text-[10px] text-slate-500">Pending</div>
      </div>
      <div className="text-center p-3 bg-slate-50 rounded-lg">
        <div className={`flex items-center justify-center ${stats.invited ? "text-green-500" : "text-slate-300"}`}>
          {stats.invited ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>
        <div className="text-[10px] text-slate-500">Invited</div>
      </div>
    </div>
  )
}

// ─── Activity Feed Item ───────────────────────────────────────────────────────

function ActivityItem({ activity, onToggle }: { activity: AgentActivity & { expanded?: boolean }; onToggle: () => void }) {
  const getTypeStyles = () => {
    switch (activity.type) {
      case "ingredient-need":
        return { bg: "bg-green-100", text: "text-green-700", label: "INGREDIENT NEED" }
      case "supplier-match":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "SUPPLIER MATCH" }
      case "email-sent":
        return { bg: "bg-purple-100", text: "text-purple-700", label: "EMAIL SENT" }
      case "quote-response":
        return { bg: "bg-amber-100", text: "text-amber-700", label: "QUOTE RESPONSE" }
      default:
        return { bg: "bg-slate-100", text: "text-slate-700", label: "UPDATE" }
    }
  }
  
  const styles = getTypeStyles()
  
  return (
    <div className="border-b border-slate-100 last:border-0 py-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${styles.bg} flex items-center justify-center shrink-0`}>
          {activity.type === "ingredient-need" && <Target className={`w-4 h-4 ${styles.text}`} />}
          {activity.type === "supplier-match" && <Users className={`w-4 h-4 ${styles.text}`} />}
          {activity.type === "email-sent" && <Mail className={`w-4 h-4 ${styles.text}`} />}
          {activity.type === "quote-response" && <FileText className={`w-4 h-4 ${styles.text}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-semibold ${styles.text}`}>{styles.label}</span>
            <span className="text-[10px] text-slate-400">{activity.timestamp}</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-800 mb-1">{activity.title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{activity.description}</p>
          {activity.details && (
            <button
              type="button"
              onClick={onToggle}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mt-2 transition-colors"
            >
              {activity.expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {activity.expanded ? "Hide details" : "View details"}
            </button>
          )}
          {activity.expanded && activity.details && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed">
              {activity.details}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Agent Activity Panel ─────────────────────────────────────────────────────

function AgentActivityPanel({ 
  supplier, 
  onClose,
  onSendEmail,
  onRequestQuote,
  onInviteToPlatform,
  onScheduleFollowUp,
}: { 
  supplier: Supplier
  onClose: () => void
  onSendEmail: () => void
  onRequestQuote: () => void
  onInviteToPlatform: () => void
  onScheduleFollowUp: () => void
}) {
  const [activities, setActivities] = useState(
    agentActivities.map(a => ({ ...a, expanded: false }))
  )
  
  const toggleActivity = (id: string) => {
    setActivities(prev => 
      prev.map(a => a.id === id ? { ...a, expanded: !a.expanded } : a)
    )
  }
  
  const pipelinePercentage = supplier.pipelineStage === "connected" ? 100
    : supplier.pipelineStage === "platform-invite" ? 83
    : supplier.pipelineStage === "quote-requested" ? 66
    : supplier.pipelineStage === "email-sent" ? 50
    : supplier.pipelineStage === "supplier-match" ? 33
    : 16

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Agent Activity</h2>
              <p className="text-sm text-slate-500">{supplier.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <PipelineProgress 
          currentStage={supplier.pipelineStage || "ingredient-need"} 
          percentage={pipelinePercentage} 
        />
        
        <AgentStats stats={supplier.agentStats || { emails: 0, quotes: 0, pending: 0, invited: false }} />
        
        {/* Activity Feed */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Activity</h3>
          <div className="divide-y divide-slate-100">
            {activities.map(activity => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                onToggle={() => toggleActivity(activity.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-5 border-t border-slate-200 bg-slate-50">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSendEmail}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </button>
          <button
            type="button"
            onClick={onRequestQuote}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Request Quote
          </button>
          <button
            type="button"
            onClick={onInviteToPlatform}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Invite to Platform
          </button>
          <button
            type="button"
            onClick={onScheduleFollowUp}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Schedule Follow-up
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Supplier Card ────────────────────────────────────────────────────────────

function SupplierCard({ 
  supplier, 
  onConnect, 
  onActivity,
  viewMode 
}: {
  supplier: Supplier
  onConnect: (supplier: Supplier) => void
  onActivity: (supplier: Supplier) => void
  viewMode: ViewMode
}) {
  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    return `https://wa.me/${cleaned}`
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected": return "bg-green-100 text-green-700"
      case "Active": return "bg-blue-100 text-blue-700"
      case "Inactive": return "bg-slate-100 text-slate-500"
      default: return "bg-amber-100 text-amber-700"
    }
  }

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
          <Box className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 truncate">{supplier.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
              {supplier.status}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="h-3 w-3" />
            {supplier.location}
          </div>
        </div>
        <div className="text-sm text-slate-600">Score: {supplier.score}/100</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onActivity(supplier)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Activity
          </button>
          <button
            type="button"
            onClick={() => onConnect(supplier)}
            className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0">
          <Box className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 leading-tight">{supplier.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${getStatusColor(supplier.status)}`}>
              {supplier.status}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin className="h-3 w-3" />
            {supplier.location}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm">
          <span className="text-slate-600">Score: </span>
          <span className="font-semibold text-slate-800">{supplier.score}/100</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          Last updated: {supplier.lastUpdated}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1.5">Ingredients:</p>
        {supplier.ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {supplier.ingredients.slice(0, 3).map((item, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {item}
              </span>
            ))}
            {supplier.ingredients.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                +{supplier.ingredients.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400">N/A</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {supplier.phone ? (
          <a
            href={formatWhatsAppLink(supplier.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="truncate max-w-[100px]">{supplier.phone}</span>
            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <MessageSquare className="w-2.5 h-2.5" />
            </span>
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Phone className="h-3.5 w-3.5" />
            N/A
          </span>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onActivity(supplier)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Activity
          </button>
          <button
            type="button"
            onClick={() => onConnect(supplier)}
            className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Supplier Detail Modal ────────────────────────────────────────────────────

function SupplierDetailModal({ supplier, onClose, onSendEmail }: {
  supplier: Supplier
  onClose: () => void
  onSendEmail: (supplier: Supplier) => void
}) {
  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    return `https://wa.me/${cleaned}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Box className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800">{supplier.name}</h2>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">{supplier.status}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  {supplier.location}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Quality Score</p>
              <p className="text-2xl font-bold text-slate-800">{supplier.score}/100</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-slate-800">{supplier.lastUpdated}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">About</h3>
            <p className="text-sm text-slate-600">{supplier.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Ingredients Supplied</h3>
            {supplier.ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.ingredients.map((ing, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {ing}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No ingredients listed</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Certifications</h3>
            {supplier.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full border border-green-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No certifications listed</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{supplier.email}</span>
              </div>
              {supplier.phone && (
                <a
                  href={formatWhatsAppLink(supplier.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">{supplier.phone}</span>
                  <span className="ml-auto text-xs font-medium text-green-600">Open WhatsApp</span>
                </a>
              )}
              {supplier.website && (
                <a
                  href={`https://${supplier.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-blue-600">{supplier.website}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={() => onSendEmail(supplier)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Outreach Email
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Email Outreach Modal ─────────────────────────────────────────────────────

function EmailOutreachModal({ supplier, onClose, onSend }: {
  supplier: Supplier
  onClose: () => void
  onSend: (supplier: Supplier, subject: string, body: string) => void
}) {
  const [subject, setSubject] = useState(`Partnership Inquiry - JourneyFoods`)
  const [body, setBody] = useState(
    `Hi ${supplier.name} Team,\n\nI hope this message finds you well. My name is Riana Lynn from JourneyFoods, and I'm reaching out because we're impressed with your ingredient offerings.\n\nWe're currently looking for suppliers who can provide high-quality ingredients for our food manufacturing partners. Based on your profile, we believe there could be a great opportunity for collaboration.\n\nWould you be interested in setting up a call to discuss potential partnership opportunities?\n\nAdditionally, we'd love to invite you to create a supplier profile on our platform, which will help streamline communication and enable us to better match your products with our clients' needs.\n\nLooking forward to hearing from you.\n\nBest regards,\nRiana Lynn\nJourneyFoods`
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Send Outreach Email</h2>
                <p className="text-sm text-slate-500">To: {supplier.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Email Tracking Enabled</h3>
                <p className="text-xs text-slate-600 mt-1">
                  You'll be notified when the recipient opens this email. The email includes an invitation for the supplier to sign up for a profile on JourneyFoods.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={() => onSend(supplier, subject, body)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Email
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Supplier Full Page View ──────────────────────────────────────────────────

function SupplierFullPageView({ 
  supplier, 
  onBack, 
  onSendEmail 
}: { 
  supplier: Supplier
  onBack: () => void
  onSendEmail: (supplier: Supplier) => void
}) {
  const formatWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    return `https://wa.me/${cleaned}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected": return "bg-green-100 text-green-700 border-green-200"
      case "Active": return "bg-blue-100 text-blue-700 border-blue-200"
      case "Inactive": return "bg-slate-100 text-slate-500 border-slate-200"
      default: return "bg-amber-100 text-amber-700 border-amber-200"
    }
  }

  const pipelinePercentage = supplier.pipelineStage === "connected" ? 100
    : supplier.pipelineStage === "platform-invite" ? 83
    : supplier.pipelineStage === "quote-requested" ? 66
    : supplier.pipelineStage === "email-sent" ? 50
    : supplier.pipelineStage === "supplier-match" ? 33
    : 16

  // Mock data for products supplied
  const productsSupplied = [
    { id: "1", name: "Organic Protein Bar", status: "active" },
    { id: "2", name: "Green Smoothie Mix", status: "active" },
    { id: "3", name: "Matcha Energy Bites", status: "concept" },
  ]

  // Mock order history
  const orderHistory = [
    { id: "1", date: "Mar 15, 2026", amount: "$12,500", status: "completed" },
    { id: "2", date: "Feb 28, 2026", amount: "$8,750", status: "completed" },
    { id: "3", date: "Jan 20, 2026", amount: "$15,200", status: "completed" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <button 
            type="button" 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Suppliers
          </button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center">
                <Box className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-800">{supplier.name}</h1>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(supplier.status)}`}>
                    {supplier.status}
                  </span>
                  {supplier.dataSource && <DataSourceBadge source={supplier.dataSource} size="md" />}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {supplier.location}
                  </span>
                  <span className="text-sm text-slate-400">|</span>
                  <span className="text-sm text-slate-500">Last updated {supplier.lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4 text-slate-500" />
              </button>
              <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <ExternalLink className="h-4 w-4 text-slate-500" />
              </button>
              <button
                type="button"
                onClick={() => onSendEmail(supplier)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">About</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-10 h-10 mx-auto rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{supplier.score.toFixed(0)}</p>
                <p className="text-xs text-slate-500 mt-1">Quality Score</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-10 h-10 mx-auto rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{supplier.ingredients.length}</p>
                <p className="text-xs text-slate-500 mt-1">Ingredients</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-10 h-10 mx-auto rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                  <Truck className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{supplier.agentStats?.quotes || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Orders</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-10 h-10 mx-auto rounded-lg bg-violet-100 flex items-center justify-center mb-3">
                  <BarChart3 className="h-5 w-5 text-violet-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{pipelinePercentage}%</p>
                <p className="text-xs text-slate-500 mt-1">Pipeline</p>
              </div>
            </div>

            {/* Ingredients Supplied */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Ingredients Supplied</h2>
              {supplier.ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {supplier.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No ingredients listed</p>
              )}
            </div>

            {/* Products Using This Supplier */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Products Using This Supplier</h2>
              <div className="space-y-3">
                {productsSupplied.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                        <Package className="h-4 w-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{product.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      product.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Order History</h2>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{order.date}</p>
                        <p className="text-xs text-slate-400">Order #{order.id}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{order.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{supplier.email}</span>
                </div>
                {supplier.phone && (
                  <a
                    href={formatWhatsAppLink(supplier.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{supplier.phone}</span>
                    <MessageSquare className="h-4 w-4 text-green-500 ml-auto" />
                  </a>
                )}
                {supplier.website && (
                  <a
                    href={`https://${supplier.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Globe className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-blue-600">{supplier.website}</span>
                    <ExternalLink className="h-3 w-3 text-slate-400 ml-auto" />
                  </a>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Certifications</h3>
              {supplier.certifications.length > 0 ? (
                <div className="space-y-2">
                  {supplier.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No certifications listed</p>
              )}
            </div>

            {/* Agent Activity Summary */}
            {supplier.agentStats && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-800">AI Agent Activity</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-800">{supplier.agentStats.emails}</p>
                    <p className="text-xs text-slate-500">Emails Sent</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-800">{supplier.agentStats.quotes}</p>
                    <p className="text-xs text-slate-500">Quotes</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <p className={`text-xl font-bold ${supplier.agentStats.pending > 0 ? "text-amber-600" : "text-slate-800"}`}>
                      {supplier.agentStats.pending}
                    </p>
                    <p className="text-xs text-slate-500">Pending</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-center flex flex-col items-center justify-center">
                    {supplier.agentStats.invited ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-slate-400" />
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {supplier.agentStats.invited ? "Invited" : "Not Invited"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onSendEmail(supplier)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send Email
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Request Quote
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Supplier View Components ─────────────────────────────────────────────────

function InboundOpportunityCard({ opportunity }: { opportunity: InboundOpportunity }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-700"
      case "reviewing": return "bg-amber-100 text-amber-700"
      case "responded": return "bg-green-100 text-green-700"
      case "matched": return "bg-purple-100 text-purple-700"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{opportunity.brandName}</h4>
            <p className="text-xs text-slate-500">{opportunity.receivedAt}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(opportunity.status)}`}>
          {opportunity.status}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Ingredient:</span>
          <span className="text-sm font-medium text-slate-800">{opportunity.ingredient}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Quantity:</span>
          <span className="text-sm text-slate-700">{opportunity.quantity}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Timeline:</span>
          <span className="text-sm text-slate-700">{opportunity.timeline}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Respond
        </button>
        <button
          type="button"
          className="px-3 py-2 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

function SupplierDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Supplier Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your profile, respond to opportunities, and grow your business.</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Update Catalog
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">Inbound Leads</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">12</span>
            <span className="text-sm text-green-600 font-medium">+3 this week</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">Active Connections</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">8</span>
            <span className="text-sm text-green-600 font-medium">+2 this month</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">Profile Views</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">156</span>
            <span className="text-sm text-green-600 font-medium">+28% vs last month</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">Quote Requests</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">5</span>
            <span className="text-sm text-amber-600 font-medium">2 pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbound Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Inbound Opportunities</h2>
            <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inboundOpportunities.map(opp => (
              <InboundOpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>

        {/* Profile & Agent Suggestions */}
        <div className="space-y-4">
          {/* Profile Completion */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Profile Completion</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">60% Complete</span>
                  <span className="text-amber-600 font-medium">4 items left</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Add pricing info</span>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Add</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Upload certifications</span>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Upload</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Set lead times</span>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Set</button>
              </div>
            </div>
          </div>

          {/* Agent Suggestions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Agent Suggestions</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/80 rounded-lg">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Update pricing</strong> for Organic Mango Puree - 3 brands are searching for this ingredient.
                </p>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Update now <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-3 bg-white/80 rounded-lg">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Add certification</strong> - Brands filtering for Non-GMO can't find your Pea Protein.
                </p>
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Add certification <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Freshness */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Data Freshness</h3>
              <button type="button" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Ingredient Catalog</span>
                <span className="text-xs text-green-600 font-medium">Updated 2 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pricing Data</span>
                <span className="text-xs text-amber-600 font-medium">14 days old</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Certifications</span>
                <span className="text-xs text-green-600 font-medium">Up to date</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Lead Times</span>
                <span className="text-xs text-red-600 font-medium">30+ days old</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Supplier Ingredients Page ───────────────────────────────────────────────

type IngredientStatus = "active" | "concept" | "flagged"

interface SupplierIngredient {
  id: string
  name: string
  category: string
  form: string
  price: number | null
  unit: string
  status: IngredientStatus
  certifications: string[]
  activeProducts: number
  conceptProducts: number
  lastUpdated: string
  alert?: string
  origin: string
  minOrder: string
  leadTime: string
  starred: boolean
}

const supplierIngredients: SupplierIngredient[] = [
  {
    id: "1", name: "Organic Mango Puree", category: "Fruit", form: "Puree",
    price: 4.50, unit: "kg", status: "active",
    certifications: ["USDA Organic", "Non-GMO", "Fair Trade"],
    activeProducts: 12, conceptProducts: 5, lastUpdated: "2 days ago",
    origin: "Mexico", minOrder: "25 kg", leadTime: "2–3 weeks", starred: true,
  },
  {
    id: "2", name: "Buckwheat Flour", category: "Grain", form: "Powder",
    price: 2.75, unit: "kg", status: "active",
    certifications: ["Gluten-Free", "Non-GMO"],
    activeProducts: 8, conceptProducts: 15, lastUpdated: "1 week ago",
    origin: "USA", minOrder: "50 kg", leadTime: "1–2 weeks", starred: false,
  },
  {
    id: "3", name: "Turmeric Extract", category: "Spice", form: "Powder",
    price: null, unit: "kg", status: "flagged",
    certifications: ["USDA Organic"],
    activeProducts: 25, conceptProducts: 3, lastUpdated: "3 days ago",
    origin: "India", minOrder: "10 kg", leadTime: "4–6 weeks",
    alert: "Supply chain disruption — 3-week delay expected", starred: false,
  },
  {
    id: "4", name: "Eco-Friendly Pouch", category: "Packaging", form: "Unit",
    price: 0.85, unit: "unit", status: "active",
    certifications: ["FSC Certified", "Recyclable"],
    activeProducts: 3, conceptProducts: 22, lastUpdated: "5 days ago",
    origin: "Germany", minOrder: "500 units", leadTime: "2–4 weeks", starred: false,
  },
  {
    id: "5", name: "Pea Protein Isolate", category: "Protein", form: "Powder",
    price: 7.20, unit: "kg", status: "active",
    certifications: [],
    activeProducts: 18, conceptProducts: 9, lastUpdated: "1 day ago",
    origin: "Canada", minOrder: "25 kg", leadTime: "1–3 weeks", starred: true,
    alert: "Certifications missing — brands filtering by Non-GMO cannot find this ingredient",
  },
  {
    id: "6", name: "Himalayan Pink Salt", category: "Mineral", form: "Crystal",
    price: 1.20, unit: "kg", status: "active",
    certifications: ["Natural", "Non-GMO"],
    activeProducts: 32, conceptProducts: 7, lastUpdated: "2 weeks ago",
    origin: "Pakistan", minOrder: "100 kg", leadTime: "1–2 weeks", starred: true,
  },
  {
    id: "7", name: "Avocado Oil", category: "Oil", form: "Liquid",
    price: 12.40, unit: "kg", status: "active",
    certifications: ["USDA Organic", "Non-GMO"],
    activeProducts: 9, conceptProducts: 4, lastUpdated: "1 day ago",
    origin: "Mexico", minOrder: "20 kg", leadTime: "2–3 weeks", starred: true,
  },
  {
    id: "8", name: "Chicory Root Fiber", category: "Fiber", form: "Powder",
    price: 6.10, unit: "kg", status: "concept",
    certifications: ["Non-GMO", "EU Organic"],
    activeProducts: 0, conceptProducts: 8, lastUpdated: "6 days ago",
    origin: "Belgium", minOrder: "10 kg", leadTime: "3–4 weeks", starred: false,
  },
]

const SUPPLIER_CATEGORIES = ["All", "Fruit", "Grain", "Spice", "Protein", "Oil", "Mineral", "Fiber", "Packaging"]
const SUPPLIER_STATUSES: Array<{ key: "all" | IngredientStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "concept", label: "Concept" },
  { key: "flagged", label: "Flagged" },
]

function getStatusStyles(status: IngredientStatus) {
  switch (status) {
    case "active": return { badge: "bg-green-100 text-green-700", dot: "bg-green-500" }
    case "concept": return { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" }
    case "flagged": return { badge: "bg-red-100 text-red-700", dot: "bg-red-500" }
  }
}

// ─── Add / Edit Ingredient Modal ──────────────────────────────────────────────

function IngredientFormModal({
  ingredient,
  onClose,
  onSave,
}: {
  ingredient?: SupplierIngredient | null
  onClose: () => void
  onSave: (data: Partial<SupplierIngredient>) => void
}) {
  const isEdit = !!ingredient
  const [name, setName] = useState(ingredient?.name ?? "")
  const [category, setCategory] = useState(ingredient?.category ?? "")
  const [form, setForm] = useState(ingredient?.form ?? "")
  const [price, setPrice] = useState(ingredient?.price?.toString() ?? "")
  const [unit, setUnit] = useState(ingredient?.unit ?? "kg")
  const [status, setStatus] = useState<IngredientStatus>(ingredient?.status ?? "concept")
  const [origin, setOrigin] = useState(ingredient?.origin ?? "")
  const [minOrder, setMinOrder] = useState(ingredient?.minOrder ?? "")
  const [leadTime, setLeadTime] = useState(ingredient?.leadTime ?? "")
  const [certInput, setCertInput] = useState("")
  const [certifications, setCertifications] = useState<string[]>(ingredient?.certifications ?? [])

  const addCert = () => {
    const t = certInput.trim()
    if (t && !certifications.includes(t)) {
      setCertifications(prev => [...prev, t])
      setCertInput("")
    }
  }

  const removeCert = (cert: string) => {
    setCertifications(prev => prev.filter(c => c !== cert))
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      category: category.trim(),
      form: form.trim(),
      price: price ? parseFloat(price) : null,
      unit,
      status,
      origin: origin.trim(),
      minOrder: minOrder.trim(),
      leadTime: leadTime.trim(),
      certifications,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{isEdit ? "Edit Ingredient" : "Add New Ingredient"}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEdit ? `Editing ${ingredient.name}` : "Add a new ingredient to your portfolio"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ingredient Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Organic Mango Puree"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category + Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Fruit, Protein"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Form</label>
              <input
                type="text"
                value={form}
                onChange={e => setForm(e.target.value)}
                placeholder="e.g. Powder, Liquid"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (est.)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
                <option value="L">L</option>
                <option value="unit">unit</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <div className="flex gap-2">
              {(["active", "concept", "flagged"] as IngredientStatus[]).map(s => {
                const styles = getStatusStyles(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 transition-colors capitalize ${
                      status === s
                        ? `${styles.badge} border-current`
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Origin + Min Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Origin</label>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="e.g. Mexico, USA"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Order</label>
              <input
                type="text"
                value={minOrder}
                onChange={e => setMinOrder(e.target.value)}
                placeholder="e.g. 25 kg"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lead Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Lead Time</label>
            <input
              type="text"
              value={leadTime}
              onChange={e => setLeadTime(e.target.value)}
              placeholder="e.g. 2–3 weeks"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Certifications</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={certInput}
                onChange={e => setCertInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCert() } }}
                placeholder="e.g. USDA Organic"
                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addCert}
                className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </div>
            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {certifications.map(cert => (
                  <span key={cert} className="flex items-center gap-1.5 px-3 py-1 text-sm bg-green-50 text-green-700 border border-green-200 rounded-full font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {cert}
                    <button type="button" onClick={() => removeCert(cert)} className="ml-0.5 hover:text-green-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            {isEdit ? "Save Changes" : "Add Ingredient"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Ingredient Detail Panel ──────────────────────────────────────────────────

function SupplierIngredientPanel({
  ingredient,
  onClose,
  onEdit,
}: {
  ingredient: SupplierIngredient
  onClose: () => void
  onEdit: (ingredient: SupplierIngredient) => void
}) {
  const styles = getStatusStyles(ingredient.status)

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 leading-tight">{ingredient.name}</h2>
                {ingredient.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${styles.badge}`}>
                  {ingredient.status}
                </span>
                <span className="text-xs text-slate-400">{ingredient.category} · {ingredient.form}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Alert */}
      {ingredient.alert && (
        <div className="mx-5 mt-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{ingredient.alert}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-xl font-bold text-slate-800">
              {ingredient.price !== null ? `$${ingredient.price.toFixed(2)}` : "—"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">per {ingredient.unit}</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-xl font-bold text-green-600">{ingredient.activeProducts}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Active</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-xl font-bold text-amber-600">{ingredient.conceptProducts}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Concept</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</h3>
          <div className="space-y-2">
            {[
              { label: "Origin", value: ingredient.origin || "—" },
              { label: "Min Order", value: ingredient.minOrder || "—" },
              { label: "Lead Time", value: ingredient.leadTime || "—" },
              { label: "Last Updated", value: ingredient.lastUpdated },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-medium text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Certifications</h3>
          {ingredient.certifications.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {ingredient.certifications.map(cert => (
                <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {cert}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-700 font-medium">No certifications — add them to improve discoverability</span>
            </div>
          )}
        </div>

        {/* Usage bar */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Usage Breakdown</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Active products</span>
              <span className="font-semibold text-slate-800">{ingredient.activeProducts}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${Math.min(100, (ingredient.activeProducts / (ingredient.activeProducts + ingredient.conceptProducts + 1)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Concept products</span>
              <span className="font-semibold text-slate-800">{ingredient.conceptProducts}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${Math.min(100, (ingredient.conceptProducts / (ingredient.activeProducts + ingredient.conceptProducts + 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-5 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onEdit(ingredient)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Edit Details
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Supplier Ingredients Page ────────────────────────────────────────────────

export function SupplierIngredientsPage() {
  const [ingredients, setIngredients] = useState<SupplierIngredient[]>(supplierIngredients)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState<"all" | IngredientStatus>("all")
  const [selectedIngredient, setSelectedIngredient] = useState<SupplierIngredient | null>(null)
  const [editingIngredient, setEditingIngredient] = useState<SupplierIngredient | null | undefined>(undefined)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || ing.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || ing.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: ingredients.length,
    active: ingredients.filter(i => i.status === "active").length,
    concept: ingredients.filter(i => i.status === "concept").length,
    flagged: ingredients.filter(i => i.status === "flagged").length,
    totalActive: ingredients.reduce((sum, i) => sum + i.activeProducts, 0),
    totalConcept: ingredients.reduce((sum, i) => sum + i.conceptProducts, 0),
  }

  const handleSave = (data: Partial<SupplierIngredient>) => {
    if (editingIngredient) {
      // Edit existing
      setIngredients(prev => prev.map(i => i.id === editingIngredient.id ? { ...i, ...data, lastUpdated: "Just now" } : i))
      setEditingIngredient(undefined)
      setSelectedIngredient(prev => prev?.id === editingIngredient.id ? { ...prev, ...data, lastUpdated: "Just now" } : prev)
    } else {
      // Add new
      const newIng: SupplierIngredient = {
        id: `new-${Date.now()}`,
        name: data.name ?? "",
        category: data.category ?? "",
        form: data.form ?? "",
        price: data.price ?? null,
        unit: data.unit ?? "kg",
        status: data.status ?? "concept",
        certifications: data.certifications ?? [],
        activeProducts: 0,
        conceptProducts: 0,
        lastUpdated: "Just now",
        origin: data.origin ?? "",
        minOrder: data.minOrder ?? "",
        leadTime: data.leadTime ?? "",
        starred: false,
      }
      setIngredients(prev => [newIng, ...prev])
      setShowAddModal(false)
    }
  }

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, starred: !i.starred } : i))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Ingredients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your ingredient portfolio and track how brands are using them.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingIngredient(null); setShowAddModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-800" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Concept", value: stats.concept, color: "text-amber-600" },
          { label: "Flagged", value: stats.flagged, color: "text-red-600" },
          { label: "Active Uses", value: stats.totalActive, color: "text-blue-600" },
          { label: "Concept Uses", value: stats.totalConcept, color: "text-violet-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SUPPLIER_STATUSES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedStatus(key)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedStatus === key
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {SUPPLIER_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
          <span className="col-span-4">Ingredient</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-2">Usage</span>
          <span className="col-span-2">Certifications</span>
          <span className="col-span-1">Price/unit</span>
          <span className="col-span-1">Origin</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Leaf className="h-12 w-12 mx-auto mb-3 text-slate-200" />
              <p className="font-medium text-slate-600">No ingredients found</p>
              <p className="text-sm mt-1">Try adjusting your filters or add a new ingredient</p>
            </div>
          ) : (
            filtered.map(ing => {
              const statusStyles = getStatusStyles(ing.status)
              return (
                <div
                  key={ing.id}
                  className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedIngredient(ing)}
                >
                  {/* Ingredient name */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    {ing.alert ? (
                      <span className="h-5 w-5 rounded-full border-2 border-red-400 flex items-center justify-center shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      </span>
                    ) : (
                      <span className="h-5 w-5 shrink-0" />
                    )}
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 border border-green-100 flex items-center justify-center shrink-0">
                      <Leaf className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{ing.name}</p>
                      <p className="text-xs text-slate-400 truncate">{ing.category} · {ing.form}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusStyles.badge}`}>
                      {ing.status}
                    </span>
                  </div>

                  {/* Usage */}
                  <div className="col-span-2 text-sm">
                    <span className="block text-slate-700 font-medium">{ing.activeProducts} Active</span>
                    <span className="block text-slate-400 text-xs">{ing.conceptProducts} Concept</span>
                  </div>

                  {/* Certifications */}
                  <div className="col-span-2">
                    {ing.certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {ing.certifications.slice(0, 2).map(cert => (
                          <span key={cert} className="px-1.5 py-0.5 text-[10px] bg-green-50 text-green-700 rounded border border-green-100 font-medium truncate max-w-[80px]">
                            {cert}
                          </span>
                        ))}
                        {ing.certifications.length > 2 && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded font-medium">
                            +{ing.certifications.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">None</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-1 text-sm">
                    {ing.price !== null ? (
                      <span className="font-semibold text-slate-800">${ing.price.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-400">No data</span>
                    )}
                  </div>

                  {/* Origin */}
                  <div className="col-span-1">
                    <span className="text-xs text-slate-500 truncate block">{ing.origin || "—"}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={e => toggleStar(ing.id, e)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label={ing.starred ? "Unstar" : "Star"}
                    >
                      <Star className={`h-4 w-4 ${ing.starred ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} />
                    </button>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setEditingIngredient(ing); setShowAddModal(true) }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Edit ingredient"
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Upload CTA */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Upload Your Ingredient Catalog</h3>
            <p className="text-sm text-slate-300 mt-0.5">Import a CSV or spreadsheet to add multiple ingredients at once.</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors shrink-0"
        >
          <Upload className="h-4 w-4" />
          Upload Catalog
        </button>
      </div>

      {/* Detail Panel */}
      {selectedIngredient && !showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedIngredient(null)} />
          <SupplierIngredientPanel
            ingredient={selectedIngredient}
            onClose={() => setSelectedIngredient(null)}
            onEdit={ing => { setEditingIngredient(ing); setShowAddModal(true) }}
          />
        </>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <IngredientFormModal
          ingredient={editingIngredient}
          onClose={() => { setShowAddModal(false); setEditingIngredient(undefined) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ─── Main Suppliers Page ──────────────────────────────────────────────────────

interface SuppliersPageProps {
  isSupplierMode?: boolean
}

export function SuppliersPage({ isSupplierMode = false }: SuppliersPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [detailViewSupplier, setDetailViewSupplier] = useState<Supplier | null>(null)
  const [activitySupplier, setActivitySupplier] = useState<Supplier | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleConnect = (supplier: Supplier) => {
    // Open full page view when clicking Connect
    setDetailViewSupplier(supplier)
  }

  const handleActivity = (supplier: Supplier) => {
    setActivitySupplier(supplier)
  }

  const handleSendEmail = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setShowEmailModal(true)
  }

  const handleEmailSent = () => {
    setShowEmailModal(false)
    setSelectedSupplier(null)
  }

  const filteredSuppliers = suppliersData.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Supplier Mode View
  if (isSupplierMode) {
    return <SupplierDashboard />
  }

  // Full Page Supplier Detail View
  if (detailViewSupplier) {
    return (
      <SupplierFullPageView
        supplier={detailViewSupplier}
        onBack={() => setDetailViewSupplier(null)}
        onSendEmail={(supplier) => {
          setSelectedSupplier(supplier)
          setShowEmailModal(true)
        }}
      />
    )
  }

  // Manufacturer Mode View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Supplier Network</h1>
          <p className="text-sm text-slate-500 mt-1">Discover, connect, and manage supplier relationships with AI-powered matching.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search suppliers or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Agent Summary Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">AI Agent Activity Summary</h3>
            <p className="text-sm text-slate-600 mb-3">
              Your agent has identified <strong>3 ingredient needs</strong> from your product pipeline, matched <strong>5 potential suppliers</strong>, 
              and sent <strong>2 outreach emails</strong> this week.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-600">2 emails opened</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-slate-600">1 quote pending</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-slate-600">3 suppliers invited</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Supplier Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard 
              key={supplier.id} 
              supplier={supplier} 
              onConnect={handleConnect} 
              onActivity={handleActivity}
              viewMode={viewMode} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard 
              key={supplier.id} 
              supplier={supplier} 
              onConnect={handleConnect} 
              onActivity={handleActivity}
              viewMode={viewMode} 
            />
          ))}
        </div>
      )}

      {/* Modals & Panels */}
      {activitySupplier && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setActivitySupplier(null)}
          />
          <AgentActivityPanel
            supplier={activitySupplier}
            onClose={() => setActivitySupplier(null)}
            onSendEmail={() => {
              setSelectedSupplier(activitySupplier)
              setShowEmailModal(true)
              setActivitySupplier(null)
            }}
            onRequestQuote={() => {
              // Handle quote request
              setActivitySupplier(null)
            }}
            onInviteToPlatform={() => {
              // Handle platform invite
              setActivitySupplier(null)
            }}
            onScheduleFollowUp={() => {
              // Handle schedule follow-up
              setActivitySupplier(null)
            }}
          />
        </>
      )}

      {selectedSupplier && !showEmailModal && (
        <SupplierDetailModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onSendEmail={handleSendEmail}
        />
      )}

      {showEmailModal && selectedSupplier && (
        <EmailOutreachModal
          supplier={selectedSupplier}
          onClose={() => {
            setShowEmailModal(false)
            setSelectedSupplier(null)
          }}
          onSend={handleEmailSent}
        />
      )}
    </div>
  )
}
