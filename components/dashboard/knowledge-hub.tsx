"use client"

import { useState } from "react"
import {
  Play,
  FileText,
  Puzzle,
  Bell,
  Database,
  Users,
  Shield,
  Clock,
  ArrowRight,
  BookOpen,
  Code2,
} from "lucide-react"
import { DeveloperPortalModal } from "./developer-portal-modal"

type HubTab = "glossary" | "guides" | "documentation" | "tutorials"

// ─── Data ─────────────────────────────────────────────────────────────────────

const glossaryTerms = [
  { term: "Journey AI", badge: "Core", definition: "Our proprietary AI engine that powers ingredient insights, formulation optimization, and supply chain decision-making across the platform." },
  { term: "Sustainability Score", badge: null, definition: "Environmental impact rating calculated from carbon footprint, water usage, land use, and supply chain distance for each ingredient." },
  { term: "Operations Scientist™", badge: "Core", definition: "Journey's AI-powered assistant that analyzes ingredients, costs, and sustainability metrics to help you make data-driven decisions faster." },
  { term: "Cost Analysis", badge: null, definition: "Real-time pricing data and cost projections to help you optimize ingredient sourcing and maintain target margins." },
  { term: "Product Score", badge: null, definition: "A comprehensive rating that combines nutrition, cost efficiency, sustainability, and supply chain reliability into a single actionable metric." },
  { term: "Supply Chain Alerts", badge: null, definition: "Automated notifications for price changes, availability issues, or sustainability concerns affecting your watched ingredients." },
  { term: "Ingredient Database", badge: null, definition: "Our searchable database of 100,000+ ingredients with detailed nutritional profiles, sourcing data, and sustainability scores." },
  { term: "Recipe Optimization", badge: null, definition: "AI-driven analysis that suggests ingredient swaps and formulation changes to improve nutrition, reduce costs, or enhance sustainability." },
]

const guides = [
  {
    category: "Platform",
    readTime: "8 min",
    title: "Getting Started with Journey AI",
    description: "Learn how to leverage our Operations Scientist™ AI engine for ingredient optimization, nutritional...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.29.49%20AM-N2snGSWUVSPe7EzCUqoOubb6knF7LY.png",
  },
  {
    category: "Data",
    readTime: "12 min",
    title: "Ingredient Database Masterclass",
    description: "Navigate our comprehensive database of 100,000+ ingredients. Filter by nutrition, cost, sustainability,...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.29.49%20AM-N2snGSWUVSPe7EzCUqoOubb6knF7LY.png",
  },
  {
    category: "Sustainability",
    readTime: "6 min",
    title: "Sustainability Scoring Deep Dive",
    description: "Understand how we calculate environmental impact scores and use them to build more sustainable...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.29.49%20AM-N2snGSWUVSPe7EzCUqoOubb6knF7LY.png",
  },
  {
    category: "Supply Chain",
    readTime: "10 min",
    title: "Supplier Sourcing Strategies",
    description: "Best practices for discovering, vetting, and connecting with ingredient suppliers using Journey's network.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.29.49%20AM-N2snGSWUVSPe7EzCUqoOubb6knF7LY.png",
  },
  {
    category: "Platform",
    readTime: "5 min",
    title: "Setting Up Your Product Portfolio",
    description: "Step-by-step walkthrough for adding products, uploading formulations, and tracking product scores.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.29.49%20AM-N2snGSWUVSPe7EzCUqoOubb6knF7LY.png",
  },
  {
    category: "Compliance",
    readTime: "9 min",
    title: "Regulatory Labeling Guide",
    description: "Everything you need to know about nutrition facts panels, allergen labeling, and regulatory compliance.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.29.49%20AM-N2snGSWUVSPe7EzCUqoOubb6knF7LY.png",
  },
]

const docs = [
  {
    icon: FileText,
    badge: "Updated",
    badgeColor: "bg-slate-100 text-slate-600",
    title: "API Reference",
    description: "Complete REST API documentation for integrating Journey Foods data into your existing systems. Includes authentication, endpoints, and code examples.",
  },
  {
    icon: Puzzle,
    badge: "New",
    badgeColor: "bg-emerald-100 text-emerald-700",
    title: "Data Integrations",
    description: "Connect Journey Foods with your ERP, inventory management, and supply chain systems for seamless data flow.",
  },
  {
    icon: Bell,
    badge: null,
    badgeColor: "",
    title: "Webhook Configuration",
    description: "Set up real-time notifications for ingredient price changes, availability alerts, and formulation updates.",
  },
  {
    icon: Database,
    badge: null,
    badgeColor: "",
    title: "Bulk Data Import",
    description: "Import your existing product catalog, ingredient lists, and supplier data using our CSV templates.",
  },
  {
    icon: Users,
    badge: null,
    badgeColor: "",
    title: "User Management",
    description: "Configure team access, roles, and permissions. Set up manufacturer view vs. brand owner permissions.",
  },
  {
    icon: Shield,
    badge: null,
    badgeColor: "",
    title: "Compliance & Security",
    description: "Review our security practices, data handling policies, and regulatory compliance certifications.",
  },
]

const tutorials = [
  {
    category: "Getting Started",
    duration: "18:24",
    isNew: true,
    title: "Product Dashboard Walkthrough",
    description: "Complete tour of the product dashboard—from adding products to managing formulations and...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.30.14%20AM-HOFgtiEBTcGEToXDHmW83a1kGFbMqY.png",
  },
  {
    category: "AI Features",
    duration: "12:08",
    isNew: true,
    title: "AI Recipe Generation Demo",
    description: "Watch how to go from 905 recipe options to 3 optimized formulations using Journey AI filters and...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.30.14%20AM-HOFgtiEBTcGEToXDHmW83a1kGFbMqY.png",
  },
  {
    category: "Core Features",
    duration: "8:45",
    isNew: false,
    title: "Ingredient Search & Analysis",
    description: "Learn advanced search techniques to find the perfect ingredients for your formulation goals.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.30.14%20AM-HOFgtiEBTcGEToXDHmW83a1kGFbMqY.png",
  },
  {
    category: "Supply Chain",
    duration: "14:20",
    isNew: false,
    title: "Supplier Discovery & Outreach",
    description: "How to find, evaluate, and connect with the best suppliers for your ingredient needs.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.30.14%20AM-HOFgtiEBTcGEToXDHmW83a1kGFbMqY.png",
  },
  {
    category: "Analytics",
    duration: "9:55",
    isNew: false,
    title: "Reading Your Analytics Dashboard",
    description: "Interpret cost trends, sustainability metrics, and supply chain performance data with confidence.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.30.14%20AM-HOFgtiEBTcGEToXDHmW83a1kGFbMqY.png",
  },
  {
    category: "Integrations",
    duration: "11:30",
    isNew: false,
    title: "Connecting Your ERP System",
    description: "Step-by-step guide to linking Journey Foods with NetSuite, SAP, and other ERP platforms.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202026-03-23%20at%207.30.14%20AM-HOFgtiEBTcGEToXDHmW83a1kGFbMqY.png",
  },
]

const tabList: Array<{ id: HubTab; label: string }> = [
  { id: "glossary", label: "Glossary" },
  { id: "guides", label: "Guides" },
  { id: "documentation", label: "Documentation" },
  { id: "tutorials", label: "Tutorials" },
]

// ─── Sub-views ────────────────────────────────────────────────────────────────

function GlossaryView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
      {glossaryTerms.map((item, i) => (
        <div key={i} className="py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-slate-800">{item.term}</span>
            {item.badge && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">{item.definition}</p>
        </div>
      ))}
    </div>
  )
}

function GuidesView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {guides.map((g, i) => (
        <article key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          <div className="aspect-video bg-slate-100 overflow-hidden">
            <img
              src={g.image}
              alt={g.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{g.category}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {g.readTime}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1 leading-snug">{g.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{g.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function DocumentationView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {docs.map((doc, i) => {
        const Icon = doc.icon
        return (
          <article key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-emerald-600" />
              </div>
              {doc.badge && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${doc.badgeColor}`}>
                  {doc.badge}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">{doc.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">{doc.description}</p>
            <button
              type="button"
              className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors self-start"
            >
              Read Documentation
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </article>
        )
      })}
    </div>
  )
}

function TutorialsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tutorials.map((t, i) => (
        <article key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          <div className="relative aspect-video bg-slate-800 overflow-hidden">
            <img
              src={t.image}
              alt={t.title}
              className="w-full h-full object-cover opacity-80"
            />
            {t.isNew && (
              <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                New
              </span>
            )}
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
            </div>
            {/* Duration badge */}
            <span className="absolute bottom-2 right-2 text-xs font-medium text-white bg-black/60 rounded px-1.5 py-0.5">
              {t.duration}
            </span>
          </div>
          <div className="p-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {t.category}
            </span>
            <h3 className="text-sm font-semibold text-slate-800 mt-2 mb-1 leading-snug">{t.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState<HubTab>("tutorials")
  const [showDevPortal, setShowDevPortal] = useState(false)

  return (
    <div className="max-w-7xl">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Knowledge Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Learn how to get the most out of Journey Foods platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDevPortal(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Code2 className="h-4 w-4" />
            Developer Portal
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            Take a Tour
          </button>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 mb-8 flex items-center justify-between min-h-[200px] px-8 py-8 gap-6">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500 text-emerald-400 mb-4">
            New Feature
          </span>
          <h2 className="text-2xl font-bold text-white mb-3 text-pretty">Introducing Journey AI 2.0</h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
            Our Operations Scientist™ now generates optimized recipe formulations in seconds. Go from 905 options to 3 perfect matches with AI-powered filtering.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Try It Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <div className="h-7 w-7 rounded-full border border-slate-500 flex items-center justify-center">
                <Play className="h-3 w-3 fill-current ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>
        </div>
        {/* Abstract chart illustration */}
        <div className="hidden lg:block shrink-0 w-72 h-44 rounded-xl bg-slate-800 overflow-hidden opacity-80">
          <div className="p-3 h-full flex flex-col justify-end gap-1">
            <div className="flex items-end gap-1 h-full">
              {[55, 80, 45, 90, 65, 75, 50, 95, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${i % 3 === 0 ? "bg-emerald-500" : i % 3 === 1 ? "bg-blue-500" : "bg-orange-400"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-8 border-b border-slate-200">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "glossary" && <GlossaryView />}
      {activeTab === "guides" && <GuidesView />}
      {activeTab === "documentation" && <DocumentationView />}
      {activeTab === "tutorials" && <TutorialsView />}

      {/* Developer Portal Modal */}
      <DeveloperPortalModal
        isOpen={showDevPortal}
        onClose={() => setShowDevPortal(false)}
      />
    </div>
  )
}
