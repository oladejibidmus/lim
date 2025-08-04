import { db } from './db'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'

export interface UserPayload {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

// Simple password hashing using Node.js crypto (for demo purposes)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}

// Simple JWT-like token creation (for demo purposes)
export function generateToken(payload: UserPayload): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payloadStr = btoa(JSON.stringify(payload))
  const signature = btoa(JSON.stringify({ secret: JWT_SECRET, timestamp: Date.now() }))
  
  return `${header}.${payloadStr}.${signature}`
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payloadStr = parts[1]
    const payload = JSON.parse(atob(payloadStr))
    
    return payload as UserPayload
  } catch {
    return null
  }
}

export async function createUser(email: string, password: string, firstName?: string, lastName?: string, company?: string) {
  const hashedPassword = await hashPassword(password)
  
  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      company,
    },
  })

  // Create default user settings
  await db.userSettings.create({
    data: {
      userId: user.id,
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        company: company || '',
      },
      sender: {
        fromName: `${firstName || ''} ${lastName || ''}`.trim() || 'User',
        fromEmail: email,
        replyTo: email,
        signature: 'Best regards,\n' + (firstName || '') + ' ' + (lastName || '') + (company ? `\n${company}` : ''),
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

  return user
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: true,
      createdAt: true,
    },
  })
}