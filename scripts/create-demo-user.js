const sdk = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const client = new sdk.Client();

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const projectId = '691cea5d0001ae1c3ee1';
const apiKey = 'standard_1c7e07619f86c93c4006a54115092e827824723d6366e63530bcc485c6f06292f5a0e76905617c872f5e457db7d3b68409f4392943b015282349d901e676c12c42a961fcf0eedf4bc93dbd19b24220ac2e17377f4085737aa9cbe4e62526900110d4b673f888237664b40203fe7dd1c7492b8709e7ec855443f77a4d0643e3b9';

if (!endpoint || !projectId || !apiKey) {
    console.error('Missing environment variables.');
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const users = new sdk.Users(client);

async function createDemoUser() {
    const email = 'demo@example.com';
    const password = 'password123';
    const name = 'Demo User';

    try {
        console.log(`Checking if user ${email} exists...`);
        const response = await users.list([
            sdk.Query.equal('email', email)
        ]);

        if (response.total > 0) {
            console.log('User already exists. Updating password...');
            const userId = response.users[0].$id;
            await users.updatePassword(userId, password);
            console.log('Password updated.');
        } else {
            console.log('Creating new user...');
            await users.create(sdk.ID.unique(), email, undefined, password, name);
            console.log('User created successfully.');
        }
    } catch (error) {
        console.error('Error managing demo user:', error);
    }
}

createDemoUser();
