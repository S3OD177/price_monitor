import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '691cea5d0001ae1c3ee1';
const APPWRITE_API_KEY = 'standard_1c7e07619f86c93c4006a54115092e827824723d6366e63530bcc485c6f06292f5a0e76905617c872f5e457db7d3b68409f4392943b015282349d901e676c12c42a961fcf0eedf4bc93dbd19b24220ac2e17377f4085737aa9cbe4e62526900110d4b673f888237664b40203fe7dd1c7492b8709e7ec855443f77a4d0643e3b9';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6919f1f40008e0a0f4e5';
const STORES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_STORES || 'Stores';

console.log('Using Database ID:', DATABASE_ID);
console.log('Using Collection ID:', STORES_COLLECTION_ID);

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function addAttribute(collectionId, key, type, size, required, defaultValue = null) {
    try {
        console.log(`Adding attribute: ${key} (${type}, size: ${size}, required: ${required})`);

        if (type === 'string') {
            await databases.createStringAttribute(
                DATABASE_ID,
                collectionId,
                key,
                size,
                required,
                defaultValue
            );
        } else if (type === 'datetime') {
            await databases.createDatetimeAttribute(
                DATABASE_ID,
                collectionId,
                key,
                required,
                defaultValue
            );
        }

        console.log(`✅ Successfully added: ${key}`);
        // Wait a bit between attribute creations
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        if (error.code === 409) {
            console.log(`ℹ️  Attribute ${key} already exists, skipping...`);
        } else {
            console.error(`❌ Error adding ${key}:`, error.message);
        }
    }
}

async function setupStoresSchema() {
    console.log('🚀 Starting Stores collection schema setup...\n');

    const attributes = [
        { key: 'lastSyncAt', type: 'datetime', size: 0, required: false },
    ];

    for (const attr of attributes) {
        await addAttribute(
            STORES_COLLECTION_ID,
            attr.key,
            attr.type,
            attr.size,
            attr.required
        );
    }

    console.log('\n✅ Stores collection schema setup complete!');
}

// Run the setup
setupStoresSchema()
    .then(() => {
        console.log('\n🎉 All done! You can now sync products.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    });
