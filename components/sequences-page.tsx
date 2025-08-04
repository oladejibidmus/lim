"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Workflow,
  Clock,
  Users,
} from "lucide-react"
// import { Sidebar } from "@/components/sidebar"
// import { Header } from "@/components/header"
import { sequencesAPI, type Sequence } from "@/lib/data"
import { SequenceModal } from "@/components/sequence-modal"
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

export function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [selectedSequences, setSelectedSequences] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showSequenceModal, setShowSequenceModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setSequences(sequencesAPI.getAll())
  }, [])

  const refreshData = () => {
    setSequences(sequencesAPI.getAll())
    setSelectedSequences([])
  }

  const filteredSequences = sequences.filter((sequence) => {
    const matchesSearch = sequence.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || sequence.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSequences(filteredSequences.map((s) => s.id))
    } else {
      setSelectedSequences([])
    }
  }

  const handleSelectSequence = (sequenceId: number, checked: boolean) => {
    if (checked) {
      setSelectedSequences([...selectedSequences, sequenceId])
    } else {
      setSelectedSequences(selectedSequences.filter((id) => id !== sequenceId))
    }
  }

  const handleActivate = (sequenceId: number) => {
    const activated = sequencesAPI.activate(sequenceId)
    if (activated) {
      toast({
        title: "Sequence activated",
        description: `"${activated.name}" is now active.`,
      })
      refreshData()
    }
  }

  const handlePause = (sequenceId: number) => {
    const paused = sequencesAPI.pause(sequenceId)
    if (paused) {
      toast({
        title: "Sequence paused",
        description: `"${paused.name}" has been paused.`,
      })
      refreshData()
    }
  }

  const handleDuplicate = (sequenceId: number) => {
    const duplicated = sequencesAPI.duplicate(sequenceId)
    if (duplicated) {
      toast({
        title: "Sequence duplicated",
        description: `"${duplicated.name}" has been created.`,
      })
      refreshData()
    }
  }

  const handleBulkDuplicate = () => {
    selectedSequences.forEach((id) => handleDuplicate(id))
    setSelectedSequences([])
  }

  const handleBulkPause = () => {
    selectedSequences.forEach((id) => {
      const sequence = sequences.find((s) => s.id === id)
      if (sequence?.status === "active") {
        handlePause(id)
      }
    })
    setSelectedSequences([])
  }

  const handleBulkDelete = () => {
    sequencesAPI.delete(selectedSequences)
    toast({
      title: "Sequences deleted",
      description: `${selectedSequences.length} sequence(s) have been deleted.`,
    })
    refreshData()
    setShowDeleteDialog(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const activeSequences = sequences.filter((s) => s.status === "active").length
  const totalSubscribers = sequences.reduce((sum, s) => sum + s.subscribers, 0)
  const avgCompletionRate =
    sequences.length > 0
      ? sequences.reduce((sum, s) => sum + (s.subscribers > 0 ? (s.completed / s.subscribers) * 100 : 0), 0) /
        sequences.length
      : 0

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Sequences</h1>
              <p className="text-gray-600 mt-2">Create automated email sequences for better engagement</p>
            </div>
            <Button onClick={() => setShowSequenceModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Sequence
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sequences</CardTitle>
              <Workflow className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSequences}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers}</div>
              <p className="text-xs text-muted-foreground">Across all sequences</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCompletionRate.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Sequences</CardTitle>
                <CardDescription>Manage your automated email sequences</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search sequences..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("paused")}>Paused</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedSequences.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedSequences.length} sequence{selectedSequences.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkPause}>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
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
                      checked={selectedSequences.length === filteredSequences.length && filteredSequences.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Avg. Open Rate</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSequences.map((sequence) => (
                  <TableRow key={sequence.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSequences.includes(sequence.id)}
                        onCheckedChange={(checked) => handleSelectSequence(sequence.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sequence.name}</div>
                      <div className="text-sm text-gray-500">Created {sequence.created}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(sequence.status)}</TableCell>
                    <TableCell>{sequence.steps} steps</TableCell>
                    <TableCell>{sequence.subscribers.toLocaleString()}</TableCell>
                    <TableCell>{sequence.completed.toLocaleString()}</TableCell>
                    <TableCell>{sequence.status === "active" ? `${sequence.avgOpenRate.toFixed(1)}%` : "—"}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleDuplicate(sequence.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {sequence.status === "paused" && (
                            <DropdownMenuItem onClick={() => handleActivate(sequence.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {sequence.status === "active" && (
                            <DropdownMenuItem onClick={() => handlePause(sequence.id)}>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedSequences([sequence.id])
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

            {filteredSequences.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== "all" ? "No sequences match your filters" : "No sequences yet"}
                </div>
                {!searchTerm && statusFilter === "all" && (
                  <Button className="mt-4" onClick={() => setShowSequenceModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Sequence
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SequenceModal open={showSequenceModal} onClose={() => setShowSequenceModal(false)} onSuccess={refreshData} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sequences</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedSequences.length} sequence(s)? This action cannot be undone.
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
