const TRENDYOL_API_BASE = "https://api.trendyol.com/sapigw/suppliers";

export interface TrendyolCredentials {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
}

export class TrendyolClient {
    private credentials: TrendyolCredentials;
    private authHeader: string;

    constructor(credentials: TrendyolCredentials) {
        this.credentials = credentials;
        this.authHeader = `Basic ${Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64')}`;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${TRENDYOL_API_BASE}/${this.credentials.supplierId}${endpoint}`;
        const headers = {
            "Authorization": this.authHeader,
            "Content-Type": "application/json",
            "User-Agent": "PriceMonitorApp/1.0",
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Trendyol API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response.json();
    }

    async validateCredentials(): Promise<boolean> {
        try {
            // Try to fetch a small list of products to validate access
            await this.request("/products?size=1");
            return true;
        } catch (error) {
            console.error("Trendyol validation failed:", error);
            return false;
        }
    }

    async getProducts(page = 0, size = 50): Promise<any> {
        // Trendyol pagination uses page (0-indexed) and size
        return this.request(`/products?page=${page}&size=${size}`);
    }
}
