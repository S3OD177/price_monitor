import { Client } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;

console.log('--- Environment Diagnostics ---');
console.log(`Endpoint: ${endpoint}`);
console.log(`Project ID: ${projectId}`);
console.log(`Key Loaded: ${key ? 'YES' : 'NO'}`);
if (key) {
    console.log(`Key Prefix: ${key.substring(0, 5)}...`);
    console.log(`Key Length: ${key.length}`);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(key);

console.log('--- Client Configuration ---');
// Try a simple authenticated request (e.g., get project or just check health if possible, but getAccount is for session users)
// We'll just print that we are ready to try.
console.log('Client initialized.');
