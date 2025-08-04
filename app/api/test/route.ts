import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`
    
    // Test user count
    const userCount = await db.user.count()
    
    // Test contact count
    const contactCount = await db.contact.count()
    
    // Test campaign count
    const campaignCount = await db.campaign.count()
    
    // Test sequence count
    const sequenceCount = await db.sequence.count()

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        userCount,
        contactCount,
        campaignCount,
        sequenceCount,
      },
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}