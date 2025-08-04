"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Mail, Users, Plus, Eye, MousePointer, Send, TrendingUp } from "lucide-react"
import { api } from "@/lib/api-client"
import { CampaignModal } from "@/components/campaign-modal"
import { SequenceModal } from "@/components/sequence-modal"
import { ContactImportModal } from "@/components/contact-import-modal"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
  totalContacts: number
  subscribedContacts: number
  totalCampaigns: number
  sentCampaigns: number
  totalOpens: number
  totalClicks: number
  totalUnsubscribes: number
  avgOpenRate: number
  avgClickRate: number
}

interface Campaign {
  id: string
  name: string
  subject: string
  status: string
  recipients: number
  openRate: number
  clickRate: number
}

interface Sequence {
  id: string
  name: string
  status: string
  subscribers: number
}

export function DashboardPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showSequenceModal, setShowSequenceModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load data in parallel
      const [contactsData, campaignsData, sequencesData, analyticsData] = await Promise.all([
        api.getContacts({ limit: 1000 }),
        api.getCampaigns({ limit: 1000 }),
        api.getSequences({ limit: 1000 }),
        api.getAnalyticsOverview()
      ])

      setContacts(contactsData.contacts || [])
      setCampaigns(campaignsData.campaigns || [])
      setSequences(sequencesData.sequences || [])
      setStats(analyticsData.overview)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadDashboardData()
  }

  const recentActivity = [
    ...campaigns
      .filter((c) => c.status === "sent")
      .slice(0, 2)
      .map((c) => ({
        id: c.id,
        type: "campaign" as const,
        name: c.name,
        action: "sent",
        time: "2 hours ago",
        recipients: c.recipients,
      })),
    ...sequences
      .filter((s) => s.status === "active")
      .slice(0, 2)
      .map((s) => ({
        id: s.id,
        type: "sequence" as const,
        name: s.name,
        action: "activated",
        time: "5 hours ago",
        recipients: s.subscribers,
      })),
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>
  }

  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.recipients, 0)

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your email campaigns.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.subscribedContacts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmailsSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgOpenRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgClickRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +0.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your email marketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg" onClick={() => setShowCampaignModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="lg"
                onClick={() => setShowSequenceModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Sequence
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="lg"
                onClick={() => setShowImportModal(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Import Contacts
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your campaigns and sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={`${activity.type}-${activity.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {activity.type === "campaign" && <Mail className="h-5 w-5 text-blue-500" />}
                          {activity.type === "sequence" && <BarChart3 className="h-5 w-5 text-green-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                          <p className="text-xs text-gray-500">
                            {activity.action} • {activity.recipients} recipients • {activity.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant={activity.action === "sent" ? "default" : "secondary"}>{activity.action}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Create your first campaign to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card className="mt-6 shadow-lg shadow-orange-200/50">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Overview of your recent campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge
                          variant={
                            campaign.status === "sent"
                              ? "default"
                              : campaign.status === "scheduled"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {campaign.status}
                        </Badge>
                        {campaign.recipients > 0 && (
                          <span className="text-sm text-gray-500">{campaign.recipients} recipients</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {campaign.status === "sent" && (
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{campaign.openRate.toFixed(1)}%</div>
                        <div className="text-gray-500">Open Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{campaign.clickRate.toFixed(1)}%</div>
                        <div className="text-gray-500">Click Rate</div>
                      </div>
                    </div>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CampaignModal open={showCampaignModal} onClose={() => setShowCampaignModal(false)} onSuccess={refreshData} />
      <SequenceModal open={showSequenceModal} onClose={() => setShowSequenceModal(false)} onSuccess={refreshData} />
      <ContactImportModal open={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={refreshData} />
    </>
  )
}
