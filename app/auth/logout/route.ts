// app/auth/logout/route.ts - Simple logout
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create redirect response to login
    const response = NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
    
    // Optional: Clear auth cookies if needed
    // response.cookies.delete('auth-token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
  }
}
