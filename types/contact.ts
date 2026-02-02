// types/contact.ts
export interface ContactLog {
  id: string
  product_id: string
  vendor_id: string
  user_id?: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'pending' | 'contacted' | 'ignored'
  created_at: string
  updated_at: string
}

export interface ContactFormData {
  product_id: string
  name: string
  email: string
  message: string
  phone?: string
}

// Re-export other contact types if needed
