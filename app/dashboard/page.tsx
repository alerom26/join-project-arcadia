"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Calendar, HelpCircle, LogOut } from "lucide-react"
import { isSessionValid, clearSession } from "@/lib/utils"
import ApplicationStatus from "./application-status"

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isSessionValid()) {
      router.push("/access")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    clearSession()
    router.push("/access")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 animate-pulse text-green-600 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-green-700">Project Arcadia</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Project Arcadia</h2>
          <p className="text-lg text-gray-600">
            Join our community of environmental advocates working towards a sustainable future.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/about">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-lg">About Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Learn about our mission, vision, and the team behind Project Arcadia.</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/what-we-do">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Leaf className="h-6 w-6 text-green-600 mr-2" />
                  <CardTitle className="text-lg">What We Do</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Discover our environmental initiatives and ongoing projects.</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/meetings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-purple-600 mr-2" />
                  <CardTitle className="text-lg">Meetings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>View upcoming meetings, events, and how to participate.</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/qa">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <HelpCircle className="h-6 w-6 text-orange-600 mr-2" />
                  <CardTitle className="text-lg">Q&A</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Find answers to frequently asked questions about our organization.</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Featured Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 text-green-600 mr-2" />
                Latest Initiative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Urban Reforestation Project</h3>
              <p className="text-gray-600 mb-4">
                We're working to plant 1,000 trees across Hong Kong's urban areas this year. Join us in making our city
                greener and more sustainable.
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Project
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                Next Meeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">25-26 Winter Start of Term Meeting</h3>
              <p className="text-gray-600 mb-4">
                Join us for our start of term meeting to discuss ongoing projects and plan future initiatives.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Every first Saturday</span>
                <Badge variant="outline">Termly</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue with Application Section */}
        <ApplicationStatus />
      </main>
    </div>
  )
}
