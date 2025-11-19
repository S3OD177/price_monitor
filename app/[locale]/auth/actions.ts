'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSessionClient } from '@/lib/appwrite/server'

export async function createSession(secret: string) {
    const cookieStore = await cookies()
    cookieStore.set('appwrite-session', secret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })
}

export async function logout(locale: string = 'en') {
    const { account } = await createSessionClient()

    try {
        await account.deleteSession('current')
    } catch (error) {
        // Session might be invalid already
    }

    const cookieStore = await cookies()
    cookieStore.delete('appwrite-session')

    redirect(`/${locale}/auth`)
}
