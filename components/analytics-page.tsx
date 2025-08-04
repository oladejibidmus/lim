"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, TrendingUp, Eye, MousePointer, UserMinus } from "lucide-react"

const performanceData = [
  { name: "Jan", opens: 2400, clicks: 240, unsubscribes: 12 },
  { name: "Feb", opens: 1398, clicks: 180, unsubscribes: 8 },
  { name: "Mar", opens: 9800, clicks: 890, unsubscribes: 15 },
  { name: "Apr", opens: 3908, clicks: 420, unsubscribes: 18 },
  { name: "May", opens: 4800, clicks: 520, unsubscribes: 22 },
  { name: "Jun", opens: 3800, clicks: 380, unsubscribes: 14 },
]

const campaignPerformance = [
  { name: "Welcome Series", openRate: 28.5, clickRate: 4.2, sent: 1250 },
  { name: "Newsletter", openRate: 22.1, clickRate: 2.8, sent: 2400 },
  { name: "Product Launch", openRate: 31.2, clickRate: 8.7, sent: 892 },
  { name: "Re-engagement", openRate: 18.9, clickRate: 1.9, sent: 567 },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "#3b82f6" },
  { name: "Mobile", value: 40, color: "#10b981" },
  { name: "Tablet", value: 15, color: "#f59e0b" },
]

const timeData = [
  { hour: "6 AM", opens: 45 },
  { hour: "9 AM", opens: 120 },
  { hour: "12 PM", opens: 180 },
  { hour: "3 PM", opens: 210 },
  { hour: "6 PM", opens: 165 },
  { hour: "9 PM", opens: 95 },
]

export function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Track your email marketing performance</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opens</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,126</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,630</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribes</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="timing">Best Times</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg shadow-orange-200/50">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Email engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="opens" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg shadow-orange-200/50">
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Email opens by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Detailed performance metrics for each campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="openRate" fill="#3b82f6" name="Open Rate %" />
                  <Bar dataKey="clickRate" fill="#10b981" name="Click Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg shadow-orange-200/50">
              <CardHeader>
                <CardTitle>Subscriber Growth</CardTitle>
                <CardDescription>New subscribers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="opens" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg shadow-orange-200/50">
              <CardHeader>
                <CardTitle>Engagement Segments</CardTitle>
                <CardDescription>Subscriber engagement levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Highly Engaged</span>
                    <span className="text-sm text-gray-500">1,247 (43%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "43%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Moderately Engaged</span>
                    <span className="text-sm text-gray-500">892 (31%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "31%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Engagement</span>
                    <span className="text-sm text-gray-500">708 (26%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "26%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle>Best Send Times</CardTitle>
              <CardDescription>Optimal times for email engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="opens" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
