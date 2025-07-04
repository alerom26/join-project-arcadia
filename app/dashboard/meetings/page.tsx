"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, Calendar, Clock, MapPin } from "lucide-react"
import { isSessionValid } from "@/lib/utils"

export default function MeetingsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isSessionValid()) {
      router.push("/access")
    }
  }, [router])

  const upcomingMeetings = []

  const recurringMeetings = [
    {
      title: "Full Member Meeting",
      frequency: "First Tuesday of every month",
      time: "12:40 PM - 1:05 PM",
      location: "Study Pods connected via Zoom",
      description: "Regular meeting for all members to discuss projects and plan activities.",
    },
    {
      title: "Standard Member Meetings",
      frequency: "Every Thursday & Friday",
      time: "12:40 PM - 1:05 PM",
      location: "Study Pods (usually B1 + B2)",
      description: "Focused planning sessions for specific project initiatives.",
    },
    {
      title: "Executive Meeting",
      frequency: "Every Wednesday",
      time: "12:40 PM - 12:55 PM",
      location: "Study Pods (usually C)",
      description: "Coordination meetings for executives to discuss progress.",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "In-Person":
        return "bg-green-100 text-green-800"
      case "Virtual":
        return "bg-blue-100 text-blue-800"
      case "Field Work":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-green-700">Project Arcadia</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meetings & Events</h2>
          <p className="text-xl text-gray-600">
            Stay connected with our community through regular meetings and special events.
          </p>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Meetings</h3>
          <div className="space-y-6">
            {upcomingMeetings.map((meeting, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{meeting.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(meeting.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {meeting.time} ({meeting.duration})
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {meeting.location}
                        </div>
                      </div>
                    </div>
                    <Badge className={getTypeColor(meeting.type)}>{meeting.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{meeting.description}</CardDescription>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Agenda:</h4>
                    <ul className="space-y-1">
                      {meeting.agenda.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recurring Meetings */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recurring Meetings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recurringMeetings.map((meeting, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {meeting.frequency}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {meeting.location}
                    </div>
                  </div>
                  <CardDescription className="mt-3">{meeting.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Meeting Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Meeting Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-700">How to Join</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Check the meeting schedule above</li>
                  <li>• For in-person meetings, a 5 minute transition time at the start is included.</li>
                  <li>• For virtual meetings, join via the provided Zoom link</li>
                  <li>• You are reccomended to take personal notes in our Shared OneNote</li>
                  <li>• Come prepared with questions or ideas to share</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-700">What to Expect</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Welcoming and inclusive environment</li>
                  <li>• Updates on current environmental projects</li>
                  <li>• Opportunities to volunteer and contribute</li>
                  <li>• Networking with like-minded individuals</li>
                  <li>• Learning about environmental issues and solutions</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">New Members Welcome!</h4>
              <p className="text-green-700">
                First time attending? Don't worry! Our meetings are designed to be welcoming to newcomers. We'll make
                sure you feel included and help you find ways to get involved that match your interests and
                availability.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
