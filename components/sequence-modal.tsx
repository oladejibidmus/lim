"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sequencesAPI } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface SequenceModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SequenceModal({ open, onClose, onSuccess }: SequenceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    steps: 3,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newSequence = sequencesAPI.create({
        name: formData.name,
        description: formData.description,
        status: "draft",
        steps: formData.steps,
        subscribers: 0,
        completed: 0,
        avgOpenRate: 0,
        created: new Date().toISOString().split("T")[0],
      })

      toast({
        title: "Sequence created!",
        description: `"${newSequence.name}" has been saved as a draft.`,
      })

      setFormData({ name: "", description: "", steps: 3 })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sequence. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Sequence</DialogTitle>
          <DialogDescription>Create an automated email sequence to nurture your subscribers.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Sequence Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter sequence name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose of this sequence"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps">Number of Steps</Label>
            <Input
              id="steps"
              type="number"
              min="1"
              max="10"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: Number.parseInt(e.target.value) || 3 })}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Sequence"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
