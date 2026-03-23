"use client"

import { useState } from "react"
import { Search, Link2, FileSpreadsheet, FileText, ChevronDown, Clock, ArrowUpRight } from "lucide-react"

type IntegrationTab = "data-sources" | "markets" | "requests"
type CategoryFilter = "all" | "marketing" | "supply-chain" | "sustainability" | "data" | "nutrition" | "cost" | "erp" | "analytics"

interface DataSource {
  id: string
  name: string
  description: string
  icon: "excel" | "csv" | "google-sheets" | "json" | "xml" | "api"
  connected: boolean
}

interface MarketIntegration {
  id: string
  name: string
  description: string
  category: CategoryFilter[]
  status: "available" | "coming-soon" | "connected"
  popular?: boolean
}

interface IntegrationRequest {
  id: string
  requestType: string
  requestDate: string
  expectedLiveDate: string
  payment: "Paid" | "Pending" | "Free"
  status: "requested" | "in-progress" | "completed" | "rejected"
}

const dataSources: DataSource[] = [
  { id: "excel", name: "Microsoft Excel", description: "Import product catalogs, ingredient lists, and supplier data from Excel files.", icon: "excel", connected: false },
  { id: "csv", name: "CSV Files", description: "Upload comma-separated value files for bulk data import.", icon: "csv", connected: false },
  { id: "google-sheets", name: "Google Sheets", description: "Sync data directly from your Google Sheets spreadsheets.", icon: "google-sheets", connected: true },
  { id: "json", name: "JSON Import", description: "Import structured JSON data from external systems.", icon: "json", connected: false },
  { id: "xml", name: "XML Import", description: "Parse and import XML formatted data files.", icon: "xml", connected: false },
  { id: "api", name: "REST API", description: "Connect via REST API for real-time data synchronization.", icon: "api", connected: true },
]

const marketIntegrations: MarketIntegration[] = [
  // Marketing & Research
  { id: "npd", name: "NPD Group", description: "Consumer market research and retail tracking data.", category: ["marketing", "data"], status: "available", popular: true },
  { id: "crunchbase", name: "Crunchbase", description: "Company insights and funding data for supplier research.", category: ["data", "marketing"], status: "available" },
  { id: "mintel", name: "Mintel", description: "Global market intelligence and consumer trends.", category: ["marketing", "data"], status: "available", popular: true },
  { id: "nielsen", name: "Nielsen", description: "Retail measurement and consumer behavior analytics.", category: ["marketing", "analytics"], status: "available", popular: true },
  { id: "euromonitor", name: "Euromonitor", description: "Strategic market research and industry analysis.", category: ["marketing", "data"], status: "available" },
  { id: "statista", name: "Statista", description: "Statistics and market data across industries.", category: ["marketing", "data"], status: "available" },
  
  // Supply Chain & ERP
  { id: "sap", name: "SAP", description: "Enterprise resource planning and supply chain management.", category: ["supply-chain", "erp"], status: "available", popular: true },
  { id: "oracle", name: "Oracle", description: "Cloud ERP and supply chain solutions.", category: ["supply-chain", "erp"], status: "available", popular: true },
  { id: "netsuite", name: "NetSuite", description: "Cloud-based ERP for growing businesses.", category: ["supply-chain", "erp"], status: "available" },
  { id: "odoo", name: "Odoo", description: "Open-source ERP and business applications.", category: ["supply-chain", "erp"], status: "available" },
  { id: "dynamics365", name: "Microsoft Dynamics 365", description: "Unified CRM and ERP cloud solution.", category: ["supply-chain", "erp"], status: "available" },
  { id: "infor", name: "Infor", description: "Industry-specific cloud ERP solutions.", category: ["supply-chain", "erp"], status: "coming-soon" },
  
  // Data & Analytics
  { id: "airtable", name: "Airtable", description: "Flexible database and spreadsheet hybrid.", category: ["data", "analytics"], status: "available" },
  { id: "google-cloud", name: "Google Cloud", description: "Cloud computing and data analytics platform.", category: ["data", "analytics"], status: "available", popular: true },
  { id: "ibm", name: "IBM Watson", description: "AI-powered analytics and insights.", category: ["data", "analytics"], status: "available" },
  { id: "snowflake", name: "Snowflake", description: "Cloud data warehouse and analytics.", category: ["data", "analytics"], status: "available" },
  { id: "databricks", name: "Databricks", description: "Unified analytics platform for data teams.", category: ["data", "analytics"], status: "coming-soon" },
  { id: "tableau", name: "Tableau", description: "Business intelligence and data visualization.", category: ["data", "analytics"], status: "available" },
  { id: "powerbi", name: "Power BI", description: "Microsoft business analytics service.", category: ["data", "analytics"], status: "available" },
  { id: "looker", name: "Looker", description: "Modern BI and embedded analytics.", category: ["data", "analytics"], status: "available" },
  
  // Sustainability
  { id: "ecoinvent", name: "Ecoinvent", description: "Life cycle inventory database for sustainability.", category: ["sustainability", "data"], status: "available", popular: true },
  { id: "gabi", name: "GaBi", description: "Life cycle assessment software and database.", category: ["sustainability"], status: "available" },
  { id: "sphera", name: "Sphera", description: "ESG and sustainability performance management.", category: ["sustainability"], status: "available" },
  { id: "sustainalytics", name: "Sustainalytics", description: "ESG risk ratings and research.", category: ["sustainability", "data"], status: "coming-soon" },
  { id: "cdp", name: "CDP", description: "Environmental disclosure and scoring system.", category: ["sustainability"], status: "available" },
  
  // Nutrition
  { id: "usda", name: "USDA FoodData Central", description: "Comprehensive nutrient database.", category: ["nutrition", "data"], status: "connected", popular: true },
  { id: "nutritionix", name: "Nutritionix", description: "Nutrition data API for food products.", category: ["nutrition", "data"], status: "available" },
  { id: "edamam", name: "Edamam", description: "Nutrition analysis and food database API.", category: ["nutrition"], status: "available" },
  { id: "fatsecret", name: "FatSecret", description: "Food and nutrition data platform.", category: ["nutrition"], status: "available" },
  { id: "openfoodfacts", name: "Open Food Facts", description: "Open database of food products worldwide.", category: ["nutrition", "data"], status: "connected" },
  
  // Cost & Pricing
  { id: "bloomberg", name: "Bloomberg", description: "Financial data and commodity pricing.", category: ["cost", "data"], status: "available", popular: true },
  { id: "refinitiv", name: "Refinitiv", description: "Financial market data and infrastructure.", category: ["cost", "data"], status: "available" },
  { id: "platts", name: "S&P Global Platts", description: "Commodity and energy price assessments.", category: ["cost"], status: "coming-soon" },
  { id: "fastmarkets", name: "Fastmarkets", description: "Commodity price reporting and analytics.", category: ["cost"], status: "available" },
  
  // E-commerce & Retail
  { id: "shopify", name: "Shopify", description: "E-commerce platform integration.", category: ["marketing", "supply-chain"], status: "available", popular: true },
  { id: "amazon", name: "Amazon Seller Central", description: "Amazon marketplace integration.", category: ["marketing", "supply-chain"], status: "available" },
  { id: "woocommerce", name: "WooCommerce", description: "WordPress e-commerce plugin integration.", category: ["marketing"], status: "available" },
  { id: "bigcommerce", name: "BigCommerce", description: "Enterprise e-commerce platform.", category: ["marketing"], status: "available" },
  
  // Communication & Collaboration
  { id: "slack", name: "Slack", description: "Team communication and notifications.", category: ["data"], status: "available" },
  { id: "teams", name: "Microsoft Teams", description: "Collaboration and communication hub.", category: ["data"], status: "available" },
  { id: "asana", name: "Asana", description: "Project and task management.", category: ["data"], status: "available" },
  { id: "monday", name: "Monday.com", description: "Work operating system for teams.", category: ["data"], status: "available" },
  { id: "notion", name: "Notion", description: "All-in-one workspace for notes and docs.", category: ["data"], status: "available" },
  { id: "jira", name: "Jira", description: "Issue tracking and project management.", category: ["data"], status: "coming-soon" },
]

const integrationRequests: IntegrationRequest[] = [
  { id: "1", requestType: "Excel Upload", requestDate: "Aug 28 2025 03:21 am", expectedLiveDate: "Awaiting Payment", payment: "Paid", status: "requested" },
  { id: "2", requestType: "Excel Upload", requestDate: "Aug 28 2025 01:59 am", expectedLiveDate: "Awaiting Payment", payment: "Paid", status: "requested" },
  { id: "3", requestType: "Excel Upload", requestDate: "Aug 28 2025 01:44 am", expectedLiveDate: "Awaiting Payment", payment: "Paid", status: "requested" },
  { id: "4", requestType: "API Connection", requestDate: "Aug 25 2025 10:15 am", expectedLiveDate: "Sep 1 2025", payment: "Paid", status: "in-progress" },
  { id: "5", requestType: "Custom Integration", requestDate: "Aug 20 2025 02:30 pm", expectedLiveDate: "Sep 15 2025", payment: "Pending", status: "in-progress" },
  { id: "6", requestType: "CSV Import", requestDate: "Aug 15 2025 09:00 am", expectedLiveDate: "Aug 18 2025", payment: "Free", status: "completed" },
]

const categories: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marketing", label: "Marketing" },
  { id: "supply-chain", label: "Supply Chain" },
  { id: "sustainability", label: "Sustainability" },
  { id: "data", label: "Data" },
  { id: "nutrition", label: "Nutrition" },
  { id: "cost", label: "Cost" },
  { id: "erp", label: "ERP" },
  { id: "analytics", label: "Analytics" },
]

function DataSourceIcon({ type }: { type: DataSource["icon"] }) {
  switch (type) {
    case "excel":
      return (
        <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-lg">X</div>
        </div>
      )
    case "csv":
      return (
        <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-yellow-400 flex items-center justify-center text-white font-bold text-sm">CSV</div>
        </div>
      )
    case "google-sheets":
      return (
        <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    case "json":
      return (
        <div className="w-16 h-16 rounded-xl bg-yellow-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center text-white font-bold text-xs">{"{ }"}</div>
        </div>
      )
    case "xml":
      return (
        <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-xs">XML</div>
        </div>
      )
    case "api":
      return (
        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
            <Link2 className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    default:
      return (
        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
      )
  }
}

function getIntegrationLogo(name: string) {
  // Return styled text logos for each integration
  const logos: Record<string, { bg: string; text: string; content: string }> = {
    "NPD Group": { bg: "bg-gradient-to-r from-teal-400 to-cyan-400", text: "text-white", content: "npd" },
    "Crunchbase": { bg: "bg-white", text: "text-slate-800", content: "crunchbase" },
    "Mintel": { bg: "bg-slate-800", text: "text-white", content: "MINTEL" },
    "Nielsen": { bg: "bg-white", text: "text-red-600", content: "nielsen" },
    "SAP": { bg: "bg-white", text: "text-blue-600", content: "SAP" },
    "Oracle": { bg: "bg-white", text: "text-red-500", content: "ORACLE" },
    "Odoo": { bg: "bg-white", text: "text-slate-700", content: "odoo" },
    "Airtable": { bg: "bg-white", text: "text-blue-500", content: "Airtable" },
    "Google Cloud": { bg: "bg-white", text: "text-blue-500", content: "Google Cloud" },
    "IBM Watson": { bg: "bg-white", text: "text-blue-600", content: "IBM" },
    "Shopify": { bg: "bg-white", text: "text-green-600", content: "shopify" },
    "USDA FoodData Central": { bg: "bg-green-600", text: "text-white", content: "USDA" },
    "Bloomberg": { bg: "bg-slate-900", text: "text-white", content: "Bloomberg" },
    "Snowflake": { bg: "bg-blue-50", text: "text-blue-500", content: "Snowflake" },
    "Tableau": { bg: "bg-white", text: "text-blue-600", content: "Tableau" },
    "Ecoinvent": { bg: "bg-green-50", text: "text-green-600", content: "ecoinvent" },
    "Slack": { bg: "bg-purple-50", text: "text-purple-600", content: "Slack" },
  }
  return logos[name] || { bg: "bg-slate-100", text: "text-slate-600", content: name.substring(0, 3) }
}

export function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("data-sources")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")

  const filteredIntegrations = marketIntegrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || integration.category.includes(categoryFilter)
    return matchesSearch && matchesCategory
  })

  const integrationCount = filteredIntegrations.length

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { id: "data-sources" as IntegrationTab, label: "Data Source Connections" },
          { id: "markets" as IntegrationTab, label: "Markets" },
          { id: "requests" as IntegrationTab, label: "Requests" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-slate-800 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Source Connections Tab */}
      {activeTab === "data-sources" && (
        <div className="space-y-4">
          <div className="max-w-3xl">
            <p className="text-slate-600">
              Journey Foods provides a comprehensive list of data sources to collect and combine data from your marketing automation platforms, CRMs, A/B testing tools, and more. No code required.
            </p>
            <p className="text-sm text-slate-500 mt-2">Select a source from the list below to learn more!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <DataSourceIcon type={source.icon} />
                  <h3 className="mt-4 font-semibold text-slate-800">{source.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{source.description}</p>
                  <button
                    type="button"
                    className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      source.connected
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                  >
                    <Link2 className="h-4 w-4" />
                    {source.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Markets Tab */}
      {activeTab === "markets" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800">Connect your market research data to your innovation team.</h2>
            <p className="mt-2 text-slate-500">
              Whether it's your own data or third-party data, find out more about our key partners and contact us to connect to other partners.
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Category
                <ChevronDown className="h-4 w-4" />
              </button>
              <span className="text-sm text-slate-500">{integrationCount} integrations</span>
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Integration grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredIntegrations.map((integration) => {
              const logo = getIntegrationLogo(integration.name)
              return (
                <div
                  key={integration.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col"
                >
                  {integration.popular && (
                    <span className="self-start px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full mb-3">
                      Popular
                    </span>
                  )}
                  {integration.status === "coming-soon" && (
                    <span className="self-start px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full mb-3">
                      Coming Soon
                    </span>
                  )}
                  {integration.status === "connected" && (
                    <span className="self-start px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-3">
                      Connected
                    </span>
                  )}
                  
                  <div className={`h-16 rounded-lg ${logo.bg} flex items-center justify-center mb-4 border border-slate-100`}>
                    <span className={`font-bold ${logo.text} text-lg`}>{logo.content}</span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 text-sm">{integration.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-1">{integration.description}</p>
                  
                  <button
                    type="button"
                    disabled={integration.status === "coming-soon"}
                    className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      integration.status === "connected"
                        ? "bg-green-100 text-green-700"
                        : integration.status === "coming-soon"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Link2 className="h-4 w-4" />
                    {integration.status === "connected" ? "Manage" : integration.status === "coming-soon" ? "Coming Soon" : "Request"}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Request Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                    <button type="button" className="flex items-center gap-1 hover:text-slate-800">
                      Request Date
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Expected Live Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {integrationRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-800">{request.requestType}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{request.requestDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{request.expectedLiveDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{request.payment}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === "requested"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : request.status === "in-progress"
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : request.status === "completed"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Total Requests</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{integrationRequests.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {integrationRequests.filter((r) => r.status === "in-progress").length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {integrationRequests.filter((r) => r.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
