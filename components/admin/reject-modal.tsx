// components\admin\reject-modal.tsx
"use client"

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface RejectModalProps {
    isOpen: boolean
    onClose: () => void
    productId: string
    productName: string
    onReject: (productId: string, reason: string) => Promise<void>
}

export function RejectModal({
    isOpen,
    onClose,
    productId,
    productName,
    onReject
}: RejectModalProps) {
    const [reason, setReason] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!reason.trim()) return

        setIsSubmitting(true)
        try {
            await onReject(productId, reason)
            setReason('')
            onClose()
        } catch (error) {
            console.error('Failed to reject product:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Product</DialogTitle>
                    <DialogDescription>
                        Provide a reason for rejecting "{productName}". This will be visible to the vendor.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Rejection Reason *
                        </label>
                        <Textarea
                            id="reason"
                            placeholder="Example: Image quality is poor, description is insufficient, price seems unrealistic..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Minimum 20 characters. Be constructive to help vendor improve.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={!reason.trim() || reason.length < 20 || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejecting...
                            </>
                        ) : (
                            'Confirm Reject'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}