'use server'

import { createSessionClient } from "@/lib/appwrite/server"
import { revalidatePath } from "next/cache"

export async function addCompetitorLink(formData: FormData) {
    const { account } = await createSessionClient()
    try {
        await account.get()
    } catch (error) {
        throw new Error("Unauthorized")
    }

    const productId = formData.get('productId') as string
    const label = formData.get('label') as string
    const url = formData.get('url') as string

    try {
        // 1. Scrape the URL
        const { scrapeProduct } = await import("@/lib/scraping/scraper")
        const scrapedData = await scrapeProduct(url)

        // 2. Add Competitor to DB
        const { addCompetitor, addPrice } = await import("@/lib/data/appwrite")
        const competitor = await addCompetitor({
            product_id: productId,
            url: url,
            name: label || scrapedData?.title || "Competitor",
        })

        // 3. Add initial price
        if (scrapedData && scrapedData.price) {
            await addPrice({
                competitor_id: competitor.$id,
                price: scrapedData.price,
                currency: scrapedData.currency,
                scraped_at: new Date().toISOString()
            })
        }

        revalidatePath(`/dashboard/products`)
    } catch (error: any) {
        console.error("Failed to add competitor:", error)
        return { error: "Failed to add competitor" }
    }
}

export async function deleteCompetitorLink(linkId: string, productId: string) {
    const { account } = await createSessionClient()
    try {
        await account.get()
    } catch (error) {
        throw new Error("Unauthorized")
    }

    // Mock database deletion
    console.log("Deleting competitor link:", linkId)

    revalidatePath(`/products/${productId}`)
}
