import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

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

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const days = parseInt(searchParams.get('days') || '30')

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    // Check if campaign belongs to user
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: user.id,
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get campaign analytics for the specified period
    const analytics = await db.campaignAnalytics.findMany({
      where: {
        campaignId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Generate daily performance data
    const dailyPerformance = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayAnalytics = analytics.find(a => 
        a.date.toDateString() === currentDate.toDateString()
      )
      
      dailyPerformance.push({
        date: currentDate.toISOString().split('T')[0],
        opens: dayAnalytics?.opens || 0,
        clicks: dayAnalytics?.clicks || 0,
        bounces: dayAnalytics?.bounces || 0,
        unsubscribes: dayAnalytics?.unsubscribes || 0,
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate cumulative stats
    const totalOpens = analytics.reduce((sum, a) => sum + a.opens, 0)
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0)
    const totalBounces = analytics.reduce((sum, a) => sum + a.bounces, 0)
    const totalUnsubscribes = analytics.reduce((sum, a) => sum + a.unsubscribes, 0)

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        status: campaign.status,
        recipients: campaign.recipients,
        sent: campaign.sent,
      },
      stats: {
        totalOpens,
        totalClicks,
        totalBounces,
        totalUnsubscribes,
        openRate: campaign.recipients > 0 ? (totalOpens / campaign.recipients * 100).toFixed(2) : 0,
        clickRate: campaign.recipients > 0 ? (totalClicks / campaign.recipients * 100).toFixed(2) : 0,
        bounceRate: campaign.recipients > 0 ? (totalBounces / campaign.recipients * 100).toFixed(2) : 0,
        unsubscribeRate: campaign.recipients > 0 ? (totalUnsubscribes / campaign.recipients * 100).toFixed(2) : 0,
      },
      dailyPerformance,
    })
  } catch (error) {
    console.error('Get campaign analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}