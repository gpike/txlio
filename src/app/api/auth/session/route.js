import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { accessToken, refreshToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 },
      )
    }

    const response = NextResponse.json({ ok: true })

    response.cookies.set('sb-access-token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    if (refreshToken) {
      response.cookies.set('sb-refresh-token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    return response
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Invalid request' },
      { status: 400 },
    )
  }
}
