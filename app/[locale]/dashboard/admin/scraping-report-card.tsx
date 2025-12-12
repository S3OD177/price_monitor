'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { markReportResolved, deleteReport } from './actions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface ScrapingReportCardProps {
    report: any
}

export function ScrapingReportCard({ report }: ScrapingReportCardProps) {
    const [loading, setLoading] = useState(false)
    const [showNotes, setShowNotes] = useState(false)
    const [adminNotes, setAdminNotes] = useState('')
    const { toast } = useToast()
    const router = useRouter()

    const handleResolve = async () => {
        setLoading(true)
        try {
            const result = await markReportResolved(report.$id, adminNotes)
            if (result.success) {
                toast({
                    title: "Report Resolved",
                    description: "The scraping report has been marked as resolved"
                })
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to resolve report",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to resolve report",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this report?')) return

        setLoading(true)
        try {
            const result = await deleteReport(report.$id)
            if (result.success) {
                toast({
                    title: "Report Deleted",
                    description: "The scraping report has been deleted"
                })
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to delete report",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete report",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant={report.status === 'pending' ? 'default' : 'secondary'}>
                                    {report.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {report.productName && (
                                <div>
                                    <span className="text-sm font-medium">Product: </span>
                                    <span className="text-sm">{report.productName}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {report.reportedSku && (
                                    <div>
                                        <span className="text-muted-foreground">Reported SKU: </span>
                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{report.reportedSku}</code>
                                    </div>
                                )}
                                {report.expectedSku && (
                                    <div>
                                        <span className="text-muted-foreground">Expected SKU: </span>
                                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{report.expectedSku}</code>
                                    </div>
                                )}
                            </div>

                            <div className="bg-muted p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Issue Description:</p>
                                <p className="text-sm text-muted-foreground">{report.issue}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <a href={report.productUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View Product
                                    </a>
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    Reported by: {report.reportedBy}
                                </span>
                            </div>

                            {report.status === 'resolved' && report.resolvedAt && (
                                <div className="text-xs text-muted-foreground">
                                    Resolved on {new Date(report.resolvedAt).toLocaleDateString()}
                                    {report.adminNotes && (
                                        <div className="mt-1 bg-green-50 p-2 rounded">
                                            <span className="font-medium">Admin Notes: </span>
                                            {report.adminNotes}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {report.status === 'pending' && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowNotes(!showNotes)}
                                    disabled={loading}
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Resolve
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {showNotes && report.status === 'pending' && (
                        <div className="space-y-2 pt-2 border-t">
                            <div className="grid gap-2">
                                <Label htmlFor={`notes-${report.$id}`}>Admin Notes (Optional)</Label>
                                <Textarea
                                    id={`notes-${report.$id}`}
                                    placeholder="Add notes about how this was resolved..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleResolve}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resolving...
                                        </>
                                    ) : (
                                        'Confirm Resolve'
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowNotes(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
