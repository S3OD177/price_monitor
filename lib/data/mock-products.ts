export interface Competitor {
    id: string
    name: string
    price: number
    url: string
    lastUpdated: string
}

export interface Product {
    id: string
    name: string
    sku: string
    image: string
    price: number
    competitors: Competitor[]
}

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Wireless Noise Cancelling Headphones",
        sku: "WH-1000XM5",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
        price: 299.99,
        competitors: [
            {
                id: "c1",
                name: "Amazon",
                price: 298.00,
                url: "https://amazon.com",
                lastUpdated: "2024-04-15T10:00:00Z"
            },
            {
                id: "c2",
                name: "Best Buy",
                price: 349.99,
                url: "https://bestbuy.com",
                lastUpdated: "2024-04-15T11:30:00Z"
            }
        ]
    },
    {
        id: "2",
        name: "Smart Watch Series 9",
        sku: "SW-S9-45",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNtYXJ0JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D",
        price: 399.00,
        competitors: [
            {
                id: "c3",
                name: "Walmart",
                price: 389.00,
                url: "https://walmart.com",
                lastUpdated: "2024-04-14T09:15:00Z"
            }
        ]
    },
    {
        id: "3",
        name: "Mechanical Gaming Keyboard",
        sku: "KB-MECH-RGB",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",
        price: 129.50,
        competitors: []
    }
]
