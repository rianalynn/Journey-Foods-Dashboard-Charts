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

// Pages accessible on free/no subscription (very limited)
export const FREE_PAGES: PageType[] = [
  "overview",
  "account",
  "settings",
  "knowledge-hub",
]

// Pages accessible on trial (limited features: overview, settings, generate, products)
export const TRIAL_PAGES: PageType[] = [
  "overview",
  "account",
  "settings",
  "knowledge-hub",
  "generate",
  "products",
]

// Pages that require active paid subscription (everything)
export const PAID_PAGES: PageType[] = [
  "overview",
  "generate",
  "workflows",
  "ingredients",
  "products",
  "suppliers",
  "packaging",
  "analytics",
  "integrations",
  "documents",
  "guava",
  "account",
  "admin",
  "knowledge-hub",
  "settings",
]

// Pages always locked unless paid subscription
export const GATED_PAGES: PageType[] = [
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
  // Active paid subscription = full access
  if (subscriptionStatus === "active") return true
  
  // Trial = limited access (overview, settings, generate, products)
  if (subscriptionStatus === "trial") {
    return TRIAL_PAGES.includes(page)
  }
  
  // No subscription/expired = very limited
  return FREE_PAGES.includes(page)
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
