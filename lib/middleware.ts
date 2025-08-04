import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/campaigns', '/sequences', '/contacts', '/analytics', '/settings']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If accessing protected route without token, redirect to sign in
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If token exists, verify it
  if (token) {
    const user = verifyToken(token)
    
    // If token is invalid, clear it and redirect to sign in
    if (!user && isProtectedPath) {
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (user && (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}