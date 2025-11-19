import { Client, Databases, ID } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_NAME = "PriceMonitorDB";
const COLLECTIONS = [
    {
        name: "Products",
        attributes: [
            { key: "name", type: "string", size: 255, required: true },
            { key: "sku", type: "string", size: 100, required: false },
            { key: "image_url", type: "url", required: false },
            { key: "user_id", type: "string", size: 50, required: true },
            { key: "store_id", type: "string", size: 50, required: false }, // Link to store if applicable
        ],
        indexes: [
            { key: "user_id", type: "key", attributes: ["user_id"] }
        ]
    },
    {
        name: "Competitors",
        attributes: [
            { key: "product_id", type: "string", size: 50, required: true },
            { key: "url", type: "url", required: true },
            { key: "name", type: "string", size: 255, required: true }, // e.g. "Amazon", "Noon"
            { key: "selector", type: "string", size: 1000, required: false }, // CSS selector for price
        ],
        indexes: [
            { key: "product_id", type: "key", attributes: ["product_id"] }
        ]
    },
    {
        name: "PriceHistory",
        attributes: [
            { key: "competitor_id", type: "string", size: 50, required: true },
            { key: "price", type: "double", required: true },
            { key: "currency", type: "string", size: 3, required: true },
            { key: "scraped_at", type: "datetime", required: true },
        ],
        indexes: [
            { key: "competitor_id", type: "key", attributes: ["competitor_id"] },
            { key: "scraped_at", type: "key", attributes: ["scraped_at"] }
        ]
    }
];

async function setupDatabase() {
    try {
        // 1. Create Database
        console.log("Creating Database...");
        const db = await databases.create(ID.unique(), DATABASE_NAME);
        console.log(`Database created: ${db.$id}`);

        // 2. Create Collections
        for (const col of COLLECTIONS) {
            console.log(`Creating Collection: ${col.name}...`);
            const collection = await databases.createCollection(db.$id, ID.unique(), col.name);

            // 3. Create Attributes
            for (const attr of col.attributes) {
                console.log(`  Adding attribute: ${attr.key}`);
                if (attr.type === "string") {
                    await databases.createStringAttribute(db.$id, collection.$id, attr.key, attr.size || 255, attr.required);
                } else if (attr.type === "url") {
                    await databases.createUrlAttribute(db.$id, collection.$id, attr.key, attr.required);
                } else if (attr.type === "double") {
                    await databases.createFloatAttribute(db.$id, collection.$id, attr.key, attr.required);
                } else if (attr.type === "datetime") {
                    await databases.createDatetimeAttribute(db.$id, collection.$id, attr.key, attr.required);
                }
                // Wait a bit for attribute to be available (Appwrite async nature)
                await new Promise(r => setTimeout(r, 500));
            }

            // 4. Create Indexes
            for (const idx of col.indexes) {
                console.log(`  Adding index: ${idx.key}`);
                // await databases.createIndex(db.$id, collection.$id, idx.key, idx.type, idx.attributes);
            }

            console.log(`Collection ${col.name} setup complete.`);
        }

        console.log("Database setup complete!");
        console.log(`Please update your .env with: NEXT_PUBLIC_APPWRITE_DATABASE_ID=${db.$id}`);

    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

setupDatabase();
