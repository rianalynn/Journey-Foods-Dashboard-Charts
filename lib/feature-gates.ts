import type { SubscriptionStatus } from "./user-context"

export type PageType =
  | "overview"
  | "generate"
  | "workflows"
  | "ingredients"
  | "products"
  | "suppliers"
  | "packaging"
  | "analytics"
  | "integrations"
  | "documents"
  | "guava"
  | "account"
  | "admin"
  | "knowledge-hub"
  | "settings"

// Pages that are always accessible regardless of subscription
export const FREE_PAGES: PageType[] = [
  "overview",
  "knowledge-hub",
  "account",
  "products",
  "settings",
]

// Pages that require trial or active subscription
export const GATED_PAGES: PageType[] = [
  "generate",
  "workflows",
  "ingredients",
  "suppliers",
  "packaging",
  "analytics",
  "integrations",
  "documents",
  "guava",
  "admin",
]

export function canAccessPage(
  page: PageType,
  subscriptionStatus: SubscriptionStatus | undefined
): boolean {
  if (FREE_PAGES.includes(page)) return true
  if (subscriptionStatus === "trial" || subscriptionStatus === "active") return true
  return false
}

export function isPageLocked(
  page: PageType,
  subscriptionStatus: SubscriptionStatus | undefined
): boolean {
  return !canAccessPage(page, subscriptionStatus)
}

export const PAGE_LABELS: Record<PageType, string> = {
  overview: "Overview",
  generate: "Generate",
  workflows: "Workflows",
  ingredients: "Ingredients",
  products: "Products",
  suppliers: "Suppliers",
  packaging: "Packaging",
  analytics: "Analytics",
  integrations: "Integrations",
  documents: "Documents",
  guava: "Guava",
  account: "Account",
  admin: "Admin",
  "knowledge-hub": "Knowledge Hub",
  settings: "Settings",
}

export const PAGE_DESCRIPTIONS: Record<PageType, string> = {
  overview: "Get a high-level view of your product portfolio and key metrics.",
  generate: "Use AI to generate new product formulations and ingredient combinations.",
  workflows: "Create and manage automated workflows for product development.",
  ingredients: "Search and analyze ingredients with AI-powered insights.",
  products: "Manage your product catalog and track development progress.",
  suppliers: "Find and connect with ingredient suppliers worldwide.",
  packaging: "Explore sustainable packaging options for your products.",
  analytics: "Deep dive into performance metrics and trend analysis.",
  integrations: "Connect Journey Foods with your existing tools and systems.",
  documents: "Store and manage product documentation and compliance files.",
  guava: "Access the Guava AI assistant for advanced product intelligence.",
  account: "Manage your account settings and preferences.",
  admin: "Administrative tools and user management.",
  "knowledge-hub": "Learn best practices and explore industry resources.",
  settings: "Configure your dashboard and notification preferences.",
}
