'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { account } from "@/lib/appwrite/client"
import { createSession } from "@/app/[locale]/auth/actions"
import { ID } from 'appwrite'
import { Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface AuthFormProps {
    defaultTab?: "login" | "signup"
}

const DEMO_ACCOUNTS = [
    { email: 'demo@example.com', password: 'password123', name: 'Demo Account 1' },
    { email: 'demo2@example.com', password: 'password123', name: 'Demo Account 2' }
]

export function AuthForm({ defaultTab = "login" }: AuthFormProps) {
    const router = useRouter()
    const locale = useLocale()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedDemo, setSelectedDemo] = useState(0)

    // Login State
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // Signup State
    const [signupName, setSignupName] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            // Clear any existing session
            try {
                await account.getSession('current')
                await account.deleteSession('current')
            } catch (e) {
                // No existing session
            }

            const session = await account.createEmailPasswordSession(loginEmail, loginPassword)
            await createSession(session.secret)

            // Use window.location for reliable redirect
            window.location.href = `/${locale}/dashboard`
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.message || "Failed to login")
            setIsLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await account.create(ID.unique(), signupEmail, signupPassword, signupName)
            const session = await account.createEmailPasswordSession(signupEmail, signupPassword)
            await createSession(session.secret)

            // Use window.location for reliable redirect
            window.location.href = `/${locale}/dashboard`
        } catch (err: any) {
            console.error("Signup error:", err)
            setError(err.message || "Failed to sign up")
            setIsLoading(false)
        }
    }

    const handleDemoLogin = async () => {
        const demo = DEMO_ACCOUNTS[selectedDemo]
        setLoginEmail(demo.email)
        setLoginPassword(demo.password)

        setIsLoading(true)
        setError(null)

        try {
            // Clear any existing session
            try {
                await account.getSession('current')
                await account.deleteSession('current')
            } catch (e) {
                // No existing session
            }

            const session = await account.createEmailPasswordSession(demo.email, demo.password)
            await createSession(session.secret)

            // Use window.location for reliable redirect
            window.location.href = `/${locale}/dashboard`
        } catch (err: any) {
            console.error("Demo login error:", err)

            if (err.code === 401 || err.message.includes('Invalid credentials')) {
                setError(`${demo.name} hasn't been created yet. Please sign up with ${demo.email} first, or use Demo Account 1.`)
            } else if (err.code === 429 || err.message.includes('Rate limit')) {
                setError('Too many login attempts. Please wait a few minutes and try again, or use the other demo account.')
            } else {
                setError(err.message || "Failed to login with demo account")
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4 dark:bg-background">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            </div>

            <Card className="w-full max-w-md border-border/50 shadow-xl backdrop-blur-xl bg-background/60">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-base">
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="text-xs text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Sign In
                                </Button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedDemo}
                                        onChange={(e) => setSelectedDemo(Number(e.target.value))}
                                        className="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {DEMO_ACCOUNTS.map((demo, index) => (
                                            <option key={index} value={index}>{demo.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full bg-background/50"
                                    onClick={handleDemoLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Use Demo Account
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                        className="bg-background/50"
                                    />
                                </div>
                                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center border-t bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                        By clicking continue, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
