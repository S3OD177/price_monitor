import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '691cea5d0001ae1c3ee1';
const APPWRITE_API_KEY = 'standard_1c7e07619f86c93c4006a54115092e827824723d6366e63530bcc485c6f06292f5a0e76905617c872f5e457db7d3b68409f4392943b015282349d901e676c12c42a961fcf0eedf4bc93dbd19b24220ac2e17377f4085737aa9cbe4e62526900110d4b673f888237664b40203fe7dd1c7492b8709e7ec855443f77a4d0643e3b9';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6919f1f40008e0a0f4e5';
const COLLECTION_ID = 'scraping_reports';

console.log('Using Database ID:', DATABASE_ID);
console.log('Creating Collection:', COLLECTION_ID);

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function createScrapingReportsCollection() {
    console.log('🚀 Creating Scraping Reports collection...\n');

    try {
        // Create collection
        await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'Scraping Reports',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );
        console.log('✅ Collection created successfully');

        // Wait for collection to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  Collection already exists, continuing with attributes...');
        } else {
            throw error;
        }
    }

    // Define attributes
    const attributes = [
        { key: 'productUrl', type: 'string', size: 2000, required: true },
        { key: 'reportedSku', type: 'string', size: 255, required: false },
        { key: 'expectedSku', type: 'string', size: 255, required: false },
        { key: 'reportedBy', type: 'string', size: 255, required: true },
        { key: 'productName', type: 'string', size: 500, required: false },
        { key: 'issue', type: 'string', size: 2000, required: true },
        { key: 'status', type: 'string', size: 50, required: true },
        { key: 'createdAt', type: 'string', size: 50, required: true },
        { key: 'resolvedAt', type: 'string', size: 50, required: false },
        { key: 'resolvedBy', type: 'string', size: 255, required: false },
        { key: 'adminNotes', type: 'string', size: 2000, required: false }
    ];

    for (const attr of attributes) {
        try {
            console.log(`Adding attribute: ${attr.key} (${attr.type}, size: ${attr.size}, required: ${attr.required})`);

            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    COLLECTION_ID,
                    attr.key,
                    attr.size,
                    attr.required
                );
            }

            console.log(`✅ Successfully added: ${attr.key}`);
            // Wait between attribute creations
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            if (error.code === 409) {
                console.log(`ℹ️  Attribute ${attr.key} already exists, skipping...`);
            } else {
                console.error(`❌ Error adding ${attr.key}:`, error.message);
            }
        }
    }

    // Create indexes for better query performance
    console.log('\n📊 Creating indexes...');

    const indexes = [
        { key: 'status_idx', type: 'key', attributes: ['status'] },
        { key: 'reportedBy_idx', type: 'key', attributes: ['reportedBy'] },
        { key: 'createdAt_idx', type: 'key', attributes: ['createdAt'] }
    ];

    for (const index of indexes) {
        try {
            console.log(`Creating index: ${index.key}`);
            await databases.createIndex(
                DATABASE_ID,
                COLLECTION_ID,
                index.key,
                index.type,
                index.attributes
            );
            console.log(`✅ Index created: ${index.key}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            if (error.code === 409) {
                console.log(`ℹ️  Index ${index.key} already exists, skipping...`);
            } else {
                console.error(`❌ Error creating index ${index.key}:`, error.message);
            }
        }
    }

    console.log('\n✅ Scraping Reports collection setup complete!');
}

// Run the setup
createScrapingReportsCollection()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    });
