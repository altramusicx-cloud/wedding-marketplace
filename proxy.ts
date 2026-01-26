import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

    // PROTECTED ROUTES
    const protectedRoutes = ['/dashboard', '/admin', '/dashboard/vendor']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Redirect guest dari protected routes
    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ROLE-BASED PROTECTION (jika user login)
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, is_vendor')
            .eq('id', user.id)
            .single()

        if (!profile) return response

        // Admin tidak boleh akses user/vendor dashboard
        if (profile.is_admin === true) {
            if (pathname === '/dashboard' || pathname.startsWith('/dashboard/vendor')) {
                // FIX: Redirect ke /admin (bukan /admin/)
                return NextResponse.redirect(new URL('/admin', request.url))
            }
        }

        // Non-admin tidak boleh akses admin panel
        if (!profile.is_admin && pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Jika sudah login dan akses /login, redirect berdasarkan role
        if (pathname === '/login' || pathname === '/register') {
            if (profile.is_admin) {
                return NextResponse.redirect(new URL('/admin', request.url))
            } else {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4)$).*)',
    ],
}
