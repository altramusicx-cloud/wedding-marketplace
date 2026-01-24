//app\dashboard\vendor\products\ProductsClient.tsx

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProductsClient from "./ProductsClient"
import type { ProductWithImages } from "@/types"

export default async function VendorProductsPage() {
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // 2. Vendor check
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_vendor")
        .eq("id", user.id)
        .single()

    if (!profile?.is_vendor) {
        redirect("/dashboard")
    }

    // 3. Fetch data (server-side)
    const { data: products, error } = await supabase
        .from("products")
        .select(`
            *,
            product_images(*)
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching products:", error)
    }

    // 4. Calculate stats (server-side)
    const approvedCount = products?.filter(p => p.status === 'approved').length || 0
    const pendingCount = products?.filter(p => p.status === 'pending').length || 0

    // TODO: Fetch real analytics from database
    const stats = {
        approved: approvedCount,
        pending: pendingCount,
        totalViews: 1243,
        totalContacts: 48
    }

    return (
        <ProductsClient
            initialProducts={products as ProductWithImages[] || []}
            initialStats={stats}
        />
    )
}