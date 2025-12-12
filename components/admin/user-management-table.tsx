'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Ban, CheckCircle, Search, Eye } from 'lucide-react'
import { toggleUserBan, getUserActivity } from '@/app/[locale]/dashboard/admin/admin-actions'
import { useToast } from '@/hooks/use-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface User {
    $id: string
    email: string
    name: string
    emailVerification: boolean
    status: boolean
    registration: string
    passwordUpdate: string
}

interface UserManagementTableProps {
    users: User[]
}

export function UserManagementTable({ users: initialUsers }: UserManagementTableProps) {
    const [users, setUsers] = useState(initialUsers)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [userActivity, setUserActivity] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleToggleBan = async (userId: string, currentStatus: boolean) => {
        setIsLoading(true)
        const result = await toggleUserBan(userId, !currentStatus)

        if (result.success) {
            // Update local state
            setUsers(users.map(u =>
                u.$id === userId ? { ...u, status: !currentStatus } : u
            ))
            toast({
                title: 'Success',
                description: result.message
            })
        } else {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        }
        setIsLoading(false)
    }

    const handleViewActivity = async (user: User) => {
        setSelectedUser(user)
        setIsLoading(true)

        const result = await getUserActivity(user.$id)

        if (result.success) {
            setUserActivity(result.activity)
        } else {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            })
        }
        setIsLoading(false)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all registered users</CardDescription>
                    <div className="flex items-center gap-2 mt-4">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by email or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.$id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>{user.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status ? 'default' : 'destructive'}>
                                                {user.status ? 'Active' : 'Banned'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.emailVerification ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <span className="text-muted-foreground text-sm">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.registration).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewActivity(user)}
                                                    disabled={isLoading}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant={user.status ? 'destructive' : 'default'}
                                                    size="sm"
                                                    onClick={() => handleToggleBan(user.$id, user.status)}
                                                    disabled={isLoading}
                                                >
                                                    <Ban className="h-4 w-4 mr-1" />
                                                    {user.status ? 'Ban' : 'Unban'}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Activity: {selectedUser?.email}</DialogTitle>
                        <DialogDescription>
                            View detailed activity and statistics for this user
                        </DialogDescription>
                    </DialogHeader>
                    {userActivity && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Stores</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{userActivity.storesCount}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Products</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{userActivity.productsCount}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Competitors</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{userActivity.competitorsCount}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {userActivity.stores.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Connected Stores</h4>
                                    <div className="space-y-2">
                                        {userActivity.stores.map((store: any) => (
                                            <div key={store.$id} className="flex items-center justify-between p-2 border rounded">
                                                <div>
                                                    <div className="font-medium">{store.storeName}</div>
                                                    <div className="text-sm text-muted-foreground">{store.platform}</div>
                                                </div>
                                                <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                                                    {store.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
