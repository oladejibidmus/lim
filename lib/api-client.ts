// API client for making authenticated requests to the backend

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    // For client-side requests, we'll rely on cookies for authentication
    // The browser will automatically include the auth-token cookie
    return {
      'Content-Type': 'application/json',
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }
    return response.json()
  }

  // Authentication
  async signup(data: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    company?: string
  }) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async signin(data: { email: string; password: string }) {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async signout() {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getCurrentUser() {
    const response = await fetch('/api/auth/me', {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Contacts
  async getContacts(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`/api/contacts?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getContact(id: string) {
    const response = await fetch(`/api/contacts/${id}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createContact(data: {
    name: string
    email: string
    status?: string
    tags?: string[]
  }) {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async updateContact(id: string, data: {
    name?: string
    email?: string
    status?: string
    tags?: string[]
  }) {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async deleteContact(id: string) {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async bulkDeleteContacts(contactIds: string[]) {
    const response = await fetch('/api/contacts/bulk', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        action: 'delete',
        contactIds,
      }),
    })
    return this.handleResponse(response)
  }

  async bulkAddTags(contactIds: string[], tags: string[]) {
    const response = await fetch('/api/contacts/bulk', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        action: 'addTags',
        contactIds,
        tags,
      }),
    })
    return this.handleResponse(response)
  }

  async importContacts(contacts: Array<{
    name: string
    email: string
    tags?: string[]
  }>) {
    const response = await fetch('/api/contacts/bulk', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        action: 'import',
        contacts,
      }),
    })
    return this.handleResponse(response)
  }

  // Campaigns
  async getCampaigns(params?: {
    page?: number
    limit?: number
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`/api/campaigns?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getCampaign(id: string) {
    const response = await fetch(`/api/campaigns/${id}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createCampaign(data: {
    name: string
    subject: string
    content: string
    status?: string
    scheduledDate?: string
  }) {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async updateCampaign(id: string, data: {
    name?: string
    subject?: string
    content?: string
    status?: string
    scheduledDate?: string
  }) {
    const response = await fetch(`/api/campaigns/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async deleteCampaign(id: string) {
    const response = await fetch(`/api/campaigns/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async sendCampaign(id: string) {
    const response = await fetch(`/api/campaigns/${id}/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async scheduleCampaign(id: string, scheduledDate: string) {
    const response = await fetch(`/api/campaigns/${id}/schedule`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ scheduledDate }),
    })
    return this.handleResponse(response)
  }

  async duplicateCampaign(id: string) {
    const response = await fetch(`/api/campaigns/${id}/duplicate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Sequences
  async getSequences(params?: {
    page?: number
    limit?: number
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`/api/sequences?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getSequence(id: string) {
    const response = await fetch(`/api/sequences/${id}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createSequence(data: {
    name: string
    description?: string
    steps?: number
    status?: string
  }) {
    const response = await fetch('/api/sequences', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async updateSequence(id: string, data: {
    name?: string
    description?: string
    steps?: number
    status?: string
  }) {
    const response = await fetch(`/api/sequences/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async deleteSequence(id: string) {
    const response = await fetch(`/api/sequences/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async activateSequence(id: string) {
    const response = await fetch(`/api/sequences/${id}/activate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async pauseSequence(id: string) {
    const response = await fetch(`/api/sequences/${id}/pause`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async duplicateSequence(id: string) {
    const response = await fetch(`/api/sequences/${id}/duplicate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Analytics
  async getAnalyticsOverview() {
    const response = await fetch('/api/analytics/overview', {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getCampaignAnalytics(campaignId: string, days?: number) {
    const searchParams = new URLSearchParams()
    searchParams.append('campaignId', campaignId)
    if (days) searchParams.append('days', days.toString())

    const response = await fetch(`/api/analytics/campaigns?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Settings
  async getSettings() {
    const response = await fetch('/api/settings', {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateSettings(section: string, data: any) {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ section, data }),
    })
    return this.handleResponse(response)
  }

  async testSmtp(data: {
    host: string
    port: string
    encryption: string
    username: string
    password: string
    fromEmail: string
    toEmail: string
  }) {
    const response = await fetch('/api/settings/test-smtp', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }
}

export const api = new ApiClient()