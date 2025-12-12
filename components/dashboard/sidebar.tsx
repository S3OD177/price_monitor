'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    Settings,
    Store,
    LogOut,
    CreditCard,
    Puzzle,
    FileText,
    Bell,
    User,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { account } from '@/lib/appwrite/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        href: '/dashboard/products',
        icon: Package,
    },
    {
        title: 'Integrations',
        href: '/dashboard/integrations',
        icon: Puzzle,
    },
    {
        title: 'Reports',
        href: '/dashboard/reports',
        icon: FileText,
    },
    {
        title: 'Alerts',
        href: '/dashboard/alerts',
        icon: Bell,
    },
    {
        title: 'Account',
        href: '/dashboard/account',
        icon: User,
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    // Note: We don't check admin status client-side because the session cookie is HttpOnly
    // and not accessible to the client-side SDK. Admin status should be checked server-side.
    // Users can navigate to /dashboard/admin directly, and server-side middleware will handle auth.


    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            router.push('/auth');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Store className="h-5 w-5" />
                    </div>
                    <span>PriceMonitor</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}

                    {/* Admin Link */}
                    {isAdmin && (
                        <Link
                            href="/dashboard/admin"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary mt-4 border-t pt-4",
                                pathname.includes('/dashboard/admin')
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <ShieldAlert className="h-4 w-4" />
                            Admin Panel
                        </Link>
                    )}
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </Button>
            </div>
        </div>
    );
}
