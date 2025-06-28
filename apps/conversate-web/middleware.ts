import { withAuth } from "next-auth/middleware"

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/login') || 
            req.nextUrl.pathname.startsWith('/signup') || 
            req.nextUrl.pathname.startsWith('/auth') ||
            req.nextUrl.pathname === '/') {
          return true
        }
        
        // For protected routes, require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .*\\.(?:svg|png|jpg|jpeg|gif|webp)$ (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
