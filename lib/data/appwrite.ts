import { ID, Query } from "node-appwrite";
import { createSessionClient } from "../appwrite/server";
import { APPWRITE_CONFIG } from "../appwrite/config";

export interface Product {
    $id: string;
    name: string;
    sku?: string;
    image_url?: string;
    user_id: string;
    store_id?: string;
    price?: number;
}

export interface Competitor {
    $id: string;
    product_id: string;
    url: string;
    name: string;
    selector?: string;
}

export interface Price {
    $id: string;
    competitor_id: string;
    price: number;
    currency: string;
    scraped_at: string;
}

export async function getProducts() {
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
        [Query.orderDesc("$createdAt")]
    );
    return documents as unknown as Product[];
}

export async function addProduct(data: Omit<Product, "$id">) {
    const { databases } = await createSessionClient();
    return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
        ID.unique(),
        data
    );
}

export async function getCompetitors(productId: string) {
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
        [Query.equal("product_id", productId)]
    );
    return documents as unknown as Competitor[];
}

export async function addCompetitor(data: Omit<Competitor, "$id">) {
    const { databases } = await createSessionClient();
    return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
        ID.unique(),
        data
    );
}

export async function addPrice(data: Omit<Price, "$id">) {
    const { databases } = await createSessionClient();
    return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRICES,
        ID.unique(),
        data
    );
}

export async function getPriceHistory(competitorId: string) {
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRICES,
        [
            Query.equal("competitor_id", competitorId),
            Query.orderDesc("scraped_at"),
            Query.limit(10)
        ]
    );
    return documents as unknown as Price[];
}
