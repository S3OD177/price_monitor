import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Package, TrendingUp, ArrowUpRight } from "lucide-react"

export function DashboardPreview() {
    return (
        <div className="w-full rounded-xl border bg-background shadow-2xl overflow-hidden">
            <div className="border-b bg-muted/40 p-4 flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Overview of your stores and products.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Store className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                +1 this week
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,248</div>
                            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Price Changes</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-7">
                    <Card className="col-span-4 shadow-sm">
                        <CardHeader>
                            <CardTitle>Connected Stores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                                            <Store className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">My Salla Store</p>
                                            <p className="text-xs text-muted-foreground mt-1">Salla</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Synced 2m ago</div>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                                            <Store className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Trendyol Shop</p>
                                            <p className="text-xs text-muted-foreground mt-1">Trendyol</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Synced 1h ago</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-red-500" />
                                    <div>
                                        <p className="text-sm font-medium">Competitor Price Drop</p>
                                        <p className="text-xs text-muted-foreground">iPhone 15 Pro Max dropped by 5%</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-yellow-500" />
                                    <div>
                                        <p className="text-sm font-medium">Stock Low</p>
                                        <p className="text-xs text-muted-foreground">Samsung S24 Ultra is low stock</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
