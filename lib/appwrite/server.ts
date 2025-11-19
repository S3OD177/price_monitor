import { Client, Account, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { APPWRITE_CONFIG } from "./config";

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
        .setProject(APPWRITE_CONFIG.PROJECT_ID);

    const cookieStore = await cookies();
    const session = cookieStore.get("appwrite-session");

    if (session) {
        client.setSession(session.value);
    }

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
    };
}

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
        .setProject(APPWRITE_CONFIG.PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY || ""); // Needs API Key for admin tasks

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
    };
}
