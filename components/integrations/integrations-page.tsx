"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Link2,
  X,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Send,
  FileSpreadsheet,
  FileText,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────
type IntegrationTab = "data-sources" | "markets" | "requests"
type IntegrationStatus = "available" | "connected" | "pending" | "hidden"

interface Integration {
  name: string
  tags: string[]
  description: string
  status: IntegrationStatus
  url: string
  discount?: string
  connectable?: boolean // true for built-in connectors (like Excel, CSV, Google Sheets)
}

interface IntegrationRequest {
  id: string
  integrationName: string
  requestedAt: string
  status: "pending" | "approved" | "denied"
  message?: string
}

// ─── Categories derived from tags ─────────────────────────────────────────
const ALL_CATEGORIES = [
  "All",
  "Data",
  "Marketing",
  "Nutrition",
  "Supply Chain",
  "Sustainability",
  "Cost",
  "Product Data",
  "Food Tracking",
  "Packaging",
  "Regulatory & Compliance",
  "Business Growth",
  "Network",
  "Plant-Based",
  "Alternative Meats",
  "Flavor",
  "Manufacturing",
  "Security",
] as const

// ─── Data Source Connections ───────────────────────────────────────────────
const dataSourceConnections: Integration[] = [
  { name: "Microsoft Excel", tags: ["Data"], description: "Import and sync data directly from Excel spreadsheets. Supports .xlsx and .xls formats.", status: "available", url: "", connectable: true },
  { name: "CSV Upload", tags: ["Data"], description: "Upload CSV files to import ingredient, product, and supplier data in bulk.", status: "available", url: "", connectable: true },
  { name: "Google Sheets", tags: ["Data"], description: "Connect your Google Sheets to automatically sync data with Journey Foods.", status: "available", url: "", connectable: true },
  { name: "Airtable", tags: ["Data"], description: "Sync your Airtable bases with Journey Foods for real-time data integration.", status: "available", url: "https://www.airtable.com", connectable: true },
  { name: "Google Cloud", tags: ["Data"], description: "Connect Google Cloud services for advanced data storage and processing.", status: "available", url: "https://cloud.google.com", connectable: false },
  { name: "Snowflake", tags: ["Data"], description: "Connect your Snowflake data warehouse for advanced analytics and data management.", status: "available", url: "https://www.snowflake.com", connectable: false },
]

// ─── Market Integrations (all partnerships) ───────────────────────────────
const marketIntegrations: Integration[] = [
  { name: "8451", tags: ["Data", "Marketing"], description: "A retail data science, insights and media company, helping to create more personalized and valuable experiences for shoppers across the path to purchase.", status: "available", url: "https://www.8451.com/", discount: "10%" },
  { name: "Acoustic Extra Freezing (AEF)", tags: ["Nutrition"], description: "A revolutionary innovation in food processing and storage with equipment that generates acoustic waves causing formation of nano-size ice crystals to preserve taste, texture, color and biochemical properties of the food.", status: "available", url: "http://aefrus.com" },
  { name: "Ad adapted", tags: ["Marketing"], description: "A native mobile advertisement platform designed to assist CPGs and mid-market retailers with direct integrations into top shopping list apps.", status: "available", url: "https://www.adadapted.com/", discount: "10%" },
  { name: "Aeris Communications", tags: ["Supply Chain", "Food Tracking"], description: "Developer of a cellular IoT connectivity and connected vehicle platform designed to improve operational efficiency.", status: "available", url: "https://www.aeris.com/", discount: "10%" },
  { name: "Ag-Analytics", tags: ["Data"], description: "Ag-Analytics houses and maintains a large warehouse of historic and current agricultural-related data to provide insights to farmers, researchers, and policymakers.", status: "available", url: "https://www.analytics.ag/", discount: "10%" },
  { name: "Agri-neo", tags: ["Cost"], description: "Agri-Neo helps safely feed the world by assembling Food Safety Systems for Neo-Pure and conducts food safety science done by chemists, microbiologists, and engineers.", status: "available", url: "https://www.agri-neo.com" },
  { name: "Agricxlab", tags: ["Supply Chain", "Data"], description: "Agricxlab uses computer vision and artificial intelligence on images to yield a quality assessment of agri-produce.", status: "available", url: "http://www.agricx.com" },
  { name: "Agrivi", tags: ["Supply Chain"], description: "Agrivi is one of the leading global ag-tech companies in farm management software, changing the way food is produced.", status: "available", url: "https://www.agrivi.com/en" },
  { name: "AGSHIFT", tags: ["Sustainability"], description: "AgShift is an AI based food technology start-up working on designing world's most advanced autonomous food inspection system.", status: "available", url: "https://www.agshift.com" },
  { name: "Agtools Inc", tags: ["Supply Chain"], description: "A data analysis platform intended to help growers, processors and distributors to improve their yield by providing real-time and critical data.", status: "available", url: "https://www.agtechtools.com/" },
  { name: "AgTrace", tags: ["Supply Chain"], description: "A blockchain traceability solution that tracks all stages of the food value chain.", status: "available", url: "https://agtrace.ag/en/", discount: "10%" },
  { name: "AI Palette", tags: ["Marketing"], description: "Ai Palette identifies food trends in real-time while uncovering consumer needs and motivations.", status: "available", url: "https://www.aipalette.com/", discount: "10%" },
  { name: "Alpha food labs", tags: ["Nutrition"], description: "Alpha Food Labs builds and launches new food and beverage products.", status: "available", url: "https://www.alphafoodlabs.com/" },
  { name: "Arc-net", tags: ["Supply Chain"], description: "Developer of a platform designed to provide a secure, immutable, and trustable means to control and share product data.", status: "available", url: "http://www.arc-net.io/", discount: "10%" },
  { name: "Authena AG", tags: ["Cost"], description: "Authena AG's platform protects product identity against counterfeit, product diversion and fraud.", status: "available", url: "https://authena.io", discount: "30%" },
  { name: "Axxya systems", tags: ["Nutrition"], description: "Creator of the Nutritionist Pro family of applications which provide thorough nutrient analysis of food labels, diets, menus and recipes.", status: "available", url: "https://www.nutritionistpro.com/" },
  { name: "BeefMarket", tags: ["Cost", "Supply Chain"], description: "BeefMarket is a fractional investment platform for investors to invest in beef production.", status: "available", url: "https://beefmarket.ai" },
  { name: "Berkshire Grey", tags: ["Cost"], description: "Combining AI and Robotics, Berkshire Grey automates omni-channel fulfillment for retailers, eCommerce, and logistics enterprises.", status: "available", url: "https://www.berkshiregrey.com/" },
  { name: "Te-Food", tags: ["Cost", "Supply Chain"], description: "A whole-chain traceability solution covering all logistics, food safety activities, and data management of the supply chain.", status: "available", url: "http://www.biggroup.it" },
  { name: "Blue Ridge", tags: ["Supply Chain"], description: "Blue Ridge leverages data sets, machine learning-driven recommendations, and pricing simulations to enable retailers to proactively understand the financial impact of each purchasing decision.", status: "available", url: "https://blueridgeglobal.com/", discount: "10%" },
  { name: "Brandwatch", tags: ["Marketing"], description: "Brandwatch allows users to segment data into categories relevant to the business as well as break-down the data and analyze it.", status: "available", url: "https://www.brandwatch.com/" },
  { name: "Brightloom", tags: ["Marketing"], description: "First of its kind customer growth platform, providing consumer brands with a personalized customer engagement solution.", status: "available", url: "https://www.brightloom.com/" },
  { name: "Brightseed", tags: ["Plant-Based", "Product Data"], description: "Brightseed enables a healthier future by illuminating and activating the biological connections between plants and people.", status: "available", url: "https://brightseedbio.com/" },
  { name: "brinc.io", tags: ["Sustainability"], description: "A venture capital and accelerator firm that supports and mentors founders to help them grow and change how we move, what we eat, how we feel.", status: "available", url: "https://www.brinc.io/" },
  { name: "Buhlergroup", tags: ["Supply Chain"], description: "Buhler technologies provides process solutions along complete value chains to make full use of digitalization.", status: "available", url: "https://www.buhlergroup.com/" },
  { name: "byFlow", tags: ["Sustainability"], description: "byFlow changes the way food is prepared and experienced by developing and selling 3D Printing Technology.", status: "available", url: "https://www.3dbyflow.com/" },
  { name: "byzzer", tags: ["Supply Chain", "Data"], description: "Byzzer is a subscription-based platform that leverages NielsenIQ retail data to help small CPG manufacturers.", status: "available", url: "https://byzzer.com/", discount: "20%" },
  { name: "Cascades", tags: ["Sustainability"], description: "Cascades offers sustainable, innovative, and value-added packaging, hygiene, and recovery solutions.", status: "available", url: "https://www.cascades.com/en" },
  { name: "CDP", tags: ["Sustainability"], description: "The only global disclosure system for companies, cities, states and regions to manage their environmental impacts.", status: "available", url: "https://www.cdp.net/en" },
  { name: "Chainpoint", tags: ["Supply Chain", "Cost"], description: "Chainpoint manages and shares product, process and supplier information, from raw material to finished product.", status: "available", url: "https://www.chainpoint.com/", discount: "10%" },
  { name: "Chicory", tags: ["Marketing"], description: "Chicory assists users to discover recipes across the web and create a shopping list with all the needed ingredients.", status: "available", url: "https://chicory.co/", discount: "10%" },
  { name: "Cintech", tags: ["Sustainability"], description: "Cintech increases competitiveness and fosters innovation within Quebec's agrifood industry.", status: "available", url: "https://en.cintech.ca/" },
  { name: "Clarifruit", tags: ["Supply Chain"], description: "Clarifruit offers an automated, end-to-end quality control as a service (QCaaS) platform for fresh fruit and vegetable quality control.", status: "available", url: "https://www.clarifruit.com/" },
  { name: "Clear Labs", tags: ["Supply Chain"], description: "Clear Labs collects hundreds of millions of data points per analysis to reduce disease outbreaks and unlock additional opportunities.", status: "available", url: "https://www.clearlabs.com/", discount: "10%" },
  { name: "Climatechange.ai", tags: ["Sustainability"], description: "Provides news, analysis and market intelligence on global climate change.", status: "available", url: "https://www.climatechange.ai/" },
  { name: "Climax Foods", tags: ["Sustainability", "Data"], description: "Uses data science to accelerate the food innovation processes through focused experimentation.", status: "available", url: "https://www.climaxfoods.com/", discount: "10%" },
  { name: "CMX", tags: ["Supply Chain"], description: "CMX helps the 'hidden heroes' of product safety and quality to build and maintain trust with their customers.", status: "available", url: "https://www.cmx1.com/", discount: "10%" },
  { name: "Comerso", tags: ["Sustainability"], description: "Developer of a food management platform designed to offer surplus food delivery services.", status: "available", url: "https://comerso.fr/en/homepage/" },
  { name: "Connecting Food", tags: ["Marketing"], description: "Developer of food tracing platform designed to bring in traceability and transparency in the supply chain process.", status: "available", url: "https://connecting-food.com" },
  { name: "Controlant", tags: ["Supply Chain"], description: "Delivers value across the end-to-end supply chain by dramatically increasing the visibility of product flow.", status: "available", url: "http://controlant.com" },
  { name: "Cooki", tags: ["Cost", "Supply Chain"], description: "Online Software for food information focusing on nutritional values, allergens, contaminations, food cost, and labels.", status: "available", url: "https://www.cooki.it" },
  { name: "Copia", tags: ["Sustainability", "Food Tracking"], description: "A food waste management system operating through the donations of excess food.", status: "available", url: "https://www.gocopia.com/" },
  { name: "Crisp", tags: ["Sustainability", "Data"], description: "Developer of SaaS platform that ingests and analyzes data from various sources and provides forecasts on food supply and demand.", status: "available", url: "https://www.gocrisp.com/", discount: "10%" },
  { name: "Crobox", tags: ["Marketing"], description: "Crobox customizes the way shoppers interact with products on an individual level.", status: "available", url: "http://crobox.com" },
  { name: "Crunchbase", tags: ["Marketing"], description: "Leading provider of private-company prospecting and research solutions.", status: "pending", url: "https://www.crunchbase.com" },
  { name: "CX.i", tags: ["Data", "Marketing"], description: "CX.i gives direct customer retail purchase data and insights and integrates into Journey Foods.", status: "pending", url: "https://www.customerxi.com/", discount: "10%" },
  { name: "DAAP", tags: ["Marketing", "Data"], description: "DAAP, a preferred partner for data harmonization, brings data streams into a consolidated view.", status: "available", url: "https://www.daapllc.com" },
  { name: "Datafiniti", tags: ["Cost", "Data", "Product Data"], description: "Provides instant access to business, people, product, and property data sources from thousands of websites.", status: "available", url: "https://datafiniti.co/" },
  { name: "Dear Systems", tags: ["Supply Chain", "Marketing"], description: "DEAR Systems is a software development company that offers a cloud-based inventory system.", status: "available", url: "https://dearsystems.com/" },
  { name: "Destini", tags: ["Marketing"], description: "Destini is the leading store-level data product locator and intelligence solution across the U.S. and Canada for the CPG industry.", status: "available", url: "https://destini.co/" },
  { name: "Dynamic Yield", tags: ["Marketing"], description: "Dynamic Yield helps enterprise brands quickly deliver and test personalized digital customer interactions.", status: "available", url: "https://www.dynamicyield.com/", discount: "10%" },
  { name: "EAT Grim", tags: ["Sustainability"], description: "GRIM fights food waste by creating a marketplace for ugly and surplus produce.", status: "available", url: "https://eatgrim.com/", discount: "10%" },
  { name: "Eaternity", tags: ["Sustainability"], description: "Eaternity develops a solution for the food industry to measure exactly and efficiently the environmental footprint of food products.", status: "available", url: "https://eaternity.org/" },
  { name: "Ecotone Renewables", tags: ["Sustainability"], description: "Ecotone Renewables works to close the food loop by sustainably processing food waste on-site.", status: "available", url: "https://ecotonerenewables.com" },
  { name: "Elementum", tags: ["Supply Chain", "Product Data"], description: "Elementum's SaaS platform centralizes information and communication to drive real-time decisions.", status: "available", url: "https://www.elementum.com/", discount: "10%" },
  { name: "Engage", tags: ["Marketing"], description: "Engage provides a solution platform that acts as a control layer between organizations and their customers.", status: "available", url: "https://engage.com/", discount: "10%" },
  { name: "Engine insights", tags: ["Marketing"], description: "ENGINE is a new kind of data-driven solutions company offering marketing solutions from insights and content to distribution.", status: "available", url: "https://engine-insights.com/", discount: "10%" },
  { name: "Erudus", tags: ["Nutrition", "Product Data"], description: "Uniting the food industry around data, Erudus provides accurate allergen, nutritional and technical product information.", status: "available", url: "https://erudus.com/" },
  { name: "ESHA", tags: ["Nutrition"], description: "ESHA's nutritional software products are recognized as the industry's top choice for food formulation and labeling.", status: "pending", url: "https://esha.com/", discount: "15%" },
  { name: "Esko", tags: ["Packaging"], description: "Esko provides integrated solutions for packaging, printing, and finishing.", status: "available", url: "https://www.esko.com/en" },
  { name: "Eversight", tags: ["Marketing"], description: "Eversight's digital testing platform offers expertise in retail pricing using predictive analytics and machine learning.", status: "available", url: "https://eversightlabs.com/", discount: "10%" },
  { name: "Farmcrowdy", tags: ["Supply Chain"], description: "Farmcrowdy is Nigeria's first digital agriculture platform, enabling environments for key players in the food value chain.", status: "available", url: "https://www.farmcrowdy.com/" },
  { name: "Fi Global insights", tags: ["Cost", "Marketing", "Data"], description: "Fi Global Insights provides food and beverage professionals with personalized business solutions.", status: "available", url: "https://insights.figlobal.com/" },
  { name: "Fieldcraft", tags: ["Supply Chain", "Sustainability"], description: "Fieldcraft is a supply chain for sustainable agriculture, serving as the first farm to foodtech ingredient marketplace.", status: "available", url: "https://www.fieldcraft.com/" },
  { name: "FlavorWiki", tags: ["Marketing", "Data"], description: "FlavorWiki evaluates flavor, texture, aroma and mouthfeel simultaneously by turning normal consumers into accurate taste testers.", status: "available", url: "https://www.flavorwiki.com" },
  { name: "Food future strategies", tags: ["Marketing"], description: "Food Future Strategies serves as a trusted and committed strategic partner in helping brands break new ground.", status: "available", url: "http://foodfuturestrategies.com/" },
  { name: "Food insight", tags: ["Nutrition", "Data"], description: "A nonprofit educational organization focused on nutrition, food safety and agriculture.", status: "available", url: "https://foodinsight.org/", discount: "10%" },
  { name: "Food Safe System", tags: ["Cost", "Nutrition"], description: "Food Safe System digitises and automates food safety compliance for the food service industry.", status: "available", url: "https://www.foodsafesystem.com" },
  { name: "Food Systems Dashboard", tags: ["Nutrition"], description: "Food Systems Dashboard introduces effective and usable technologies into the professional kitchen.", status: "available", url: "https://foodsystemsdashboard.org/" },
  { name: "FoodLab", tags: ["Nutrition", "Regulatory & Compliance"], description: "Food Lab Inc. provides comprehensive nutritional analysis services and FDA compliant food labels.", status: "available", url: "https://foodlab.com/" },
  { name: "FoodLogiQ", tags: ["Supply Chain"], description: "FoodLogiQ connects the world's food supply chain for food safety compliance and whole chain traceability.", status: "available", url: "https://www.foodlogiq.com/" },
  { name: "Foodpairing", tags: ["Marketing", "Cost", "Nutrition"], description: "Foodpairing inspire chefs globally to create new flavor combinations based on science.", status: "available", url: "https://www.foodpairing.com" },
  { name: "Footprint", tags: ["Sustainability"], description: "Footprint is a sustainable technology firm focused on reducing or eliminating plastics.", status: "available", url: "https://www.footprintus.com/" },
  { name: "Fox-tech co.", tags: ["Supply Chain", "Data"], description: "Fox-Tech Co. monitors, tracks and improves operations by enabling business owners to have temperature and humidity alerts.", status: "available", url: "https://www.fox-tech.co" },
  { name: "Fresh Check", tags: ["Cost", "Nutrition"], description: "Fresh Check manufactures a sticker that changes color when the food becomes stale or infested with bacteria.", status: "available", url: "https://freshcheckuk.com" },
  { name: "Full Harvest", tags: ["Sustainability", "Supply Chain", "Food Tracking"], description: "Full Harvest is an online food distribution marketplace for surplus and imperfect produce.", status: "available", url: "https://www.fullharvest.com/", discount: "15%" },
  { name: "Gastrograph", tags: ["Cost", "Nutrition", "Marketing"], description: "Gastrograph uses artificial intelligence to understand human sensory perceptions and develop products.", status: "available", url: "https://www.gastrograph.com/" },
  { name: "Genuine way", tags: ["Supply Chain"], description: "Genuine Way utilizes blockchain technology to certify authenticity and production quality of consumer goods.", status: "available", url: "https://www.genuineway.io" },
  { name: "FoodGenius", tags: ["Cost", "Marketing", "Data"], description: "Provider of data services and analytics for the foodservice industry.", status: "available", url: "https://getfoodgenius.com/" },
  { name: "GoodFood Institute", tags: ["Alternative Meats"], description: "GoodFood Institute identifies the most effective solutions for alternative proteins.", status: "available", url: "http://www.gfi.org" },
  { name: "Goodr", tags: ["Sustainability"], description: "Goodr provides a secure ledger that tracks an organization's surplus food from pickup to donation.", status: "available", url: "https://www.goodr.co/" },
  { name: "Greencovery", tags: ["Sustainability"], description: "Greencovery provides food technology intended to enable food companies to produce sustainable ingredients.", status: "available", url: "https://greencovery.com/about/", discount: "10%" },
  { name: "GreenPod Labs", tags: ["Sustainability"], description: "GreenPod Labs uses nanotechnology to extend the shelf life of fruits and vegetables.", status: "available", url: "https://greenpodlabs.com/", discount: "10%" },
  { name: "Grovara", tags: ["Network", "Cost"], description: "Grovara connects hundreds of natural and organic brands with international retailers in a single online marketplace.", status: "available", url: "https://www.grovara.com/" },
  { name: "Growinco", tags: ["Supply Chain"], description: "Growin connects eco-systems and its needs to build a more efficient environment.", status: "available", url: "http://www.growinco.com" },
  { name: "Holifresh", tags: ["Supply Chain"], description: "Holifresh has developed a digital thermometer platform designed to monitor the parameters of the cold chain.", status: "available", url: "https://www.holifresh.eu/" },
  { name: "Hooro", tags: ["Marketing"], description: "HOORO intercepts consumer purchases at brick and mortar stores to optimize inventory with predictive models.", status: "available", url: "https://www.hooro.it" },
  { name: "How Good", tags: ["Sustainability"], description: "How Good offers a data model of 33,000 ingredients and chemicals to provide holistic analysis of environmental and social impact.", status: "available", url: "http://www.howgood.com" },
  { name: "IBM Food Trust", tags: ["Cost", "Marketing", "Supply Chain", "Product Data"], description: "IBM Food Trust is a network to connect participants across the food supply through a permissioned, permanent and shared record.", status: "available", url: "https://www.ibm.com/blockchain/solutions/food-trust" },
  { name: "Infer by Ignite Tech", tags: ["Marketing"], description: "Infer helps companies' marketing strategies by identifying the most promising prospects.", status: "available", url: "https://ignitetech.com/softwarelibrary/infer" },
  { name: "Ingredients Online", tags: ["Supply Chain", "Nutrition"], description: "ingredientsonline.com is an innovative online e-commerce platform providing complete transparency in supply chain sourcing.", status: "available", url: "https://www.ingredientsonline.com/", discount: "10%" },
  { name: "Inmar intelligence", tags: ["Supply Chain", "Data", "Network"], description: "Inmar Intelligence navigates company business challenges through advanced analytics.", status: "available", url: "https://www.inmar.com/" },
  { name: "Innit", tags: ["Marketing"], description: "Innit provides a personalized food information application designed to empower people through food.", status: "available", url: "https://www.innit.com/withinnit/" },
  { name: "Innoscentia", tags: ["Cost", "Supply Chain"], description: "Innoscentia provides a unique sensor technology that indicates food status in real time.", status: "available", url: "http://www.innoscentia.com/" },
  { name: "Innova market insights", tags: ["Marketing"], description: "Innova informs the global food industry with market intelligence and research.", status: "available", url: "https://www.innovamarketinsights.com/" },
  { name: "IntelliDigest", tags: ["Sustainability"], description: "IntelliDigest seeks to end edible food waste while converting inedible food waste to bio-energy.", status: "available", url: "https://IntelliDigest.com" },
  { name: "IRI insights", tags: ["Marketing"], description: "IRI is a leading provider of big data, predictive analytics and forward-looking insights for CPG.", status: "available", url: "https://www.iriworldwide.com/" },
  { name: "iSense", tags: ["Flavor", "Data"], description: "Provider of a digital sensor operation marketplace intended to optimize and benchmark flavor collections.", status: "available", url: "https://www.isensegroup.com/", discount: "10%" },
  { name: "Intelligent Shopper Solutions", tags: ["Marketing"], description: "Helps clients sustainably grow sales and profits by creating relevant shopping experiences.", status: "hidden", url: "https://intelligentshoppersolutions-global.com/", discount: "12%" },
  { name: "JustFood", tags: ["Supply Chain", "Business Growth"], description: "JustFood ERP software helps food manufacturers and food distributors improve food safety.", status: "available", url: "http://justfooderp.com/" },
  { name: "Kiinns", tags: ["Supply Chain"], description: "Kiinns is a food-safety startup that completely eliminates cleaning processes in the food industry.", status: "available", url: "https://www.kiinns.com/" },
  { name: "Kitro", tags: ["Cost", "Nutrition", "Sustainability"], description: "Kitro is an automated management system designed to reduce food waste in a data-driven way.", status: "available", url: "https://www.kitro.ch" },
  { name: "Knoema", tags: ["Marketing", "Data"], description: "Knoema's platform connects data with analytical and presentation tools for visualization.", status: "available", url: "https://knoema.com/" },
  { name: "Kolabtree", tags: ["Network", "Cost"], description: "Kolabtree connects labs and businesses to scientists from all over the world.", status: "available", url: "https://www.kolabtree.com/" },
  { name: "Leanpath", tags: ["Sustainability"], description: "Leanpath has developed a food waste tracking technology designed to track and reduce food wastes.", status: "available", url: "https://www.leanpath.com/" },
  { name: "Leroma", tags: ["Supply Chain"], description: "Leroma is a B2B platform for the food processing industry, connecting food ingredients suppliers worldwide.", status: "available", url: "https://leroma.de/main/index.html" },
  { name: "Leverage", tags: ["Supply Chain"], description: "Leverage is your ultimate control tower for end-to-end supply chain management powered by AI.", status: "available", url: "https://www.tryleverage.ai/" },
  { name: "Lumachain", tags: ["Supply Chain"], description: "Lumachain brings transparency to global supply chains, benefitting producers, enterprises and consumers.", status: "available", url: "https://lumachain.io/" },
  { name: "Map Of AG", tags: ["Cost", "Supply Chain"], description: "Map of AG is the operator of a data platform to connect farm and agri-food sector data.", status: "available", url: "https://www.mapof.ag" },
  { name: "Market Research", tags: ["Marketing"], description: "MarketResearch.com is a leading provider of global market intelligence products and services.", status: "available", url: "https://www.marketresearch.com/" },
  { name: "Matsmart", tags: ["Sustainability"], description: "Matsmart sells surplus food online.", status: "available", url: "http://www.matsmart.se/", discount: "10%" },
  { name: "Mimica", tags: ["Sustainability"], description: "Mimica is creating the next generation of food expiry labelling that reduces food waste.", status: "available", url: "https://www.mimicalab.com/" },
  { name: "Mintec", tags: ["Cost"], description: "Mintec is the provider of global food commodity pricing data with more than 14,000 food ingredients.", status: "pending", url: "https://www.mintecglobal.com/", discount: "10%" },
  { name: "Mintel", tags: ["Product Data"], description: "Mintel provides a unique perspective on global and local economies delivering predictive analytics.", status: "pending", url: "https://www.mintel.com/", discount: "15%" },
  { name: "Monday", tags: ["Marketing", "Business Growth"], description: "Monday.com is a project management tool that enables organizations to manage tasks, projects, and teamwork.", status: "available", url: "https://monday.com/", discount: "10%" },
  { name: "Mori", tags: ["Sustainability"], description: "Mori is an all-natural protective layer that slows down the spoiling process of fruits, veggies, meats, and seafood.", status: "available", url: "https://www.mori.com/" },
  { name: "Morning Consult", tags: ["Marketing"], description: "Morning Consult collects data from daily interviews of nationally representative populations.", status: "available", url: "https://morningconsult.com/" },
  { name: "Mycocycle", tags: ["Sustainability"], description: "Mycocycle develops technologies utilizing the science of mycology and diverts materials from landfills.", status: "available", url: "https://mycocycle.com/", discount: "20%" },
  { name: "Natural Development", tags: ["Cost", "Nutrition"], description: "Natural Development specializes in helping brands launch new products in the natural and organic space.", status: "available", url: "https://www.naturaldevelop.com/" },
  { name: "NCCOR", tags: ["Marketing"], description: "NCCOR brings together leading research funders to strengthen research and accelerate progress in reducing childhood obesity.", status: "pending", url: "https://tools.nccor.org/css/" },
  { name: "Netbase Quid", tags: ["Marketing"], description: "Netbase Quid processes indexed resources across all forms of data, enabling clients to improve engagement.", status: "available", url: "https://netbasequid.com/" },
  { name: "New Hope Network", tags: ["Marketing"], description: "New Hope Network helps businesses identify people, products, partnerships and trends that create opportunities.", status: "available", url: "https://www.newhope.com/" },
  { name: "Nielsen", tags: ["Marketing"], description: "Nielsen Holdings is a leading global data and analytics company that provides understanding of the media industry.", status: "available", url: "https://www.nielsen.com/" },
  { name: "NPD", tags: ["Marketing"], description: "NPD offers data, industry expertise, and prescriptive analytics to help clients grow their businesses.", status: "pending", url: "https://www.npd.com/", },
  { name: "NutraSign", tags: ["Supply Chain"], description: "NutraSign is a solution backed by Blockchain technology that allows food companies to improve traceability.", status: "available", url: "https://www.nutrasign.io" },
  { name: "Oscillum", tags: ["Cost", "Nutrition", "Supply Chain"], description: "Oscillum develops sensors for wide applications in the agrifood sector.", status: "available", url: "https://www.oscillum.com" },
  { name: "OsiSoft", tags: ["Sustainability"], description: "OsiSoft is a data management platform that unlocks operational insights from real-time data.", status: "available", url: "https://www.osisoft.com/" },
  { name: "Otrafy", tags: ["Supply Chain"], description: "Otrafy helps food processors meet compliance and regulatory requirements faster.", status: "available", url: "https://www.otrafy.com/" },
  { name: "OZO Innovations", tags: ["Sustainability", "Cost"], description: "Ozo Innovations develops cost effective and safe oxidative solutions for food production.", status: "available", url: "https://ozoinnovations.com/" },
  { name: "Packaged facts", tags: ["Cost", "Marketing", "Data"], description: "Packaged Facts publishes authoritative market intelligence on consumer market topics.", status: "available", url: "https://www.packagedfacts.com/" },
  { name: "Personica", tags: ["Marketing"], description: "Personica builds technology that enables restaurants to create personal, lasting guest relationships.", status: "available", url: "https://www.personica.com/" },
  { name: "Petrel", tags: ["Sustainability"], description: "Petrel connects eCommerce and the circular economy to build zero waste solutions.", status: "available", url: "https://www.petrel.fr/" },
  { name: "Pinto", tags: ["Cost", "Marketing"], description: "Pinto tracks the nutrients, ingredients and other food data points relevant to dietary goals.", status: "available", url: "https://pinto.co/" },
  { name: "Planetly", tags: ["Sustainability"], description: "Planetly has developed a climate technology platform to get full transparency of carbon emissions.", status: "available", url: "https://www.planetly.com/", discount: "20%" },
  { name: "pOsti", tags: ["Nutrition", "Sustainability"], description: "pOsti enhances the traditional recipes of the Italian regions combining them with narration and certification.", status: "available", url: "https://posti.world" },
  { name: "Producers market", tags: ["Network"], description: "Producers Market is a market linkage platform dedicated to empowering producer members globally.", status: "available", url: "https://producersmarket.com/" },
  { name: "Provision Analytics", tags: ["Food Tracking", "Sustainability"], description: "Provision Analytics captures and interprets all your food data to enable your business to go 100% paperless.", status: "available", url: "https://provision.io/" },
  { name: "PTC", tags: ["Supply Chain"], description: "PTC is a global supplier of high quality food ingredients and co-manufactured snacks.", status: "available", url: "https://www.ptcfoods.com/" },
  { name: "Purfresh", tags: ["Sustainability"], description: "Purfresh offers controlled atmosphere systems designed to protect and preserve food and water.", status: "available", url: "https://www.purfresh.com/", discount: "10%" },
  { name: "Raveler", tags: ["Marketing"], description: "Provider of a digital platform for small-batch food businesses to get clarity and boost efficiency.", status: "hidden", url: "https://www.raveler.io" },
  { name: "ReciPal", tags: ["Nutrition"], description: "ReciPal takes care of nutrition analysis, nutrition fact labels, ingredient lists, and recipe costing.", status: "available", url: "https://www.recipal.com/" },
  { name: "Regrow", tags: ["Sustainability", "Food Tracking", "Supply Chain"], description: "Regrow is an automated agriculture platform designed to track, monitor, and manage crops.", status: "available", url: "https://www.regrow.ag/", discount: "10%" },
  { name: "rePurpose Global", tags: ["Sustainability"], description: "rePurpose Global empowers anybody to take meaningful environmental action and go Plastic Neutral.", status: "available", url: "https://repurpose.global/" },
  { name: "Retail velocity", tags: ["Marketing", "Supply Chain"], description: "Retail Velocity uses manufacturing and software experience to help clients eliminate inefficiencies.", status: "available", url: "https://www.retailvelocity.com/", discount: "10%" },
  { name: "Revuze", tags: ["Marketing", "Data"], description: "Revuze is a cloud-based business software designed to offer an all-automated customer opinions analyzer.", status: "available", url: "https://www.revuze.it/", discount: "10%" },
  { name: "Ripe", tags: ["Sustainability"], description: "Ripe's platform uses blockchain technology for data transparency to facilitate sustainability.", status: "available", url: "https://ripe.io" },
  { name: "Fastmarkets RISI", tags: ["Sustainability", "Food Tracking"], description: "Fastmarkets is the leading price reporting and analytics for metals, minerals and forest products.", status: "available", url: "https://www.risiinfo.com/" },
  { name: "Safetychain", tags: ["Sustainability"], description: "SafetyChain is the #1 Plant Management Platform that improves yield and maximizes productivity.", status: "available", url: "https://safetychain.com/" },
  { name: "Sampler", tags: ["Marketing"], description: "Sampler provides self-serve digital product sampling services.", status: "available", url: "https://sampler.io/", discount: "20%" },
  { name: "SAP", tags: ["Supply Chain"], description: "SAP engineers solutions to fuel innovation, foster equality, and spread opportunity.", status: "pending", url: "https://www.sap.com/", discount: "10%" },
  { name: "Save Foods", tags: ["Sustainability", "Supply Chain"], description: "Save Foods develops solutions for extending storability and shelf life of vegetables and fruits.", status: "available", url: "https://www.savefoods.co" },
  { name: "Seebo", tags: ["Sustainability", "Data"], description: "Seebo offers process-based artificial intelligence technology to predict and prevent quality losses.", status: "available", url: "https://www.seebo.com/", discount: "10%" },
  { name: "Senoptica Technologies", tags: ["Sustainability"], description: "Senoptica Technologies' sensor helps reduce food waste on resource-intensive foods.", status: "available", url: "https://senoptica.com" },
  { name: "SGS Digicomply", tags: ["Regulatory & Compliance"], description: "Digicomply is a smart intelligence network that combines AI and SGS expertise for regulatory data.", status: "available", url: "https://www.digicomply.com" },
  { name: "Shelf Engine", tags: ["Sustainability", "Supply Chain"], description: "Shelf Engine develops an automated prediction platform for grocery stores buying perishables.", status: "available", url: "https://www.shelfengine.com/", discount: "10%" },
  { name: "Skupos", tags: ["Marketing", "Supply Chain"], description: "Skupos automates inventory management and ordering with real-time inventory levels.", status: "available", url: "https://www.skupos.com/", discount: "10%" },
  { name: "SlantRange", tags: ["Supply Chain"], description: "SlantRange manufactures aerial remote drone sensors for agricultural metrics.", status: "available", url: "https://slantrange.com/" },
  { name: "Sourcemap", tags: ["Supply Chain"], description: "Sourcemap helps consumers and companies trace products to the source.", status: "available", url: "https://sourcemap.com/", discount: "10%" },
  { name: "SPINS", tags: ["Marketing"], description: "SPINS transforms raw data into intelligent business solutions for the Natural & Organic Products Industry.", status: "available", url: "https://www.spins.com/" },
  { name: "Spoiler Alert", tags: ["Supply Chain", "Sustainability"], description: "Spoiler Alert connects food manufacturers with a national network of discount channels.", status: "available", url: "https://www.spoileralert.com/" },
  { name: "SPRK", tags: ["Sustainability"], description: "SPRK's AI enabled distribution platform works with companies to make the global food chain waste free.", status: "available", url: "https://www.sprk.global/", discount: "20%" },
  { name: "Statista", tags: ["Marketing", "Data"], description: "Statista is a business data platform providing facts and insights including market research and analysis.", status: "available", url: "https://www.statista.com/", discount: "10%" },
  { name: "Stellapps", tags: ["Supply Chain"], description: "Stellapps is an end-to-end dairy technology solutions company for farm optimization.", status: "available", url: "https://www.stellapps.com/" },
  { name: "Suma", tags: ["Network"], description: "Suma connects family farmers to food buyers.", status: "available", url: "https://appsuma.com.br" },
  { name: "Supplyshift", tags: ["Supply Chain"], description: "Supplyshift turns supply chain data into actionable business intelligence.", status: "available", url: "https://www.supplyshift.net/", discount: "10%" },
  { name: "Sustainability consortium", tags: ["Sustainability"], description: "TSC is a global non-profit transforming the consumer goods industry for sustainability.", status: "available", url: "https://www.sustainabilityconsortium.org/" },
  { name: "SwissDeCode", tags: ["Supply Chain"], description: "SwissDeCode helps farmers and food manufacturers with rapid on-site DNA detection solutions.", status: "available", url: "https://www.swissdecode.com" },
  { name: "Syndigo", tags: ["Supply Chain", "Data"], description: "Syndigo combines a large database of consumer product images and information with category management.", status: "available", url: "https://www.syndigo.com/" },
  { name: "TABS analytics", tags: ["Marketing", "Supply Chain"], description: "TABS analytics allows CPG manufacturers to analyze sales and marketing data.", status: "available", url: "https://www.tabsanalytics.com/", discount: "10%" },
  { name: "Tastewise", tags: ["Marketing"], description: "Tastewise fuels food product innovation, sales, and marketing by predicting consumer behavior.", status: "available", url: "http://www.tastewise.io/" },
  { name: "Technomic", tags: ["Marketing"], description: "Technomic provides consulting and research services for food service clients.", status: "available", url: "https://www.technomic.com/", discount: "10%" },
  { name: "TetraPak", tags: ["Sustainability", "Packaging"], description: "TetraPak is creating carbon-neutral packaging.", status: "available", url: "http://www.tetrapak.com" },
  { name: "Tiffin Foods", tags: ["Sustainability", "Supply Chain"], description: "Tiffin Foods connects suppliers and representatives of healthy, craft, and natural foods.", status: "available", url: "https://tiffins.com.br/" },
  { name: "Tilkal", tags: ["Supply Chain", "Security"], description: "Tilkal's traceability platform identifies physical products to combat counterfeiting.", status: "available", url: "https://www.tilkal.com" },
  { name: "Topl", tags: ["Sustainability"], description: "Topl is an ESG tech company building a blockchain to help organizations prove their sustainable practices.", status: "available", url: "https://www.topl.co/" },
  { name: "Trace One", tags: ["Supply Chain", "Product Data"], description: "Trace One helps retailers and brand owners create responsible products to market faster.", status: "available", url: "https://www.traceone.com/en/" },
  { name: "Traceall Global", tags: ["Supply Chain"], description: "Traceall Global is a provider of global traceability solutions for blue chip brands.", status: "available", url: "https://www.traceallglobal.com" },
  { name: "Tracegains", tags: ["Supply Chain"], description: "TraceGains delivers cloud-based supplier compliance, quality, and innovation solutions.", status: "available", url: "https://www.tracegains.com/" },
  { name: "Transparent Path", tags: ["Cost", "Supply Chain"], description: "Transparent Path is focused on supply chain visibility to reduce food waste and financial risk.", status: "available", url: "https://xparent.io" },
  { name: "Trayak", tags: ["Sustainability"], description: "Trayak helps brands develop responsible packaging and products.", status: "available", url: "https://trayak.com/" },
  { name: "Treasure Data", tags: ["Marketing"], description: "Customer data platform for creating accurate customer profiles.", status: "available", url: "https://www.treasuredata.com/" },
  { name: "UKKO", tags: ["Cost", "Nutrition"], description: "UKKO is improving the lives of millions suffering from food allergies using cutting edge technologies.", status: "available", url: "https://www.ukko.us/" },
  { name: "UL Prospector", tags: ["Supply Chain"], description: "UL Prospector combines specialized raw material and ingredient information into one powerful search engine.", status: "available", url: "https://www.ulprospector.com/" },
  { name: "UpClear", tags: ["Cost", "Marketing"], description: "UpClear is a global Enterprise Software provider for Consumer Goods brands.", status: "available", url: "https://upclear.com/", discount: "10%" },
  { name: "Vegshelf", tags: ["Marketing"], description: "Vegshelf is a digital B2B platform connecting supermarkets and stores with plant-based food brands.", status: "available", url: "https://www.vegshelf.com" },
  { name: "Wasteless", tags: ["Sustainability"], description: "Wasteless is an intelligent grocery pricing software to reduce waste and optimize revenue.", status: "available", url: "https://www.wasteless.com/", discount: "10%" },
  { name: "Wenda", tags: ["Supply Chain"], description: "Wenda is a collaborative platform for supply chain process visibility and product tracking.", status: "available", url: "https://wenda-it.com/en/" },
  { name: "WGSN", tags: ["Marketing"], description: "WGSN provides expert product design and consumer forecasts with global trend insights.", status: "available", url: "https://www.wgsn.com/en/" },
  { name: "Winnow", tags: ["Sustainability"], description: "Winnow's digital tools provide data to drive improvements in kitchen production and cut food waste.", status: "available", url: "https://www.winnowsolutions.com/" },
  { name: "Yoran Imaging", tags: ["Sustainability"], description: "Yoran Imaging's monitoring system for heat-sealed packages reduces production slowdown.", status: "available", url: "https://www.yoran-imaging.com/" },
  { name: "Ypsicon", tags: ["Cost"], description: "Ypsicon develops new technologies for the food, pharmaceutical and cosmetics industries.", status: "available", url: "https://www.ypsicon.com" },
  { name: "Yume", tags: ["Supply Chain"], description: "Yume's wholesale food platform provides sale surplus food from suppliers at discounted rates.", status: "available", url: "https://www.yumefood.com.au" },
  { name: "ZetaGlobal", tags: ["Marketing"], description: "ZetaGlobal helps enterprises manage multiple vendor solutions across automation and omnichannel engagement.", status: "available", url: "https://zetaglobal.com/" },
  { name: "Oracle", tags: ["Supply Chain", "Data"], description: "Oracle offers integrated suites of applications plus secure, autonomous infrastructure in the Oracle Cloud.", status: "available", url: "https://www.oracle.com/" },
  { name: "Shopify", tags: ["Marketing", "Cost"], description: "Shopify is a complete commerce platform that lets you start, grow, and manage a business.", status: "available", url: "https://www.shopify.com/" },
  { name: "Odoo", tags: ["Supply Chain", "Business Growth"], description: "Odoo is a suite of open source business apps covering CRM, eCommerce, manufacturing, and more.", status: "available", url: "https://www.odoo.com/" },
  { name: "IBM", tags: ["Data", "Supply Chain"], description: "IBM provides cognitive solutions, cloud services, and enterprise technology.", status: "available", url: "https://www.ibm.com/" },
]

// ─── Helper: generate initials or icon from name ───────────────────────────
function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

const tagColorMap: Record<string, { bg: string; text: string }> = {
  "Data": { bg: "bg-blue-50", text: "text-blue-700" },
  "Marketing": { bg: "bg-indigo-50", text: "text-indigo-700" },
  "Nutrition": { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Supply Chain": { bg: "bg-amber-50", text: "text-amber-700" },
  "Sustainability": { bg: "bg-green-50", text: "text-green-700" },
  "Cost": { bg: "bg-rose-50", text: "text-rose-700" },
  "Product Data": { bg: "bg-sky-50", text: "text-sky-700" },
  "Food Tracking": { bg: "bg-orange-50", text: "text-orange-700" },
  "Packaging": { bg: "bg-teal-50", text: "text-teal-700" },
  "Regulatory & Compliance": { bg: "bg-red-50", text: "text-red-700" },
  "Business Growth": { bg: "bg-cyan-50", text: "text-cyan-700" },
  "Network": { bg: "bg-fuchsia-50", text: "text-fuchsia-700" },
  "Plant-Based": { bg: "bg-lime-50", text: "text-lime-700" },
  "Alternative Meats": { bg: "bg-pink-50", text: "text-pink-700" },
  "Flavor": { bg: "bg-yellow-50", text: "text-yellow-700" },
  "Manufacturing": { bg: "bg-slate-100", text: "text-slate-700" },
  "Security": { bg: "bg-zinc-100", text: "text-zinc-700" },
}

// ─── Request Modal ────────────────────────────────────────────────────────
function RequestModal({
  integration,
  onClose,
  onSubmit,
}: {
  integration: Integration
  onClose: () => void
  onSubmit: (message: string) => void
}) {
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    onSubmit(message)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Request Submitted</h2>
            <p className="text-sm text-slate-500 mb-6">
              {"Your request to connect with "}<span className="font-semibold text-slate-700">{integration.name}</span>{" has been submitted. We'll notify you when the integration is ready."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                {getInitials(integration.name)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Request {integration.name}</h2>
                <p className="text-sm text-slate-500">Submit a request to enable this integration</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-600">{integration.description}</p>
            {integration.url && (
              <a
                href={integration.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 transition-colors"
              >
                Visit website <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {integration.tags.map((tag) => {
              const color = tagColorMap[tag] || { bg: "bg-slate-100", text: "text-slate-600" }
              return (
                <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
                  {tag}
                </span>
              )
            })}
          </div>
          {integration.discount && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-sm text-emerald-700 font-medium">
                Journey Foods discount: {integration.discount} off
              </span>
            </div>
          )}
          <label className="block mb-2">
            <span className="text-sm font-medium text-slate-700">Message (optional)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your use case or specific needs..."
              rows={3}
              className="mt-1.5 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </label>
        </div>
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            <Send className="h-4 w-4" />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Connect Modal ────────────────────────────────────────────────────────
function ConnectModal({
  integration,
  onClose,
}: {
  integration: Integration
  onClose: () => void
}) {
  const [step, setStep] = useState<"info" | "connecting" | "connected">("info")

  const handleConnect = () => {
    setStep("connecting")
    setTimeout(() => setStep("connected"), 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-lg">
                {integration.name === "Microsoft Excel" ? (
                  <FileSpreadsheet className="h-6 w-6" />
                ) : integration.name === "CSV Upload" ? (
                  <FileText className="h-6 w-6" />
                ) : (
                  getInitials(integration.name)
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Connect {integration.name}</h2>
                <p className="text-sm text-slate-500">Set up your data connection</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === "info" && (
            <>
              <p className="text-sm text-slate-600 mb-4">{integration.description}</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Automatic data sync</p>
                    <p className="text-xs text-slate-500">Your data will be synced in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Secure connection</p>
                    <p className="text-xs text-slate-500">All data is encrypted end-to-end</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Easy setup</p>
                    <p className="text-xs text-slate-500">Connect in just a few clicks</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Link2 className="h-4 w-4" />
                Connect Now
              </button>
            </>
          )}

          {step === "connecting" && (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-700">Connecting to {integration.name}...</p>
              <p className="text-xs text-slate-500 mt-1">This may take a moment</p>
            </div>
          )}

          {step === "connected" && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Connected!</h3>
              <p className="text-sm text-slate-500 mb-6">
                {integration.name} is now connected to your Journey Foods account.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Integration Card ─────────────────────────────────────────────────────
function IntegrationCard({
  integration,
  onRequest,
  onConnect,
}: {
  integration: Integration
  onRequest: (i: Integration) => void
  onConnect: (i: Integration) => void
}) {
  const isConnectable = integration.connectable
  const isPending = integration.status === "pending"

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          {integration.name === "Microsoft Excel" ? (
            <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
          ) : integration.name === "CSV Upload" ? (
            <FileText className="h-7 w-7 text-amber-600" />
          ) : integration.name === "Google Sheets" ? (
            <FileSpreadsheet className="h-7 w-7 text-green-600" />
          ) : integration.name === "Airtable" ? (
            <span className="text-xl font-bold text-blue-600">At</span>
          ) : integration.name === "Google Cloud" ? (
            <span className="text-xl font-bold text-sky-600">GC</span>
          ) : integration.name === "Snowflake" ? (
            <span className="text-xl font-bold text-cyan-600">Sf</span>
          ) : (
            <span className="text-sm font-bold text-slate-500">{getInitials(integration.name)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{integration.name}</h3>
            {isPending && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium">
                Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{integration.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {integration.tags.slice(0, 3).map((tag) => {
              const color = tagColorMap[tag] || { bg: "bg-slate-100", text: "text-slate-600" }
              return (
                <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color.bg} ${color.text}`}>
                  {tag}
                </span>
              )
            })}
            {integration.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                +{integration.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {integration.discount && (
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {integration.discount} off
          </span>
        )}
        {!integration.discount && <span />}
        {isConnectable ? (
          <button
            type="button"
            onClick={() => onConnect(integration)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Link2 className="h-3.5 w-3.5" />
            Connect
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onRequest(integration)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <Link2 className="h-3.5 w-3.5" />
            Request
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main IntegrationsPage Component ──────────────────────────────────────
export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("data-sources")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [requestModal, setRequestModal] = useState<Integration | null>(null)
  const [connectModal, setConnectModal] = useState<Integration | null>(null)
  const [requests, setRequests] = useState<IntegrationRequest[]>([])
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)

  const handleRequest = (integration: Integration) => {
    setRequestModal(integration)
  }

  const handleConnect = (integration: Integration) => {
    setConnectModal(integration)
  }

  const handleRequestSubmit = (message: string) => {
    if (requestModal) {
      setRequests((prev) => [
        {
          id: `req-${Date.now()}`,
          integrationName: requestModal.name,
          requestedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: "pending",
          message,
        },
        ...prev,
      ])
    }
  }

  // Filter market integrations
  const filteredMarket = useMemo(() => {
    return marketIntegrations
      .filter((i) => i.status !== "hidden")
      .filter((i) => {
        if (selectedCategory !== "All" && !i.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase())) return false
        if (searchQuery && !i.name.toLowerCase().includes(searchQuery.toLowerCase()) && !i.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
      })
  }, [selectedCategory, searchQuery])

  const filteredDataSources = useMemo(() => {
    return dataSourceConnections.filter((i) => {
      if (searchQuery && !i.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [searchQuery])

  const tabs: Array<{ key: IntegrationTab; label: string; count?: number }> = [
    { key: "data-sources", label: "Data Source Connections" },
    { key: "markets", label: "Markets" },
    { key: "requests", label: "Requests", count: requests.length },
  ]

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-slate-800 text-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Data Sources Tab ─────────────────────────────────────────── */}
      {activeTab === "data-sources" && (
        <div>
          <div className="mb-6">
            <p className="text-sm text-slate-600">
              Journey Foods provides a comprehensive list of data sources to collect and combine data from your marketing automation platforms, CRMs, A/B testing tools, and more. No code required.
            </p>
            <p className="text-sm text-slate-500 mt-1">Select a source from the list below to learn more!</p>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search data sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDataSources.map((ds) => (
              <IntegrationCard
                key={ds.name}
                integration={ds}
                onRequest={handleRequest}
                onConnect={handleConnect}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── Markets Tab ──────────────────────────────────────────────── */}
      {activeTab === "markets" && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Connect your market research data to your innovation team.</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl mx-auto">
              {"Whether it's your own data or third-party data, find out more about our key partners and contact us to connect to other partners."}
            </p>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category filter dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory !== "All"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {selectedCategory === "All" ? "Category" : selectedCategory}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 max-h-72 overflow-y-auto">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat)
                        setCategoryDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear filter
              </button>
            )}

            <span className="text-sm text-slate-400 ml-auto">
              {filteredMarket.length} integration{filteredMarket.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Quick category pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", "Marketing", "Supply Chain", "Sustainability", "Data", "Nutrition", "Cost"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Integration Grid */}
          {filteredMarket.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMarket.map((integration) => (
                <IntegrationCard
                  key={integration.name}
                  integration={integration}
                  onRequest={handleRequest}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No integrations found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Requests Tab ─────────────────────────────────────────────── */}
      {activeTab === "requests" && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Your Integration Requests</h2>
            <p className="text-sm text-slate-500 mt-1">Track the status of your integration requests.</p>
          </div>

          {requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Link2 className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800">{req.integrationName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Requested on {req.requestedAt}</p>
                    {req.message && (
                      <p className="text-xs text-slate-400 mt-1 truncate">{"Message: "}{req.message}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : req.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Send className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No requests yet</h3>
              <p className="text-sm text-slate-500">
                Browse the <button type="button" onClick={() => setActiveTab("markets")} className="text-blue-600 font-medium hover:text-blue-700">Markets</button> tab to request integrations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {requestModal && (
        <RequestModal
          integration={requestModal}
          onClose={() => setRequestModal(null)}
          onSubmit={handleRequestSubmit}
        />
      )}
      {connectModal && (
        <ConnectModal
          integration={connectModal}
          onClose={() => setConnectModal(null)}
        />
      )}
    </div>
  )
}
