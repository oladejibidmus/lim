"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Video, MessageCircle, Send, ChevronRight } from "lucide-react"

const helpArticles = [
  {
    id: 1,
    title: "Getting Started with EmailFlow",
    category: "Getting Started",
    description: "Learn the basics of setting up your first email campaign",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Creating Your First Email Sequence",
    category: "Sequences",
    description: "Step-by-step guide to building automated email sequences",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Managing Your Contact Lists",
    category: "Contacts",
    description: "Best practices for organizing and segmenting your contacts",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Understanding Email Analytics",
    category: "Analytics",
    description: "How to read and interpret your email performance metrics",
    readTime: "7 min read",
  },
]

const videoTutorials = [
  {
    id: 1,
    title: "EmailFlow Overview",
    duration: "3:45",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Video+Thumbnail",
  },
  {
    id: 2,
    title: "Campaign Creation Walkthrough",
    duration: "8:20",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Video+Thumbnail",
  },
  {
    id: 3,
    title: "Advanced Sequence Building",
    duration: "12:15",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Video+Thumbnail",
  },
]

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [supportMessage, setSupportMessage] = useState("")

  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">Find answers to your questions and get the help you need</p>
      </div>

      {/* Search */}
      <Card className="mb-8 shadow-lg shadow-orange-200/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles, tutorials, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-lg h-12"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Knowledge Base</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="support">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    Read Article
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Start Guide */}
          <Card className="shadow-lg shadow-orange-200/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>Get up and running with EmailFlow in just a few steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Set up your sender profile</h4>
                    <p className="text-sm text-gray-600">Configure your from name and email address</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Import your contacts</h4>
                    <p className="text-sm text-gray-600">Upload your contact list or add contacts manually</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Create your first campaign</h4>
                    <p className="text-sm text-gray-600">Design and send your first email campaign</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg shadow-orange-200/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </CardTitle>
                <CardDescription>Send us a message and we'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="What can we help you with?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg shadow-orange-200/50">
              <CardHeader>
                <CardTitle>Other Ways to Get Help</CardTitle>
                <CardDescription>Additional support options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Live Chat</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Chat with our support team in real-time during business hours
                  </p>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Email Support</h4>
                  <p className="text-sm text-gray-600 mb-3">Send us an email at support@emailflow.com</p>
                  <Button variant="outline" size="sm">
                    Send Email
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Community Forum</h4>
                  <p className="text-sm text-gray-600 mb-3">Connect with other users and share best practices</p>
                  <Button variant="outline" size="sm">
                    Visit Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
