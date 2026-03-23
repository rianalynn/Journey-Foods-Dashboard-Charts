// ─── Workflows Data Types and Mock Data ───────────────────────────────────────

// ─── Stage Definitions ────────────────────────────────────────────────────────

export const WORKFLOW_STAGES = [
  { id: "ideation", label: "Ideation", order: 1 },
  { id: "formulation", label: "Formulation", order: 2 },
  { id: "costing", label: "Costing", order: 3 },
  { id: "sourcing", label: "Sourcing", order: 4 },
  { id: "regulatory", label: "Regulatory", order: 5 },
  { id: "testing", label: "Testing", order: 6 },
  { id: "packaging", label: "Packaging", order: 7 },
  { id: "labeling", label: "Labeling", order: 8 },
  { id: "production", label: "Production", order: 9 },
  { id: "launch", label: "Launch", order: 10 },
  { id: "monitoring", label: "Monitoring", order: 11 },
] as const

export type StageId = (typeof WORKFLOW_STAGES)[number]["id"]

// ─── Types ────────────────────────────────────────────────────────────────────

export type StageStatus = "not-started" | "in-progress" | "completed" | "blocked" | "skipped"

export interface StageProgress {
  stageId: StageId
  status: StageStatus
  startDate?: string
  endDate?: string
  completedDate?: string
  assignee?: string
  notes?: string
  automationEnabled: boolean
  blockedReason?: string
}

export interface LinkedEntity {
  type: "product" | "ingredient" | "packaging" | "supplier"
  id: string
  name: string
}

export interface AutomationLogEntry {
  id: string
  timestamp: string
  stageId: StageId
  action: string
  result: "success" | "warning" | "error"
  details?: string
}

export interface ManualAction {
  id: string
  stageId: StageId
  title: string
  description: string
  dueDate?: string
  assignee?: string
  priority: "low" | "medium" | "high" | "critical"
  completed: boolean
}

export interface ProjectFolder {
  id: string
  name: string
  brand?: string
  description?: string
  status: "active" | "on-hold" | "completed" | "archived"
  createdAt: string
  updatedAt: string
  targetLaunchDate?: string
  targetMarkets: string[] // region codes from compliance-data
  owner: string
  team: string[]
  stages: StageProgress[]
  linkedEntities: LinkedEntity[]
  automationProfile: "full" | "partial" | "manual"
  automationLog: AutomationLogEntry[]
  manualActions: ManualAction[]
  tags: string[]
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getStageLabel(stageId: StageId): string {
  return WORKFLOW_STAGES.find((s) => s.id === stageId)?.label || stageId
}

export function getStageOrder(stageId: StageId): number {
  return WORKFLOW_STAGES.find((s) => s.id === stageId)?.order || 0
}

export function getCurrentStage(stages: StageProgress[]): StageProgress | undefined {
  // Find the first in-progress stage, or the first not-started if none in progress
  const inProgress = stages.find((s) => s.status === "in-progress")
  if (inProgress) return inProgress
  
  const notStarted = stages.filter((s) => s.status === "not-started")
  if (notStarted.length > 0) {
    return notStarted.sort((a, b) => getStageOrder(a.stageId) - getStageOrder(b.stageId))[0]
  }
  
  return stages[stages.length - 1]
}

export function getProjectProgress(stages: StageProgress[]): number {
  const completed = stages.filter((s) => s.status === "completed" || s.status === "skipped").length
  return Math.round((completed / stages.length) * 100)
}

export function getStageStatusColor(status: StageStatus): { bg: string; text: string; border: string; fill: string } {
  switch (status) {
    case "completed":
      return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", fill: "bg-green-500" }
    case "in-progress":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", fill: "bg-blue-500" }
    case "blocked":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", fill: "bg-red-500" }
    case "skipped":
      return { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", fill: "bg-slate-300" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-200", fill: "bg-slate-200" }
  }
}

export function getProjectStatusColor(status: ProjectFolder["status"]): { bg: string; text: string; border: string; accent: string } {
  switch (status) {
    case "active":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", accent: "border-l-blue-500" }
    case "on-hold":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", accent: "border-l-amber-500" }
    case "completed":
      return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", accent: "border-l-green-500" }
    case "archived":
      return { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", accent: "border-l-slate-400" }
  }
}

export function getPriorityColor(priority: ManualAction["priority"]): { bg: string; text: string } {
  switch (priority) {
    case "critical":
      return { bg: "bg-red-100", text: "text-red-700" }
    case "high":
      return { bg: "bg-orange-100", text: "text-orange-700" }
    case "medium":
      return { bg: "bg-amber-100", text: "text-amber-700" }
    case "low":
      return { bg: "bg-slate-100", text: "text-slate-600" }
  }
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

function createDefaultStages(overrides: Partial<Record<StageId, Partial<StageProgress>>> = {}): StageProgress[] {
  return WORKFLOW_STAGES.map((stage) => ({
    stageId: stage.id,
    status: "not-started" as StageStatus,
    automationEnabled: true,
    ...overrides[stage.id],
  }))
}

export const mockProjects: ProjectFolder[] = [
  {
    id: "proj-1",
    name: "Plant-Based Protein Bar",
    brand: "GreenFuel",
    description: "High-protein plant-based snack bar targeting fitness enthusiasts",
    status: "active",
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2026-03-20T14:30:00Z",
    targetLaunchDate: "2026-06-01",
    targetMarkets: ["NA", "EU"],
    owner: "Sarah Chen",
    team: ["Mike Johnson", "Lisa Park", "David Kim"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2025-11-20", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2025-12-15", automationEnabled: true },
      costing: { status: "completed", completedDate: "2026-01-10", automationEnabled: true },
      sourcing: { status: "completed", completedDate: "2026-02-01", automationEnabled: true },
      regulatory: { status: "in-progress", startDate: "2026-02-15", automationEnabled: true },
      testing: { status: "not-started", automationEnabled: true },
      packaging: { status: "not-started", automationEnabled: false },
      labeling: { status: "not-started", automationEnabled: true },
      production: { status: "not-started", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "1", name: "Plant-Based Protein Bar" },
      { type: "ingredient", id: "1", name: "Pea Protein Isolate" },
      { type: "ingredient", id: "2", name: "Organic Oat Flour" },
      { type: "packaging", id: "pkg-1", name: "Recyclable Flow Wrap" },
    ],
    automationProfile: "partial",
    automationLog: [
      { id: "log-1", timestamp: "2026-03-20T10:00:00Z", stageId: "regulatory", action: "FDA compliance check initiated", result: "success" },
      { id: "log-2", timestamp: "2026-03-19T15:30:00Z", stageId: "sourcing", action: "Supplier verification completed", result: "success" },
      { id: "log-3", timestamp: "2026-03-18T09:00:00Z", stageId: "regulatory", action: "EU allergen labeling check", result: "warning", details: "Review recommended for sesame declaration" },
    ],
    manualActions: [
      { id: "ma-1", stageId: "regulatory", title: "Review sesame allergen labeling", description: "Verify sesame cross-contact statement meets EU requirements", dueDate: "2026-03-25", assignee: "Lisa Park", priority: "high", completed: false },
      { id: "ma-2", stageId: "packaging", title: "Approve final packaging artwork", description: "Sign off on production-ready packaging design", dueDate: "2026-04-01", assignee: "Sarah Chen", priority: "medium", completed: false },
    ],
    tags: ["plant-based", "protein", "snack", "fitness"],
  },
  {
    id: "proj-2",
    name: "Immunity Boost Gummies",
    brand: "VitalKids",
    description: "Children's vitamin gummies with elderberry and zinc",
    status: "active",
    createdAt: "2025-10-01T09:00:00Z",
    updatedAt: "2026-03-21T11:00:00Z",
    targetLaunchDate: "2026-04-15",
    targetMarkets: ["NA"],
    owner: "Mike Johnson",
    team: ["Sarah Chen", "Emily Wong"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2025-10-15", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2025-11-20", automationEnabled: true },
      costing: { status: "completed", completedDate: "2025-12-10", automationEnabled: true },
      sourcing: { status: "completed", completedDate: "2026-01-15", automationEnabled: true },
      regulatory: { status: "completed", completedDate: "2026-02-20", automationEnabled: true },
      testing: { status: "completed", completedDate: "2026-03-01", automationEnabled: true },
      packaging: { status: "completed", completedDate: "2026-03-10", automationEnabled: false },
      labeling: { status: "in-progress", startDate: "2026-03-15", automationEnabled: true },
      production: { status: "not-started", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "2", name: "Immunity Boost Gummies" },
      { type: "ingredient", id: "3", name: "Elderberry Extract" },
      { type: "ingredient", id: "4", name: "Zinc Citrate" },
    ],
    automationProfile: "full",
    automationLog: [
      { id: "log-4", timestamp: "2026-03-21T10:00:00Z", stageId: "labeling", action: "Nutrition facts panel generated", result: "success" },
      { id: "log-5", timestamp: "2026-03-20T14:00:00Z", stageId: "labeling", action: "Allergen statement validated", result: "success" },
    ],
    manualActions: [
      { id: "ma-3", stageId: "labeling", title: "Verify pediatric dosage claims", description: "Confirm vitamin dosage claims are appropriate for ages 4-12", dueDate: "2026-03-23", assignee: "Emily Wong", priority: "high", completed: false },
    ],
    tags: ["vitamins", "kids", "immunity", "gummies"],
  },
  {
    id: "proj-3",
    name: "Keto-Friendly Bread Mix",
    brand: "LowCarb Living",
    description: "Low-carb bread mix with almond and coconut flour",
    status: "on-hold",
    createdAt: "2025-09-01T08:00:00Z",
    updatedAt: "2026-03-10T16:00:00Z",
    targetLaunchDate: "2026-08-01",
    targetMarkets: ["NA", "UK"],
    owner: "David Kim",
    team: ["Sarah Chen"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2025-09-15", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2025-10-20", automationEnabled: true },
      costing: { status: "completed", completedDate: "2025-11-15", automationEnabled: true },
      sourcing: { status: "blocked", startDate: "2025-12-01", automationEnabled: true, blockedReason: "Almond flour supplier capacity constraints" },
      regulatory: { status: "not-started", automationEnabled: true },
      testing: { status: "not-started", automationEnabled: true },
      packaging: { status: "not-started", automationEnabled: false },
      labeling: { status: "not-started", automationEnabled: true },
      production: { status: "not-started", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "3", name: "Keto-Friendly Bread Mix" },
      { type: "ingredient", id: "5", name: "Almond Flour" },
      { type: "ingredient", id: "6", name: "Coconut Flour" },
    ],
    automationProfile: "partial",
    automationLog: [
      { id: "log-6", timestamp: "2026-03-10T16:00:00Z", stageId: "sourcing", action: "Supplier capacity check", result: "error", details: "Primary supplier cannot meet volume requirements until Q3" },
    ],
    manualActions: [
      { id: "ma-4", stageId: "sourcing", title: "Identify alternative almond flour suppliers", description: "Research and qualify backup suppliers for almond flour", dueDate: "2026-03-30", assignee: "David Kim", priority: "critical", completed: false },
    ],
    tags: ["keto", "low-carb", "baking", "bread"],
  },
  {
    id: "proj-4",
    name: "Probiotic Yogurt Smoothie",
    brand: "GutHealth+",
    description: "Drinkable yogurt with added probiotics and fiber",
    status: "active",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-03-22T09:00:00Z",
    targetLaunchDate: "2026-07-01",
    targetMarkets: ["NA", "EU", "UK"],
    owner: "Lisa Park",
    team: ["Mike Johnson", "Sarah Chen", "David Kim"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2026-01-25", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2026-02-15", automationEnabled: true },
      costing: { status: "in-progress", startDate: "2026-03-01", automationEnabled: true },
      sourcing: { status: "not-started", automationEnabled: true },
      regulatory: { status: "not-started", automationEnabled: true },
      testing: { status: "not-started", automationEnabled: true },
      packaging: { status: "not-started", automationEnabled: false },
      labeling: { status: "not-started", automationEnabled: true },
      production: { status: "not-started", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "4", name: "Probiotic Yogurt Smoothie" },
      { type: "ingredient", id: "7", name: "Lactobacillus acidophilus" },
      { type: "ingredient", id: "8", name: "Inulin Fiber" },
    ],
    automationProfile: "full",
    automationLog: [
      { id: "log-7", timestamp: "2026-03-22T09:00:00Z", stageId: "costing", action: "Ingredient cost analysis started", result: "success" },
      { id: "log-8", timestamp: "2026-03-21T14:00:00Z", stageId: "formulation", action: "Stability testing passed", result: "success" },
    ],
    manualActions: [],
    tags: ["probiotics", "dairy", "gut-health", "smoothie"],
  },
  {
    id: "proj-5",
    name: "Organic Baby Food Pouches",
    brand: "TinyBites",
    description: "Stage 2 organic fruit and vegetable purees",
    status: "active",
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2026-03-21T16:00:00Z",
    targetLaunchDate: "2026-05-01",
    targetMarkets: ["NA", "EU"],
    owner: "Emily Wong",
    team: ["Lisa Park", "Mike Johnson"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2025-08-15", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2025-09-20", automationEnabled: true },
      costing: { status: "completed", completedDate: "2025-10-15", automationEnabled: true },
      sourcing: { status: "completed", completedDate: "2025-11-20", automationEnabled: true },
      regulatory: { status: "completed", completedDate: "2026-01-15", automationEnabled: true },
      testing: { status: "completed", completedDate: "2026-02-10", automationEnabled: true },
      packaging: { status: "completed", completedDate: "2026-02-28", automationEnabled: false },
      labeling: { status: "completed", completedDate: "2026-03-15", automationEnabled: true },
      production: { status: "in-progress", startDate: "2026-03-20", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "5", name: "Apple Carrot Puree" },
      { type: "product", id: "6", name: "Banana Spinach Blend" },
      { type: "ingredient", id: "9", name: "Organic Apple Puree" },
      { type: "ingredient", id: "10", name: "Organic Carrot Puree" },
      { type: "packaging", id: "pkg-2", name: "BPA-Free Spouted Pouch" },
    ],
    automationProfile: "partial",
    automationLog: [
      { id: "log-9", timestamp: "2026-03-21T16:00:00Z", stageId: "production", action: "Production batch #1 scheduled", result: "success" },
      { id: "log-10", timestamp: "2026-03-20T10:00:00Z", stageId: "production", action: "Co-packer verification completed", result: "success" },
    ],
    manualActions: [
      { id: "ma-5", stageId: "production", title: "Approve first production batch", description: "QA sign-off on initial production run samples", dueDate: "2026-03-28", assignee: "Emily Wong", priority: "high", completed: false },
      { id: "ma-6", stageId: "launch", title: "Coordinate retailer onboarding", description: "Finalize distribution agreements with key retailers", dueDate: "2026-04-15", assignee: "Lisa Park", priority: "medium", completed: false },
    ],
    tags: ["baby-food", "organic", "puree", "stage-2"],
  },
  {
    id: "proj-6",
    name: "Collagen Beauty Water",
    brand: "GlowUp",
    description: "Flavored water enhanced with marine collagen peptides",
    status: "completed",
    createdAt: "2025-03-01T09:00:00Z",
    updatedAt: "2026-02-15T12:00:00Z",
    targetLaunchDate: "2026-02-01",
    targetMarkets: ["NA"],
    owner: "Sarah Chen",
    team: ["Lisa Park"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2025-03-15", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2025-04-20", automationEnabled: true },
      costing: { status: "completed", completedDate: "2025-05-15", automationEnabled: true },
      sourcing: { status: "completed", completedDate: "2025-06-20", automationEnabled: true },
      regulatory: { status: "completed", completedDate: "2025-08-15", automationEnabled: true },
      testing: { status: "completed", completedDate: "2025-09-30", automationEnabled: true },
      packaging: { status: "completed", completedDate: "2025-10-30", automationEnabled: false },
      labeling: { status: "completed", completedDate: "2025-11-30", automationEnabled: true },
      production: { status: "completed", completedDate: "2026-01-15", automationEnabled: false },
      launch: { status: "completed", completedDate: "2026-02-01", automationEnabled: false },
      monitoring: { status: "completed", completedDate: "2026-02-15", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "7", name: "Collagen Beauty Water - Berry" },
      { type: "product", id: "8", name: "Collagen Beauty Water - Citrus" },
      { type: "ingredient", id: "11", name: "Marine Collagen Peptides" },
    ],
    automationProfile: "full",
    automationLog: [
      { id: "log-11", timestamp: "2026-02-15T12:00:00Z", stageId: "monitoring", action: "30-day post-launch analytics compiled", result: "success" },
    ],
    manualActions: [],
    tags: ["collagen", "beauty", "beverage", "wellness"],
  },
  {
    id: "proj-7",
    name: "Sports Recovery Powder",
    brand: "AthleteFuel",
    description: "Post-workout recovery blend with BCAAs and electrolytes",
    status: "active",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-03-22T11:00:00Z",
    targetLaunchDate: "2026-09-01",
    targetMarkets: ["NA", "EU", "APAC"],
    owner: "Mike Johnson",
    team: ["David Kim", "Emily Wong"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2026-02-10", automationEnabled: true },
      formulation: { status: "in-progress", startDate: "2026-02-20", automationEnabled: true },
      costing: { status: "not-started", automationEnabled: true },
      sourcing: { status: "not-started", automationEnabled: true },
      regulatory: { status: "not-started", automationEnabled: true },
      testing: { status: "not-started", automationEnabled: true },
      packaging: { status: "not-started", automationEnabled: false },
      labeling: { status: "not-started", automationEnabled: true },
      production: { status: "not-started", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "9", name: "Sports Recovery Powder" },
      { type: "ingredient", id: "12", name: "BCAA Complex" },
      { type: "ingredient", id: "13", name: "Electrolyte Blend" },
    ],
    automationProfile: "partial",
    automationLog: [
      { id: "log-12", timestamp: "2026-03-22T11:00:00Z", stageId: "formulation", action: "Flavor profile testing initiated", result: "success" },
    ],
    manualActions: [
      { id: "ma-7", stageId: "formulation", title: "Select final flavor variants", description: "Choose 3 flavors for initial launch based on consumer testing", dueDate: "2026-04-01", assignee: "Mike Johnson", priority: "medium", completed: false },
    ],
    tags: ["sports", "recovery", "protein", "fitness"],
  },
  {
    id: "proj-8",
    name: "Functional Mushroom Coffee",
    brand: "MindBrew",
    description: "Coffee blend with lion's mane and chaga mushroom extracts",
    status: "active",
    createdAt: "2026-01-01T09:00:00Z",
    updatedAt: "2026-03-20T14:00:00Z",
    targetLaunchDate: "2026-08-15",
    targetMarkets: ["NA", "UK"],
    owner: "David Kim",
    team: ["Sarah Chen", "Lisa Park"],
    stages: createDefaultStages({
      ideation: { status: "completed", completedDate: "2026-01-10", automationEnabled: true },
      formulation: { status: "completed", completedDate: "2026-02-15", automationEnabled: true },
      costing: { status: "completed", completedDate: "2026-03-01", automationEnabled: true },
      sourcing: { status: "in-progress", startDate: "2026-03-10", automationEnabled: true },
      regulatory: { status: "not-started", automationEnabled: true },
      testing: { status: "not-started", automationEnabled: true },
      packaging: { status: "not-started", automationEnabled: false },
      labeling: { status: "not-started", automationEnabled: true },
      production: { status: "not-started", automationEnabled: false },
      launch: { status: "not-started", automationEnabled: false },
      monitoring: { status: "not-started", automationEnabled: true },
    }),
    linkedEntities: [
      { type: "product", id: "10", name: "Functional Mushroom Coffee" },
      { type: "ingredient", id: "14", name: "Lion's Mane Extract" },
      { type: "ingredient", id: "15", name: "Chaga Mushroom Powder" },
      { type: "supplier", id: "sup-1", name: "OrganicMush Co." },
    ],
    automationProfile: "full",
    automationLog: [
      { id: "log-13", timestamp: "2026-03-20T14:00:00Z", stageId: "sourcing", action: "Supplier qualification started", result: "success" },
      { id: "log-14", timestamp: "2026-03-18T10:00:00Z", stageId: "costing", action: "Target cost achieved", result: "success" },
    ],
    manualActions: [
      { id: "ma-8", stageId: "sourcing", title: "Verify mushroom extract certifications", description: "Confirm organic and quality certifications for mushroom suppliers", dueDate: "2026-04-05", assignee: "David Kim", priority: "high", completed: false },
    ],
    tags: ["coffee", "mushroom", "functional", "nootropic"],
  },
]

// ─── Utility Functions ────────────────────────────────────────────────────────

export function getProjectsByStatus(status: ProjectFolder["status"]): ProjectFolder[] {
  return mockProjects.filter((p) => p.status === status)
}

export function getProjectById(id: string): ProjectFolder | undefined {
  return mockProjects.find((p) => p.id === id)
}

export function getActiveProjects(): ProjectFolder[] {
  return mockProjects.filter((p) => p.status === "active")
}

export function getBlockedStagesCount(): number {
  return mockProjects.reduce((count, project) => {
    return count + project.stages.filter((s) => s.status === "blocked").length
  }, 0)
}

export function getPendingManualActionsCount(): number {
  return mockProjects.reduce((count, project) => {
    return count + project.manualActions.filter((a) => !a.completed).length
  }, 0)
}

export function getProjectsNearLaunch(daysAhead: number = 30): ProjectFolder[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead)
  
  return mockProjects.filter((p) => {
    if (!p.targetLaunchDate || p.status === "completed" || p.status === "archived") return false
    const launchDate = new Date(p.targetLaunchDate)
    return launchDate <= cutoffDate && launchDate >= new Date()
  })
}
