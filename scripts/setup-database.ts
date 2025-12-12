import { Client, Databases, Permission, Role } from 'node-appwrite';

// Configuration
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = 'price-monitor-db';

async function setupDatabase() {
    console.log('🚀 Setting up Appwrite database for Price Monitor...\n');

    try {
        // Step 1: Create Database
        console.log('📦 Creating database...');
        try {
            const db = await databases.create(DATABASE_ID, 'Price Monitor Database');
            console.log('✅ Database created:', db.name);
        } catch (error: any) {
            if (error.code === 409) {
                console.log('ℹ️  Database already exists');
            } else {
                throw error;
            }
        }

        // Wait a bit for database to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 2: Create Collections
        const collections = [
            {
                id: 'stores',
                name: 'Stores',
                attributes: [
                    { key: 'userId', type: 'string', size: 255, required: true },
                    { key: 'platform', type: 'string', size: 50, required: true },
                    { key: 'storeName', type: 'string', size: 255, required: true },
                    { key: 'storeUrl', type: 'string', size: 500, required: false },
                    { key: 'apiKey', type: 'string', size: 500, required: false },
                    { key: 'status', type: 'string', size: 50, required: true },
                    { key: 'lastSync', type: 'datetime', required: false }
                ]
            },
            {
                id: 'products',
                name: 'Products',
                attributes: [
                    { key: 'userId', type: 'string', size: 255, required: true },
                    { key: 'storeId', type: 'string', size: 255, required: true },
                    { key: 'productId', type: 'string', size: 255, required: true },
                    { key: 'name', type: 'string', size: 500, required: true },
                    { key: 'sku', type: 'string', size: 255, required: false },
                    { key: 'currentPrice', type: 'float', required: true },
                    { key: 'currency', type: 'string', size: 10, required: true },
                    { key: 'imageUrl', type: 'string', size: 1000, required: false },
                    { key: 'productUrl', type: 'string', size: 1000, required: false }
                ]
            },
            {
                id: 'competitor-links',
                name: 'Competitor Links',
                attributes: [
                    { key: 'userId', type: 'string', size: 255, required: true },
                    { key: 'productId', type: 'string', size: 255, required: true },
                    { key: 'competitorUrl', type: 'string', size: 1000, required: true },
                    { key: 'competitorName', type: 'string', size: 255, required: false },
                    { key: 'lastPrice', type: 'float', required: false },
                    { key: 'lastChecked', type: 'datetime', required: false }
                ]
            },
            {
                id: 'price-history',
                name: 'Price History',
                attributes: [
                    { key: 'userId', type: 'string', size: 255, required: true },
                    { key: 'productId', type: 'string', size: 255, required: false },
                    { key: 'competitorLinkId', type: 'string', size: 255, required: false },
                    { key: 'price', type: 'float', required: true },
                    { key: 'currency', type: 'string', size: 10, required: true },
                    { key: 'recordedAt', type: 'datetime', required: true }
                ]
            }
        ];

        for (const collection of collections) {
            console.log(`\n📋 Creating collection: ${collection.name}...`);

            try {
                // Create collection with document-level permissions
                await databases.createCollection(
                    DATABASE_ID,
                    collection.id,
                    collection.name,
                    [
                        Permission.read(Role.user('ID')),
                        Permission.create(Role.users()),
                        Permission.update(Role.user('ID')),
                        Permission.delete(Role.user('ID'))
                    ],
                    true // Document security enabled
                );
                console.log(`✅ Collection "${collection.name}" created`);

                // Wait for collection to be ready
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Create attributes
                console.log(`   Adding attributes...`);
                for (const attr of collection.attributes) {
                    try {
                        if (attr.type === 'string') {
                            await databases.createStringAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.size,
                                attr.required
                            );
                        } else if (attr.type === 'float') {
                            await databases.createFloatAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required
                            );
                        } else if (attr.type === 'datetime') {
                            await databases.createDatetimeAttribute(
                                DATABASE_ID,
                                collection.id,
                                attr.key,
                                attr.required
                            );
                        }
                        console.log(`   ✓ ${attr.key}`);
                        // Small delay between attributes
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (attrError: any) {
                        if (attrError.code === 409) {
                            console.log(`   ℹ️  ${attr.key} already exists`);
                        } else {
                            console.error(`   ❌ Error creating ${attr.key}:`, attrError.message);
                        }
                    }
                }
            } catch (error: any) {
                if (error.code === 409) {
                    console.log(`ℹ️  Collection "${collection.name}" already exists`);
                } else {
                    console.error(`❌ Error creating collection:`, error.message);
                }
            }
        }

        console.log('\n🎉 Database setup complete!\n');
        console.log('📝 Summary:');
        console.log(`   Database: ${DATABASE_ID}`);
        console.log(`   Collections: stores, products, competitor-links, price-history`);
        console.log('\n✅ Your Price Monitor SaaS is ready!');
        console.log('🚀 Navigate to http://localhost:3000/ar/auth to get started\n');

    } catch (error: any) {
        console.error('\n❌ Setup failed:', error.message);
        if (error.code === 401) {
            console.log('\n⚠️  API Key Error: The API key does not have sufficient permissions.');
            console.log('📝 Please ensure your API key has these scopes:');
            console.log('   - databases.write');
            console.log('   - collections.write');
            console.log('   - attributes.write');
            console.log('\n💡 Alternative: Create the database manually in Appwrite Console');
            console.log('   See DATABASE_SETUP.md for instructions');
        }
        process.exit(1);
    }
}

setupDatabase();
