"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Copy, Trash2, Send, Calendar } from "lucide-react"
import { CampaignModal } from "@/components/campaign-modal"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Campaign {
  id: string
  name: string
  description: string
  status: 'draft' | 'sent' | 'scheduled'
  createdAt: string
  updatedAt: string
  contacts?: any[]
  sequences?: any[]
  analytics?: any[]
}

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch campaigns",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive"
      })
    }
  }

  const refreshData = () => {
    fetchCampaigns()
    setSelectedCampaigns([])
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(filteredCampaigns.map((c) => c.id))
    } else {
      setSelectedCampaigns([])
    }
  }

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns([...selectedCampaigns, campaignId])
    } else {
      setSelectedCampaigns(selectedCampaigns.filter((id) => id !== campaignId))
    }
  }

  const handleDuplicate = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/duplicate`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const duplicated = await response.json()
        toast({
          title: "Campaign duplicated",
          description: `"${duplicated.name}" has been created.`,
        })
        refreshData()
      } else {
        toast({
          title: "Error",
          description: "Failed to duplicate campaign",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate campaign",
        variant: "destructive"
      })
    }
  }

  const handleSend = async (campaignId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const sent = await response.json()
        toast({
          title: "Campaign sent!",
          description: `"${sent.name}" has been sent.`,
        })
        refreshData()
      } else {
        toast({
          title: "Error",
          description: "Failed to send campaign",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchedule = async (campaignId: string) => {
    try {
      const scheduleDate = new Date()
      scheduleDate.setDate(scheduleDate.getDate() + 1)

      const response = await fetch(`/api/campaigns/${campaignId}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledAt: scheduleDate.toISOString(),
        }),
      })
      
      if (response.ok) {
        const scheduled = await response.json()
        toast({
          title: "Campaign scheduled",
          description: `"${scheduled.name}" will be sent tomorrow.`,
        })
        refreshData()
      } else {
        toast({
          title: "Error",
          description: "Failed to schedule campaign",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule campaign",
        variant: "destructive"
      })
    }
  }

  const handleBulkDelete = async () => {
    setIsLoading(true)
    try {
      // Delete each selected campaign
      const deletePromises = selectedCampaigns.map(campaignId =>
        fetch(`/api/campaigns/${campaignId}`, {
          method: 'DELETE',
        })
      )

      const responses = await Promise.all(deletePromises)
      const allSuccessful = responses.every(response => response.ok)

      if (allSuccessful) {
        toast({
          title: "Campaigns deleted",
          description: `${selectedCampaigns.length} campaign(s) have been deleted.`,
        })
        refreshData()
        setShowDeleteDialog(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to delete some campaigns",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaigns",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Sent</Badge>
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
              <p className="text-gray-600 mt-2">Create and manage your email campaigns</p>
            </div>
            <Button onClick={() => setShowCampaignModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Campaigns</CardTitle>
                <CardDescription>Manage your email campaigns</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("sent")}>Sent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>Scheduled</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCampaigns.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectedCampaigns.forEach((id) => handleDuplicate(id))
                      setSelectedCampaigns([])
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm">
                    Archive
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Updated Date</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{campaign.contacts?.length || 0}</TableCell>
                    <TableCell>{campaign.updatedAt}</TableCell>
                    <TableCell>
                      {campaign.analytics && campaign.analytics.length > 0 
                        ? `${((campaign.analytics[0].emailsOpened / campaign.analytics[0].emailsSent) * 100).toFixed(1)}%` 
                        : "—"
                      }
                    </TableCell>
                    <TableCell>
                      {campaign.analytics && campaign.analytics.length > 0 
                        ? `${((campaign.analytics[0].emailsClicked / campaign.analytics[0].emailsSent) * 100).toFixed(1)}%` 
                        : "—"
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(campaign.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {campaign.status === "draft" && (
                            <DropdownMenuItem onClick={() => handleSend(campaign.id)} disabled={isLoading}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Now
                            </DropdownMenuItem>
                          )}
                          {campaign.status === "draft" && (
                            <DropdownMenuItem onClick={() => handleSchedule(campaign.id)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedCampaigns([campaign.id])
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== "all" ? "No campaigns match your filters" : "No campaigns yet"}
                </div>
                {!searchTerm && statusFilter === "all" && (
                  <Button className="mt-4" onClick={() => setShowCampaignModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CampaignModal open={showCampaignModal} onClose={() => setShowCampaignModal(false)} onSuccess={refreshData} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaigns</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCampaigns.length} campaign(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
