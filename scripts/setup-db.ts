import { Client, Databases, ID, Permission, Role } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_NAME = "PriceMonitorDB";
const APPWRITE_CONFIG = {
    DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'price_monitor_db'
}

const COLLECTIONS = [
    {
        name: "Products",
        attributes: [
            { key: "name", type: "string", size: 255, required: true },
            { key: "sku", type: "string", size: 100, required: false },
            { key: "image_url", type: "url", required: false },
            { key: "user_id", type: "string", size: 50, required: true },
            { key: "store_id", type: "string", size: 50, required: false },
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
            { key: "name", type: "string", size: 255, required: true },
            { key: "selector", type: "string", size: 1000, required: false },
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
        console.log("Starting database setup...");

        // Check if database exists, if not create it
        let dbId = APPWRITE_CONFIG.DATABASE_ID;
        try {
            await databases.get(dbId);
            console.log(`Database ${dbId} already exists.`);
        } catch (e) {
            console.log("Creating Database...");
            const db = await databases.create(ID.unique(), DATABASE_NAME);
            dbId = db.$id;
            console.log(`Database created: ${dbId}`);
        }

        // Create Collections
        const existingCollections = await databases.listCollections(dbId);
        const existingNames = existingCollections.collections.map(c => c.name);

        for (const col of COLLECTIONS) {
            if (!existingNames.includes(col.name)) {
                console.log(`Creating Collection: ${col.name}...`);
                const collection = await databases.createCollection(dbId, ID.unique(), col.name);

                // Create Attributes
                for (const attr of col.attributes) {
                    console.log(`  Adding attribute: ${attr.key}`);
                    if (attr.type === "string") {
                        await databases.createStringAttribute(dbId, collection.$id, attr.key, attr.size || 255, attr.required);
                    } else if (attr.type === "url") {
                        await databases.createUrlAttribute(dbId, collection.$id, attr.key, attr.required);
                    } else if (attr.type === "double") {
                        await databases.createFloatAttribute(dbId, collection.$id, attr.key, attr.required);
                    } else if (attr.type === "datetime") {
                        await databases.createDatetimeAttribute(dbId, collection.$id, attr.key, attr.required);
                    }
                    await new Promise(r => setTimeout(r, 500));
                }

                // Create Indexes
                for (const idx of col.indexes) {
                    console.log(`  Adding index: ${idx.key}`);
                    // await databases.createIndex(dbId, collection.$id, idx.key, idx.type, idx.attributes);
                }
                console.log(`Collection ${col.name} setup complete.`);
            } else {
                console.log(`Collection ${col.name} already exists.`);
            }
        }

        // Product Change Requests Collection
        if (!existingNames.includes('Product Change Requests')) {
            console.log('Creating Product Change Requests collection...');
            const changeReqCol = await databases.createCollection(
                dbId,
                'product_change_requests',
                'Product Change Requests',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ]
            );

            console.log('Creating product_change_requests attributes...');
            await databases.createStringAttribute(dbId, changeReqCol.$id, 'competitorId', 255, true);
            await databases.createStringAttribute(dbId, changeReqCol.$id, 'userId', 255, true);
            await databases.createStringAttribute(dbId, changeReqCol.$id, 'proposedName', 255, false);
            await databases.createStringAttribute(dbId, changeReqCol.$id, 'proposedSku', 255, false);
            await databases.createFloatAttribute(dbId, changeReqCol.$id, 'proposedPrice', false);
            await databases.createStringAttribute(dbId, changeReqCol.$id, 'proposedCurrency', 10, false);
            await databases.createEnumAttribute(dbId, changeReqCol.$id, 'status', ['pending', 'approved', 'rejected'], true);
            await databases.createDatetimeAttribute(dbId, changeReqCol.$id, 'createdAt', true);
            console.log('Product Change Requests collection setup complete.');
        }

        // Scraping Reports Collection
        if (!existingNames.includes('Scraping Reports')) {
            console.log('Creating Scraping Reports collection...');
            const scrapingReportsCol = await databases.createCollection(
                dbId,
                'scraping_reports',
                'Scraping Reports',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ]
            );

            console.log('Creating scraping_reports attributes...');
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'productId', 255, true);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'productName', 255, false);
            await databases.createUrlAttribute(dbId, scrapingReportsCol.$id, 'productUrl', true);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'reportedSku', 255, false);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'expectedSku', 255, false);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'issue', 2000, true);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'reportedBy', 255, true);
            await databases.createEnumAttribute(dbId, scrapingReportsCol.$id, 'status', ['pending', 'resolved'], true);
            await databases.createDatetimeAttribute(dbId, scrapingReportsCol.$id, 'createdAt', true);
            await databases.createDatetimeAttribute(dbId, scrapingReportsCol.$id, 'resolvedAt', false);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'resolvedBy', 255, false);
            await databases.createStringAttribute(dbId, scrapingReportsCol.$id, 'adminNotes', 2000, false);
            console.log('Scraping Reports collection setup complete.');
        }

        console.log("Database setup complete!");
        console.log(`Please update your .env with: NEXT_PUBLIC_APPWRITE_DATABASE_ID=${dbId}`);

    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

setupDatabase();
