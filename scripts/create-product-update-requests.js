import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.NEXT_APPWRITE_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_NAME = 'product_update_requests';

async function createProductUpdateRequestsCollection() {
    try {
        console.log(`Checking if collection ${COLLECTION_NAME} exists...`);

        // 1. Create Collection
        let collectionId;
        try {
            // Try to list collections to see if it exists (not efficient but simple)
            // Or just try to create and catch error
            const collection = await databases.createCollection(
                DATABASE_ID,
                COLLECTION_NAME, // Using name as ID for simplicity if possible, or unique ID
                COLLECTION_NAME
            );
            collectionId = collection.$id;
            console.log(`Created collection: ${collectionId}`);
        } catch (error) {
            if (error.code === 409) {
                console.log('Collection already exists, skipping creation.');
                collectionId = COLLECTION_NAME;
            } else {
                throw error;
            }
        }

        // 2. Create Attributes
        const attributes = [
            { key: 'productId', type: 'string', size: 255, required: true },
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'productUrl', type: 'string', size: 1000, required: true },
            { key: 'currentData', type: 'string', size: 10000, required: true }, // JSON string
            { key: 'proposedData', type: 'string', size: 10000, required: true }, // JSON string
            { key: 'changedFields', type: 'string', size: 1000, required: true }, // JSON array string
            { key: 'reason', type: 'string', size: 1000, required: false },
            { key: 'status', type: 'string', size: 50, required: true }, // pending, approved, rejected
            { key: 'reviewedBy', type: 'string', size: 255, required: false },
            { key: 'reviewedAt', type: 'string', size: 100, required: false },
            { key: 'adminNotes', type: 'string', size: 1000, required: false }
        ];

        for (const attr of attributes) {
            try {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.size,
                    attr.required
                );
                console.log(`Created attribute: ${attr.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`Attribute ${attr.key} already exists.`);
                } else {
                    console.error(`Failed to create attribute ${attr.key}:`, error.message);
                }
            }
            // Wait a bit to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 3. Create Indexes
        const indexes = [
            { key: 'status_idx', type: 'key', attributes: ['status'] },
            { key: 'userId_idx', type: 'key', attributes: ['userId'] },
            { key: 'createdAt_idx', type: 'key', attributes: ['$createdAt'], order: 'DESC' }
        ];

        for (const idx of indexes) {
            try {
                await databases.createIndex(
                    DATABASE_ID,
                    collectionId,
                    idx.key,
                    idx.type,
                    idx.attributes,
                    idx.order ? [idx.order] : undefined
                );
                console.log(`Created index: ${idx.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`Index ${idx.key} already exists.`);
                } else {
                    console.error(`Failed to create index ${idx.key}:`, error.message);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('Setup complete!');

    } catch (error) {
        console.error('Setup failed:', error);
    }
}

createProductUpdateRequestsCollection();
