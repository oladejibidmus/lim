"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { campaignsAPI, contactsAPI } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface CampaignModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CampaignModal({ open, onClose, onSuccess }: CampaignModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    recipients: "all",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const subscribedContacts = contactsAPI.getAll().filter((c) => c.status === "subscribed")

      const newCampaign = campaignsAPI.create({
        name: formData.name,
        subject: formData.subject,
        content: formData.content,
        status: "draft",
        recipients: subscribedContacts.length,
        sent: null,
        openRate: 0,
        clickRate: 0,
        unsubscribes: 0,
      })

      toast({
        title: "Campaign created!",
        description: `"${newCampaign.name}" has been saved as a draft.`,
      })

      setFormData({ name: "", subject: "", content: "", recipients: "all" })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>Create a new email campaign to send to your subscribers.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Enter email subject line"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <Select
              value={formData.recipients}
              onValueChange={(value) => setFormData({ ...formData, recipients: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Subscribers ({contactsAPI.getAll().filter((c) => c.status === "subscribed").length})
                </SelectItem>
                <SelectItem value="vip">VIP Customers</SelectItem>
                <SelectItem value="leads">Leads Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your email content here..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
