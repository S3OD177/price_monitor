'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface SearchResult {
    name: string
    price: number
    currency: string
    url: string
    platform: string
    sku?: string
    imageUrl?: string
    confidence?: number
    matchReason?: string
}

/**
 * Search the web for competitors using Gemini AI
 * Optimized for single-request efficiency
 */
export async function searchWithGemini(
    sku: string,
    productName: string,
    referencePrice: number
): Promise<SearchResult[]> {
    try {
        // Use gemini-1.5-flash for speed and lower cost/quota usage
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `Task: Find competitor products in Saudi Arabia e-commerce stores.
Target Product:
- SKU: "${sku}"
- Name: "${productName}"
- Reference Price: ${referencePrice} SAR

Instructions:
1. Search for the exact SKU "${sku}" first.
2. If exact SKU not found, look for the product by Name "${productName}".
3. Focus on Saudi stores: Salla.sa, Noon.com, Jarir.com, Extra.com, Amazon.sa.
4. Validate matches:
   - Calculate "confidence" (0-100) based on name/SKU match.
   - Flag "suspicious_price" if price is < ${referencePrice * 0.1} or > ${referencePrice * 3}.

Return JSON Array (NO markdown):
[
  {
    "name": "Product Name",
    "price": 299.99,
    "currency": "SAR",
    "url": "https://...",
    "platform": "salla",
    "sku": "Found SKU",
    "imageUrl": "https://...",
    "confidence": 95,
    "matchReason": "Exact SKU match"
  }
]
If nothing found, return [].`

        const result = await model.generateContent(prompt)
        const response = result.response.text()

        const cleanedResponse = response
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()

        try {
            const products = JSON.parse(cleanedResponse)
            return Array.isArray(products) ? products : []
        } catch (parseError) {
            console.error('[searchWithGemini] Failed to parse JSON:', cleanedResponse)
            return []
        }
    } catch (error) {
        console.error('[searchWithGemini] Error:', error)
        return []
    }
}

/**
 * Search the web using Brave Search API
 */
export async function searchWithBrave(sku: string): Promise<string[]> {
    if (!process.env.BRAVE_API_KEY) {
        console.log('[searchWithBrave] No API key configured')
        return []
    }

    try {
        const query = `"${sku}" (site:salla.sa OR site:noon.com OR site:jarir.com OR site:extra.com OR site:amazon.sa)`

        const response = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&country=sa&count=10`,
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Subscription-Token': process.env.BRAVE_API_KEY
                }
            }
        )

        if (!response.ok) {
            console.error('[searchWithBrave] API error:', response.status)
            return []
        }

        const data = await response.json()
        const urls = data.web?.results?.map((r: any) => r.url) || []

        return urls.filter((url: string) =>
            url.includes('.sa') ||
            url.includes('salla') ||
            url.includes('noon') ||
            url.includes('jarir') ||
            url.includes('extra')
        )
    } catch (error) {
        console.error('[searchWithBrave] Error:', error)
        return []
    }
}

/**
 * Scrape a URL using Jina AI Reader
 */
export async function scrapeWithJina(url: string): Promise<Partial<SearchResult> | null> {
    try {
        const response = await fetch(`https://r.jina.ai/${url}`, {
            headers: {
                'Accept': 'application/json',
                'X-Return-Format': 'json'
            }
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        const content = data.content || data.text || ''

        // Extract product info from markdown content
        const name = extractProductName(content)
        const price = extractPrice(content)
        const platform = detectPlatform(url)

        return {
            name,
            price,
            currency: 'SAR',
            url,
            platform,
            imageUrl: data.images?.[0]
        }
    } catch (error) {
        console.error('[scrapeWithJina] Error:', error)
        return null
    }
}

// Helper functions
function extractProductName(content: string): string {
    // Look for product name in markdown headers
    const headerMatch = content.match(/^#\s+(.+)$/m)
    if (headerMatch) return headerMatch[1]

    // Fallback to first line
    const firstLine = content.split('\n')[0]
    return firstLine.replace(/[#*]/g, '').trim()
}

function extractPrice(content: string): number {
    // Look for SAR prices
    const priceMatch = content.match(/(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:SAR|ريال|SR)/i)
    if (priceMatch) {
        return parseFloat(priceMatch[1].replace(/,/g, ''))
    }
    return 0
}

function detectPlatform(url: string): string {
    if (url.includes('salla')) return 'salla'
    if (url.includes('noon')) return 'noon'
    if (url.includes('jarir')) return 'jarir'
    if (url.includes('extra')) return 'extra'
    if (url.includes('amazon')) return 'amazon'
    return 'other'
}
