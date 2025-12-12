import { createSessionClient } from '@/lib/appwrite/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth/admin-middleware'
import {
    getAllUsers,
    getSystemMetrics,
    getDatabaseStats,
    getScrapingStats,
    getAnalyticsData
} from './admin-actions'
import { getPendingRequests, getScrapingReports, getProductUpdateRequests } from './actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RequestActionButtons } from './request-action-buttons'
import { ScrapingReportCard } from './scraping-report-card'
import { ProductUpdateCard } from './product-update-card'
import { UserManagementTable } from '@/components/admin/user-management-table'
import { SystemMonitor } from '@/components/admin/system-monitor'
import { DatabaseTools } from '@/components/admin/database-tools'
import { ScrapingDashboard } from '@/components/admin/scraping-dashboard'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'
import {
    Users,
    Activity,
    Database,
    FileText,
    BarChart3,
    ShieldAlert,
    RefreshCw
} from 'lucide-react'

// Define fallback data constants to satisfy type requirements
const DEFAULT_SYSTEM_METRICS = {
    totalProducts: 0,
    totalStores: 0,
    totalCompetitors: 0,
    totalPriceRecords: 0,
    timestamp: new Date().toISOString()
}

const DEFAULT_ANALYTICS_DATA = {
    totalUsers: 0,
    newUsersLast30Days: 0,
    totalProducts: 0,
    newProductsLast30Days: 0,
    userGrowthRate: '0'
}

const DEFAULT_SCRAPING_STATS = {
    total: 0,
    pending: 0,
    resolved: 0,
    recent24h: 0,
    successRate: '0'
}

export default async function AdminDashboard({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    // 1. Verify Admin Access
    const adminCheck = await isAdmin()
    if (!adminCheck.isAdmin) {
        redirect(`/${locale}/dashboard`)
    }

    // 2. Fetch All Data in Parallel
    const [
        usersData,
        systemMetrics,
        dbStats,
        scrapingStats,
        analyticsData,
        requestsData,
        reportsData,
        productUpdatesData
    ] = await Promise.all([
        getAllUsers(),
        getSystemMetrics(),
        getDatabaseStats(),
        getScrapingStats(),
        getAnalyticsData(),
        getPendingRequests(),
        getScrapingReports('all'),
        getProductUpdateRequests('pending')
    ])

    // 3. Process Data
    const requests = requestsData.requests || []
    const allReports = reportsData.reports || []
    const pendingReports = allReports.filter((r: any) => r.status === 'pending')
    const productUpdates = productUpdatesData.requests || []

    // Prepare data with fallbacks for components
    const metricsData = systemMetrics.success && systemMetrics.metrics ? systemMetrics.metrics : DEFAULT_SYSTEM_METRICS
    const analyticsChartData = analyticsData.success && analyticsData.analytics ? analyticsData.analytics : DEFAULT_ANALYTICS_DATA
    const scrapingStatsData = scrapingStats.success && scrapingStats.stats ? scrapingStats.stats : DEFAULT_SCRAPING_STATS
    const dbStatsData = dbStats.success && dbStats.stats ? dbStats.stats : []
    const usersListData = usersData.success && usersData.users ? usersData.users : []

    const totalPending = requests.length + pendingReports.length + productUpdates.length

    return (
        <div className="flex-1 space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">
                        System control center and management tools
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-4 py-1">
                        Admin Access Granted
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6 lg:w-auto">
                    <TabsTrigger value="overview">
                        <Activity className="h-4 w-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="users">
                        <Users className="h-4 w-4 mr-2" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="database">
                        <Database className="h-4 w-4 mr-2" />
                        Database
                    </TabsTrigger>
                    <TabsTrigger value="scraping">
                        <FileText className="h-4 w-4 mr-2" />
                        Scraping
                    </TabsTrigger>
                    <TabsTrigger value="moderation">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Moderation
                        {totalPending > 0 && (
                            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                {totalPending}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-4">
                    <SystemMonitor metrics={metricsData} />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <div className="col-span-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common administrative tasks</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    {/* Quick actions placeholders */}
                                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                        <h3 className="font-medium">Review Pending Requests</h3>
                                        <p className="text-sm text-muted-foreground">{totalPending} items waiting</p>
                                    </div>
                                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                        <h3 className="font-medium">Check System Health</h3>
                                        <p className="text-sm text-muted-foreground">All systems operational</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest system events</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Activity feed placeholder */}
                                        <div className="text-sm text-muted-foreground text-center py-4">
                                            No recent critical alerts
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* USERS TAB */}
                <TabsContent value="users">
                    <UserManagementTable users={usersListData} />
                </TabsContent>

                {/* ANALYTICS TAB */}
                <TabsContent value="analytics">
                    <AnalyticsCharts data={analyticsChartData} />
                </TabsContent>

                {/* DATABASE TAB */}
                <TabsContent value="database">
                    <DatabaseTools stats={dbStatsData} />
                </TabsContent>

                {/* SCRAPING TAB */}
                <TabsContent value="scraping">
                    <ScrapingDashboard stats={scrapingStatsData} />
                </TabsContent>

                {/* MODERATION TAB */}
                <TabsContent value="moderation" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Product Updates */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <RefreshCw className="h-5 w-5" />
                                    Product Updates
                                </CardTitle>
                                <CardDescription>Community edits ({productUpdates.length})</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {productUpdates.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No pending updates
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {productUpdates.map((request: any) => (
                                            <ProductUpdateCard key={request.$id} request={request} />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Change Requests (Legacy/Other) */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Change Requests</CardTitle>
                                <CardDescription>User suggestions ({requests.length})</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {requests.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No pending requests
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {requests.map((request: any) => (
                                            <div key={request.$id} className="flex flex-col gap-4 p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">ID:</span>
                                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{request.competitorId}</code>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                                        <div><span className="text-muted-foreground">Name:</span> {request.proposedName}</div>
                                                        <div><span className="text-muted-foreground">Price:</span> {request.proposedPrice}</div>
                                                    </div>
                                                </div>
                                                <RequestActionButtons request={request} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Scraping Reports */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Scraping Reports</CardTitle>
                                <CardDescription>User reported issues ({pendingReports.length})</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingReports.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No pending reports
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingReports.map((report: any) => (
                                            <ScrapingReportCard key={report.$id} report={report} />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
