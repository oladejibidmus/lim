// Mock data and business logic
export interface Contact {
  id: number
  name: string
  email: string
  status: "subscribed" | "unsubscribed" | "bounced"
  tags: string[]
  joinDate: string
  lastActivity: string
  campaigns: number
  sequences: number
}

export interface Campaign {
  id: number
  name: string
  subject: string
  status: "draft" | "scheduled" | "sent"
  recipients: number
  sent: string | null
  openRate: number
  clickRate: number
  unsubscribes: number
  content?: string
  scheduledDate?: string
}

export interface Sequence {
  id: number
  name: string
  status: "active" | "paused" | "draft"
  steps: number
  subscribers: number
  completed: number
  avgOpenRate: number
  created: string
  description?: string
}

// Mock data stores
let contactsData: Contact[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    status: "subscribed",
    tags: ["customer", "vip"],
    joinDate: "2024-01-10",
    lastActivity: "2024-01-18",
    campaigns: 5,
    sequences: 2,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    status: "subscribed",
    tags: ["lead", "newsletter"],
    joinDate: "2024-01-12",
    lastActivity: "2024-01-19",
    campaigns: 3,
    sequences: 1,
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@example.com",
    status: "unsubscribed",
    tags: ["customer"],
    joinDate: "2024-01-05",
    lastActivity: "2024-01-15",
    campaigns: 8,
    sequences: 0,
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily.chen@example.com",
    status: "subscribed",
    tags: ["lead", "trial"],
    joinDate: "2024-01-14",
    lastActivity: "2024-01-20",
    campaigns: 2,
    sequences: 1,
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.w@example.com",
    status: "bounced",
    tags: ["customer"],
    joinDate: "2024-01-08",
    lastActivity: "2024-01-16",
    campaigns: 4,
    sequences: 0,
  },
]

let campaignsData: Campaign[] = [
  {
    id: 1,
    name: "Welcome Series #1",
    status: "sent",
    subject: "Welcome to our community!",
    recipients: 245,
    sent: "2024-01-15",
    openRate: 24.5,
    clickRate: 3.2,
    unsubscribes: 2,
    content: "Welcome to our amazing platform! We're excited to have you on board.",
  },
  {
    id: 2,
    name: "Monthly Newsletter",
    status: "scheduled",
    subject: "January Updates & News",
    recipients: 1250,
    sent: "2024-01-20",
    openRate: 0,
    clickRate: 0,
    unsubscribes: 0,
    scheduledDate: "2024-01-25T10:00:00",
    content: "Here are the latest updates from our team...",
  },
  {
    id: 3,
    name: "Product Launch",
    status: "draft",
    subject: "Introducing our new feature",
    recipients: 0,
    sent: null,
    openRate: 0,
    clickRate: 0,
    unsubscribes: 0,
    content: "We're thrilled to announce our latest feature...",
  },
  {
    id: 4,
    name: "Holiday Sale",
    status: "sent",
    subject: "50% off everything!",
    recipients: 892,
    sent: "2024-01-10",
    openRate: 31.2,
    clickRate: 8.7,
    unsubscribes: 5,
    content: "Don't miss our biggest sale of the year!",
  },
]

let sequencesData: Sequence[] = [
  {
    id: 1,
    name: "Welcome Onboarding",
    status: "active",
    steps: 5,
    subscribers: 342,
    completed: 89,
    avgOpenRate: 28.5,
    created: "2024-01-10",
    description: "5-step welcome sequence for new subscribers",
  },
  {
    id: 2,
    name: "Product Education Series",
    status: "paused",
    steps: 7,
    subscribers: 156,
    completed: 23,
    avgOpenRate: 22.1,
    created: "2024-01-08",
    description: "Educational content about product features",
  },
  {
    id: 3,
    name: "Re-engagement Campaign",
    status: "draft",
    steps: 3,
    subscribers: 0,
    completed: 0,
    avgOpenRate: 0,
    created: "2024-01-15",
    description: "Win back inactive subscribers",
  },
  {
    id: 4,
    name: "Customer Success Journey",
    status: "active",
    steps: 6,
    subscribers: 78,
    completed: 12,
    avgOpenRate: 35.2,
    created: "2024-01-05",
    description: "Guide customers to success with our platform",
  },
]

// Business logic functions
export const contactsAPI = {
  getAll: () => contactsData,

  getById: (id: number) => contactsData.find((c) => c.id === id),

  create: (contact: Omit<Contact, "id">) => {
    const newContact = { ...contact, id: Date.now() }
    contactsData.push(newContact)
    return newContact
  },

  update: (id: number, updates: Partial<Contact>) => {
    const index = contactsData.findIndex((c) => c.id === id)
    if (index !== -1) {
      contactsData[index] = { ...contactsData[index], ...updates }
      return contactsData[index]
    }
    return null
  },

  delete: (ids: number[]) => {
    contactsData = contactsData.filter((c) => !ids.includes(c.id))
    return true
  },

  addTags: (ids: number[], tags: string[]) => {
    ids.forEach((id) => {
      const contact = contactsData.find((c) => c.id === id)
      if (contact) {
        contact.tags = [...new Set([...contact.tags, ...tags])]
      }
    })
    return true
  },

  importCSV: (csvData: string) => {
    // Simple CSV parsing simulation
    const lines = csvData.split("\n")
    const headers = lines[0].split(",")
    const imported = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      if (values.length >= 2) {
        const contact = {
          id: Date.now() + i,
          name: values[0]?.trim() || "",
          email: values[1]?.trim() || "",
          status: "subscribed" as const,
          tags: values[2] ? values[2].split(";").map((t) => t.trim()) : [],
          joinDate: new Date().toISOString().split("T")[0],
          lastActivity: new Date().toISOString().split("T")[0],
          campaigns: 0,
          sequences: 0,
        }
        contactsData.push(contact)
        imported.push(contact)
      }
    }
    return imported
  },
}

export const campaignsAPI = {
  getAll: () => campaignsData,

  getById: (id: number) => campaignsData.find((c) => c.id === id),

  create: (campaign: Omit<Campaign, "id">) => {
    const newCampaign = {
      ...campaign,
      id: Date.now(),
      openRate: 0,
      clickRate: 0,
      unsubscribes: 0,
    }
    campaignsData.push(newCampaign)
    return newCampaign
  },

  update: (id: number, updates: Partial<Campaign>) => {
    const index = campaignsData.findIndex((c) => c.id === id)
    if (index !== -1) {
      campaignsData[index] = { ...campaignsData[index], ...updates }
      return campaignsData[index]
    }
    return null
  },

  delete: (ids: number[]) => {
    campaignsData = campaignsData.filter((c) => !ids.includes(c.id))
    return true
  },

  duplicate: (id: number) => {
    const original = campaignsData.find((c) => c.id === id)
    if (original) {
      const duplicate = {
        ...original,
        id: Date.now(),
        name: `${original.name} (Copy)`,
        status: "draft" as const,
        recipients: 0,
        sent: null,
        openRate: 0,
        clickRate: 0,
        unsubscribes: 0,
      }
      campaignsData.push(duplicate)
      return duplicate
    }
    return null
  },

  send: (id: number) => {
    const campaign = campaignsData.find((c) => c.id === id)
    if (campaign && campaign.status === "draft") {
      campaign.status = "sent"
      campaign.sent = new Date().toISOString().split("T")[0]
      campaign.recipients = contactsData.filter((c) => c.status === "subscribed").length
      // Simulate some performance metrics
      campaign.openRate = Math.random() * 30 + 15 // 15-45%
      campaign.clickRate = Math.random() * 8 + 1 // 1-9%
      campaign.unsubscribes = Math.floor(Math.random() * 5)
      return campaign
    }
    return null
  },

  schedule: (id: number, date: string) => {
    const campaign = campaignsData.find((c) => c.id === id)
    if (campaign) {
      campaign.status = "scheduled"
      campaign.scheduledDate = date
      return campaign
    }
    return null
  },
}

export const sequencesAPI = {
  getAll: () => sequencesData,

  getById: (id: number) => sequencesData.find((s) => s.id === id),

  create: (sequence: Omit<Sequence, "id">) => {
    const newSequence = {
      ...sequence,
      id: Date.now(),
      subscribers: 0,
      completed: 0,
      avgOpenRate: 0,
    }
    sequencesData.push(newSequence)
    return newSequence
  },

  update: (id: number, updates: Partial<Sequence>) => {
    const index = sequencesData.findIndex((s) => s.id === id)
    if (index !== -1) {
      sequencesData[index] = { ...sequencesData[index], ...updates }
      return sequencesData[index]
    }
    return null
  },

  delete: (ids: number[]) => {
    sequencesData = sequencesData.filter((s) => !ids.includes(s.id))
    return true
  },

  activate: (id: number) => {
    const sequence = sequencesData.find((s) => s.id === id)
    if (sequence) {
      sequence.status = "active"
      return sequence
    }
    return null
  },

  pause: (id: number) => {
    const sequence = sequencesData.find((s) => s.id === id)
    if (sequence) {
      sequence.status = "paused"
      return sequence
    }
    return null
  },

  duplicate: (id: number) => {
    const original = sequencesData.find((s) => s.id === id)
    if (original) {
      const duplicate = {
        ...original,
        id: Date.now(),
        name: `${original.name} (Copy)`,
        status: "draft" as const,
        subscribers: 0,
        completed: 0,
        avgOpenRate: 0,
      }
      sequencesData.push(duplicate)
      return duplicate
    }
    return null
  },
}

// Analytics data
export const analyticsAPI = {
  getOverviewStats: () => ({
    totalOpens: contactsData.reduce((sum, c) => sum + c.campaigns, 0) * 1000,
    totalClicks: contactsData.reduce((sum, c) => sum + c.campaigns, 0) * 100,
    avgOpenRate:
      campaignsData.filter((c) => c.status === "sent").reduce((sum, c) => sum + c.openRate, 0) /
        campaignsData.filter((c) => c.status === "sent").length || 0,
    totalUnsubscribes: campaignsData.reduce((sum, c) => sum + c.unsubscribes, 0),
  }),

  getPerformanceData: () => [
    { name: "Jan", opens: 2400, clicks: 240, unsubscribes: 12 },
    { name: "Feb", opens: 1398, clicks: 180, unsubscribes: 8 },
    { name: "Mar", opens: 9800, clicks: 890, unsubscribes: 15 },
    { name: "Apr", opens: 3908, clicks: 420, unsubscribes: 18 },
    { name: "May", opens: 4800, clicks: 520, unsubscribes: 22 },
    { name: "Jun", opens: 3800, clicks: 380, unsubscribes: 14 },
  ],

  getCampaignPerformance: () =>
    campaignsData
      .filter((c) => c.status === "sent")
      .map((c) => ({
        name: c.name,
        openRate: c.openRate,
        clickRate: c.clickRate,
        sent: c.recipients,
      })),
}

// Settings data
export interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    company: string
  }
  sender: {
    fromName: string
    fromEmail: string
    replyTo: string
    signature: string
  }
  smtp: {
    host: string
    port: string
    encryption: string
    username: string
    password: string
  }
  notifications: {
    emailNotifications: boolean
    campaignAlerts: boolean
    weeklyReports: boolean
  }
  compliance: {
    companyAddress: string
    unsubscribeText: string
    privacyPolicy: string
  }
  appearance: {
    theme: string
    language: string
    timezone: string
  }
}

const userSettings: UserSettings = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    company: "Acme Inc.",
  },
  sender: {
    fromName: "John Doe",
    fromEmail: "john@example.com",
    replyTo: "support@example.com",
    signature: "Best regards,\nJohn Doe\nAcme Inc.",
  },
  smtp: {
    host: "",
    port: "587",
    encryption: "tls",
    username: "",
    password: "",
  },
  notifications: {
    emailNotifications: true,
    campaignAlerts: true,
    weeklyReports: false,
  },
  compliance: {
    companyAddress: "123 Business St\nSuite 100\nCity, State 12345",
    unsubscribeText: "You can unsubscribe from these emails at any time.",
    privacyPolicy: "",
  },
  appearance: {
    theme: "light",
    language: "en",
    timezone: "utc",
  },
}

export const settingsAPI = {
  get: () => userSettings,

  update: (section: keyof UserSettings, data: any) => {
    userSettings[section] = { ...userSettings[section], ...data }
    return userSettings[section]
  },

  testSMTP: () => {
    // Simulate SMTP test
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "SMTP connection successful!" })
      }, 2000)
    })
  },
}
