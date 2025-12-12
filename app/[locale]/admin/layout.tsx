import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { createSessionClient } from '@/lib/appwrite/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth/admin-middleware'

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    // Verify admin access at layout level
    const adminCheck = await isAdmin()
    if (!adminCheck.isAdmin) {
        redirect(`/${locale}/dashboard`)
    }

    return (
        <div className="flex min-h-screen bg-muted/40">
            <AdminSidebar locale={locale} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
