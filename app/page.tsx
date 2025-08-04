"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardPage } from "@/components/dashboard-page"
import { CampaignsPage } from "@/components/campaigns-page"
import { SequencesPage } from "@/components/sequences-page"
import { ContactsPage } from "@/components/contacts-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { SettingsPage } from "@/components/settings-page"
import { HelpPage } from "@/components/help-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")

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
