export interface TrendyolProduct {
    id: string
    title: string
    productCode: string
    listPrice: number
    currency: string
    quantity: number
    images: string[]
    approved: boolean
}

export async function fetchTrendyolProducts(
    supplierId: string,
    username: string,
    password: string
): Promise<TrendyolProduct[]> {
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    // Trendyol API endpoint for products
    const url = `https://api.trendyol.com/sapigw/suppliers/${supplierId}/products?size=50`

    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${auth}`,
            'User-Agent': `${supplierId} - SelfIntegration`,
        },
    })

    if (!response.ok) {
        throw new Error(`Trendyol API error: ${response.statusText}`)
    }

    const data = await response.json()

    return data.content.map((item: any) => ({
        id: item.id,
        title: item.title,
        productCode: item.productCode,
        listPrice: item.listPrice,
        currency: item.currencyType || 'TRY', // Default to TRY if not provided
        quantity: item.quantity,
        images: item.images.map((img: any) => img.url),
        approved: item.approved,
    }))
}
