// lib/actions/logout.ts - Simple logout action
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    
    // Clear cache and redirect
    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('Logout failed:', error)
    redirect('/error?message=Logout failed')
  }
}
