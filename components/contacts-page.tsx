"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  Tag,
  Users,
  UserPlus,
  UserMinus,
  Mail,
} from "lucide-react"
import { contactsAPI, type Contact } from "@/lib/data"
import { ContactImportModal } from "@/components/contact-import-modal"
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

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", email: "", tags: "" })
  const [newTags, setNewTags] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setContacts(contactsAPI.getAll())
  }, [])

  const refreshData = () => {
    setContacts(contactsAPI.getAll())
    setSelectedContacts([])
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map((c) => c.id))
    } else {
      setSelectedContacts([])
    }
  }

  const handleSelectContact = (contactId: number, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId])
    } else {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId))
    }
  }

  const handleAddContact = () => {
    const contact = contactsAPI.create({
      name: newContact.name,
      email: newContact.email,
      status: "subscribed",
      tags: newContact.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      joinDate: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      campaigns: 0,
      sequences: 0,
    })

    toast({
      title: "Contact added",
      description: `${contact.name} has been added to your contacts.`,
    })

    setNewContact({ name: "", email: "", tags: "" })
    setShowAddModal(false)
    refreshData()
  }

  const handleAddTags = () => {
    const tags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)
    contactsAPI.addTags(selectedContacts, tags)

    toast({
      title: "Tags added",
      description: `Added tags to ${selectedContacts.length} contact(s).`,
    })

    setNewTags("")
    setShowTagModal(false)
    refreshData()
  }

  const handleBulkDelete = () => {
    contactsAPI.delete(selectedContacts)
    toast({
      title: "Contacts deleted",
      description: `${selectedContacts.length} contact(s) have been deleted.`,
    })
    refreshData()
    setShowDeleteDialog(false)
  }

  const handleExport = () => {
    const csvContent = [
      "Name,Email,Status,Tags,Join Date,Last Activity",
      ...filteredContacts.map(
        (c) => `"${c.name}","${c.email}","${c.status}","${c.tags.join(";")}","${c.joinDate}","${c.lastActivity}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contacts.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: `Exported ${filteredContacts.length} contacts to CSV.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "subscribed":
        return <Badge variant="default">Subscribed</Badge>
      case "unsubscribed":
        return <Badge variant="secondary">Unsubscribed</Badge>
      case "bounced":
        return <Badge variant="destructive">Bounced</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const subscribedCount = contacts.filter((c) => c.status === "subscribed").length
  const unsubscribedCount = contacts.filter((c) => c.status === "unsubscribed").length
  const bouncedCount = contacts.filter((c) => c.status === "bounced").length

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
              <p className="text-gray-600 mt-2">Manage your email contacts and segments</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowImportModal(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All contacts</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribed</CardTitle>
              <UserPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribedCount}</div>
              <p className="text-xs text-muted-foreground">Active subscribers</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
              <UserMinus className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unsubscribedCount}</div>
              <p className="text-xs text-muted-foreground">Opted out</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounced</CardTitle>
              <Mail className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bouncedCount}</div>
              <p className="text-xs text-muted-foreground">Invalid emails</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Contacts</CardTitle>
                <CardDescription>Manage your contact database</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search contacts..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter("subscribed")}>Subscribed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("unsubscribed")}>Unsubscribed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("bounced")}>Bounced</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedContacts.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedContacts.length} contact{selectedContacts.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowTagModal(true)}>
                    <Tag className="mr-2 h-4 w-4" />
                    Add Tags
                  </Button>
                  <Button variant="outline" size="sm">
                    Add to Sequence
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
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{contact.joinDate}</TableCell>
                    <TableCell>{contact.lastActivity}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{contact.campaigns} campaigns</div>
                        <div className="text-gray-500">{contact.sequences} sequences</div>
                      </div>
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="mr-2 h-4 w-4" />
                            Manage Tags
                          </DropdownMenuItem>
                          <DropdownMenuItem>Add to Sequence</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedContacts([contact.id])
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

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== "all" ? "No contacts match your filters" : "No contacts yet"}
                </div>
                {!searchTerm && statusFilter === "all" && (
                  <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Contact
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ContactImportModal open={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={refreshData} />

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>Add a new contact to your email list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                value={newContact.tags}
                onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                placeholder="customer, vip, newsletter (comma separated)"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact} disabled={!newContact.name || !newContact.email}>
                Add Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>Add tags to {selectedContacts.length} selected contact(s).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newTags">Tags</Label>
              <Input
                id="newTags"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="customer, vip, newsletter (comma separated)"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTagModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTags} disabled={!newTags}>
                Add Tags
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contacts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedContacts.length} contact(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
