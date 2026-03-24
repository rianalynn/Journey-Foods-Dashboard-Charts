"use client"

import { useState } from "react"
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
  Leaf,
  Box,
  Building2,
  Zap,
  User,
  Calendar,
  Users,
  Globe,
  Settings,
  FileText,
  AlertCircle,
} from "lucide-react"
import {
  type StageId,
  type LinkedEntity,
  WORKFLOW_STAGES,
  getStageLabel,
} from "@/lib/workflows-data"
import { regions, type Region } from "@/lib/compliance-data"
import { TimelineBar } from "./workflow-components"

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewProjectData {
  name: string
  brand: string
  description: string
  targetMarkets: string[]
  automationProfile: "full" | "partial" | "manual"
  stageAutomation: Record<StageId, boolean>
  linkedEntities: LinkedEntity[]
  owner: string
  team: string[]
  targetLaunchDate: string
  tags: string[]
}

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewProjectData) => void
}

// ─── Mock Data for Entity Selection ───────────────────────────────────────────

const mockAvailableEntities: LinkedEntity[] = [
  { type: "product", id: "1", name: "Plant-Based Protein Bar" },
  { type: "product", id: "2", name: "Immunity Boost Gummies" },
  { type: "product", id: "3", name: "Keto-Friendly Bread Mix" },
  { type: "ingredient", id: "1", name: "Pea Protein Isolate" },
  { type: "ingredient", id: "2", name: "Organic Oat Flour" },
  { type: "ingredient", id: "3", name: "Elderberry Extract" },
  { type: "ingredient", id: "4", name: "Zinc Citrate" },
  { type: "packaging", id: "pkg-1", name: "Recyclable Flow Wrap" },
  { type: "packaging", id: "pkg-2", name: "BPA-Free Spouted Pouch" },
  { type: "supplier", id: "sup-1", name: "OrganicMush Co." },
  { type: "supplier", id: "sup-2", name: "NaturePro Ingredients" },
]

const mockTeamMembers = [
  "Sarah Chen",
  "Mike Johnson",
  "Lisa Park",
  "David Kim",
  "Emily Wong",
  "James Wilson",
]

// ─── Step Components ──────────────────────────────────────────────────────────

interface StepProps {
  data: NewProjectData
  onChange: (updates: Partial<NewProjectData>) => void
}

function Step1BasicInfo({ data, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Basic Information</h3>
        <p className="text-sm text-slate-500">Give your project a name and description</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g., Plant-Based Protein Bar"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-slate-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            value={data.brand}
            onChange={(e) => onChange({ brand: e.target.value })}
            placeholder="e.g., GreenFuel"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Brief description of the project..."
            rows={3}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={data.tags.join(", ")}
            onChange={(e) => onChange({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
            placeholder="e.g., plant-based, protein, snack"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>
    </div>
  )
}

function Step2Markets({ data, onChange }: StepProps) {
  const toggleRegion = (regionCode: string) => {
    const region = regions.find((r) => r.code === regionCode)
    if (!region) return

    if (data.targetMarkets.includes(regionCode)) {
      onChange({
        targetMarkets: data.targetMarkets.filter((m) => m !== regionCode),
      })
    } else {
      onChange({
        targetMarkets: [...data.targetMarkets, regionCode],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Target Markets</h3>
        <p className="text-sm text-slate-500">
          Select the regions where this product will be sold. This determines which regulatory rules apply.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {regions.map((region) => {
          const isSelected = data.targetMarkets.includes(region.code)
          return (
            <button
              key={region.code}
              type="button"
              onClick={() => toggleRegion(region.code)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <span className="text-2xl">{region.flag}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{region.name}</p>
                <p className="text-xs text-slate-500">{region.countries.length} countries</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {data.targetMarkets.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Applicable Regulatory Bodies
          </p>
          <div className="flex flex-wrap gap-2">
            {data.targetMarkets.includes("NA") && (
              <>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">FDA</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Health Canada</span>
              </>
            )}
            {data.targetMarkets.includes("EU") && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">EFSA</span>
            )}
            {data.targetMarkets.includes("UK") && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">UK FSA</span>
            )}
            {data.targetMarkets.includes("APAC") && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">FSANZ</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Step3Automation({ data, onChange }: StepProps) {
  const profiles = [
    {
      id: "full" as const,
      label: "Full Automation",
      description: "All stages run automated checks when possible",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "partial" as const,
      label: "Partial Automation",
      description: "Automated checks for selected stages only",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: "manual" as const,
      label: "Manual Control",
      description: "All stages require manual review and approval",
      icon: <User className="h-5 w-5" />,
    },
  ]

  const handleProfileChange = (profile: NewProjectData["automationProfile"]) => {
    const newStageAutomation: Record<StageId, boolean> = {} as Record<StageId, boolean>
    for (const stage of WORKFLOW_STAGES) {
      newStageAutomation[stage.id] = profile === "full" || (profile === "partial" && data.stageAutomation[stage.id])
    }
    onChange({
      automationProfile: profile,
      stageAutomation: newStageAutomation,
    })
  }

  const toggleStageAutomation = (stageId: StageId) => {
    onChange({
      stageAutomation: {
        ...data.stageAutomation,
        [stageId]: !data.stageAutomation[stageId],
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Automation Profile</h3>
        <p className="text-sm text-slate-500">
          Choose how much automation to apply to this project
        </p>
      </div>

      {/* Profile Selection */}
      <div className="grid grid-cols-3 gap-3">
        {profiles.map((profile) => {
          const isSelected = data.automationProfile === profile.id
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleProfileChange(profile.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                {profile.icon}
              </div>
              <p className="font-medium text-slate-800 text-sm">{profile.label}</p>
              <p className="text-xs text-slate-500 text-center">{profile.description}</p>
            </button>
          )
        })}
      </div>

      {/* Stage-level customization for partial */}
      {data.automationProfile === "partial" && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Stage Automation Settings
          </p>
          <div className="grid grid-cols-2 gap-2">
            {WORKFLOW_STAGES.map((stage) => {
              const isEnabled = data.stageAutomation[stage.id]
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => toggleStageAutomation(stage.id)}
                  className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                    isEnabled
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  <span className="font-mono">{stage.label}</span>
                  {isEnabled ? (
                    <Zap className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Step4Entities({ data, onChange }: StepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | LinkedEntity["type"]>("all")

  const filteredEntities = mockAvailableEntities.filter((entity) => {
    if (filterType !== "all" && entity.type !== filterType) return false
    if (searchTerm && !entity.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const isSelected = (entity: LinkedEntity) => {
    return data.linkedEntities.some((e) => e.type === entity.type && e.id === entity.id)
  }

  const toggleEntity = (entity: LinkedEntity) => {
    if (isSelected(entity)) {
      onChange({
        linkedEntities: data.linkedEntities.filter((e) => !(e.type === entity.type && e.id === entity.id)),
      })
    } else {
      onChange({
        linkedEntities: [...data.linkedEntities, entity],
      })
    }
  }

  const icons: Record<LinkedEntity["type"], React.ReactNode> = {
    product: <Package className="h-4 w-4" />,
    ingredient: <Leaf className="h-4 w-4" />,
    packaging: <Box className="h-4 w-4" />,
    supplier: <Building2 className="h-4 w-4" />,
  }

  const colors: Record<LinkedEntity["type"], string> = {
    product: "bg-purple-50 border-purple-200 text-purple-700",
    ingredient: "bg-green-50 border-green-200 text-green-700",
    packaging: "bg-amber-50 border-amber-200 text-amber-700",
    supplier: "bg-blue-50 border-blue-200 text-blue-700",
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Link Entities</h3>
        <p className="text-sm text-slate-500">
          Connect products, ingredients, packaging, or suppliers to this project
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search entities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="all">All Types</option>
          <option value="product">Products</option>
          <option value="ingredient">Ingredients</option>
          <option value="packaging">Packaging</option>
          <option value="supplier">Suppliers</option>
        </select>
      </div>

      {/* Entity Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filteredEntities.map((entity) => {
          const selected = isSelected(entity)
          return (
            <button
              key={`${entity.type}-${entity.id}`}
              type="button"
              onClick={() => toggleEntity(entity)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                selected
                  ? "border-blue-500 bg-blue-50"
                  : `border-slate-200 hover:border-slate-300 ${colors[entity.type]}`
              }`}
            >
              <div className={selected ? "text-blue-600" : ""}>
                {icons[entity.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{entity.name}</p>
                <p className="text-xs opacity-75 capitalize">{entity.type}</p>
              </div>
              {selected && (
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Count */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-medium">{data.linkedEntities.length}</span> entities selected
        </p>
      </div>
    </div>
  )
}

function Step5TeamDates({ data, onChange }: StepProps) {
  const toggleTeamMember = (member: string) => {
    if (data.team.includes(member)) {
      onChange({ team: data.team.filter((m) => m !== member) })
    } else {
      onChange({ team: [...data.team, member] })
    }
  }

  // Create mock stages for timeline preview
  const previewStages = WORKFLOW_STAGES.map((stage, idx) => ({
    stageId: stage.id,
    status: "not-started" as const,
    automationEnabled: data.stageAutomation[stage.id] ?? true,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Team & Timeline</h3>
        <p className="text-sm text-slate-500">
          Assign ownership and set your target launch date
        </p>
      </div>

      {/* Owner */}
      <div>
        <label htmlFor="owner" className="block text-sm font-medium text-slate-700 mb-1">
          Project Owner <span className="text-red-500">*</span>
        </label>
        <select
          id="owner"
          value={data.owner}
          onChange={(e) => onChange({ owner: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select owner...</option>
          {mockTeamMembers.map((member) => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>

      {/* Team Members */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Team Members
        </label>
        <div className="flex flex-wrap gap-2">
          {mockTeamMembers.filter((m) => m !== data.owner).map((member) => {
            const isSelected = data.team.includes(member)
            return (
              <button
                key={member}
                type="button"
                onClick={() => toggleTeamMember(member)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                {member}
                {isSelected && <Check className="h-3 w-3" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Target Launch Date */}
      <div>
        <label htmlFor="launchDate" className="block text-sm font-medium text-slate-700 mb-1">
          Target Launch Date
        </label>
        <input
          type="date"
          id="launchDate"
          value={data.targetLaunchDate}
          onChange={(e) => onChange({ targetLaunchDate: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {/* Timeline Preview */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Project Timeline Preview
        </p>
        <TimelineBar stages={previewStages} showLabels size="md" />
        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <span>Today</span>
          <span>{data.targetLaunchDate ? new Date(data.targetLaunchDate).toLocaleDateString() : "No date set"}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Modal Component ─────────────────────────────────────────────────────

export function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 5

  const defaultStageAutomation = WORKFLOW_STAGES.reduce((acc, stage) => {
    acc[stage.id] = true
    return acc
  }, {} as Record<StageId, boolean>)

  const [data, setData] = useState<NewProjectData>({
    name: "",
    brand: "",
    description: "",
    targetMarkets: [],
    automationProfile: "full",
    stageAutomation: defaultStageAutomation,
    linkedEntities: [],
    owner: "",
    team: [],
    targetLaunchDate: "",
    tags: [],
  })

  const handleChange = (updates: Partial<NewProjectData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.name.trim().length > 0
      case 2:
        return data.targetMarkets.length > 0
      case 3:
        return true
      case 4:
        return true
      case 5:
        return data.owner.trim().length > 0
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onSubmit(data)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleClose = () => {
    setStep(1)
    setData({
      name: "",
      brand: "",
      description: "",
      targetMarkets: [],
      automationProfile: "full",
      stageAutomation: defaultStageAutomation,
      linkedEntities: [],
      owner: "",
      team: [],
      targetLaunchDate: "",
      tags: [],
    })
    onClose()
  }

  if (!isOpen) return null

  const stepLabels = ["Basics", "Markets", "Automation", "Entities", "Team"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Project</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Step {step} of {totalSteps}: {stepLabels[step - 1]}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1 px-6 py-3 bg-slate-50">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx < step ? "bg-blue-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && <Step1BasicInfo data={data} onChange={handleChange} />}
          {step === 2 && <Step2Markets data={data} onChange={handleChange} />}
          {step === 3 && <Step3Automation data={data} onChange={handleChange} />}
          {step === 4 && <Step4Entities data={data} onChange={handleChange} />}
          {step === 5 && <Step5TeamDates data={data} onChange={handleChange} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              step === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              canProceed()
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {step === totalSteps ? "Create Project" : "Continue"}
            {step < totalSteps && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
