export interface ProductChangeRequest {
    $id?: string
    competitorId: string
    userId: string
    proposedName?: string
    proposedSku?: string
    proposedPrice?: number
    proposedCurrency?: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    updatedAt: string
}
