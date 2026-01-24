// app/api/products/[id]/view/route.ts - SIMPLE VERSION DULU
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const params = await context.params
        const productId = params.id

        // 🛡️ Ambil user dari session
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    view_count: 0
                },
                { status: 401 }
            )
        }

        const viewerId = user.id

        // 🛡️ Cek apakah produk ada dan approved
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id, vendor_id, status, name, view_count')
            .eq('id', productId)
            .eq('status', 'approved')
            .single()

        if (productError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Product not available',
                    view_count: 0
                },
                { status: 404 }
            )
        }

        // 🛡️ Vendor tidak boleh view produk sendiri
        if (product.vendor_id === viewerId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vendor cannot view own product',
                    view_count: product.view_count || 0
                },
                { status: 403 }
            )
        }

        // 🛡️ SIMPLE INCREMENT: Tanpa function RPC dulu
        const { data: updatedProduct, error: updateError } = await supabase
            .from('products')
            .update({
                view_count: (product.view_count || 0) + 1
            })
            .eq('id', productId)
            .select('view_count')
            .single()

        if (updateError) throw updateError

        return NextResponse.json({
            success: true,
            view_count: updatedProduct.view_count || 0,
            product_name: product.name
        })

    } catch (error: any) {
        console.error('Error in view increment:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process view',
                view_count: 0
            },
            { status: 500 }
        )
    }
}