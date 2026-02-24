"use client"

import { useState } from "react"
import {
  X,
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
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────

export type AgentEventType =
  | "ingredient_need"
  | "supplier_match"
  | "email_sent"
  | "email_opened"
  | "email_clicked"
  | "email_replied"
  | "follow_up_scheduled"
  | "follow_up_sent"
  | "quote_requested"
  | "quote_received"
  | "platform_invite"
  | "connection_established"

export interface AgentTimelineEvent {
  id: string
  type: AgentEventType
  timestamp: string
  title: string
  description: string
  metadata?: {
    ingredient?: string
    score?: number
    emailSubject?: string
    quoteAmount?: string
    moq?: string
    leadTime?: string
  }
  status: "completed" | "pending" | "active"
}

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

// ─── Event Config ─────────────────────────────────────────────────────────

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

// ─── Timeline Event Component ─────────────────────────────────────────────

function TimelineEvent({
  event,
  isLast,
}: {
  event: AgentTimelineEvent
  isLast: boolean
}) {
  const config = eventConfig[event.type]
  const Icon = config.icon
  const [expanded, setExpanded] = useState(false)
  const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0

  return (
    <div className="flex gap-3">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            event.status === "completed"
              ? config.dotColor
              : event.status === "active"
                ? `${config.dotColor} ring-4 ring-opacity-20 ring-blue-300`
                : "bg-slate-200"
          }`}
        >
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 min-h-6" />}
      </div>

      {/* Content */}
      <div className={`pb-5 flex-1 min-w-0 ${isLast ? "" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${config.bgColor}`}
              >
                {config.label}
              </span>
              {event.status === "pending" && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                  Pending
                </span>
              )}
              {event.status === "active" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Active
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-800 mt-1 leading-snug">
              {event.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {event.description}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 mt-1 whitespace-nowrap">
            {event.timestamp}
          </span>
        </div>

        {/* Expandable metadata */}
        {hasMetadata && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {expanded ? "Hide details" : "View details"}
            </button>
            {expanded && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                {event.metadata?.ingredient && (
                  <div className="flex items-center gap-2">
                    <Leaf className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-slate-600">
                      Ingredient:{" "}
                      <strong className="text-slate-800">
                        {event.metadata.ingredient}
                      </strong>
                    </span>
                  </div>
                )}
                {event.metadata?.score !== undefined && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-slate-600">
                      Match Score:{" "}
                      <strong className="text-slate-800">
                        {event.metadata.score}/100
                      </strong>
                    </span>
                  </div>
                )}
                {event.metadata?.emailSubject && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-slate-600 truncate">
                      Subject:{" "}
                      <strong className="text-slate-800">
                        {event.metadata.emailSubject}
                      </strong>
                    </span>
                  </div>
                )}
                {event.metadata?.quoteAmount && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-cyan-500" />
                    <span className="text-xs text-slate-600">
                      Quote:{" "}
                      <strong className="text-slate-800">
                        {event.metadata.quoteAmount}
                      </strong>
                    </span>
                  </div>
                )}
                {event.metadata?.moq && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-cyan-500" />
                    <span className="text-xs text-slate-600">
                      MOQ:{" "}
                      <strong className="text-slate-800">
                        {event.metadata.moq}
                      </strong>
                    </span>
                  </div>
                )}
                {event.metadata?.leadTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-600">
                      Lead Time:{" "}
                      <strong className="text-slate-800">
                        {event.metadata.leadTime}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────

export default function AgentActivityDrawer({
  supplier,
  timeline,
  open,
  onClose,
  onSendEmail,
  onRequestQuote,
  onInviteToPlatform,
  onScheduleFollowUp,
}: {
  supplier: Supplier
  timeline: AgentTimelineEvent[]
  open: boolean
  onClose: () => void
  onSendEmail: () => void
  onRequestQuote: () => void
  onInviteToPlatform: () => void
  onScheduleFollowUp: () => void
}) {
  // Summary stats derived from timeline
  const emailsSent = timeline.filter((e) => e.type === "email_sent").length
  const quotesReceived = timeline.filter(
    (e) => e.type === "quote_received"
  ).length
  const quotesPending = timeline.filter(
    (e) => e.type === "quote_requested" && e.status === "active"
  ).length
  const isConnected = timeline.some(
    (e) => e.type === "connection_established" && e.status === "completed"
  )
  const isInvited = timeline.some(
    (e) =>
      e.type === "platform_invite" &&
      (e.status === "completed" || e.status === "active")
  )

  // Progress calculation
  const stageOrder: AgentEventType[] = [
    "ingredient_need",
    "supplier_match",
    "email_sent",
    "quote_requested",
    "platform_invite",
    "connection_established",
  ]
  const completedStages = stageOrder.filter((stage) =>
    timeline.some((e) => e.type === stage && e.status === "completed")
  )
  const progressPercent = Math.round(
    (completedStages.length / stageOrder.length) * 100
  )

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close agent activity panel"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[440px] max-w-[calc(100vw-48px)] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={`Agent activity for ${supplier.name}`}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-800 truncate">
                  Agent Activity
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  {supplier.name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-600">
                Pipeline Progress
              </span>
              <span className="text-[11px] font-semibold text-slate-800">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              {stageOrder.map((stage) => {
                const done = completedStages.includes(stage)
                const active = timeline.some(
                  (e) => e.type === stage && e.status === "active"
                )
                const conf = eventConfig[stage]
                return (
                  <div
                    key={stage}
                    className="flex items-center gap-1"
                    title={conf.label}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        done
                          ? "bg-green-500"
                          : active
                            ? "bg-blue-500 animate-pulse"
                            : "bg-slate-200"
                      }`}
                    />
                    <span className="text-[9px] text-slate-400 hidden lg:inline">
                      {conf.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Summary Stats ──────────────────────────────────────── */}
        <div className="px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-lg font-bold text-slate-800">{emailsSent}</p>
              <p className="text-[10px] text-slate-500">Emails</p>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-lg font-bold text-slate-800">
                {quotesReceived}
              </p>
              <p className="text-[10px] text-slate-500">Quotes</p>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <p className="text-lg font-bold text-amber-600">
                {quotesPending}
              </p>
              <p className="text-[10px] text-slate-500">Pending</p>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center">
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : isInvited ? (
                  <Clock className="h-5 w-5 text-amber-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {isConnected ? "Active" : isInvited ? "Invited" : "Not yet"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Timeline ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {timeline.length > 0 ? (
            <div>
              {timeline.map((event, idx) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  isLast={idx === timeline.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                No agent activity yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Start by sending an outreach email or requesting a quote to
                begin tracking this supplier.
              </p>
            </div>
          )}
        </div>

        {/* ── Quick Actions ──────────────────────────────────────── */}
        <div className="px-5 py-4 border-t border-slate-200 shrink-0 bg-white">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSendEmail}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              Send Email
            </button>
            <button
              type="button"
              onClick={onRequestQuote}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Request Quote
            </button>
            <button
              type="button"
              onClick={onInviteToPlatform}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite to Platform
            </button>
            <button
              type="button"
              onClick={onScheduleFollowUp}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              Schedule Follow-up
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
