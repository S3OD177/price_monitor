import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '691cea5d0001ae1c3ee1';
const APPWRITE_API_KEY = 'standard_1c7e07619f86c93c4006a54115092e827824723d6366e63530bcc485c6f06292f5a0e76905617c872f5e457db7d3b68409f4392943b015282349d901e676c12c42a961fcf0eedf4bc93dbd19b24220ac2e17377f4085737aa9cbe4e62526900110d4b673f888237664b40203fe7dd1c7492b8709e7ec855443f77a4d0643e3b9';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6919f1f40008e0a0f4e5';
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS || 'Products';

console.log('Using Database ID:', DATABASE_ID);
console.log('Using Collection ID:', PRODUCTS_COLLECTION_ID);

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
                defaultValue,
                attr.array || false
            );
        } else if (type === 'integer') {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                collectionId,
                key,
                required,
                null,
                null,
                defaultValue
            );
        } else if (type === 'float') {
            await databases.createFloatAttribute(
                DATABASE_ID,
                collectionId,
                key,
                required,
                null,
                null,
                defaultValue
            );
        } else if (type === 'boolean') {
            await databases.createBooleanAttribute(
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

async function setupProductsSchema() {
    console.log('🚀 Starting Products collection schema setup...\n');

    // First, try to delete the url attribute if it exists (to change its type)
    try {
        console.log('Attempting to delete existing url attribute...');
        await databases.deleteAttribute(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            'url'
        );
        console.log('✅ Deleted url attribute');
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.log('ℹ️  url attribute does not exist or cannot be deleted, continuing...');
    }

    const attributes = [
        { key: 'externalId', type: 'string', size: 255, required: false },
        { key: 'storeId', type: 'string', size: 255, required: false },
        { key: 'url', type: 'string', size: 2000, required: false }, // Changed to optional string
        { key: 'imageUrl', type: 'string', size: 2000, required: false },
        { key: 'description', type: 'string', size: 5000, required: false },
        { key: 'originalPrice', type: 'float', size: 0, required: false },
        { key: 'regular_price', type: 'float', size: 0, required: false },
        { key: 'cost_price', type: 'float', size: 0, required: false },
        { key: 'taxed_price', type: 'float', size: 0, required: false },
        { key: 'pre_tax_price', type: 'float', size: 0, required: false },
        { key: 'sale_end', type: 'string', size: 255, required: false },
        { key: 'is_available', type: 'boolean', size: 0, required: false },
        { key: 'suggestedCompetitorUrls', type: 'string', size: 2000, required: false, array: true },
    ];

    for (const attr of attributes) {
        await addAttribute(
            PRODUCTS_COLLECTION_ID,
            attr.key,
            attr.type,
            attr.size,
            attr.required
        );
    }

    console.log('\n✅ Products collection schema setup complete!');
}

// Run the setup
setupProductsSchema()
    .then(() => {
        console.log('\n🎉 All done! You can now sync products from Salla.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    });
