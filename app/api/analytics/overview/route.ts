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

    // Get user's campaigns and contacts
    const [campaigns, contacts, campaignAnalytics] = await Promise.all([
      db.campaign.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          recipients: true,
          openRate: true,
          clickRate: true,
          unsubscribes: true,
          status: true,
          name: true,
          sent: true,
        },
      }),
      db.contact.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          status: true,
          campaigns: true,
          sequences: true,
        },
      }),
      db.campaignAnalytics.findMany({
        where: {
          campaign: {
            userId: user.id,
          },
        },
        select: {
          opens: true,
          clicks: true,
          bounces: true,
          unsubscribes: true,
          date: true,
        },
      }),
    ])

    // Calculate overview stats
    const totalContacts = contacts.length
    const subscribedContacts = contacts.filter(c => c.status === 'subscribed').length
    const totalCampaigns = campaigns.length
    const sentCampaigns = campaigns.filter(c => c.status === 'sent')

    const totalOpens = sentCampaigns.reduce((sum, c) => sum + Math.floor(c.openRate * c.recipients / 100), 0)
    const totalClicks = sentCampaigns.reduce((sum, c) => sum + Math.floor(c.clickRate * c.recipients / 100), 0)
    const totalUnsubscribes = campaigns.reduce((sum, c) => sum + c.unsubscribes, 0)
    
    const avgOpenRate = sentCampaigns.length > 0 
      ? sentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / sentCampaigns.length 
      : 0
    const avgClickRate = sentCampaigns.length > 0 
      ? sentCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / sentCampaigns.length 
      : 0

    // Calculate monthly performance data for the last 6 months
    const monthlyData = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthCampaigns = campaigns.filter(c => 
        c.sent && c.sent >= monthDate && c.sent < nextMonthDate
      )
      
      const monthOpens = monthCampaigns.reduce((sum, c) => sum + Math.floor(c.openRate * c.recipients / 100), 0)
      const monthClicks = monthCampaigns.reduce((sum, c) => sum + Math.floor(c.clickRate * c.recipients / 100), 0)
      const monthUnsubscribes = monthCampaigns.reduce((sum, c) => sum + c.unsubscribes, 0)
      
      monthlyData.push({
        name: monthDate.toLocaleString('default', { month: 'short' }),
        opens: monthOpens,
        clicks: monthClicks,
        unsubscribes: monthUnsubscribes,
      })
    }

    // Get campaign performance data
    const campaignPerformance = sentCampaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      openRate: campaign.openRate,
      clickRate: campaign.clickRate,
      sent: campaign.recipients,
    }))

    return NextResponse.json({
      overview: {
        totalContacts,
        subscribedContacts,
        totalCampaigns,
        sentCampaigns: sentCampaigns.length,
        totalOpens,
        totalClicks,
        totalUnsubscribes,
        avgOpenRate: Math.round(avgOpenRate * 100) / 100,
        avgClickRate: Math.round(avgClickRate * 100) / 100,
      },
      monthlyPerformance: monthlyData,
      campaignPerformance,
    })
  } catch (error) {
    console.error('Get analytics overview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}