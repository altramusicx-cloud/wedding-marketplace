// types/contact.ts - Contact related types
export interface ContactLog {
  id: string
  product_id: string
  vendor_id: string
  user_id?: string
  name: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'contacted' | 'rejected' | 'closed'
  created_at: string
  updated_at: string
  
  // Relations
  product?: Product
  vendor?: Vendor
}
