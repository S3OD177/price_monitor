import * as cheerio from 'cheerio'

export interface ScrapedProduct {
    name: string
    price: number
    originalPrice?: number  // Price before discount
    currency: string
    imageUrl?: string
    description?: string
    stock?: number
    sku?: string  // Product SKU/code
}

/**
 * Scrapes product information from a URL
 * Supports common e-commerce platforms and meta tags
 */
export async function scrapeProductInfo(url: string): Promise<ScrapedProduct> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Extract product name
        const name = extractProductName($)

        // Extract price and currency (with sale price detection)
        const { price, originalPrice, currency } = extractPriceAndCurrency($, url)

        // Extract SKU
        const sku = extractSKU($, url)

        // Extract image
        const imageUrl = extractProductImage($)

        // Extract description
        const description = extractDescription($)

        // Extract stock (if available)
        const stock = extractStock($)

        return {
            name,
            price,
            originalPrice,
            currency,
            sku,
            imageUrl,
            description,
            stock
        }
    } catch (error: any) {
        console.error('[scrapeProductInfo] Error:', error)
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
}

function extractProductName($: cheerio.CheerioAPI): string {
    // Try multiple selectors in order of preference
    const selectors = [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
        'h1[itemprop="name"]',
        'h1.product-title',
        'h1.product-name',
        '.product-title h1',
        'h1'
    ]

    for (const selector of selectors) {
        const element = $(selector).first()
        if (element.length) {
            const content = element.attr('content') || element.text().trim()
            if (content) return content
        }
    }

    return 'Imported Product'
}

function extractPriceAndCurrency($: cheerio.CheerioAPI, url: string): { price: number; originalPrice?: number; currency: string } {
    let priceText = ''
    let originalPriceText = ''
    let currency = 'SAR' // Default currency

    // Determine currency based on URL
    if (url.includes('salla.sa')) {
        currency = 'SAR'
    } else if (url.includes('trendyol.com')) {
        currency = 'TRY'
    }

    // Try structured data (JSON-LD)
    const jsonLd = $('script[type="application/ld+json"]').toArray()
    for (const script of jsonLd) {
        try {
            const data = JSON.parse($(script).html() || '{}')
            if (data['@type'] === 'Product' && data.offers) {
                const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers
                if (offer.price) {
                    priceText = String(offer.price)
                    if (offer.priceCurrency) {
                        currency = offer.priceCurrency
                    }
                    // Check for original price (before discount)
                    if (offer.priceSpecification && offer.priceSpecification.price) {
                        originalPriceText = String(offer.priceSpecification.price)
                    }
                    break
                }
            }
        } catch (e) {
            // Skip invalid JSON
        }
    }

    // Try meta tags
    if (!priceText) {
        const metaPrice = $('meta[property="product:price:amount"]').attr('content') ||
            $('meta[property="og:price:amount"]').attr('content')
        if (metaPrice) {
            priceText = metaPrice
            const metaCurrency = $('meta[property="product:price:currency"]').attr('content') ||
                $('meta[property="og:price:currency"]').attr('content')
            if (metaCurrency) currency = metaCurrency
        }
    }

    // Try common price selectors (sale price first, then regular price)
    if (!priceText) {
        const salePriceSelectors = [
            '.sale-price',
            '.special-price',
            '.discounted-price',
            '.offer-price',
            '[data-price-type="sale"]'
        ]

        for (const selector of salePriceSelectors) {
            const element = $(selector).first()
            if (element.length) {
                priceText = element.attr('content') || element.text().trim()
                if (priceText) {
                    // Look for original price nearby
                    const originalPriceSelectors = [
                        '.original-price',
                        '.regular-price',
                        '.old-price',
                        '.was-price',
                        '[data-price-type="regular"]'
                    ]
                    for (const origSelector of originalPriceSelectors) {
                        const origElement = $(origSelector).first()
                        if (origElement.length) {
                            originalPriceText = origElement.attr('content') || origElement.text().trim()
                            break
                        }
                    }
                    break
                }
            }
        }
    }

    // If no sale price found, try regular price selectors
    if (!priceText) {
        const priceSelectors = [
            '.price',
            '.product-price',
            '[itemprop="price"]',
            '.current-price',
            'span.price'
        ]

        for (const selector of priceSelectors) {
            const element = $(selector).first()
            if (element.length) {
                priceText = element.attr('content') || element.text().trim()
                if (priceText) break
            }
        }
    }

    // Parse prices from text
    const price = parsePrice(priceText)
    const originalPrice = originalPriceText ? parsePrice(originalPriceText) : undefined

    return { price, originalPrice, currency }
}

function extractSKU($: cheerio.CheerioAPI, url: string): string | undefined {
    // 1. Try to extract SKU from URL (very common in Saudi e-commerce platforms)
    const urlPath = new URL(url).pathname
    const urlParams = new URL(url).searchParams

    // Salla pattern: /p/SKU or /products/SKU
    const sallaMatch = urlPath.match(/\/p\/([a-zA-Z0-9-_]+)/) || urlPath.match(/\/products\/([a-zA-Z0-9-_]+)/)
    if (sallaMatch) return sallaMatch[1]

    // Zid pattern: /products/SKU or /p/SKU
    const zidMatch = urlPath.match(/\/products?\/([a-zA-Z0-9-_]+)/)
    if (zidMatch) return zidMatch[1]

    // Noon pattern: /p-SKU or /product/SKU
    const noonMatch = urlPath.match(/\/p-([a-zA-Z0-9-_]+)/) || urlPath.match(/\/product\/([a-zA-Z0-9-_]+)/)
    if (noonMatch) return noonMatch[1]

    // Amazon.sa pattern: /dp/SKU or ASIN in URL
    const amazonMatch = urlPath.match(/\/dp\/([A-Z0-9]{10})/) || urlPath.match(/\/gp\/product\/([A-Z0-9]{10})/)
    if (amazonMatch) return amazonMatch[1]

    // Check URL parameters for SKU
    const skuParam = urlParams.get('sku') || urlParams.get('product_id') || urlParams.get('id')
    if (skuParam) return skuParam

    // 2. Try data attributes (common in modern e-commerce)
    const dataAttributes = [
        '[data-product-sku]',
        '[data-product-id]',
        '[data-sku]',
        '[data-product-code]',
        '[data-item-id]'
    ]

    for (const selector of dataAttributes) {
        const element = $(selector).first()
        if (element.length) {
            const sku = element.attr('data-product-sku') ||
                element.attr('data-product-id') ||
                element.attr('data-sku') ||
                element.attr('data-product-code') ||
                element.attr('data-item-id')
            if (sku) return sku
        }
    }

    // 3. Try meta tags and structured data
    const metaSelectors = [
        'meta[property="product:retailer_item_id"]',
        'meta[property="product:sku"]',
        'meta[name="product:sku"]',
        'meta[itemprop="sku"]',
        'meta[itemprop="productID"]'
    ]

    for (const selector of metaSelectors) {
        const element = $(selector).first()
        if (element.length) {
            const sku = element.attr('content')
            if (sku) return sku
        }
    }

    // 4. Try semantic HTML elements
    const semanticSelectors = [
        '[itemprop="sku"]',
        '[itemprop="productID"]',
        '.product-sku',
        '.sku',
        '.product-code',
        '.item-code',
        '#sku',
        '#product-sku'
    ]

    for (const selector of semanticSelectors) {
        const element = $(selector).first()
        if (element.length) {
            const sku = element.text().trim()
            // Clean up common prefixes
            const cleanedSku = sku.replace(/^(SKU|Code|Ref|Model)[\s:]+/i, '').trim()
            if (cleanedSku) return cleanedSku
        }
    }

    // 5. Try to find SKU in JSON-LD structured data
    const jsonLd = $('script[type="application/ld+json"]').toArray()
    for (const script of jsonLd) {
        try {
            const data = JSON.parse($(script).html() || '{}')
            if (data['@type'] === 'Product' && data.sku) {
                return String(data.sku)
            }
            // Check mpn (Manufacturer Part Number) as fallback
            if (data['@type'] === 'Product' && data.mpn) {
                return String(data.mpn)
            }
            // Sometimes it's nested in offers
            if (data['@type'] === 'Product' && data.offers) {
                const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers
                if (offer.sku) return String(offer.sku)
            }
        } catch (e) {
            // Skip invalid JSON
        }
    }

    // 6. Try breadcrumbs (sometimes contains product ID)
    const breadcrumbSku = $('[itemtype*="BreadcrumbList"] [itemprop="item"]').last().attr('content')
    if (breadcrumbSku && /^[a-zA-Z0-9-_]+$/.test(breadcrumbSku)) {
        return breadcrumbSku
    }

    // 7. Try regex patterns on page text (last resort)
    const bodyText = $('body').text()

    // Arabic and English SKU patterns
    const skuPatterns = [
        /(?:SKU|رمز المنتج|كود المنتج)\s*[:#]\s*([a-zA-Z0-9-_]+)/i,
        /(?:Ref|Reference|المرجع)\s*[:#]\s*([a-zA-Z0-9-_]+)/i,
        /(?:Code|الكود)\s*[:#]\s*([a-zA-Z0-9-_]+)/i,
        /(?:Model|الموديل|النموذج)\s*[:#]\s*([a-zA-Z0-9-_]+)/i,
        /(?:Item|رقم الصنف)\s*[:#]\s*([a-zA-Z0-9-_]+)/i
    ]

    for (const pattern of skuPatterns) {
        const match = bodyText.match(pattern)
        if (match && match[1]) {
            // Validate it's not too long (likely not a SKU if > 50 chars)
            if (match[1].length <= 50) {
                return match[1]
            }
        }
    }

    return undefined
}

function parsePrice(priceText: string): number {
    if (!priceText) return 0

    // Remove currency symbols and text
    const cleaned = priceText
        .replace(/[^\d.,]/g, '') // Keep only digits, dots, and commas
        .replace(/,(\d{3})/g, '$1') // Remove thousand separators (commas)
        .replace(/,/g, '.') // Replace comma decimal separator with dot

    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
}

function extractProductImage($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'img[itemprop="image"]',
        '.product-image img',
        '.product-gallery img',
        'img.product-img'
    ]

    for (const selector of selectors) {
        const element = $(selector).first()
        if (element.length) {
            const src = element.attr('content') || element.attr('src')
            if (src) return src
        }
    }

    return undefined
}

function extractDescription($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
        'meta[property="og:description"]',
        'meta[name="description"]',
        '[itemprop="description"]',
        '.product-description'
    ]

    for (const selector of selectors) {
        const element = $(selector).first()
        if (element.length) {
            const content = element.attr('content') || element.text().trim()
            if (content) return content.substring(0, 500) // Limit length
        }
    }

    return undefined
}

function extractStock($: cheerio.CheerioAPI): number | undefined {
    // Try to find stock/availability information
    const stockSelectors = [
        '[itemprop="availability"]',
        '.stock-status',
        '.availability'
    ]

    for (const selector of stockSelectors) {
        const element = $(selector).first()
        if (element.length) {
            const text = element.text().toLowerCase()
            if (text.includes('out of stock') || text.includes('sold out')) {
                return 0
            }
            if (text.includes('in stock')) {
                return 100 // Default stock when available
            }
        }
    }

    return undefined
}
