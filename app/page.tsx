"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardPage } from "@/components/dashboard-page"
import { CampaignsPage } from "@/components/campaigns-page"
import { SequencesPage } from "@/components/sequences-page"
import { ContactsPage } from "@/components/contacts-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { SettingsPage } from "@/components/settings-page"
import { HelpPage } from "@/components/help-page"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="h-8 w-32 mb-4 mx-auto" />
            <Skeleton className="h-4 w-64 mb-2 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "campaigns":
        return <CampaignsPage />
      case "sequences":
        return <SequencesPage />
      case "contacts":
        return <ContactsPage />
      case "analytics":
        return <AnalyticsPage />
      case "settings":
        return <SettingsPage />
      case "help":
        return <HelpPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderPage()}</main>
      </div>
    </div>
  )
}
