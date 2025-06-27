import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  // Development bypass credentials
  if (email === 'demo@conversate.dev' && password === 'dev-user-123') {
    // Create a mock session
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: 'dev-user-123',
        email: 'demo@conversate.dev',
        profile: {
          display_name: 'Demo User'
        }
      }
    })
    
    // Set a development session cookie
    response.cookies.set('dev-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response
  }
  
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
}
