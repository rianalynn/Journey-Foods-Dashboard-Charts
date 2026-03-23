"use client"

import { useState } from "react"
import {
  User,
  Building2,
  Sliders,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Upload,
  Shield,
  Search,
  BarChart3,
  Sparkles,
  FileText,
  Code,
  Zap,
  Bot,
  Check,
  Code2,
  Globe,
  AlertTriangle,
} from "lucide-react"
import { 
  type AIModel, 
  BASIC_MODEL, 
  GENERAL_MODELS, 
  JOURNEY_MODELS, 
  ALL_MODELS 
} from "./generate-tab"
import { DeveloperPortalModal, DeveloperPortalCard } from "./developer-portal-modal"
import {
  GuardrailsToggle,
  SeverityThresholdSelector,
  MarketsSelector,
  RegulatoryRuleCard,
} from "@/components/compliance/compliance-components"
import {
  type RegulatoryGuardrails,
  type MarketSelection,
  type RuleSeverity,
  defaultGuardrails,
  defaultMarketSelection,
  regulatoryRules,
  regions,
} from "@/lib/compliance-data"

// ─── Types ────────────────────────────────────────────────────────────────────

type AccountSection = "profile" | "company" | "preferences" | "billing" | "ai-settings" | "developer" | "regulatory" | "markets"
type PreferenceTab = "product" | "ingredient" | "packaging" | "other"
type CompanyTab = "brands" | "markets" | "company-type" | "users"
type BillingTab = "invoices" | "subscription" | "billing-info" | "upgrade"

// ─── Data ─────────────────────────────────────────────────────────────────────

const productCategories = ["Food", "Beverages", "Form", "Household", "Cosmetic", "Packaging"]

const finishedFormats = [
  "Air Dried", "Blanched", "Candied", "Cold Pressed", "Concentrate", "Crushed", "Dusted",
  "Evaporated", "Extracted", "Fermented", "Filtered", "Freeze-Dried", "Fried", "Grilled",
  "Ground", "Honey Roasted", "Hulled", "Microwaved", "Minced", "Pickled", "Shredded",
  "Sliced", "Smoked", "Stabilized", "Stewed", "Strained", "Sweetened", "Uncooked",
  "Unprepared", "Unsalted", "Baked", "Boiled", "Chopped", "Cooked", "Dehydrated", "Dried",
  "Dry Roasted", "Glazed", "Hard-Boiled", "Heated", "Pasteurized", "Peeled", "Poached",
  "Rinsed", "Roasted", "Sauteed", "Scrambled", "Seasoned", "Spiced", "Spray-Dried",
  "Sugared", "Sulfured", "Toasted", "Unblanched", "Unsweetened"
]

const storageConditions = ["Refrigerated", "Frozen", "Shelf-Stable"]

const ingredientSubCategories = [
  "poultry", "sea green", "leaf vegetable", "jam/jelly", "cereal", "rice", "bread",
  "pulse", "nut butter", "oilseed", "cooking oil", "cheese", "mineral", "color additive",
  "extract", "flavor enhancer", "preservative", "seasoning", "starch", "sweetener",
  "concentrate", "Leavening Agents", "Dough Strengtheners and Conditioners", "Gases",
  "Antioxidants", "Polysaccharides", "Sequestrants", "Solvents", "root vegetable",
  "flour", "oat", "bean", "supplement", "microbiological", "yogurt", "milk", "vitamin",
  "amino acid", "condiment", "pasta", "plant protein", "tuber", "Thickener", "Binder",
  "acidulants", "Anti-caking agents", "Humectants", "Yeast Nutrients", "Firming Agents",
  "Enzymes", "Flour Additive"
]

const ingredientForms = ["liquid", "paste", "powder", "capsule", "puree", "sauce", "whole"]
const ingredientStorage = ["canned", "frozen", "raw", "drained"]

const ingredientProcesses = [
  "air dried", "baked", "blanched", "candied", "concentrate", "dehydrated", "dried",
  "dry roasted", "evaporated", "extracted", "fermented", "filtered", "freeze-dried",
  "fried", "grilled", "ground", "mashed", "microwaved", "minced", "oil roasted", "peeled",
  "salted", "seasoned", "shredded", "smoked", "spray-dried", "strained", "sugared",
  "sulfured", "sweetened", "toasted", "uncooked", "unprepared", "boiled", "chopped",
  "cooked", "cold pressed", "crushed", "dusted", "glazed", "hard-boiled", "heated",
  "pasteurized", "pickled", "poached", "sauteed", "scrambled", "sliced", "spiced",
  "stabilized", "stewed", "unblanched", "unsalted", "unsweetened"
]

const dietaryFunctional = [
  "Adaptogenic", "Vegan", "Vegetarian", "Lacto Vegetarian", "Pescatarian", "Nootropic",
  "Weight Loss", "Diabetes Friendly", "Low Calorie", "Processed Food", "Whole Food",
  "Digestive Health", "Omega-3s", "High Protein", "No Saturated Fat", "Superfood",
  "High Fiber", "Gluten Free", "Lacto-ovo Vegetarian", "Ovo Vegetarian", "Paleo",
  "Probiotic", "Antioxidant", "Low Sodium", "Anti-Inflammatory", "Heart Health",
  "Low Fat", "Anti Cancer", "Kidney Health", "No Added Salt", "No Added Sugar",
  "Dairy Free", "Whole Grain", "Medicinal", "Intermittent fasting", "Clean eating"
]

const allergens = [
  "Milk", "Egg", "Fish", "Stone Fruit", "Cream", "Butter", "Apple", "Crustacean, Shellfish",
  "Tree Nut", "Peanut", "Wheat, Gluten", "Soya", "Gelatin", "Seeds", "Corn", "Coconut",
  "Buckwheat", "Peach", "Kiwi"
]

const packagingForms = [
  "Pouches", "Bag", "Customizable", "Plastic Containers", "Plastic Tips Caps & Closures",
  "Banderoles Labels & Sleeves", "Laminates", "Wrapper", "Boxes", "Flowpacks",
  "Formable Webs", "Lidding", "Trays", "Films", "Bottle", "Flexible Packaging",
  "Liners and Components"
]

const endUserBenefits = [
  "Freshness Retention", "Ovenproof", "Frozen", "Attractive", "Active Packaging",
  "Lightweight", "Resistant", "Yoghurt", "Opaque", "Convenient", "Squeezable",
  "Tamper Evidence", "Transparent", "Microwaveable", "Portionable", "Children",
  "Easy Opening", "BPA Free"
]

const packagingSizes = [
  "5 oz", "15 oz", "16 oz", "12 oz", "200-500g", "1 kg", "3 oz", "0-100g", "8 oz",
  "100-200g", "20 oz", "Customized size"
]

const sustainability = ["Recyclable", "SFI Certified Sourcing", "Responsibly Sourced Materials", "PEFC", "Lower Carbon Footprint"]
const fillingProcess = ["Hot Fill", "Aseptic", "Ambient Fill", "Heat Pasteurisation", "Retort", "Cold Fill"]
const materials = ["Plastic", "Metal", "Glass", "Wood, cardboard and papers", "Transparent", "Opaque"]

// ─── Chip Component ───────────────────────────────────────────────────────────

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        selected
          ? "bg-blue-50 border-blue-300 text-blue-700"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
      }`}
    >
      <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
        selected ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300"
      }`}>
        {selected && "✓"}
      </span>
      {label}
    </button>
  )
}

// ─── Account Page ─────────────────────────────────────────────────────────────

export function AccountPage() {
  const [activeSection, setActiveSection] = useState<AccountSection>("profile")
  const [preferenceTab, setPreferenceTab] = useState<PreferenceTab>("product")
  const [companyTab, setCompanyTab] = useState<CompanyTab>("brands")
  const [billingTab, setBillingTab] = useState<BillingTab>("subscription")
  const [selectedDefaultModel, setSelectedDefaultModel] = useState<AIModel>(BASIC_MODEL)
  const [showDevPortal, setShowDevPortal] = useState(false)
  
  // Profile form state
  const [profile, setProfile] = useState({
    firstName: "Riana",
    lastName: "Lynn",
    country: "United States",
    city: "Austin",
    state: "TX",
    company: "Journey Foods",
    phone: "512-555-0123",
    email: "riana@journeyfoods.io",
    companyGoals: ""
  })

  // Selected preferences
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["Air Dried", "Cold Pressed", "Freeze-Dried"])
  const [selectedStorage, setSelectedStorage] = useState<string[]>(["Shelf-Stable"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["poultry", "cheese", "flour"])
  const [selectedIngForms, setSelectedIngForms] = useState<string[]>(["powder", "liquid"])
  const [selectedIngStorage, setSelectedIngStorage] = useState<string[]>(["frozen"])
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>(["baked", "dried"])
  const [selectedDietary, setSelectedDietary] = useState<string[]>(["Vegan", "High Protein", "Gluten Free"])
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(["Milk", "Peanut"])
  const [selectedPkgForms, setSelectedPkgForms] = useState<string[]>(["Pouches", "Bottle"])
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(["Recyclable", "Easy Opening"])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["12 oz", "16 oz"])
  const [selectedSustainability, setSelectedSustainability] = useState<string[]>(["Recyclable"])
  const [selectedFilling, setSelectedFilling] = useState<string[]>(["Cold Fill"])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(["Glass"])

  // Regulatory settings state
  const [guardrails, setGuardrails] = useState<RegulatoryGuardrails>(defaultGuardrails)
  const [marketSelection, setMarketSelection] = useState<MarketSelection>(defaultMarketSelection)
  const [activeRuleIds, setActiveRuleIds] = useState<string[]>(regulatoryRules.map(r => r.id))

  const toggleSelection = (item: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item))
    } else {
      setter([...current, item])
    }
  }

  const sidebarItems = [
    { id: "profile" as const, label: "Profile Settings", icon: User },
    { id: "company" as const, label: "Company Settings", icon: Building2 },
    { id: "preferences" as const, label: "Preferences", icon: Sliders },
    { id: "regulatory" as const, label: "Regulatory Guardrails", icon: Shield },
    { id: "markets" as const, label: "Target Markets", icon: Globe },
    { id: "ai-settings" as const, label: "AI Settings", icon: Bot },
    { id: "developer" as const, label: "Developer Portal", icon: Code2 },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="flex gap-0 min-h-[calc(100vh-140px)]">
      {/* Blue sidebar */}
      <div className="w-56 bg-gradient-to-b from-blue-600 to-blue-700 rounded-l-xl shrink-0">
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white rounded-r-xl border border-slate-200 border-l-0 p-8">
        <h1 className="text-xl font-semibold text-slate-800 mb-6">
          {activeSection === "profile" && "Profile Settings"}
          {activeSection === "company" && "Company Settings"}
          {activeSection === "preferences" && "Preferences"}
          {activeSection === "regulatory" && "Regulatory Guardrails"}
          {activeSection === "markets" && "Target Markets"}
          {activeSection === "ai-settings" && "AI Settings"}
          {activeSection === "developer" && "Developer Portal"}
          {activeSection === "billing" && "Billing"}
        </h1>

        {/* ── Profile Settings ─────────────────────────────────────────────── */}
        {activeSection === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Goals</label>
                <textarea
                  value={profile.companyGoals}
                  onChange={(e) => setProfile({ ...profile, companyGoals: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">User Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                    <Upload className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Choose File
                    </button>
                    <p className="text-xs text-slate-500 mt-0.5">no file</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                    <Upload className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Choose File
                    </button>
                    <p className="text-xs text-slate-500 mt-0.5">no file</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Shield className="h-4 w-4" />
                Set up two-factor authentication
              </button>
            </div>
          </div>
        )}

        {/* ── Company Settings ─────────────────────────────────────────────── */}
        {activeSection === "company" && (
          <div>
            <div className="flex gap-1 border-b border-slate-200 mb-6">
              {(["brands", "markets", "company-type", "users"] as CompanyTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCompanyTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    companyTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab === "company-type" ? "Company Type" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {companyTab !== "markets" && (
              <div className="max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {companyTab === "markets" && (
              <div className="max-w-2xl">
                <MarketsSelector
                  selectedRegions={marketSelection.regions}
                  selectedCountries={marketSelection.countries}
                  onRegionToggle={(regionCode) => {
                    setMarketSelection((prev) => ({
                      ...prev,
                      regions: prev.regions.includes(regionCode)
                        ? prev.regions.filter((r) => r !== regionCode)
                        : [...prev.regions, regionCode],
                    }))
                  }}
                  onCountryToggle={(countryCode) => {
                    setMarketSelection((prev) => ({
                      ...prev,
                      countries: prev.countries.includes(countryCode)
                        ? prev.countries.filter((c) => c !== countryCode)
                        : [...prev.countries, countryCode],
                    }))
                  }}
                  onSelectAll={() => {
                    setMarketSelection({
                      regions: regions.map((r) => r.code),
                      countries: regions.flatMap((r) => r.countries.map((c) => c.code)),
                    })
                  }}
                  onClearAll={() => setMarketSelection({ regions: [], countries: [] })}
                />
              </div>
            )}

            <p className="text-sm text-slate-600 mt-8 max-w-lg">
              These preferences will help tailor our product suggestions and filter your live searching whilst using the app.
            </p>

            <button
              type="button"
              className="mt-4 px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Save account settings
            </button>
          </div>
        )}

        {/* ── Preferences ──────────────────────────────────────────────────── */}
        {activeSection === "preferences" && (
          <div>
            <div className="flex gap-1 border-b border-slate-200 mb-6">
              {(["product", "ingredient", "packaging", "other"] as PreferenceTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreferenceTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    preferenceTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab === "product" ? "Product Preferences" : 
                   tab === "ingredient" ? "Ingredient Preferences" :
                   tab === "packaging" ? "Packaging Preferences" : "Other"}
                </button>
              ))}
            </div>

            {/* Product Preferences */}
            {preferenceTab === "product" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {productCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 transition-colors"
                      >
                        <span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-xs">✓</span>
                        </span>
                        {cat}
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Finished Format</h3>
                  <div className="flex flex-wrap gap-2">
                    {finishedFormats.map((format) => (
                      <Chip
                        key={format}
                        label={format}
                        selected={selectedFormats.includes(format)}
                        onClick={() => toggleSelection(format, selectedFormats, setSelectedFormats)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Storage Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {storageConditions.map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleSelection(cond, selectedStorage, setSelectedStorage)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          selectedStorage.includes(cond)
                            ? "bg-slate-800 border-slate-800 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ingredient Preferences */}
            {preferenceTab === "ingredient" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Sub Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredientSubCategories.slice(0, 30).map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        selected={selectedCategories.includes(cat)}
                        onClick={() => toggleSelection(cat, selectedCategories, setSelectedCategories)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Form</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredientForms.map((form) => (
                      <Chip
                        key={form}
                        label={form}
                        selected={selectedIngForms.includes(form)}
                        onClick={() => toggleSelection(form, selectedIngForms, setSelectedIngForms)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Storage Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredientStorage.map((stor) => (
                      <Chip
                        key={stor}
                        label={stor}
                        selected={selectedIngStorage.includes(stor)}
                        onClick={() => toggleSelection(stor, selectedIngStorage, setSelectedIngStorage)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Processes</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredientProcesses.slice(0, 40).map((proc) => (
                      <Chip
                        key={proc}
                        label={proc}
                        selected={selectedProcesses.includes(proc)}
                        onClick={() => toggleSelection(proc, selectedProcesses, setSelectedProcesses)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Dietary/Functional</h3>
                  <div className="flex flex-wrap gap-2">
                    {dietaryFunctional.map((diet) => (
                      <Chip
                        key={diet}
                        label={diet}
                        selected={selectedDietary.includes(diet)}
                        onClick={() => toggleSelection(diet, selectedDietary, setSelectedDietary)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((allergen) => (
                      <Chip
                        key={allergen}
                        label={allergen}
                        selected={selectedAllergens.includes(allergen)}
                        onClick={() => toggleSelection(allergen, selectedAllergens, setSelectedAllergens)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Sustainability</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Byproduct", "Fair Trade", "Upcycled"].map((sus) => (
                      <Chip
                        key={sus}
                        label={sus}
                        selected={selectedSustainability.includes(sus)}
                        onClick={() => toggleSelection(sus, selectedSustainability, setSelectedSustainability)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Packaging Preferences */}
            {preferenceTab === "packaging" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Form</h3>
                  <div className="flex flex-wrap gap-2">
                    {packagingForms.map((form) => (
                      <Chip
                        key={form}
                        label={form}
                        selected={selectedPkgForms.includes(form)}
                        onClick={() => toggleSelection(form, selectedPkgForms, setSelectedPkgForms)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">End User Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {endUserBenefits.map((benefit) => (
                      <Chip
                        key={benefit}
                        label={benefit}
                        selected={selectedBenefits.includes(benefit)}
                        onClick={() => toggleSelection(benefit, selectedBenefits, setSelectedBenefits)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {packagingSizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        selected={selectedSizes.includes(size)}
                        onClick={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Sustainability</h3>
                  <div className="flex flex-wrap gap-2">
                    {sustainability.map((sus) => (
                      <Chip
                        key={sus}
                        label={sus}
                        selected={selectedSustainability.includes(sus)}
                        onClick={() => toggleSelection(sus, selectedSustainability, setSelectedSustainability)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Filling Process</h3>
                  <div className="flex flex-wrap gap-2">
                    {fillingProcess.map((fill) => (
                      <Chip
                        key={fill}
                        label={fill}
                        selected={selectedFilling.includes(fill)}
                        onClick={() => toggleSelection(fill, selectedFilling, setSelectedFilling)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Material</h3>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((mat) => (
                      <Chip
                        key={mat}
                        label={mat}
                        selected={selectedMaterials.includes(mat)}
                        onClick={() => toggleSelection(mat, selectedMaterials, setSelectedMaterials)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other */}
            {preferenceTab === "other" && (
              <div className="text-sm text-slate-500">
                Additional preferences and settings will appear here.
              </div>
            )}

            <p className="text-sm text-slate-600 mt-8 max-w-lg">
              These preferences will help tailor our product suggestions and filter your live searching whilst using the app.
            </p>

            <button
              type="button"
              className="mt-4 px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Save account settings
            </button>
          </div>
        )}

        {/* ── Billing ──────────────────────────────────────────────────────── */}
        {activeSection === "billing" && (
          <div>
            <div className="flex gap-1 border-b border-slate-200 mb-6">
              {(["invoices", "subscription", "billing-info", "upgrade"] as BillingTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBillingTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    billingTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab === "billing-info" ? "Billing Info" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {billingTab === "subscription" && (
              <div className="space-y-6">
                {/* Billing Period */}
                <div className="bg-slate-50 rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Billing Period</h2>
                  <p className="text-sm text-slate-600">
                    Active: <span className="text-emerald-600 font-medium">Fresh</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Subscription ends: 03/28/2026</p>
                </div>

                {/* Usage & Credits */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Usage & Credits</h2>
                  <p className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center">
                      <span className="text-[10px]">📅</span>
                    </span>
                    Billing Cycle: 02/26/2026 - 03/28/2026
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: Search, label: "Ingredient Searches", used: 12, total: 50 },
                      { icon: BarChart3, label: "Nutrition Analyses", used: 3, total: 10 },
                      { icon: Sparkles, label: "AI Recommendations", used: 8, total: 20 },
                      { icon: FileText, label: "Report Exports", used: 1, total: 3 },
                      { icon: Code, label: "Api Calls", used: 45, total: 500 },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-700">{item.label}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            {item.used} / {item.total}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Upgrade Plan
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Upsell banner */}
                <div className="bg-emerald-500 rounded-xl p-5 flex items-center justify-between max-w-md">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Need more credits?</h3>
                      <p className="text-emerald-100 text-sm">
                        Upgrade to Growth for 10x more searches and unlimited AI recommendations.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-white text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors shrink-0"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            )}

            {billingTab === "invoices" && (
              <div className="text-sm text-slate-500">Your invoices will appear here.</div>
            )}

            {billingTab === "billing-info" && (
              <div className="text-sm text-slate-500">Your billing information and payment methods will appear here.</div>
            )}

            {billingTab === "upgrade" && (
              <div className="text-sm text-slate-500">Plan upgrade options will appear here.</div>
            )}
          </div>
        )}

        {/* ── AI Settings ──────────────────────────────────────────────────── */}
        {activeSection === "ai-settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Default AI Model</h2>
              <p className="text-sm text-slate-500 mb-4">
                Choose your default AI model for the Generate tab. You can always switch models within the chat.
              </p>
            </div>

            {/* General Models */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">General Models</h3>
              <div className="grid gap-3">
                {GENERAL_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedDefaultModel(model)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedDefaultModel.id === model.id
                        ? `border-transparent ring-2 ${model.ring} bg-slate-50`
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
                        {model.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-slate-800">{model.label}</span>
                          {model.sub && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className={`font-semibold bg-gradient-to-r ${model.color} bg-clip-text text-transparent text-sm`}>
                                {model.sub}
                              </span>
                              <span className="text-slate-400 text-xs tracking-widest">{model.subtag}</span>
                            </>
                          )}
                          {model.live ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Live
                            </span>
                          ) : (
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                          )}
                          {selectedDefaultModel.id === model.id && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 leading-snug">{model.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {model.tags.map((t) => (
                            <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                        selectedDefaultModel.id === model.id
                          ? `bg-gradient-to-br ${model.color} border-transparent`
                          : "border-slate-300"
                      }`}>
                        {selectedDefaultModel.id === model.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Journey AI Models */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Journey AI Models</h3>
              <div className="grid gap-3">
                {JOURNEY_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => model.live && setSelectedDefaultModel(model)}
                    disabled={!model.live}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      !model.live
                        ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                        : selectedDefaultModel.id === model.id
                        ? `border-transparent ring-2 ${model.ring} bg-slate-50`
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
                        {model.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-slate-800">{model.label}</span>
                          <span className="text-slate-300">·</span>
                          <span className={`font-semibold bg-gradient-to-r ${model.color} bg-clip-text text-transparent text-sm`}>
                            {model.sub}
                          </span>
                          <span className="text-slate-400 text-xs tracking-widest">{model.subtag}</span>
                          {model.live ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Live
                            </span>
                          ) : (
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Forging</span>
                          )}
                          {selectedDefaultModel.id === model.id && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 leading-snug">{model.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {model.tags.map((t) => (
                            <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                        selectedDefaultModel.id === model.id
                          ? `bg-gradient-to-br ${model.color} border-transparent`
                          : "border-slate-300"
                      }`}>
                        {selectedDefaultModel.id === model.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save AI Preferences
              </button>
            </div>
          </div>
        )}

        {/* ── Developer Portal ──────────────────────────────────────────────── */}
        {activeSection === "developer" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">API Access</h2>
              <p className="text-sm text-slate-500 mb-6">
                Connect to the Journey Foods API to integrate our ingredient data, formulation tools, and analytics into your existing systems.
              </p>
            </div>

            <DeveloperPortalCard onClick={() => setShowDevPortal(true)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-2">API Documentation</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Comprehensive guides, endpoint references, and code examples.
                </p>
                <a
                  href="https://developers.journeyfoods.io/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View Documentation →
                </a>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Webhooks</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Set up real-time notifications for price changes, supply alerts, and more.
                </p>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Configure Webhooks →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Regulatory Guardrails ──────────────────────────────────────────── */}
        {activeSection === "regulatory" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Compliance Settings</h2>
              <p className="text-sm text-slate-500 mb-6">
                Configure how regulatory compliance is enforced across your products and ingredients.
              </p>
            </div>

            {/* Master Toggles */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">General Settings</h3>
              
              <GuardrailsToggle
                label="Enable Regulatory Guardrails"
                description="Automatically check products and ingredients against applicable regulations"
                enabled={guardrails.enabled}
                onToggle={(enabled) => setGuardrails({ ...guardrails, enabled })}
              />

              <GuardrailsToggle
                label="Auto-Block Non-Compliant Products"
                description="Automatically prevent products with critical violations from being published"
                enabled={guardrails.autoBlock}
                onToggle={(enabled) => setGuardrails({ ...guardrails, autoBlock: enabled })}
              />

              <GuardrailsToggle
                label="Notify on Violations"
                description="Send notifications when compliance issues are detected"
                enabled={guardrails.notifyOnViolation}
                onToggle={(enabled) => setGuardrails({ ...guardrails, notifyOnViolation: enabled })}
              />
            </div>

            {/* Severity Threshold */}
            <div className="pt-4 border-t border-slate-200">
              <SeverityThresholdSelector
                value={guardrails.severityThreshold}
                onChange={(value) => setGuardrails({ ...guardrails, severityThreshold: value })}
              />
            </div>

            {/* Enabled Rule Sets */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Enabled Rule Sources</h3>
              <div className="flex flex-wrap gap-2">
                {["FDA", "EFSA", "FSANZ", "Health Canada", "UK FSA", "Codex"].map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => {
                      if (guardrails.enabledRuleSets.includes(source)) {
                        setGuardrails({
                          ...guardrails,
                          enabledRuleSets: guardrails.enabledRuleSets.filter((s) => s !== source),
                        })
                      } else {
                        setGuardrails({
                          ...guardrails,
                          enabledRuleSets: [...guardrails.enabledRuleSets, source],
                        })
                      }
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      guardrails.enabledRuleSets.includes(source)
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded mr-2 ${
                      guardrails.enabledRuleSets.includes(source) ? "bg-blue-500" : "bg-slate-300"
                    }`} />
                    {source}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Rules */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Active Regulatory Rules</h3>
                <span className="text-xs text-slate-500">{activeRuleIds.length} of {regulatoryRules.length} active</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {regulatoryRules.map((rule) => (
                  <RegulatoryRuleCard
                    key={rule.id}
                    rule={rule}
                    isActive={activeRuleIds.includes(rule.id)}
                    onToggle={(id, active) => {
                      if (active) {
                        setActiveRuleIds([...activeRuleIds, id])
                      } else {
                        setActiveRuleIds(activeRuleIds.filter((r) => r !== id))
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="button"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Guardrail Settings
              </button>
            </div>
          </div>
        )}

        {/* ── Target Markets ────────────────────────────────────────────────── */}
        {activeSection === "markets" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Target Markets</h2>
              <p className="text-sm text-slate-500 mb-6">
                Select the regions and countries where your products will be sold. This determines which regulatory rules apply.
              </p>
            </div>

            {/* Markets Selector */}
            <MarketsSelector
              selectedRegions={marketSelection.regions}
              selectedCountries={marketSelection.countries}
              onRegionToggle={(regionCode) => {
                const region = regions.find((r) => r.code === regionCode)
                if (!region) return
                
                if (marketSelection.regions.includes(regionCode)) {
                  // Remove region and all its countries
                  setMarketSelection({
                    regions: marketSelection.regions.filter((r) => r !== regionCode),
                    countries: marketSelection.countries.filter(
                      (c) => !region.countries.some((rc) => rc.code === c)
                    ),
                  })
                } else {
                  // Add region and all its countries
                  setMarketSelection({
                    regions: [...marketSelection.regions, regionCode],
                    countries: [
                      ...marketSelection.countries,
                      ...region.countries.map((c) => c.code).filter((c) => !marketSelection.countries.includes(c)),
                    ],
                  })
                }
              }}
              onCountryToggle={(countryCode) => {
                if (marketSelection.countries.includes(countryCode)) {
                  setMarketSelection({
                    ...marketSelection,
                    countries: marketSelection.countries.filter((c) => c !== countryCode),
                  })
                } else {
                  setMarketSelection({
                    ...marketSelection,
                    countries: [...marketSelection.countries, countryCode],
                  })
                }
              }}
              onSelectAll={() => {
                setMarketSelection({
                  regions: regions.map((r) => r.code),
                  countries: regions.flatMap((r) => r.countries.map((c) => c.code)),
                })
              }}
              onClearAll={() => {
                setMarketSelection({ regions: [], countries: [] })
              }}
            />

            {/* Selected Summary */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Selection Summary</h3>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{marketSelection.regions.length}</p>
                  <p className="text-xs text-slate-500">Regions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{marketSelection.countries.length}</p>
                  <p className="text-xs text-slate-500">Countries</p>
                </div>
              </div>
              {marketSelection.countries.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Applicable regulatory bodies:</p>
                  <div className="flex flex-wrap gap-1">
                    {marketSelection.regions.includes("NA") && (
                      <>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">FDA</span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Health Canada</span>
                      </>
                    )}
                    {marketSelection.regions.includes("EU") && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">EFSA</span>
                    )}
                    {marketSelection.regions.includes("UK") && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">UK FSA</span>
                    )}
                    {marketSelection.regions.includes("APAC") && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">FSANZ</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="button"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Market Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Developer Portal Modal */}
      <DeveloperPortalModal
        isOpen={showDevPortal}
        onClose={() => setShowDevPortal(false)}
      />
    </div>
  )
}
