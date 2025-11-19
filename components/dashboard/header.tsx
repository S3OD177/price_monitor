'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    Settings,
    Store,
    LogOut,
    Puzzle
} from 'lucide-react';
import { account } from '@/lib/appwrite/client';

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
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            router.push('/auth');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 lg:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="flex h-full flex-col">
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
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                        />
                    </div>
                </form>
            </div>
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
