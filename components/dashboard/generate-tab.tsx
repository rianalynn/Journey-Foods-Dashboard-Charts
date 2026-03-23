"use client"

import { useState, useRef, useEffect } from "react"
import {
  Sparkles,
  Leaf,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Zap,
  FlaskConical,
  Tags,
  FileText,
  Globe,
  Search,
  Database,
  FileSearch,
  ExternalLink,
  Paperclip,
  Send,
  X,
} from "lucide-react"

// ─── Model Configuration ─────────────────────────────────────────────────────

export interface AIModel {
  id: string
  label: string
  sub: string | null
  subtag: string | null
  section: "general" | "journey"
  icon: string
  color: string
  ring: string
  desc: string
  tags: string[]
  live: boolean
}

export const BASIC_MODEL: AIModel = {
  id: "basic",
  label: "Basic",
  sub: "Clay",
  subtag: "unformed",
  section: "general",
  icon: "M",
  color: "from-stone-500 to-slate-600",
  ring: "ring-stone-400",
  desc: "The entry point - shapeable, fast, and accessible for general CPG and ingredient queries.",
  tags: ["Fast", "CPG", "General"],
  live: true,
}

export const CLAUDE_MODEL: AIModel = {
  id: "claude",
  label: "Claude",
  sub: null,
  subtag: null,
  section: "general",
  icon: "C",
  color: "from-gray-500 to-gray-600",
  ring: "ring-gray-400",
  desc: "General-purpose AI chat. Not domain-locked - broad, capable, conversational.",
  tags: ["General", "Open-ended", "Drafting"],
  live: true,
}

export const GEMINI_MODEL: AIModel = {
  id: "gemini",
  label: "Gemini",
  sub: null,
  subtag: null,
  section: "general",
  icon: "G",
  color: "from-blue-400 to-cyan-500",
  ring: "ring-blue-400",
  desc: "Google's general-purpose AI. Broad capability with deep Google ecosystem integration.",
  tags: ["General", "Google", "Multimodal"],
  live: false,
}

export const GENERAL_MODELS: AIModel[] = [BASIC_MODEL, CLAUDE_MODEL, GEMINI_MODEL]

export const JOURNEY_MODELS: AIModel[] = [
  {
    id: "pulp",
    label: "Note Taker",
    sub: "Pulp",
    subtag: "pressed",
    section: "journey",
    icon: "N",
    color: "from-sky-500 to-indigo-500",
    ring: "ring-sky-400",
    desc: "Raw input pressed into clean, structured output - meetings, transcripts, and documents.",
    tags: ["Summarize", "Action Items", "Decisions"],
    live: true,
  },
  {
    id: "carbon",
    label: "Agent",
    sub: "Carbon",
    subtag: "base element",
    section: "journey",
    icon: "A",
    color: "from-violet-500 to-purple-700",
    ring: "ring-violet-400",
    desc: "The element everything bonds to - chains steps and executes multi-step tasks.",
    tags: ["Autonomous", "Multi-step", "Reasoning"],
    live: false,
  },
  {
    id: "ore",
    label: "Supplier",
    sub: "Ore",
    subtag: "unrefined",
    section: "journey",
    icon: "S",
    color: "from-blue-500 to-cyan-600",
    ring: "ring-blue-400",
    desc: "Straight from the source - deep in procurement, vendor management, and RFQs.",
    tags: ["Procurement", "Vendors", "RFQ"],
    live: false,
  },
  {
    id: "assay",
    label: "Cost Analysis",
    sub: "Assay",
    subtag: "tested",
    section: "journey",
    icon: "$",
    color: "from-purple-600 to-fuchsia-700",
    ring: "ring-purple-400",
    desc: "Tests material for true worth - finds real margin, cost breakdowns, and spend intelligence.",
    tags: ["Finance", "Margin", "Spend"],
    live: false,
  },
  {
    id: "alloy",
    label: "High Product Expert",
    sub: "Alloy",
    subtag: "tempered",
    section: "journey",
    icon: "E",
    color: "from-yellow-500 to-orange-500",
    ring: "ring-yellow-400",
    desc: "Forged from multiple disciplines - the highest, most refined product expertise.",
    tags: ["Expert", "Specs", "QA"],
    live: false,
  },
]

export const ALL_MODELS: AIModel[] = [...GENERAL_MODELS, ...JOURNEY_MODELS]

// ─── Types ───────────────────────────────────────────────────────────────────

type GenerateMode = "formula" | "ingredient" | "label" | "brief"

interface TaskStep {
  id: string
  label: string
  status: "pending" | "running" | "completed" | "error"
  subSteps?: { id: string; label: string; icon?: "search" | "globe" | "database" | "file" }[]
}

interface Source {
  id: string
  title: string
  url?: string
  type: "database" | "web" | "document" | "supplier"
  snippet?: string
}

interface GeneratedResult {
  id: string
  mode: GenerateMode
  prompt: string
  output: string
  timestamp: string
  tasks?: TaskStep[]
  sources?: Source[]
  model: AIModel
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  model?: AIModel
  tasks?: TaskStep[]
  sources?: Source[]
  isGenerating?: boolean
}

const modeConfig: Record<GenerateMode, { label: string; icon: React.ComponentType<{ className?: string }>; description: string; placeholder: string }> = {
  formula: {
    label: "Formula",
    icon: FlaskConical,
    description: "Generate ingredient formulations, nutritional profiles, and recipe concepts.",
    placeholder: "e.g. High-protein energy bar with blueberry and matcha, targeting athletes...",
  },
  ingredient: {
    label: "Ingredient Match",
    icon: Leaf,
    description: "Find and suggest ingredients that meet your product goals and certifications.",
    placeholder: "e.g. Suggest plant-based protein ingredients with USDA Organic certification...",
  },
  label: {
    label: "Label Copy",
    icon: Tags,
    description: "Generate marketing copy, product names, and claim language for packaging.",
    placeholder: "e.g. Write label copy for an organic kids snack bar with clean ingredients...",
  },
  brief: {
    label: "NPD Brief",
    icon: FileText,
    description: "Create new product development briefs with market context and innovation angles.",
    placeholder: "e.g. NPD brief for a functional beverage targeting wellness-focused millennials...",
  },
}

// ─── Flow State Component (Perplexity-style) ─────────────────────────────────

function FlowState({ tasks, isExpanded, onToggle }: { tasks: TaskStep[]; isExpanded: boolean; onToggle: () => void }) {
  const runningCount = tasks.filter(t => t.status === "running").length
  const completedCount = tasks.filter(t => t.status === "completed").length
  const allCompleted = completedCount === tasks.length

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          {!allCompleted && <RefreshCw className="h-3.5 w-3.5 text-indigo-500 animate-spin" />}
          {allCompleted && <Check className="h-3.5 w-3.5 text-green-500" />}
          <span className="font-medium">
            {allCompleted 
              ? `Completed ${completedCount} tasks` 
              : `Running ${runningCount} task${runningCount !== 1 ? "s" : ""} in parallel`}
          </span>
        </div>
        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>

      {isExpanded && (
        <div className="mt-2 ml-1 border-l-2 border-slate-200 pl-4 space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="text-sm">
              <div className="flex items-center gap-2">
                {task.status === "running" && <Globe className="h-3.5 w-3.5 text-indigo-500" />}
                {task.status === "completed" && <Check className="h-3.5 w-3.5 text-green-500" />}
                {task.status === "pending" && <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />}
                <span className={task.status === "completed" ? "text-slate-500" : "text-slate-700"}>
                  {task.label}
                </span>
              </div>
              {task.subSteps && task.subSteps.length > 0 && (
                <div className="ml-6 mt-1.5 space-y-1">
                  {task.subSteps.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-2 text-xs text-slate-500">
                      {sub.icon === "search" && <Search className="h-3 w-3" />}
                      {sub.icon === "globe" && <Globe className="h-3 w-3" />}
                      {sub.icon === "database" && <Database className="h-3 w-3" />}
                      {sub.icon === "file" && <FileSearch className="h-3 w-3" />}
                      <span>{sub.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Source State Component ──────────────────────────────────────────────────

function SourceState({ sources, isExpanded, onToggle }: { sources: Source[]; isExpanded: boolean; onToggle: () => void }) {
  if (sources.length === 0) return null

  const sourceIcons: Record<Source["type"], React.ReactNode> = {
    database: <Database className="h-3.5 w-3.5" />,
    web: <Globe className="h-3.5 w-3.5" />,
    document: <FileSearch className="h-3.5 w-3.5" />,
    supplier: <Leaf className="h-3.5 w-3.5" />,
  }

  return (
    <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors w-full"
      >
        <FileSearch className="h-4 w-4 text-slate-500" />
        <span className="font-medium">{sources.length} source{sources.length !== 1 ? "s" : ""}</span>
        {isExpanded ? <ChevronDown className="h-3.5 w-3.5 ml-auto" /> : <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {sources.map((source) => (
            <div key={source.id} className="flex items-start gap-2 text-sm p-2 bg-white rounded-md border border-slate-100">
              <div className="shrink-0 mt-0.5 text-slate-400">
                {sourceIcons[source.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700 truncate">{source.title}</span>
                  {source.url && (
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {source.snippet && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{source.snippet}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Model Selector Dropdown ─────────────────────────────────────────────────

function ModelSelectorDropdown({ 
  selectedModel, 
  onSelectModel, 
  isOpen, 
  onToggle 
}: { 
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${selectedModel.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
      >
        <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs font-bold">
          {selectedModel.icon}
        </span>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-bold">{selectedModel.label}</span>
          {selectedModel.sub && <span className="text-white/70 text-[10px]">{selectedModel.sub}</span>}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
            {/* General Models */}
            <div className="px-3 pt-3 pb-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">General</span>
            </div>
            {GENERAL_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onSelectModel(model)
                  onToggle()
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors ${
                  selectedModel.id === model.id ? "bg-slate-50" : ""
                }`}
              >
                <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {model.icon}
                </span>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 text-sm">{model.label}</span>
                    {model.sub && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className={`text-xs font-medium bg-gradient-to-r ${model.color} bg-clip-text text-transparent`}>
                          {model.sub}
                        </span>
                      </>
                    )}
                    {model.live && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                  </div>
                  <span className="text-xs text-slate-500">{model.subtag ?? "general chat"}</span>
                </div>
                {selectedModel.id === model.id && <Check className="h-4 w-4 text-indigo-500" />}
              </button>
            ))}

            {/* Journey Models */}
            <div className="px-3 pt-3 pb-1.5 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Journey AI</span>
            </div>
            {JOURNEY_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  if (model.live) {
                    onSelectModel(model)
                    onToggle()
                  }
                }}
                disabled={!model.live}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
                  !model.live ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
                } ${selectedModel.id === model.id ? "bg-slate-50" : ""}`}
              >
                <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {model.icon}
                </span>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 text-sm">{model.label}</span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-xs font-medium bg-gradient-to-r ${model.color} bg-clip-text text-transparent`}>
                      {model.sub}
                    </span>
                    {model.live ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Soon</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{model.subtag}</span>
                </div>
                {selectedModel.id === model.id && <Check className="h-4 w-4 text-indigo-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Chat Message Component ──────────────────────────────────────────────────

function ChatMessage({ message, flowExpanded, sourceExpanded, onToggleFlow, onToggleSource }: { 
  message: Message
  flowExpanded: boolean
  sourceExpanded: boolean
  onToggleFlow: () => void
  onToggleSource: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-slate-800 text-white px-4 py-3 rounded-2xl rounded-br-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs text-slate-400 mt-2">{message.timestamp}</p>
        </div>
      </div>
    )
  }

  if (message.role === "system") {
    return (
      <div className="flex justify-center mb-4">
        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%]">
        {/* Model badge */}
        {message.model && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${message.model.color} flex items-center justify-center text-white text-xs font-bold`}>
              {message.model.icon}
            </span>
            <span className="text-sm font-medium text-slate-700">{message.model.label}</span>
            {message.model.sub && (
              <>
                <span className="text-slate-300">·</span>
                <span className={`text-xs font-medium bg-gradient-to-r ${message.model.color} bg-clip-text text-transparent`}>
                  {message.model.sub}
                </span>
              </>
            )}
            {message.model.live && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
          </div>
        )}

        {/* Flow state (tasks running in parallel) */}
        {message.tasks && message.tasks.length > 0 && (
          <FlowState tasks={message.tasks} isExpanded={flowExpanded} onToggle={onToggleFlow} />
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <SourceState sources={message.sources} isExpanded={sourceExpanded} onToggle={onToggleSource} />
        )}

        {/* Message content */}
        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
          {message.isGenerating ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin" />
              <span className="text-sm text-slate-500">Generating response...</span>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{message.content}</div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">{message.timestamp}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator({ model }: { model: AIModel }) {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-xs font-bold`}>
          {model.icon}
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Mock Generation Function ────────────────────────────────────────────────

const generateMockTasks = (mode: GenerateMode): TaskStep[] => {
  const baseTasks: TaskStep[] = [
    {
      id: "search-db",
      label: "Searching Journey Foods database",
      status: "completed",
      subSteps: [
        { id: "s1", label: "Ingredient profiles", icon: "database" },
        { id: "s2", label: "Supplier catalog", icon: "database" },
      ],
    },
    {
      id: "analyze",
      label: "Analyzing market trends and regulations",
      status: "completed",
      subSteps: [
        { id: "a1", label: "FDA compliance check", icon: "file" },
        { id: "a2", label: "Market data 2024-2026", icon: "search" },
      ],
    },
    {
      id: "web-search",
      label: "Researching external sources",
      status: "completed",
      subSteps: [
        { id: "w1", label: "Industry reports", icon: "globe" },
        { id: "w2", label: "Competitor analysis", icon: "globe" },
      ],
    },
  ]

  if (mode === "ingredient") {
    baseTasks.push({
      id: "supplier-match",
      label: "Matching with verified suppliers",
      status: "completed",
      subSteps: [
        { id: "sm1", label: "Pharmore Ingredients Inc", icon: "database" },
        { id: "sm2", label: "HPS Food & Ingredients", icon: "database" },
      ],
    })
  }

  return baseTasks
}

const generateMockSources = (mode: GenerateMode): Source[] => {
  const sources: Source[] = [
    {
      id: "src-1",
      title: "Journey Foods Ingredient Database",
      type: "database",
      snippet: "Internal database with 50,000+ ingredients and nutritional profiles",
    },
    {
      id: "src-2",
      title: "FDA 21 CFR 101 - Food Labeling",
      url: "https://www.fda.gov/food/food-labeling-nutrition",
      type: "document",
      snippet: "Regulatory requirements for nutrition labeling and health claims",
    },
  ]

  if (mode === "formula" || mode === "ingredient") {
    sources.push({
      id: "src-3",
      title: "Pharmore Ingredients Inc - Supplier Profile",
      type: "supplier",
      snippet: "Score: 90/100 | Certifications: GMP, NSF | MOQ: 25kg",
    })
  }

  if (mode === "brief") {
    sources.push({
      id: "src-4",
      title: "Functional Beverage Market Report 2026",
      url: "https://example.com/market-report",
      type: "web",
      snippet: "The functional beverage market is growing at 8.7% CAGR...",
    })
  }

  return sources
}

const mockOutputs: Record<GenerateMode, string> = {
  formula: `**Formulation Concept: High-protein energy bar**

Base Ingredients:
- Organic Rolled Oats - 28g (structural base, 4g protein)
- Brown Rice Protein - 15g (10g protein)
- Organic Almond Butter - 12g (healthy fats, binding)
- Organic Blueberry Powder - 5g (antioxidants, flavor)
- Organic Vanilla Extract - 2g (flavor)
- Honey / Agave Syrup - 8g (natural sweetener)
- Sunflower Lecithin - 1g (emulsifier)

Estimated Nutritional Profile (per 71g serving):
Calories: 280 | Protein: 14g | Carbs: 32g | Fat: 10g | Fiber: 4g

Recommended Certifications: USDA Organic, Non-GMO Project Verified
Supplier Match Score: 87/100

Next Steps:
1. Source blueberry powder from Journey Foods Test (score: 72)
2. Validate protein blend with Pharmore Ingredients Inc
3. Submit for nutritional analysis`,
  ingredient: `**Ingredient Recommendations**

Top Matches:

1. Pea Protein Isolate (90% protein)
   Supplier: Pharmore Ingredients Inc - Score: 90/100
   Certs: GMP, NSF | MOQ: 25kg | Est. cost: $4.20/kg

2. Brown Rice Protein (80% protein)
   Supplier: HPS Food & Ingredients Inc. - Score: 90/100
   Certs: Organic, Kosher, Halal | MOQ: 10kg | Est. cost: $3.60/kg

3. Hemp Protein Powder (50% protein)
   Supplier: HPS Food & Ingredients Inc. - Score: 90/100
   Certs: Organic, Kosher | MOQ: 5kg | Est. cost: $5.80/kg

Blend Recommendation:
60% Pea Protein + 30% Brown Rice + 10% Hemp
Complete amino acid profile achieved
BCAA ratio: 5.6g per 20g serving`,
  label: `**Label Copy Generated**

Product Name: "Pure Fuel Kids Bar"

Front of Pack:
Organic | Non-GMO | 8g Protein
"Real ingredients, real energy."

Marketing Claims:
- Made with whole grain oats
- No artificial colors or flavors
- Gluten-free certified
- 100% USDA Organic

Back of Pack Tagline:
"We believe every bite should count. Pure Fuel is crafted with clean, organic ingredients your kids will love and you can trust."

Claim Compliance Notes:
All claims reviewed against FDA 21 CFR 101. Protein claim validated at 10% DV. Organic seal requires USDA NOP certification on file.`,
  brief: `**NPD Brief: Functional Beverage**

Project Code: JF-2026-GEN-001
Category: Functional Beverages
Target Consumer: Wellness-focused Millennials (25-40)

Opportunity:
The functional beverage market is growing at 8.7% CAGR. Consumers seek products with clinical-backed ingredients and clean labels.

Product Concept:
A lightly sparkling adaptogenic drink featuring ashwagandha, lion's mane, and L-theanine - positioned as a stress-relief, focus-enhancing daily ritual.

Key Requirements:
- <5g sugar | No artificial sweeteners
- USDA Organic preferred
- Shelf stable, 12-month shelf life
- 8-12oz format, slim can or glass bottle

Ingredient Targets:
- Ashwagandha KSM-66: 300mg
- Lion's Mane Extract: 250mg
- L-Theanine: 100mg
- Hibiscus + Lemon base

Launch Timeline: Q4 2026
Target MSRP: $4.99-$6.99
Channel: DTC, Whole Foods, specialty retail`,
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function GenerateTab() {
  const [mode, setMode] = useState<GenerateMode>("formula")
  const [selectedModel, setSelectedModel] = useState<AIModel>(BASIC_MODEL)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Journey AI Generate. I can help you create formulas, find ingredients, write label copy, or draft NPD briefs. What would you like to create today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      model: BASIC_MODEL,
    },
  ])
  const [flowExpanded, setFlowExpanded] = useState<Record<string, boolean>>({})
  const [sourceExpanded, setSourceExpanded] = useState<Record<string, boolean>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    // Simulate typing and task progress
    const assistantId = `assistant-${Date.now()}`
    const tasks = generateMockTasks(mode)
    const sources = generateMockSources(mode)

    // Show typing state
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          model: selectedModel,
          tasks: tasks.map((t, i) => ({ ...t, status: i === 0 ? "running" : "pending" })),
          sources: [],
          isGenerating: true,
        } as Message,
      ])
      setFlowExpanded((prev) => ({ ...prev, [assistantId]: true }))
    }, 300)

    // Progress through tasks
    let taskIndex = 0
    const taskInterval = setInterval(() => {
      taskIndex++
      if (taskIndex < tasks.length) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  tasks: tasks.map((t, i) => ({
                    ...t,
                    status: i < taskIndex ? "completed" : i === taskIndex ? "running" : "pending",
                  })),
                }
              : m
          )
        )
      } else {
        clearInterval(taskInterval)
        
        // Complete generation
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: mockOutputs[mode],
                    tasks: tasks.map((t) => ({ ...t, status: "completed" as const })),
                    sources,
                    isGenerating: false,
                  }
                : m
            )
          )
          setSourceExpanded((prev) => ({ ...prev, [assistantId]: true }))
          setIsGenerating(false)
        }, 500)
      }
    }, 800)
  }

  const currentMode = modeConfig[mode]
  const ModeIcon = currentMode.icon

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Journey AI Generate</h1>
            <p className="text-sm text-slate-500">AI-powered product development tools</p>
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap shrink-0">
        {(Object.keys(modeConfig) as GenerateMode[]).map((m) => {
          const cfg = modeConfig[m]
          const Icon = cfg.icon
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                mode === m
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-2">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            flowExpanded={flowExpanded[message.id] ?? false}
            sourceExpanded={sourceExpanded[message.id] ?? false}
            onToggleFlow={() => setFlowExpanded((prev) => ({ ...prev, [message.id]: !prev[message.id] }))}
            onToggleSource={() => setSourceExpanded((prev) => ({ ...prev, [message.id]: !prev[message.id] }))}
          />
        ))}
        {isGenerating && messages[messages.length - 1]?.role === "user" && (
          <TypingIndicator model={selectedModel} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Info banner for first-time users */}
      {messages.length === 1 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 mb-4 shrink-0">
          <AlertCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800">How it works</p>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Describe what you want to create. Journey AI will research your ingredient database, 
              check compliance, and generate structured results you can refine and share.
            </p>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="shrink-0 border-t border-slate-200 pt-4">
        {/* Mode description */}
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
          <ModeIcon className="h-3.5 w-3.5" />
          <span>{currentMode.description}</span>
        </div>

        {/* Input box with model selector */}
        <div className="flex items-end gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent transition-all">
          {/* Model selector */}
          <ModelSelectorDropdown
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            isOpen={modelDropdownOpen}
            onToggle={() => setModelDropdownOpen((prev) => !prev)}
          />

          {/* Input */}
          <div className="flex-1 min-w-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentMode.placeholder}
              rows={2}
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Quick examples */}
        <div className="flex items-center gap-2 mt-3 text-xs">
          <Lightbulb className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400">Try:</span>
          <button
            type="button"
            onClick={() => setInput("High-protein energy bar with blueberry and vanilla")}
            className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
          >
            Energy bar formula
          </button>
          <button
            type="button"
            onClick={() => setInput("Plant-based protein alternatives to whey")}
            className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
          >
            Ingredient alternatives
          </button>
        </div>
      </div>
    </div>
  )
}
