"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  GanttChart,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Pause,
  Play,
  X,
  Zap,
  ArrowLeft,
  FileText,
  Leaf,
  Box,
  Building2,
  Settings,
  AlertTriangle,
  MoreVertical,
  ExternalLink,
  Archive,
  Trash2,
  Copy,
} from "lucide-react"
import {
  type ProjectFolder,
  type StageProgress,
  type StageId,
  type LinkedEntity,
  mockProjects,
  WORKFLOW_STAGES,
  getStageLabel,
  getStageStatusColor,
  getProjectStatusColor,
  getProjectProgress,
  getCurrentStage,
  getBlockedStagesCount,
  getPendingManualActionsCount,
  getActiveProjects,
  getProjectsNearLaunch,
} from "@/lib/workflows-data"
import {
  TimelineBar,
  ProjectFolderCard,
  ProjectStatusBadge,
  StageStatusBadge,
  AutomationChip,
  EntityChipsRow,
  ManualActionCard,
  AutomationLogEntryCard,
  StageCard,
  StatsCard,
} from "@/components/workflows/workflow-components"
import { NewProjectModal } from "@/components/workflows/new-project-modal"

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "board" | "list" | "timeline"
type StatusFilter = "all" | "active" | "on-hold" | "completed" | "archived"

// ─── Project Detail View ──────────────────────────────────────────────────────

interface ProjectDetailViewProps {
  project: ProjectFolder
  onBack: () => void
  onNavigate?: (page: string, entityId?: string) => void
}

function ProjectDetailView({ project, onBack, onNavigate }: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "stages" | "entities" | "activity">("overview")
  const statusColors = getProjectStatusColor(project.status)
  const currentStage = getCurrentStage(project.stages)
  const progress = getProjectProgress(project.stages)
  const pendingActions = project.manualActions.filter((a) => !a.completed)

  const handleEntityClick = (entity: LinkedEntity) => {
    if (entity.type === "product") {
      onNavigate?.("products", entity.id)
    } else if (entity.type === "ingredient") {
      onNavigate?.("ingredients", entity.id)
    } else if (entity.type === "packaging") {
      onNavigate?.("packaging", entity.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            {project.brand && (
              <p className="text-sm text-slate-500 mt-1">{project.brand}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={`p-5 rounded-xl border ${statusColors.border} ${statusColors.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Overall Progress</p>
            <p className="text-3xl font-bold text-slate-800">{progress}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Current Stage</p>
            <p className="font-semibold text-slate-800">{currentStage ? getStageLabel(currentStage.stageId) : "N/A"}</p>
          </div>
        </div>
        <TimelineBar stages={project.stages} showLabels size="lg" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { id: "overview", label: "Overview" },
          { id: "stages", label: "Stages" },
          { id: "entities", label: "Linked Entities" },
          { id: "activity", label: "Activity Log" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-slate-800 text-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 cols */}
        <div className="col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Description */}
              {project.description && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
              )}

              {/* Pending Actions */}
              {pendingActions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">
                    Pending Actions ({pendingActions.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingActions.map((action) => (
                      <ManualActionCard key={action.id} action={action} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {project.automationLog.slice(0, 5).map((entry) => (
                    <AutomationLogEntryCard key={entry.id} entry={entry} />
                  ))}
                  {project.automationLog.length === 0 && (
                    <p className="text-sm text-slate-500">No activity yet</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "stages" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="space-y-3">
                {project.stages.map((stage) => (
                  <StageCard key={stage.stageId} stage={stage} showDetails />
                ))}
              </div>
            </div>
          )}

          {activeTab === "entities" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="grid grid-cols-2 gap-4">
                {project.linkedEntities.map((entity) => {
                  const icons: Record<LinkedEntity["type"], React.ReactNode> = {
                    product: <Package className="h-5 w-5" />,
                    ingredient: <Leaf className="h-5 w-5" />,
                    packaging: <Box className="h-5 w-5" />,
                    supplier: <Building2 className="h-5 w-5" />,
                  }
                  const colors: Record<LinkedEntity["type"], string> = {
                    product: "bg-purple-50 border-purple-200 text-purple-700",
                    ingredient: "bg-green-50 border-green-200 text-green-700",
                    packaging: "bg-amber-50 border-amber-200 text-amber-700",
                    supplier: "bg-blue-50 border-blue-200 text-blue-700",
                  }
                  return (
                    <button
                      key={`${entity.type}-${entity.id}`}
                      type="button"
                      onClick={() => handleEntityClick(entity)}
                      className={`flex items-center gap-3 p-4 rounded-xl border ${colors[entity.type]} hover:brightness-95 transition-colors text-left`}
                    >
                      {icons[entity.type]}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entity.name}</p>
                        <p className="text-xs opacity-75 capitalize">{entity.type}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-50" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="space-y-3">
                {project.automationLog.map((entry) => (
                  <AutomationLogEntryCard key={entry.id} entry={entry} />
                ))}
                {project.automationLog.length === 0 && (
                  <p className="text-sm text-slate-500">No activity yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-4">
          {/* Project Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">Project Info</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Owner</span>
                <span className="font-medium text-slate-800">{project.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Team</span>
                <span className="font-medium text-slate-800">{project.team.length} members</span>
              </div>
              {project.targetLaunchDate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Target Launch</span>
                  <span className="font-medium text-slate-800">
                    {new Date(project.targetLaunchDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Markets</span>
                <span className="font-medium text-slate-800">{project.targetMarkets.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Automation</span>
                <span className="font-medium text-slate-800 capitalize">{project.automationProfile}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
                Duplicate Project
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Archive className="h-4 w-4" />
                Archive Project
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Board View ───────────────────────────────────────────────────────────────

interface BoardViewProps {
  projects: ProjectFolder[]
  onSelectProject: (project: ProjectFolder) => void
}

function BoardView({ projects, onSelectProject }: BoardViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Group by status
  const grouped = useMemo(() => {
    const groups: Record<ProjectFolder["status"], ProjectFolder[]> = {
      active: [],
      "on-hold": [],
      completed: [],
      archived: [],
    }
    for (const p of projects) {
      groups[p.status].push(p)
    }
    return groups
  }, [projects])

  return (
    <div className="space-y-8">
      {/* Active Projects */}
      {grouped.active.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Active Projects</h2>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {grouped.active.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {grouped.active.map((project) => (
              <ProjectFolderCard
                key={project.id}
                project={project}
                expanded={expandedIds.has(project.id)}
                onToggleExpand={() => toggleExpand(project.id)}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        </div>
      )}

      {/* On Hold Projects */}
      {grouped["on-hold"].length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">On Hold</h2>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              {grouped["on-hold"].length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {grouped["on-hold"].map((project) => (
              <ProjectFolderCard
                key={project.id}
                project={project}
                expanded={expandedIds.has(project.id)}
                onToggleExpand={() => toggleExpand(project.id)}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {grouped.completed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Completed</h2>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              {grouped.completed.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {grouped.completed.map((project) => (
              <ProjectFolderCard
                key={project.id}
                project={project}
                expanded={expandedIds.has(project.id)}
                onToggleExpand={() => toggleExpand(project.id)}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── List View ────────────────────────────────────────────────────────────────

interface ListViewProps {
  projects: ProjectFolder[]
  onSelectProject: (project: ProjectFolder) => void
}

function ListView({ projects, onSelectProject }: ListViewProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stage</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Launch Date</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const currentStage = getCurrentStage(project.stages)
            const progress = getProjectProgress(project.stages)
            const statusColors = getProjectStatusColor(project.status)
            
            return (
              <tr
                key={project.id}
                className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer border-l-4 ${statusColors.accent}`}
                onClick={() => onSelectProject(project)}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-slate-800">{project.name}</p>
                    {project.brand && <p className="text-xs text-slate-500">{project.brand}</p>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <ProjectStatusBadge status={project.status} size="sm" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <TimelineBar stages={project.stages} size="sm" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-slate-700 font-mono">
                    {currentStage ? getStageLabel(currentStage.stageId) : "-"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-slate-600">{project.owner}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-slate-600">
                    {project.targetLaunchDate ? new Date(project.targetLaunchDate).toLocaleDateString() : "-"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Timeline View (Gantt) ────────────────────────────────────────────────────

interface TimelineViewProps {
  projects: ProjectFolder[]
  onSelectProject: (project: ProjectFolder) => void
}

function TimelineView({ projects, onSelectProject }: TimelineViewProps) {
  // Generate months for the next 6 months
  const months = useMemo(() => {
    const result = []
    const now = new Date()
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      result.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        start: date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      })
    }
    return result
  }, [])

  const totalDays = useMemo(() => {
    const start = months[0].start
    const end = months[months.length - 1].end
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [months])

  const getProjectPosition = (project: ProjectFolder) => {
    const start = months[0].start
    const end = months[months.length - 1].end
    
    const projectStart = project.createdAt ? new Date(project.createdAt) : start
    const projectEnd = project.targetLaunchDate ? new Date(project.targetLaunchDate) : end
    
    const startOffset = Math.max(0, (projectStart.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
    const endOffset = Math.min(100, (projectEnd.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
    const width = endOffset - startOffset

    return { left: `${startOffset}%`, width: `${Math.max(5, width)}%` }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header with months */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <div className="w-64 flex-shrink-0 p-3 border-r border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</span>
        </div>
        <div className="flex-1 flex">
          {months.map((month) => (
            <div
              key={month.key}
              className="flex-1 p-3 text-center border-r border-slate-100 last:border-r-0"
            >
              <span className="text-xs font-medium text-slate-600">{month.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project rows */}
      <div>
        {projects.map((project) => {
          const statusColors = getProjectStatusColor(project.status)
          const position = getProjectPosition(project)
          const progress = getProjectProgress(project.stages)

          return (
            <div
              key={project.id}
              className={`flex border-b border-slate-100 hover:bg-slate-50 cursor-pointer border-l-4 ${statusColors.accent}`}
              onClick={() => onSelectProject(project)}
            >
              <div className="w-64 flex-shrink-0 p-3 border-r border-slate-100">
                <p className="font-medium text-slate-800 text-sm truncate">{project.name}</p>
                <p className="text-xs text-slate-500">{project.owner}</p>
              </div>
              <div className="flex-1 relative h-16 flex items-center px-2">
                {/* Timeline bar */}
                <div
                  className="absolute h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                  style={{ left: position.left, width: position.width }}
                >
                  {/* Progress fill */}
                  <div
                    className={`h-full ${statusColors.bg.replace("50", "200")}`}
                    style={{ width: `${progress}%` }}
                  />
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-slate-700 truncate">{progress}%</span>
                  </div>
                </div>
                {/* Launch date marker */}
                {project.targetLaunchDate && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-10 bg-slate-400"
                    style={{ left: position.width === "100%" ? "calc(100% - 2px)" : `calc(${position.left} + ${position.width})` }}
                    title={`Launch: ${new Date(project.targetLaunchDate).toLocaleDateString()}`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Workflows Page ──────────────────────────────────────────────────────

interface WorkflowsPageProps {
  onNavigate?: (page: string, entityId?: string) => void
}

export function WorkflowsPage({ onNavigate }: WorkflowsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("board")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedProject, setSelectedProject] = useState<ProjectFolder | null>(null)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  // Stats
  const activeCount = getActiveProjects().length
  const blockedCount = getBlockedStagesCount()
  const pendingActionsCount = getPendingManualActionsCount()
  const nearLaunchCount = getProjectsNearLaunch(30).length

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(searchLower)
        const matchesBrand = p.brand?.toLowerCase().includes(searchLower)
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(searchLower))
        if (!matchesName && !matchesBrand && !matchesTags) return false
      }

      // Status filter
      if (statusFilter !== "all" && p.status !== statusFilter) return false

      return true
    })
  }, [search, statusFilter])

  // If a project is selected, show detail view
  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Workflows</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your product development projects from ideation to launch
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          label="Active Projects"
          value={activeCount}
          icon={<Play className="h-5 w-5" />}
          color="default"
        />
        <StatsCard
          label="Blocked Stages"
          value={blockedCount}
          icon={<AlertCircle className="h-5 w-5" />}
          color={blockedCount > 0 ? "danger" : "default"}
        />
        <StatsCard
          label="Pending Actions"
          value={pendingActionsCount}
          icon={<Clock className="h-5 w-5" />}
          color={pendingActionsCount > 5 ? "warning" : "default"}
        />
        <StatsCard
          label="Launching in 30 days"
          value={nearLaunchCount}
          icon={<Calendar className="h-5 w-5" />}
          color={nearLaunchCount > 0 ? "success" : "default"}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode("board")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "board" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
            }`}
            title="Board View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("timeline")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "timeline" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
            }`}
            title="Timeline View"
          >
            <GanttChart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === "board" && (
        <BoardView projects={filteredProjects} onSelectProject={setSelectedProject} />
      )}
      {viewMode === "list" && (
        <ListView projects={filteredProjects} onSelectProject={setSelectedProject} />
      )}
      {viewMode === "timeline" && (
        <TimelineView projects={filteredProjects} onSelectProject={setSelectedProject} />
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No projects found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first project to get started"}
          </p>
          {!search && statusFilter === "all" && (
            <button
              type="button"
              onClick={() => setShowNewProjectModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          )}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={(data) => {
          console.log("[v0] New project data:", data)
          setShowNewProjectModal(false)
        }}
      />
    </div>
  )
}
