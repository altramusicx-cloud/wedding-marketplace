// File: lib/actions/favorites.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function toggleFavorite(productId: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect("/login?redirect=" + encodeURIComponent("/vendor/" + productId))
    }

    // Check if already favorited
    const { data: existingFavorite } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

    if (existingFavorite) {
        // Remove from favorites
        const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId)

        if (error) {
            console.error("Error removing favorite:", error)
            throw new Error("Failed to remove from favorites")
        }
    } else {
        // Add to favorites
        const { error } = await supabase
            .from("favorites")
            .insert({
                user_id: user.id,
                product_id: productId,
            })

        if (error) {
            console.error("Error adding favorite:", error)
            throw new Error("Failed to add to favorites")
        }
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/vendor/[id]", "page")
    revalidatePath("/", "layout")

    return { success: true, favorited: !existingFavorite }
}

export async function getUserFavorites() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: favorites, error } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id)

    if (error) {
        console.error("Error fetching favorites:", error)
        return []
    }

    return favorites.map(fav => fav.product_id)
}

export async function checkIsFavorited(productId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

    return !!data
}