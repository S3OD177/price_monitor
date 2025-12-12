'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAuthClient, createSessionClient } from '@/lib/appwrite/server'
import { ID } from 'node-appwrite'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const locale = formData.get('locale') as string || 'en'

    const { account } = createAuthClient()

    try {
        const session = await account.createEmailPasswordSession(email, password)
        console.log('Login successful, session created:', session.$id)

        const cookieStore = await cookies()
        cookieStore.set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: new Date(session.expire)
        })
        console.log('Cookie set, redirecting to dashboard...')

        redirect(`/${locale}/dashboard`)
    } catch (error: any) {
        console.log('Login error caught:', error)
        console.log('Error digest:', error?.digest)
        console.log('Error type:', error?.type)

        // Next.js redirect() throws a special error with digest 'NEXT_REDIRECT'
        if (error?.digest?.includes('NEXT_REDIRECT')) {
            console.log('Re-throwing redirect error')
            throw error
        }
        console.error('Login error:', error)
        return { error: error.message || 'Login failed' }
    }
}

export async function signup(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const locale = formData.get('locale') as string || 'en'

    const { account } = createAuthClient()

    try {
        await account.create(ID.unique(), email, password, name)
        const session = await account.createEmailPasswordSession(email, password)

        const cookieStore = await cookies()
        cookieStore.set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: new Date(session.expire)
        })

        redirect(`/${locale}/dashboard`)
    } catch (error: any) {
        // Next.js redirect() throws a special error with digest 'NEXT_REDIRECT'
        if (error?.digest?.includes('NEXT_REDIRECT')) {
            throw error
        }
        console.error('Signup error:', error)
        return { error: error.message || 'Signup failed' }
    }
}

export async function logout() {
    const { account } = await createSessionClient()

    try {
        await account.deleteSession('current')
    } catch (error) {
        // Ignore error if session is already invalid
    }

    const cookieStore = await cookies()
    cookieStore.delete('appwrite-session')

    // Redirect to base auth, middleware will handle locale
    redirect('/auth')
}

