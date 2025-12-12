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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RequestActionButtons } from './request-action-buttons'
import { ScrapingReportCard } from './scraping-report-card'
import { ProductUpdateCard } from './product-update-card'
import { SystemMonitor } from '@/components/admin/system-monitor'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'
import {
    Activity,
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
        systemMetrics,
        analyticsData,
        requestsData,
        reportsData,
        productUpdatesData
    ] = await Promise.all([
        getSystemMetrics(),
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

    const totalPending = requests.length + pendingReports.length + productUpdates.length

    return (
        <div className="flex-1 space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
                    <p className="text-muted-foreground">
                        System status and key metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-4 py-1 border-red-200 text-red-700 bg-red-50">
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Admin Mode
                    </Badge>
                </div>
            </div>

            <div className="space-y-8">
                {/* System Monitor */}
                <SystemMonitor metrics={metricsData} />

                {/* Analytics */}
                <AnalyticsCharts data={analyticsChartData} />

                {/* Pending Items Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Pending Updates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productUpdates.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Product edits</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Change Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{requests.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">User suggestions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Scraping Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingReports.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Issues reported</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
