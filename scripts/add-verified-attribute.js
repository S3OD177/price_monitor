import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COMPETITORS;

async function addVerifiedAttribute() {
    try {
        console.log(`Adding 'verified' attribute to collection ${COLLECTION_ID}...`);

        try {
            await databases.createBooleanAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'verified',
                false, // required
                false  // default value
            );
            console.log(`Created attribute: verified`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`Attribute 'verified' already exists.`);
            } else {
                console.error(`Failed to create attribute 'verified':`, error.message);
            }
        }

        console.log('Setup complete!');

    } catch (error) {
        console.error('Setup failed:', error);
    }
}

addVerifiedAttribute();
