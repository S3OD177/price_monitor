'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Activity,
    Database,
    FileText,
    Settings,
    ShieldAlert,
    LogOut,
    ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { account } from '@/lib/appwrite/client'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
    locale: string
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const sidebarItems = [
        {
            title: 'Overview',
            href: `/${locale}/admin`,
            icon: LayoutDashboard,
        },
        {
            title: 'Users',
            href: `/${locale}/admin/users`,
            icon: Users,
        },
        {
            title: 'System',
            href: `/${locale}/admin/system`,
            icon: Activity,
        },
        {
            title: 'Database',
            href: `/${locale}/admin/database`,
            icon: Database,
        },
        {
            title: 'Scraping',
            href: `/${locale}/admin/scraping`,
            icon: FileText,
        },
        {
            title: 'Moderation',
            href: `/${locale}/admin/moderation`,
            icon: ShieldAlert,
        },
        {
            title: 'Settings',
            href: `/${locale}/admin/settings`,
            icon: Settings,
        },
    ]

    const handleLogout = async () => {
        try {
            await account.deleteSession('current')
            router.push(`/${locale}/auth`)
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    return (
        <div className="hidden border-r bg-zinc-900 text-zinc-100 md:block md:w-64">
            <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b border-zinc-800 px-6">
                    <Link href={`/${locale}/admin`} className="flex items-center gap-2 font-semibold">
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        <span>Admin Console</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {sidebarItems.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                                        isActive
                                            ? "bg-red-600 text-white"
                                            : "text-zinc-400 hover:bg-zinc-800"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="mt-auto border-t border-zinc-800 p-4 space-y-2">
                    <Link href={`/${locale}/dashboard`}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to App
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>
        </div>
    )
}
