'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface AnalyticsData {
    totalUsers: number
    newUsersLast30Days: number
    totalProducts: number
    newProductsLast30Days: number
    userGrowthRate: string
}

interface AnalyticsChartsProps {
    data: AnalyticsData
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
    // Mock data for charts since we don't have historical data stored yet
    // In a real app, this would come from the database
    const revenueData = [
        { name: 'Jan', total: 1200 },
        { name: 'Feb', total: 1800 },
        { name: 'Mar', total: 2200 },
        { name: 'Apr', total: 2600 },
        { name: 'May', total: 3200 },
        { name: 'Jun', total: 3800 },
    ]

    const userActivityData = [
        { name: 'Mon', active: 45 },
        { name: 'Tue', active: 52 },
        { name: 'Wed', active: 48 },
        { name: 'Thu', active: 61 },
        { name: 'Fri', active: 55 },
        { name: 'Sat', active: 38 },
        { name: 'Sun', active: 42 },
    ]

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +{data.newUsersLast30Days} in last 30 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.userGrowthRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Month over month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +{data.newProductsLast30Days} in last 30 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Products/User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.totalUsers > 0 ? (data.totalProducts / data.totalUsers).toFixed(1) : '0'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Engagement metric
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue growth (Mock Data)</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={revenueData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px' }}
                                />
                                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Active Users</CardTitle>
                        <CardDescription>User activity over the last week (Mock Data)</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={userActivityData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px' }}
                                />
                                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
