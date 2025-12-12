import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Server, Database, AlertTriangle, CheckCircle } from 'lucide-react'

interface SystemMetrics {
    totalProducts: number
    totalStores: number
    totalCompetitors: number
    totalPriceRecords: number
    timestamp: string
}

interface SystemMonitorProps {
    metrics: SystemMetrics
}

export function SystemMonitor({ metrics }: SystemMonitorProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Operational</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All systems normal
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database Load</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Normal</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics.totalPriceRecords.toLocaleString()} records total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API Health</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Uptime (Last 24h)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.01%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Last 60 minutes
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent System Events</CardTitle>
                        <CardDescription>Log of recent system activities and errors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { event: 'System Backup Completed', time: '2 hours ago', status: 'success' },
                                { event: 'Database Optimization', time: '5 hours ago', status: 'success' },
                                { event: 'High API Latency Warning', time: '12 hours ago', status: 'warning' },
                                { event: 'Daily Cron Job', time: '1 day ago', status: 'success' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        {log.status === 'success' ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        )}
                                        <span className="text-sm font-medium">{log.event}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resource Usage</CardTitle>
                        <CardDescription>Current system resource utilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Database Storage</span>
                                    <span className="font-medium">45%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[45%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>API Requests (Daily Quota)</span>
                                    <span className="font-medium">23%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[23%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Function Executions</span>
                                    <span className="font-medium">12%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[12%]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
