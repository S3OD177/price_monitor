import { Client, Account, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { APPWRITE_CONFIG } from "./config";

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
        .setProject(APPWRITE_CONFIG.PROJECT_ID);

    const cookieStore = await cookies();
    const session = cookieStore.get("appwrite-session");

    const fs = require('fs');
    const logMessage = `[${new Date().toISOString()}] createSessionClient: Cookie found? ${!!session}, Value length: ${session?.value?.length || 0}\n`;
    try { fs.appendFileSync('server-logs.txt', logMessage); } catch (e) { }

    console.log(`createSessionClient: Cookie 'appwrite-session' found? ${!!session}`);
    if (session) {
        console.log(`createSessionClient: Setting session on client (length: ${session.value.length})`);
        client.setSession(session.value);
    } else {
        console.log("createSessionClient: No session cookie found");
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


// Create a regular client for authentication operations (login/signup)
// This client does NOT use an API key, allowing it to create user sessions
export function createAuthClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
        .setProject(APPWRITE_CONFIG.PROJECT_ID);
    // No API key - this is for user-level authentication operations

    return {
        get account() {
            return new Account(client);
        },
    };
}

