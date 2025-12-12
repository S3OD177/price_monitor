export const APPWRITE_CONFIG = {
    ENDPOINT: "https://fra.cloud.appwrite.io/v1",
    PROJECT_ID: "691cea5d0001ae1c3ee1",
    PROJECT_NAME: "pricewatcher",
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "PriceMonitorDB",
    COLLECTIONS: {
        PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS || "Products",
        COMPETITORS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COMPETITORS || "Competitors",
        PRICES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRICES || "PriceHistory",
        STORES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_STORES || "Stores",
        SCRAPING_REPORTS: "scraping_reports",
    }
}
