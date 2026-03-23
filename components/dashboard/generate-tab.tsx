"use client"

import { useState } from "react"
import {
  Sparkles,
  Leaf,
  Package,
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
} from "lucide-react"

type GenerateMode = "formula" | "ingredient" | "label" | "brief"

interface GeneratedResult {
  id: string
  mode: GenerateMode
  prompt: string
  output: string
  timestamp: string
}

const examplePrompts: Record<GenerateMode, string[]> = {
  formula: [
    "High-protein energy bar with blueberry and vanilla",
    "Vegan protein powder blend, chocolate flavored",
    "Keto-friendly granola with coconut and almonds",
  ],
  ingredient: [
    "Suggest superfoods for immune support",
    "Plant-based protein alternatives to whey",
    "Natural sweeteners under 10g sugar per serving",
  ],
  label: [
    "Energy bar label for athletes, clean design",
    "Organic smoothie pouch for kids",
    "Premium supplement brand label copy",
  ],
  brief: [
    "NPD brief for a functional beverage targeting Gen Z",
    "Product concept: adaptogenic coffee alternative",
    "Innovation brief for gut health snack line",
  ],
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

const mockGenerate = (mode: GenerateMode, prompt: string): string => {
  const outputs: Record<GenerateMode, string> = {
    formula: `**Formulation Concept: ${prompt}**\n\nBase Ingredients:\n• Organic Rolled Oats — 28g (structural base, 4g protein)\n• Brown Rice Protein — 15g (10g protein)\n• Organic Almond Butter — 12g (healthy fats, binding)\n• Organic Blueberry Powder — 5g (antioxidants, flavor)\n• Organic Vanilla Extract — 2g (flavor)\n• Honey / Agave Syrup — 8g (natural sweetener)\n• Sunflower Lecithin — 1g (emulsifier)\n\nEstimated Nutritional Profile (per 71g serving):\nCalories: 280 | Protein: 14g | Carbs: 32g | Fat: 10g | Fiber: 4g\n\nRecommended Certifications: USDA Organic, Non-GMO Project Verified\nSupplier Match Score: 87/100\n\nNext Steps:\n1. Source blueberry powder from Journey Foods Test (score: 72)\n2. Validate protein blend with Pharmore Ingredients Inc\n3. Submit for nutritional analysis`,
    ingredient: `**Ingredient Recommendations for: ${prompt}**\n\nTop Matches:\n\n1. Pea Protein Isolate (90% protein)\n   Supplier: Pharmore Ingredients Inc — Score: 90/100\n   Certs: GMP, NSF | MOQ: 25kg | Est. cost: $4.20/kg\n\n2. Brown Rice Protein (80% protein)\n   Supplier: HPS Food & Ingredients Inc. — Score: 90/100\n   Certs: Organic, Kosher, Halal | MOQ: 10kg | Est. cost: $3.60/kg\n\n3. Hemp Protein Powder (50% protein)\n   Supplier: HPS Food & Ingredients Inc. — Score: 90/100\n   Certs: Organic, Kosher | MOQ: 5kg | Est. cost: $5.80/kg\n\nBlend Recommendation:\n60% Pea Protein + 30% Brown Rice + 10% Hemp\nComplete amino acid profile achieved ✓\nBCCA ratio: 5.6g per 20g serving`,
    label: `**Label Copy: ${prompt}**\n\n— Product Name —\n"Pure Fuel Kids Bar"\n\n— Front of Pack —\nOrganic • Non-GMO • 8g Protein\n"Real ingredients, real energy."\n\n— Marketing Claims —\n• Made with whole grain oats\n• No artificial colors or flavors\n• Gluten-free certified\n• 100% USDA Organic\n\n— Back of Pack Tagline —\n"We believe every bite should count. Pure Fuel is crafted with clean, organic ingredients your kids will love and you can trust."\n\n— Claim Compliance Notes —\nAll claims reviewed against FDA 21 CFR 101. Protein claim validated at 10% DV. Organic seal requires USDA NOP certification on file.`,
    brief: `**NPD Brief: ${prompt}**\n\nProject Code: JF-2026-GEN-001\nCategory: Functional Beverages\nTarget Consumer: Wellness-focused Millennials (25–40)\n\nOpportunity:\nThe functional beverage market is growing at 8.7% CAGR. Consumers seek products with clinical-backed ingredients and clean labels.\n\nProduct Concept:\nA lightly sparkling adaptogenic drink featuring ashwagandha, lion's mane, and L-theanine — positioned as a stress-relief, focus-enhancing daily ritual.\n\nKey Requirements:\n• <5g sugar | No artificial sweeteners\n• USDA Organic preferred\n• Shelf stable, 12-month shelf life\n• 8–12oz format, slim can or glass bottle\n\nIngredient Targets:\n• Ashwagandha KSM-66®: 300mg\n• Lion's Mane Extract: 250mg\n• L-Theanine: 100mg\n• Hibiscus + Lemon base\n\nLaunch Timeline: Q4 2026\nTarget MSRP: $4.99–$6.99\nChannel: DTC, Whole Foods, specialty retail`,
  }
  return outputs[mode]
}

export function GenerateTab() {
  const [mode, setMode] = useState<GenerateMode>("formula")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GeneratedResult[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      const result: GeneratedResult = {
        id: `result-${Date.now()}`,
        mode,
        prompt: prompt.trim(),
        output: mockGenerate(mode, prompt.trim()),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setResults((prev) => [result, ...prev])
      setExpandedId(result.id)
      setIsGenerating(false)
      setPrompt("")
    }, 1800)
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExamplePrompt = (example: string) => {
    setPrompt(example)
  }

  const currentMode = modeConfig[mode]
  const ModeIcon = currentMode.icon

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Journey AI Generate</h1>
          <p className="text-sm text-slate-500">AI-powered product development tools for food innovation</p>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {(Object.keys(modeConfig) as GenerateMode[]).map((m) => {
          const cfg = modeConfig[m]
          const Icon = cfg.icon
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
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

      {/* Prompt card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-slate-100 rounded-lg shrink-0">
            <ModeIcon className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{currentMode.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{currentMode.description}</p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={currentMode.placeholder}
          rows={4}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
          }}
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Examples:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {examplePrompts[mode].slice(0, 2).map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleExamplePrompt(ex)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
                >
                  {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info banner */}
      {results.length === 0 && !isGenerating && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex items-start gap-4 mb-5">
          <AlertCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800">How it works</p>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Describe what you want to create — a product formula, ingredient suggestion, label copy, or NPD brief.
              Journey AI will generate a structured result you can refine, copy, and share with your team. Results draw
              from your connected supplier network and ingredient database.
            </p>
          </div>
        </div>
      )}

      {/* Generating skeleton */}
      {isGenerating && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="h-4 w-48 bg-slate-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-200 rounded w-4/6" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Generated Results</h2>
          {results.map((result) => {
            const cfg = modeConfig[result.mode]
            const ResultIcon = cfg.icon
            const isExpanded = expandedId === result.id
            return (
              <div key={result.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : result.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="p-1.5 bg-slate-100 rounded-lg shrink-0">
                    <ResultIcon className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{result.prompt}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cfg.label} · {result.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(result.id, result.output)
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Copy result"
                    >
                      {copiedId === result.id ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                      )}
                      {copiedId === result.id ? "Copied" : "Copy"}
                    </button>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {result.output}
                    </pre>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
