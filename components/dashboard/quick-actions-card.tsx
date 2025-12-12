import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, FileText, Settings } from 'lucide-react'
import Link from 'next/link'

interface QuickActionsCardProps {
    locale: string
}

export function QuickActionsCard({ locale }: QuickActionsCardProps) {
    return (
        <Card className="col-span-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <Link href={`/${locale}/dashboard/products/new`}>
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Plus className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium">Add Product</div>
                                <div className="text-xs text-muted-foreground">Track new item</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href={`/${locale}/dashboard/integrations`}>
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <RefreshCw className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium">Sync Stores</div>
                                <div className="text-xs text-muted-foreground">Update prices</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href={`/${locale}/dashboard/reports`}>
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium">View Reports</div>
                                <div className="text-xs text-muted-foreground">Analysis & insights</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href={`/${locale}/dashboard/settings`}>
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Settings className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium">Settings</div>
                                <div className="text-xs text-muted-foreground">Configure app</div>
                            </div>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
