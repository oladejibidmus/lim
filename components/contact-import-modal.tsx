"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactsAPI } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Users } from "lucide-react"

interface ContactImportModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ContactImportModal({ open, onClose, onSuccess }: ContactImportModalProps) {
  const [importMethod, setImportMethod] = useState<"csv" | "manual">("csv")
  const [csvData, setCsvData] = useState("")
  const [manualData, setManualData] = useState({
    name: "",
    email: "",
    tags: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCsvData(event.target?.result as string)
      }
      reader.readAsText(file)
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a CSV file.",
        variant: "destructive",
      })
    }
  }

  const handleCSVImport = async () => {
    setIsLoading(true)
    try {
      const imported = contactsAPI.importCSV(csvData)
      toast({
        title: "Import successful!",
        description: `Imported ${imported.length} contacts.`,
      })
      setCsvData("")
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Please check your CSV format and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualAdd = async () => {
    setIsLoading(true)
    try {
      const newContact = contactsAPI.create({
        name: manualData.name,
        email: manualData.email,
        status: "subscribed",
        tags: manualData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        joinDate: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0],
        campaigns: 0,
        sequences: 0,
      })

      toast({
        title: "Contact added!",
        description: `${newContact.name} has been added to your contacts.`,
      })

      setManualData({ name: "", email: "", tags: "" })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
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
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Add new contacts to your email list by uploading a CSV file or entering them manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Method Selection */}
          <div className="flex space-x-4">
            <Button
              variant={importMethod === "csv" ? "default" : "outline"}
              onClick={() => setImportMethod("csv")}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              CSV Upload
            </Button>
            <Button
              variant={importMethod === "manual" ? "default" : "outline"}
              onClick={() => setImportMethod("manual")}
              className="flex-1"
            >
              <Users className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
          </div>

          {importMethod === "csv" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>CSV File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Choose CSV File
                    </Button>
                    <p className="text-sm text-gray-500">Format: Name, Email, Tags (semicolon separated)</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </div>
              </div>

              {csvData && (
                <div className="space-y-2">
                  <Label>CSV Preview</Label>
                  <Textarea
                    value={csvData.split("\n").slice(0, 5).join("\n")}
                    readOnly
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500">
                    Showing first 5 rows. Total rows: {csvData.split("\n").length - 1}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleCSVImport} disabled={!csvData || isLoading}>
                  {isLoading ? "Importing..." : "Import Contacts"}
                </Button>
              </div>
            </div>
          )}

          {importMethod === "manual" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={manualData.name}
                  onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                  placeholder="Enter contact name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={manualData.email}
                  onChange={(e) => setManualData({ ...manualData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  value={manualData.tags}
                  onChange={(e) => setManualData({ ...manualData, tags: e.target.value })}
                  placeholder="customer, vip, newsletter (comma separated)"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleManualAdd} disabled={!manualData.name || !manualData.email || isLoading}>
                  {isLoading ? "Adding..." : "Add Contact"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
