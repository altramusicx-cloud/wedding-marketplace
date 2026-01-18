// File: components/admin/product-approval-card.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    CheckCircle,
    XCircle,
    Eye,
    Calendar,
    MapPin,
    Tag,
    User
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format-currency'
import { formatDate } from '@/lib/utils/format-date'
import { approveProduct, rejectProduct } from '@/lib/actions/admin'
import { useToast } from '@/components/ui/use-toast'
import type { ProductWithImages } from '@/types'

interface ProductApprovalCardProps {
    product: ProductWithImages
    readonly?: boolean
}

export function ProductApprovalCard({ product, readonly = false }: ProductApprovalCardProps) {
    const [isApproving, setIsApproving] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [showRejectForm, setShowRejectForm] = useState(false)
    const { toast } = useToast()

    const handleApprove = async () => {
        if (readonly) return

        setIsApproving(true)
        try {
            const result = await approveProduct(product.id)

            if (result.success) {
                toast({
                    title: 'Product Approved',
                    description: 'Product has been approved and published.',
                    variant: 'default'
                })
                setTimeout(() => window.location.reload(), 2000)
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'Failed to approve product',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'destructive'
            })
        } finally {
            setIsApproving(false)
        }
    }

    const handleReject = async () => {
        if (readonly || !rejectionReason.trim()) return

        setIsRejecting(true)
        try {
            const result = await rejectProduct(product.id, rejectionReason)

            if (result.success) {
                toast({
                    title: 'Product Rejected',
                    description: 'Product has been rejected.',
                    variant: 'default'
                })
                setTimeout(() => window.location.reload(), 2000)
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'Failed to reject product',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred',
                variant: 'destructive'
            })
        } finally {
            setIsRejecting(false)
            setShowRejectForm(false)
            setRejectionReason('')
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Images */}
                    <div className="lg:w-1/3">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            {product.thumbnail_url ? (
                                <img
                                    src={product.thumbnail_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : product.product_images?.[0]?.url ? (
                                <img
                                    src={product.product_images[0].url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>
                        {product.product_images && product.product_images.length > 1 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                                {product.product_images.slice(0, 3).map((image) => (
                                    <div key={image.id} className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                        <img
                                            src={image.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                {product.product_images.length > 3 && (
                                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                        +{product.product_images.length - 3}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="lg:w-2/3 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-charcoal">{product.name}</h3>
                            <p className="text-gray-600 mt-1">{product.description}</p>
                        </div>

                        {/* Product Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{product.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{product.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">
                                    {formatDate(product.created_at)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">
                                    {product.profiles?.full_name || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Price Range:</span>
                                <span className="font-bold text-lg text-charcoal">
                                    {product.price_from || product.price_to ? (
                                        <>
                                            {product.price_from && formatCurrency(product.price_from)}
                                            {product.price_to && ` - ${formatCurrency(product.price_to)}`}
                                            {product.price_unit && ` / ${product.price_unit}`}
                                        </>
                                    ) : (
                                        'Contact for price'
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        {!readonly && product.status === 'pending' && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                                Pending Approval
                            </div>
                        )}
                        {product.status === 'approved' && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                Approved
                            </div>
                        )}
                        {product.status === 'rejected' && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                                Rejected
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!readonly && product.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isApproving ? 'Approving...' : 'Approve Product'}
                                </Button>

                                {showRejectForm ? (
                                    <div className="flex-1 space-y-3">
                                        <Textarea
                                            placeholder="Reason for rejection (required)"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleReject}
                                                disabled={isRejecting || !rejectionReason.trim()}
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                {isRejecting ? 'Rejecting...' : 'Confirm Reject'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowRejectForm(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowRejectForm(true)}
                                        className="flex-1"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject Product
                                    </Button>
                                )}

                                <Button variant="ghost" className="flex-1">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}