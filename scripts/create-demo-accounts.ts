import { Client, Account, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const account = new Account(client);

async function createDemoAccounts() {
    const demoAccounts = [
        { email: 'demo@example.com', password: 'password123', name: 'Demo User' },
        { email: 'demo2@example.com', password: 'password123', name: 'Demo User 2' }
    ];

    for (const demo of demoAccounts) {
        try {
            console.log(`Creating account for ${demo.email}...`);
            await account.create(ID.unique(), demo.email, demo.password, demo.name);
            console.log(`✓ Successfully created ${demo.email}`);
        } catch (error: any) {
            if (error.code === 409) {
                console.log(`✓ Account ${demo.email} already exists`);
            } else {
                console.error(`✗ Error creating ${demo.email}:`, error.message);
            }
        }
    }
}

createDemoAccounts()
    .then(() => console.log('\nDemo accounts setup complete!'))
    .catch(console.error);
