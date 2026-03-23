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
  Bell,
  RefreshCw,
  Upload,
  Link2,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list"

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
    location: "Unknown Location", 
    score: 72.73, 
    status: "Pending", 
    lastUpdated: "Invalid Date", 
    ingredients: ["Blueberry", "Papaya", "hibiscus flow", "Mango", "Acai", "Spirulina", "Chlorella", "Matcha"], 
    phone: null, 
    email: "contact@journeyfoods.com", 
    website: "journeyfoods.com", 
    certifications: ["USDA Organic", "Non-GMO"], 
    description: "A leading supplier of organic superfoods and functional ingredients.",
    pipelineStage: "email-sent",
    agentStats: { emails: 2, quotes: 1, pending: 1, invited: false }
  },
  { 
    id: "2", 
    name: "check12345", 
    location: "Unknown Location", 
    score: 90, 
    status: "Pending", 
    lastUpdated: "Invalid Date", 
    ingredients: [], 
    phone: null, 
    email: "check@example.com", 
    website: null, 
    certifications: [], 
    description: "New supplier pending verification.",
    pipelineStage: "ingredient-need",
    agentStats: { emails: 0, quotes: 0, pending: 0, invited: false }
  },
  { 
    id: "3", 
    name: "abhi34", 
    location: "Unknown Location", 
    score: 90, 
    status: "Pending", 
    lastUpdated: "Invalid Date", 
    ingredients: [], 
    phone: null, 
    email: "abhi@example.com", 
    website: null, 
    certifications: [], 
    description: "New supplier pending verification.",
    pipelineStage: "supplier-match",
    agentStats: { emails: 0, quotes: 0, pending: 1, invited: false }
  },
  { 
    id: "4", 
    name: "LinkOne Ingredient Solutions", 
    location: "Unknown Location", 
    score: 24.24, 
    status: "Pending", 
    lastUpdated: "Invalid Date", 
    ingredients: ["Oils", "Eggs", "Nuts", "Seeds", "Dairy"], 
    phone: "+1 417-236-9602", 
    email: "info@linkone.com", 
    website: "linkone.com", 
    certifications: ["FDA Approved", "GFSI"], 
    description: "Comprehensive ingredient solutions for food manufacturers.",
    pipelineStage: "quote-requested",
    agentStats: { emails: 1, quotes: 1, pending: 1, invited: false }
  },
  { 
    id: "5", 
    name: "Pharmore Ingredients Inc", 
    location: "Unknown Location", 
    score: 90, 
    status: "Pending", 
    lastUpdated: "Invalid Date", 
    ingredients: ["Chondroitin Sulfate Sodium", "Glucosamine HCl"], 
    phone: "+1 801-446-8188", 
    email: "sales@pharmore.com", 
    website: "pharmore.com", 
    certifications: ["GMP Certified", "NSF"], 
    description: "Specialty ingredients for nutraceuticals and dietary supplements.",
    pipelineStage: "platform-invite",
    agentStats: { emails: 3, quotes: 2, pending: 0, invited: true }
  },
  { 
    id: "6", 
    name: "HPS Food & Ingredients Inc.", 
    location: "Unknown Location", 
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
    agentStats: { emails: 5, quotes: 3, pending: 0, invited: true }
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

// ─── Main Suppliers Page ──────────────────────────────────────────────────────

interface SuppliersPageProps {
  isSupplierMode?: boolean
}

export function SuppliersPage({ isSupplierMode = false }: SuppliersPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [activitySupplier, setActivitySupplier] = useState<Supplier | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleConnect = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
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
