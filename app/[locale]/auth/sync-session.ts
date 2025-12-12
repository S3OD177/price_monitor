'use server'

import { cookies } from 'next/headers'

/**
 * Syncs the client-side Appwrite session to a server-side HttpOnly cookie
 * This is needed because the client SDK stores the session in localStorage,
 * but our server-side code needs it in a cookie to authenticate requests
 */
export async function syncSession(sessionSecret: string) {
    const cookieStore = await cookies()

    // Set the session cookie with appropriate security settings
    cookieStore.set('appwrite-session', sessionSecret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        // Session expires in 1 year (Appwrite default)
        maxAge: 60 * 60 * 24 * 365
    })

    return { success: true }
}

export async function clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete('appwrite-session')
    return { success: true }
}
