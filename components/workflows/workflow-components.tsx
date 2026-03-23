"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  Calendar,
  Tag,
  Package,
  Leaf,
  Box,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  User,
  Play,
  Pause,
  SkipForward,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import {
  type ProjectFolder,
  type StageProgress,
  type StageStatus,
  type LinkedEntity,
  type AutomationLogEntry,
  type ManualAction,
  type StageId,
  WORKFLOW_STAGES,
  getStageLabel,
  getStageStatusColor,
  getProjectStatusColor,
  getProjectProgress,
  getCurrentStage,
  getPriorityColor,
} from "@/lib/workflows-data"

// ─── Timeline Bar ─────────────────────────────────────────────────────────────

interface TimelineBarProps {
  stages: StageProgress[]
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
  onClick?: (stageId: StageId) => void
}

export function TimelineBar({ stages, showLabels = false, size = "md", onClick }: TimelineBarProps) {
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" }
  const sortedStages = [...stages].sort((a, b) => {
    const orderA = WORKFLOW_STAGES.findIndex((s) => s.id === a.stageId)
    const orderB = WORKFLOW_STAGES.findIndex((s) => s.id === b.stageId)
    return orderA - orderB
  })

  return (
    <div className="w-full">
      <div className={`flex gap-0.5 ${heights[size]} rounded-full overflow-hidden bg-slate-100`}>
        {sortedStages.map((stage) => {
          const colors = getStageStatusColor(stage.status)
          return (
            <button
              key={stage.stageId}
              type="button"
              onClick={() => onClick?.(stage.stageId)}
              className={`flex-1 ${colors.fill} transition-all hover:brightness-110 ${onClick ? "cursor-pointer" : "cursor-default"}`}
              title={`${getStageLabel(stage.stageId)}: ${stage.status}`}
            />
          )
        })}
      </div>
      {showLabels && (
        <div className="flex mt-1.5">
          {sortedStages.map((stage, idx) => (
            <div key={stage.stageId} className="flex-1 text-center">
              {idx % 2 === 0 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {getStageLabel(stage.stageId).slice(0, 3)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Stage Status Badge ───────────────────────────────────────────────────────

interface StageStatusBadgeProps {
  status: StageStatus
  size?: "sm" | "md"
}

export function StageStatusBadge({ status, size = "md" }: StageStatusBadgeProps) {
  const colors = getStageStatusColor(status)
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  }

  const icons: Record<StageStatus, React.ReactNode> = {
    completed: <CheckCircle className="h-3 w-3" />,
    "in-progress": <Play className="h-3 w-3" />,
    blocked: <XCircle className="h-3 w-3" />,
    skipped: <SkipForward className="h-3 w-3" />,
    "not-started": <Clock className="h-3 w-3" />,
  }

  const labels: Record<StageStatus, string> = {
    completed: "Completed",
    "in-progress": "In Progress",
    blocked: "Blocked",
    skipped: "Skipped",
    "not-started": "Not Started",
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border} ${sizes[size]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  )
}

// ─── Project Status Badge ─────────────────────────────────────────────────────

interface ProjectStatusBadgeProps {
  status: ProjectFolder["status"]
  size?: "sm" | "md"
}

export function ProjectStatusBadge({ status, size = "md" }: ProjectStatusBadgeProps) {
  const colors = getProjectStatusColor(status)
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  }

  const labels: Record<ProjectFolder["status"], string> = {
    active: "Active",
    "on-hold": "On Hold",
    completed: "Completed",
    archived: "Archived",
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colors.bg} ${colors.text} border ${colors.border} ${sizes[size]}`}>
      {labels[status]}
    </span>
  )
}

// ─── Automation Chip ──────────────────────────────────────────────────────────

interface AutomationChipProps {
  enabled: boolean
  size?: "sm" | "md"
}

export function AutomationChip({ enabled, size = "sm" }: AutomationChipProps) {
  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs",
  }

  if (enabled) {
    return (
      <span className={`inline-flex items-center gap-1 rounded font-mono font-medium bg-blue-100 text-blue-700 ${sizes[size]}`}>
        <Zap className="h-2.5 w-2.5" />
        Auto
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded font-mono font-medium bg-slate-100 text-slate-500 ${sizes[size]}`}>
      <User className="h-2.5 w-2.5" />
      Manual
    </span>
  )
}

// ─── Entity Chip ──────────────────────────────────────────────────────────────

interface EntityChipProps {
  entity: LinkedEntity
  onClick?: () => void
}

export function EntityChip({ entity, onClick }: EntityChipProps) {
  const icons: Record<LinkedEntity["type"], React.ReactNode> = {
    product: <Package className="h-3 w-3" />,
    ingredient: <Leaf className="h-3 w-3" />,
    packaging: <Box className="h-3 w-3" />,
    supplier: <Building2 className="h-3 w-3" />,
  }

  const colors: Record<LinkedEntity["type"], string> = {
    product: "bg-purple-50 text-purple-700 border-purple-200",
    ingredient: "bg-green-50 text-green-700 border-green-200",
    packaging: "bg-amber-50 text-amber-700 border-amber-200",
    supplier: "bg-blue-50 text-blue-700 border-blue-200",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border ${colors[entity.type]} hover:brightness-95 transition-colors`}
    >
      {icons[entity.type]}
      {entity.name}
    </button>
  )
}

// ─── Entity Chips Row ─────────────────────────────────────────────────────────

interface EntityChipsRowProps {
  entities: LinkedEntity[]
  maxVisible?: number
  onEntityClick?: (entity: LinkedEntity) => void
}

export function EntityChipsRow({ entities, maxVisible = 4, onEntityClick }: EntityChipsRowProps) {
  const visible = entities.slice(0, maxVisible)
  const remaining = entities.length - maxVisible

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((entity) => (
        <EntityChip key={`${entity.type}-${entity.id}`} entity={entity} onClick={() => onEntityClick?.(entity)} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-slate-500 font-medium">+{remaining} more</span>
      )}
    </div>
  )
}

// ─── Manual Action Card ───────────────────────────────────────────────────────

interface ManualActionCardProps {
  action: ManualAction
  onComplete?: (id: string) => void
  compact?: boolean
}

export function ManualActionCard({ action, onComplete, compact = false }: ManualActionCardProps) {
  const priorityColors = getPriorityColor(action.priority)
  const isOverdue = action.dueDate && new Date(action.dueDate) < new Date() && !action.completed

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-2 rounded-lg border ${isOverdue ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${priorityColors.bg} ${priorityColors.text}`}>
            {action.priority.toUpperCase()}
          </span>
          <span className="text-sm text-slate-700 truncate">{action.title}</span>
        </div>
        {action.dueDate && (
          <span className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
            {new Date(action.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`p-3 rounded-lg border ${isOverdue ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${priorityColors.bg} ${priorityColors.text}`}>
              {action.priority.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-mono">{getStageLabel(action.stageId)}</span>
          </div>
          <h4 className="text-sm font-medium text-slate-800">{action.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{action.description}</p>
          <div className="flex items-center gap-3 mt-2">
            {action.assignee && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <User className="h-3 w-3" />
                {action.assignee}
              </span>
            )}
            {action.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                <Calendar className="h-3 w-3" />
                {new Date(action.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {onComplete && !action.completed && (
          <button
            type="button"
            onClick={() => onComplete(action.id)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Automation Log Entry ─────────────────────────────────────────────────────

interface AutomationLogEntryCardProps {
  entry: AutomationLogEntry
}

export function AutomationLogEntryCard({ entry }: AutomationLogEntryCardProps) {
  const resultColors = {
    success: "text-green-600 bg-green-50 border-green-200",
    warning: "text-amber-600 bg-amber-50 border-amber-200",
    error: "text-red-600 bg-red-50 border-red-200",
  }

  const resultIcons = {
    success: <CheckCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
  }

  return (
    <div className={`p-3 rounded-lg border ${resultColors[entry.result]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{resultIcons[entry.result]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500">{getStageLabel(entry.stageId)}</span>
            <span className="text-xs text-slate-400">
              {new Date(entry.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-sm font-medium">{entry.action}</p>
          {entry.details && (
            <p className="text-xs text-slate-600 mt-1">{entry.details}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Project Folder Card ──────────────────────────────────────────────────────

interface ProjectFolderCardProps {
  project: ProjectFolder
  onSelect?: (project: ProjectFolder) => void
  expanded?: boolean
  onToggleExpand?: () => void
}

export function ProjectFolderCard({ project, onSelect, expanded = false, onToggleExpand }: ProjectFolderCardProps) {
  const statusColors = getProjectStatusColor(project.status)
  const currentStage = getCurrentStage(project.stages)
  const progress = getProjectProgress(project.stages)
  const blockedStages = project.stages.filter((s) => s.status === "blocked")
  const pendingActions = project.manualActions.filter((a) => !a.completed)

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden border-l-4 ${statusColors.accent} hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-800 truncate">{project.name}</h3>
              <ProjectStatusBadge status={project.status} size="sm" />
            </div>
            {project.brand && (
              <p className="text-sm text-slate-500">{project.brand}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {blockedStages.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200">
                <AlertCircle className="h-3 w-3" />
                {blockedStages.length} blocked
              </span>
            )}
            {onToggleExpand && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {expanded ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Progress and Current Stage */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">
              {currentStage && `Current: ${getStageLabel(currentStage.stageId)}`}
            </span>
            <span className="text-xs font-medium text-slate-600">{progress}%</span>
          </div>
          <TimelineBar stages={project.stages} size="sm" />
        </div>

        {/* Quick Info Row */}
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {project.owner}
          </span>
          {project.targetLaunchDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(project.targetLaunchDate).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            {project.linkedEntities.length} linked
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
          {/* Linked Entities */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Linked Entities</h4>
            <EntityChipsRow entities={project.linkedEntities} maxVisible={6} />
          </div>

          {/* Pending Actions */}
          {pendingActions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Pending Actions ({pendingActions.length})
              </h4>
              <div className="space-y-2">
                {pendingActions.slice(0, 3).map((action) => (
                  <ManualActionCard key={action.id} action={action} compact />
                ))}
                {pendingActions.length > 3 && (
                  <p className="text-xs text-slate-500">+{pendingActions.length - 3} more actions</p>
                )}
              </div>
            </div>
          )}

          {/* Recent Automation */}
          {project.automationLog.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Activity</h4>
              <div className="space-y-2">
                {project.automationLog.slice(0, 2).map((entry) => (
                  <AutomationLogEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <button
            type="button"
            onClick={() => onSelect?.(project)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            View Project Details
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Stage Card ───────────────────────────────────────────────────────────────

interface StageCardProps {
  stage: StageProgress
  projectName?: string
  onStatusChange?: (stageId: StageId, status: StageStatus) => void
  showDetails?: boolean
}

export function StageCard({ stage, projectName, onStatusChange, showDetails = false }: StageCardProps) {
  const colors = getStageStatusColor(stage.status)

  return (
    <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-semibold text-slate-700">{getStageLabel(stage.stageId)}</span>
            <AutomationChip enabled={stage.automationEnabled} />
          </div>
          {projectName && (
            <p className="text-xs text-slate-500">{projectName}</p>
          )}
          <div className="mt-2">
            <StageStatusBadge status={stage.status} size="sm" />
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-200/50 space-y-2 text-xs text-slate-500">
          {stage.startDate && (
            <p>Started: {new Date(stage.startDate).toLocaleDateString()}</p>
          )}
          {stage.completedDate && (
            <p>Completed: {new Date(stage.completedDate).toLocaleDateString()}</p>
          )}
          {stage.assignee && (
            <p className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {stage.assignee}
            </p>
          )}
          {stage.blockedReason && (
            <p className="text-red-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {stage.blockedReason}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

interface StatsCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  color?: "default" | "success" | "warning" | "danger"
}

export function StatsCard({ label, value, icon, trend, color = "default" }: StatsCardProps) {
  const colorStyles = {
    default: "bg-slate-50 border-slate-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-amber-50 border-amber-200",
    danger: "bg-red-50 border-red-200",
  }

  const iconColors = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
  }

  return (
    <div className={`p-4 rounded-xl border ${colorStyles[color]}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  )
}
