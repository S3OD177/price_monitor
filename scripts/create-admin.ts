import { createAdminClient } from '@/lib/appwrite/server'
import { ID } from 'node-appwrite'

const DEMO_ADMIN = {
    email: 'admin@demo.com',
    password: 'password123',
    name: 'Demo Admin'
}

async function createDemoAdmin() {
    console.log('Creating demo admin account...')

    try {
        const { users } = await createAdminClient()

        // Check if user exists
        try {
            const existingUsers = await users.list([
                `email("${DEMO_ADMIN.email}")`
            ])

            if (existingUsers.total > 0) {
                console.log('Demo admin already exists')
                return
            }
        } catch (e) {
            // Ignore error if search fails
        }

        // Create user
        const user = await users.create(
            ID.unique(),
            DEMO_ADMIN.email,
            undefined, // phone
            DEMO_ADMIN.password,
            DEMO_ADMIN.name
        )

        // Verify email automatically
        await users.updateEmailVerification(user.$id, true)

        console.log('Success! Demo admin created:')
        console.log(`Email: ${DEMO_ADMIN.email}`)
        console.log(`Password: ${DEMO_ADMIN.password}`)

    } catch (error: any) {
        console.error('Failed to create demo admin:', error.message)
    }
}

createDemoAdmin()
