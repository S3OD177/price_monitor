import { Client, Account, Databases } from "appwrite";
import { APPWRITE_CONFIG } from "./config";

export const client = new Client();

client
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
    .setProject(APPWRITE_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
