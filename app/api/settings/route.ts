import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
})

const updateSenderSchema = z.object({
  fromName: z.string().optional(),
  fromEmail: z.string().email('Invalid email address').optional(),
  replyTo: z.string().email('Invalid email address').optional(),
  signature: z.string().optional(),
})

const updateSmtpSchema = z.object({
  host: z.string().optional(),
  port: z.string().optional(),
  encryption: z.enum(['none', 'ssl', 'tls']).optional(),
  username: z.string().optional(),
  password: z.string().optional(),
})

const updateNotificationsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  campaignAlerts: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
})

const updateComplianceSchema = z.object({
  companyAddress: z.string().optional(),
  unsubscribeText: z.string().optional(),
  privacyPolicy: z.string().optional(),
})

const updateAppearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
})

// GET /api/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    let settings = await db.userSettings.findUnique({
      where: { userId: user.id },
    })

    // If no settings exist, create default settings
    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          userId: user.id,
          profile: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            company: '',
          },
          sender: {
            fromName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            fromEmail: user.email,
            replyTo: user.email,
            signature: 'Best regards,\n' + (user.firstName || '') + ' ' + (user.lastName || ''),
          },
          smtp: {
            host: '',
            port: '587',
            encryption: 'tls',
            username: '',
            password: '',
          },
          notifications: {
            emailNotifications: true,
            campaignAlerts: true,
            weeklyReports: false,
          },
          compliance: {
            companyAddress: '',
            unsubscribeText: 'You can unsubscribe from these emails at any time.',
            privacyPolicy: '',
          },
          appearance: {
            theme: 'light',
            language: 'en',
            timezone: 'utc',
          },
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
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
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      )
    }

    // Validate data based on section
    let validatedData
    switch (section) {
      case 'profile':
        validatedData = updateProfileSchema.parse(data)
        break
      case 'sender':
        validatedData = updateSenderSchema.parse(data)
        break
      case 'smtp':
        validatedData = updateSmtpSchema.parse(data)
        break
      case 'notifications':
        validatedData = updateNotificationsSchema.parse(data)
        break
      case 'compliance':
        validatedData = updateComplianceSchema.parse(data)
        break
      case 'appearance':
        validatedData = updateAppearanceSchema.parse(data)
        break
      default:
        return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    // Check if settings exist, create if not
    let settings = await db.userSettings.findUnique({
      where: { userId: user.id },
    })

    if (!settings) {
      // Create default settings first
      settings = await db.userSettings.create({
        data: {
          userId: user.id,
          profile: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            company: '',
          },
          sender: {
            fromName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            fromEmail: user.email,
            replyTo: user.email,
            signature: 'Best regards,\n' + (user.firstName || '') + ' ' + (user.lastName || ''),
          },
          smtp: {
            host: '',
            port: '587',
            encryption: 'tls',
            username: '',
            password: '',
          },
          notifications: {
            emailNotifications: true,
            campaignAlerts: true,
            weeklyReports: false,
          },
          compliance: {
            companyAddress: '',
            unsubscribeText: 'You can unsubscribe from these emails at any time.',
            privacyPolicy: '',
          },
          appearance: {
            theme: 'light',
            language: 'en',
            timezone: 'utc',
          },
        },
      })
    }

    // Update the specific section
    const updatedSettings = await db.userSettings.update({
      where: { userId: user.id },
      data: {
        [section]: {
          ...settings[section as keyof typeof settings],
          ...validatedData,
        },
      },
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}