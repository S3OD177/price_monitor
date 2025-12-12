'use client'

import { useEffect, useState } from 'react'
import { account } from '@/lib/appwrite/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
    const [status, setStatus] = useState<string>('Checking...')
    const [sessionInfo, setSessionInfo] = useState<any>(null)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const session = await account.getSession('current')
            setSessionInfo(session)
            setStatus('✅ Client-side session exists!')
        } catch (error: any) {
            setStatus('❌ No client-side session: ' + error.message)
        }
    }

    const testLogin = async (email: string, password: string, demoName: string) => {
        setStatus(`Attempting login with ${demoName}...`)
        try {
            // Clear any existing session first
            try {
                await account.deleteSession('current')
            } catch (e) {
                console.log('No session to delete')
            }

            // Login
            const session = await account.createEmailPasswordSession(email, password)
            setStatus(`✅ Login successful! Session ID: ${session.$id}`)
            setSessionInfo(session)

            // Sync to server
            const { syncSession } = await import('@/app/[locale]/auth/sync-session')
            await syncSession(session.secret)
            setStatus('✅ Session synced to server! Redirecting...')

            // Wait a bit then redirect
            setTimeout(() => {
                window.location.href = '/en/dashboard'
            }, 1000)
        } catch (error: any) {
            setStatus('❌ Error: ' + error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Authentication Test Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2">Status:</h3>
                        <p className="font-mono text-sm">{status}</p>
                    </div>

                    {sessionInfo && (
                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">Session Info:</h3>
                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(sessionInfo, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={checkAuth} variant="outline">Check Auth Status</Button>
                        <Button onClick={() => testLogin('demo@example.com', 'password123', 'Demo 1')} variant="default">
                            Test Login (Demo 1)
                        </Button>
                        <Button onClick={() => testLogin('demo2@example.com', 'password123', 'Demo 2')} variant="default">
                            Test Login (Demo 2)
                        </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p>This page will:</p>
                        <ol className="list-decimal list-inside space-y-1 mt-2">
                            <li>Clear any existing session</li>
                            <li>Login with demo2@example.com</li>
                            <li>Sync session to server cookie</li>
                            <li>Redirect to dashboard</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
