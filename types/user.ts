// types/user.ts
import { Product } from "./product"

// types/user.ts
// import { WithId } from '.'  // TEMPORARY COMMENT

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone_number?: string
  role: 'user' | 'vendor' | 'admin'
  vendor_id?: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  user_id: string
  business_name: string
  business_description?: string
  business_logo?: string
  business_phone?: string
  business_email?: string
  business_address?: string
  is_verified: boolean
  rating?: number
  total_reviews?: number
  created_at: string
  updated_at: string
  
  // Relations
  user?: UserProfile
  products?: Product[]
}

export type SessionUser = Pick<
  UserProfile, 
  'id' | 'email' | 'full_name' | 'avatar_url' | 'role' | 'vendor_id'
>


