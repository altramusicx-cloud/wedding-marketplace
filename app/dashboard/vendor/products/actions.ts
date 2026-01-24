"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        // Verify ownership (RLS will also protect, but this is extra validation)
        const { data: product } = await supabase
            .from('products')
            .select('vendor_id')
            .eq('id', productId)
            .single()

        if (!product || product.vendor_id !== user.id) {
            return { success: false, error: "You don't have permission to delete this product" }
        }

        // Delete product images first (RLS protected)
        const { error: imagesError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId)

        if (imagesError) {
            return { success: false, error: "Failed to delete product images" }
        }

        // Delete product (RLS protected)
        const { error: productError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (productError) {
            return { success: false, error: "Failed to delete product" }
        }

        // Revalidate paths
        revalidatePath('/dashboard/vendor/products')
        revalidatePath('/dashboard/vendor')
        revalidatePath('/')

        return { success: true }

    } catch (error) {
        console.error('Delete product error:', error)
        return { success: false, error: "Internal server error" }
    }
}

export async function toggleProductFeatured(productId: string, featured: boolean) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        // Verify ownership
        const { data: product } = await supabase
            .from('products')
            .select('vendor_id')
            .eq('id', productId)
            .single()

        if (!product || product.vendor_id !== user.id) {
            return { success: false, error: "You don't have permission to modify this product" }
        }

        const { error } = await supabase
            .from('products')
            .update({ is_featured: featured })
            .eq('id', productId)

        if (error) {
            return { success: false, error: "Failed to update product" }
        }

        revalidatePath('/dashboard/vendor/products')
        revalidatePath('/vendor/[id]', 'page')
        revalidatePath('/')

        return { success: true }

    } catch (error) {
        console.error('Toggle featured error:', error)
        return { success: false, error: "Internal server error" }
    }
}