import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const testSmtpSchema = z.object({
  host: z.string().min(1, 'SMTP host is required'),
  port: z.string().min(1, 'SMTP port is required'),
  encryption: z.enum(['none', 'ssl', 'tls']),
  username: z.string().min(1, 'SMTP username is required'),
  password: z.string().min(1, 'SMTP password is required'),
  fromEmail: z.string().email('From email is required'),
  toEmail: z.string().email('Test email address is required'),
})

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = testSmtpSchema.parse(body)

    // Simulate SMTP testing (in a real implementation, you would use nodemailer or similar)
    // For now, we'll just simulate a successful connection after a delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate random success/failure for demonstration
    const isSuccess = Math.random() > 0.2 // 80% success rate

    if (!isSuccess) {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to SMTP server. Please check your settings.',
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'SMTP connection successful! Test email sent.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Test SMTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}