import { Client, Databases, Query } from "appwrite";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";

const SALLA_API_BASE = "https://api.salla.dev/admin/v2";
const SALLA_AUTH_BASE = "https://accounts.salla.sa/oauth2";

export const SALLA_CONFIG = {
    CLIENT_ID: process.env.SALLA_CLIENT_ID!,
    CLIENT_SECRET: process.env.SALLA_CLIENT_SECRET!,
    REDIRECT_URI: process.env.SALLA_REDIRECT_URI!,
};

export interface SallaTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface SallaUserResponse {
    data: {
        id: number;
        name: string;
        email: string;
        mobile: string;
        merchant: {
            id: number;
            username: string;
            name: string;
            avatar: string;
            store_location: string;
            plan: string;
            status: string;
            domain: string;
            created_at: string;
        };
    };
}

export class SallaClient {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${SALLA_API_BASE}${endpoint}`;
        const headers = {
            "Authorization": `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Salla API Error: ${error.message || response.statusText}`);
        }

        return response.json();
    }

    async getMerchantInfo(): Promise<SallaUserResponse> {
        return this.request<SallaUserResponse>("/oauth2/user/info");
    }

    async getProducts(page = 1): Promise<any> {
        return this.request(`/products?page=${page}`);
    }
}

export async function exchangeSallaCode(code: string): Promise<SallaTokenResponse> {
    const params = new URLSearchParams({
        client_id: SALLA_CONFIG.CLIENT_ID,
        client_secret: SALLA_CONFIG.CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: SALLA_CONFIG.REDIRECT_URI,
        code,
    });

    const response = await fetch(`${SALLA_AUTH_BASE}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || "Failed to exchange Salla code");
    }

    return response.json();
}

export function getSallaAuthUrl(state: string): string {
    const params = new URLSearchParams({
        client_id: SALLA_CONFIG.CLIENT_ID,
        response_type: "code",
        redirect_uri: SALLA_CONFIG.REDIRECT_URI,
        scope: "offline_access products.read", // Only request essential scopes
        state,
    });
    return `${SALLA_AUTH_BASE}/auth?${params.toString()}`;
}
