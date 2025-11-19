const { Client, Databases, ID } = require("node-appwrite");
require("dotenv").config();

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("691cea5d0001ae1c3ee1")
    .setKey("standard_1c7e07619f86c93c4006a54115092e827824723d6366e63530bcc485c6f06292f5a0e76905617c872f5e457db7d3b68409f4392943b015282349d901e676c12c42a961fcf0eedf4bc93dbd19b24220ac2e17377f4085737aa9cbe4e62526900110d4b673f888237664b40203fe7dd1c7492b8709e7ec855443f77a4d0643e3b9");

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
        console.log("Creating Database...");
        const db = await databases.create(ID.unique(), DATABASE_NAME);
        console.log(`Database created: ${db.$id}`);

        for (const col of COLLECTIONS) {
            console.log(`Creating Collection: ${col.name}...`);
            const collection = await databases.createCollection(db.$id, ID.unique(), col.name);

            for (const attr of col.attributes) {
                console.log(`  Adding attribute: ${attr.key}`);
                if (attr.type === "string") {
                    await databases.createStringAttribute(db.$id, collection.$id, attr.key, attr.size, attr.required);
                } else if (attr.type === "url") {
                    await databases.createUrlAttribute(db.$id, collection.$id, attr.key, attr.required);
                } else if (attr.type === "double") {
                    await databases.createFloatAttribute(db.$id, collection.$id, attr.key, attr.required);
                } else if (attr.type === "datetime") {
                    await databases.createDatetimeAttribute(db.$id, collection.$id, attr.key, attr.required);
                }
                await new Promise(r => setTimeout(r, 500));
            }

            console.log(`Collection ${col.name} setup complete.`);
        }

        console.log("Database setup complete!");
        console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${db.$id}`);

        // We need to map collection names to IDs for the env file
        // Since we can't easily get them back in this loop structure without storing, 
        // I'll just print the last one created, but we need all of them.
        // Actually, let's print them as we go.

    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

setupDatabase();
