"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Mail, Bell, Shield, Palette, Server, User, CheckCircle, Loader2 } from "lucide-react"
import { settingsAPI, type UserSettings } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(settingsAPI.get())
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [smtpTesting, setSmtpTesting] = useState(false)
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const { toast } = useToast()

  const handleSave = async (section: keyof UserSettings, data: any) => {
    setIsLoading({ ...isLoading, [section]: true })

    // Simulate API delay
    setTimeout(() => {
      const updated = settingsAPI.update(section, data)
      setSettings({ ...settings, [section]: updated })

      toast({
        title: "Settings saved",
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated.`,
      })

      setIsLoading({ ...isLoading, [section]: false })
    }, 1000)
  }

  const handleSMTPTest = async () => {
    setSmtpTesting(true)
    setSmtpTestResult(null)

    try {
      const result = (await settingsAPI.testSMTP()) as { success: boolean; message: string }
      setSmtpTestResult(result)

      if (result.success) {
        toast({
          title: "SMTP Test Successful",
          description: result.message,
        })
      } else {
        toast({
          title: "SMTP Test Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      setSmtpTestResult({ success: false, message: "Connection failed" })
      toast({
        title: "SMTP Test Failed",
        description: "Unable to connect to SMTP server.",
        variant: "destructive",
      })
    } finally {
      setSmtpTesting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and email preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="sender">Sender</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.profile.firstName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, firstName: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.profile.lastName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, lastName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={settings.profile.company}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: { ...settings.profile, company: e.target.value },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("profile", settings.profile)} disabled={isLoading.profile}>
                {isLoading.profile ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sender" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Sender Profiles
              </CardTitle>
              <CardDescription>Configure your email sender information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={settings.sender.fromName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sender: { ...settings.sender, fromName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.sender.fromEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sender: { ...settings.sender, fromEmail: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={settings.sender.replyTo}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sender: { ...settings.sender, replyTo: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signature">Email Signature</Label>
                <Textarea
                  id="signature"
                  placeholder="Your email signature..."
                  value={settings.sender.signature}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sender: { ...settings.sender, signature: e.target.value },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("sender", settings.sender)} disabled={isLoading.sender}>
                {isLoading.sender ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Sender Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>Configure your SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.gmail.com"
                  value={settings.smtp.host}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, host: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={settings.smtp.port}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, port: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encryption">Encryption</Label>
                  <Select
                    value={settings.smtp.encryption}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, encryption: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Username</Label>
                <Input
                  id="smtpUsername"
                  placeholder="your-email@gmail.com"
                  value={settings.smtp.username}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, username: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="Your SMTP password"
                  value={settings.smtp.password}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, password: e.target.value },
                    })
                  }
                />
              </div>

              {smtpTestResult && (
                <div
                  className={`p-3 rounded-lg flex items-center space-x-2 ${
                    smtpTestResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {smtpTestResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500" />
                  )}
                  <span className="text-sm">{smtpTestResult.message}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={() => handleSave("smtp", settings.smtp)} disabled={isLoading.smtp}>
                  {isLoading.smtp ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save SMTP Settings
                </Button>
                <Button variant="outline" onClick={handleSMTPTest} disabled={smtpTesting || !settings.smtp.host}>
                  {smtpTesting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Server className="mr-2 h-4 w-4" />
                  )}
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Campaign Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified when campaigns are sent</p>
                </div>
                <Switch
                  checked={settings.notifications.campaignAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, campaignAlerts: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReports: checked },
                    })
                  }
                />
              </div>
              <Button
                onClick={() => handleSave("notifications", settings.notifications)}
                disabled={isLoading.notifications}
              >
                {isLoading.notifications ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Compliance Settings
              </CardTitle>
              <CardDescription>Configure compliance and legal requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  placeholder="Your company's physical address..."
                  value={settings.compliance.companyAddress}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      compliance: { ...settings.compliance, companyAddress: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unsubscribeText">Unsubscribe Text</Label>
                <Textarea
                  id="unsubscribeText"
                  placeholder="Custom unsubscribe message..."
                  value={settings.compliance.unsubscribeText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      compliance: { ...settings.compliance, unsubscribeText: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                <Input
                  id="privacyPolicy"
                  placeholder="https://yoursite.com/privacy"
                  value={settings.compliance.privacyPolicy}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      compliance: { ...settings.compliance, privacyPolicy: e.target.value },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave("compliance", settings.compliance)} disabled={isLoading.compliance}>
                {isLoading.compliance ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Compliance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, theme: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, language: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.appearance.timezone}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, timezone: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="cst">Central Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleSave("appearance", settings.appearance)} disabled={isLoading.appearance}>
                {isLoading.appearance ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
