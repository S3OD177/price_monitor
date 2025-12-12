const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('691cea5d0001ae1c3ee1')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "PriceMonitorDB";
const COLLECTIONS = {
    PRODUCTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS || "Products",
    STORES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_STORES || "Stores",
};

async function main() {
    console.log(`Checking Database: ${DATABASE_ID}`);
    try {
        await databases.get(DATABASE_ID);
        console.log('Database exists');
    } catch (e) {
        console.error('Database missing:', e.message);
        return;
    }

    // Check Products Collection Permissions
    console.log(`Checking Permissions for Collection: ${COLLECTIONS.PRODUCTS}`);
    try {
        const collection = await databases.getCollection(DATABASE_ID, COLLECTIONS.PRODUCTS);
        console.log('Current Permissions:', JSON.stringify(collection.$permissions));

        const newPermissions = [
            'create("users")', // Authenticated users can create
            'read("users")',   // Authenticated users can read
            'update("users")', // Authenticated users can update
            'delete("users")'  // Authenticated users can delete
        ];

        console.log('Updating Permissions...');
        await databases.updateCollection(DATABASE_ID, COLLECTIONS.PRODUCTS, 'Products', newPermissions, true);
        console.log('Permissions updated.');

    } catch (e) {
        console.error('Error checking/updating permissions:', e.message);
    }

    // Add new attributes for scraped data
    console.log('Checking/Adding new attributes...');
    try {
        const attributes = await databases.listAttributes(DATABASE_ID, COLLECTIONS.PRODUCTS);
        const existingAttrKeys = attributes.attributes.map(a => a.key);

        // Add imageUrl attribute if missing
        if (!existingAttrKeys.includes('imageUrl')) {
            console.log('Creating imageUrl attribute...');
            await databases.createUrlAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'imageUrl', false);
            console.log('imageUrl attribute created');
        } else {
            console.log('imageUrl attribute already exists');
        }

        // Add description attribute if missing
        if (!existingAttrKeys.includes('description')) {
            console.log('Creating description attribute...');
            await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCTS, 'description', 1000, false);
            console.log('description attribute created');
        } else {
            console.log('description attribute already exists');
        }

    } catch (e) {
        console.error('Error adding attributes:', e.message);
    }
}

main().catch(console.error);
