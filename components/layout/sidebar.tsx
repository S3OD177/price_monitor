import Link from "next/link"
import { LayoutDashboard, Package, Settings, ShoppingCart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Price Monitor
                    </h2>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" />
                            Products
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Stores
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
