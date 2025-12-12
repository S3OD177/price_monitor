'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDashboardStats } from '@/app/actions/dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Package, Plus, ArrowUpRight, TrendingUp, Loader2, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/stat-card'
import { StoreCard } from '@/components/dashboard/store-card'
import { PriceHistoryChart } from '@/components/dashboard/price-history-chart'
import { CompetitorComparisonChart } from '@/components/dashboard/competitor-comparison'
import { SalesTrendChart } from '@/components/dashboard/sales-trend'
import { PriceAlertsWidget } from '@/components/dashboard/price-alerts-widget'
import { QuickActionsCard } from '@/components/dashboard/quick-actions-card'

interface DashboardPageProps {
    params: Promise<{ locale: string }>
}

export default function DashboardPage({ params }: DashboardPageProps) {
    const router = useRouter()
    const [locale, setLocale] = useState('en')
    const [isLoading, setIsLoading] = useState(true)
    const [stores, setStores] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        async function init() {
            // Get locale from params
            const resolvedParams = await params
            setLocale(resolvedParams.locale)

            try {
                const result = await getDashboardStats()

                if (result.success) {
                    setStores(result.stores)
                    setProducts(result.products)
                } else {
                    // If unauthorized, redirect to auth
                    if (result.error?.includes('Unauthorized') || result.error?.includes('missing scopes')) {
                        router.push(`/${resolvedParams.locale}/auth`)
                    } else {
                        console.warn('Dashboard: Error fetching data:', result.error)
                        // Continue with empty data
                        setStores([])
                        setProducts([])
                    }
                }
                setIsLoading(false)
            } catch (error) {
                console.error('Dashboard: Unexpected error', error)
                setIsLoading(false)
            }
        }

        init()
    }, [params, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const totalProducts = products.length
    const activeStores = stores.filter(s => s.status === 'active').length

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        {/* Add Store button moved to Integrations page */}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value="$45,231.89"
                        description="+20.1% from last month"
                        icon={DollarSign}
                    />
                    <StatCard
                        title="Active Stores"
                        value={activeStores.toString()}
                        description="Currently syncing"
                        icon={Store}
                    />
                    <StatCard
                        title="Total Products"
                        value={totalProducts.toString()}
                        description="Being monitored"
                        icon={Package}
                    />
                    <StatCard
                        title="Active Now"
                        value="+573"
                        description="+201 since last hour"
                        icon={Activity}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        <SalesTrendChart />
                    </div>
                    <div className="col-span-3">
                        <CompetitorComparisonChart />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <QuickActionsCard locale={locale} />
                    <PriceAlertsWidget />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stores.length === 0 ? (
                        <Card className="col-span-full">
                            <CardHeader>
                                <CardTitle>No Stores Connected</CardTitle>
                                <CardDescription>
                                    Connect your first store to start monitoring competitor prices
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/${locale}/dashboard/integrations`}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Go to Integrations
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        stores.map((store) => (
                            <StoreCard
                                key={store.$id}
                                store={store}
                                locale={locale}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
