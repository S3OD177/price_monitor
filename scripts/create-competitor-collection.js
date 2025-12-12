const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('691cea5d0001ae1c3ee1')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "PriceMonitorDB";
const COLLECTION_ID = "CompetitorProducts";

async function main() {
    console.log(`Creating CompetitorProducts collection in database: ${DATABASE_ID}`);

    try {
        // Try to get existing collection
        try {
            const existing = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
            console.log('Collection already exists:', existing.name);
            return;
        } catch (e) {
            console.log('Collection does not exist, creating...');
        }

        // Create collection
        const collection = await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'CompetitorProducts',
            [
                'read("users")',  // All authenticated users can read
                'create("users")', // Authenticated users can create
                'update("users")'  // Authenticated users can update
            ],
            true // Document security enabled
        );

        console.log('Collection created:', collection.name);

        // Create attributes
        console.log('Creating attributes...');

        // URL (required, unique)
        await databases.createUrlAttribute(DATABASE_ID, COLLECTION_ID, 'url', true);
        console.log('✓ url attribute created');

        // SKU (indexed for matching)
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'sku', 100, false);
        console.log('✓ sku attribute created');

        // Product name
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'name', 500, true);
        console.log('✓ name attribute created');

        // Price
        await databases.createFloatAttribute(DATABASE_ID, COLLECTION_ID, 'price', true);
        console.log('✓ price attribute created');

        // Original price (before discount)
        await databases.createFloatAttribute(DATABASE_ID, COLLECTION_ID, 'originalPrice', false);
        console.log('✓ originalPrice attribute created');

        // Currency
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'currency', 10, true);
        console.log('✓ currency attribute created');

        // Image URL
        await databases.createUrlAttribute(DATABASE_ID, COLLECTION_ID, 'imageUrl', false);
        console.log('✓ imageUrl attribute created');

        // Description
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'description', 1000, false);
        console.log('✓ description attribute created');

        // Platform
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'platform', 50, true);
        console.log('✓ platform attribute created');

        // Region (indexed for filtering)
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'region', 50, true);
        console.log('✓ region attribute created');

        // Last scraped timestamp
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, 'lastScraped', true);
        console.log('✓ lastScraped attribute created');

        // Scraped by user ID
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'scrapedBy', 100, true);
        console.log('✓ scrapedBy attribute created');

        // Verified by user
        await databases.createBooleanAttribute(DATABASE_ID, COLLECTION_ID, 'verified', true, false);
        console.log('✓ verified attribute created');

        // Stock
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'stock', false);
        console.log('✓ stock attribute created');

        console.log('\nWaiting for attributes to be available...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Create indexes
        console.log('\nCreating indexes...');

        try {
            await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'sku_index', 'key', ['sku']);
            console.log('✓ SKU index created');
        } catch (e) {
            console.log('SKU index may already exist');
        }

        try {
            await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'region_index', 'key', ['region']);
            console.log('✓ Region index created');
        } catch (e) {
            console.log('Region index may already exist');
        }

        try {
            await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'url_index', 'unique', ['url']);
            console.log('✓ URL unique index created');
        } catch (e) {
            console.log('URL index may already exist');
        }

        console.log('\n✅ CompetitorProducts collection setup complete!');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
