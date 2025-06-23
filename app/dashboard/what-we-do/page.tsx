"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, Recycle, Sun, Droplets, TreePine, GraduationCap } from "lucide-react"
import { isSessionValid } from "@/lib/utils"

export default function WhatWeDoPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isSessionValid()) {
      router.push("/access")
    }
  }, [router])

  const initiatives = [
    {
      icon: <TreePine className="h-8 w-8 text-green-600" />,
      title: "Urban Reforestation",
      description: "Planting trees and creating green spaces in urban areas to improve air quality and biodiversity.",
      status: "Active",
      impact: "500+ trees planted",
      color: "green",
    },
    {
      icon: <Recycle className="h-8 w-8 text-blue-600" />,
      title: "Waste Reduction Program",
      description: "Community-wide initiatives to reduce, reuse, and recycle waste materials effectively.",
      status: "Ongoing",
      impact: "2 tons waste diverted",
      color: "blue",
    },
    {
      icon: <Sun className="h-8 w-8 text-yellow-600" />,
      title: "Renewable Energy Advocacy",
      description: "Promoting solar and wind energy adoption in residential and commercial buildings.",
      status: "Planning",
      impact: "10 installations planned",
      color: "yellow",
    },
    {
      icon: <Droplets className="h-8 w-8 text-cyan-600" />,
      title: "Water Conservation",
      description: "Implementing rainwater harvesting and greywater recycling systems.",
      status: "Active",
      impact: "1000L daily savings",
      color: "cyan",
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      title: "Environmental Education",
      description: "Workshops and seminars to raise awareness about environmental issues and solutions.",
      status: "Ongoing",
      impact: "200+ people educated",
      color: "purple",
    },
    {
      icon: <Leaf className="h-8 w-8 text-emerald-600" />,
      title: "Sustainable Living",
      description: "Promoting eco-friendly lifestyle choices and sustainable consumption patterns.",
      status: "Active",
      impact: "50 families engaged",
      color: "emerald",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Ongoing":
        return "bg-blue-100 text-blue-800"
      case "Planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
          <p className="text-xl text-gray-600">
            Our comprehensive approach to environmental protection through community-driven initiatives.
          </p>
        </div>

        {/* Overview Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Our Approach</CardTitle>
          </CardHeader>
          <CardContent className="text-lg leading-relaxed">
            <p className="mb-4">
              At Project Arcadia, we believe in taking a holistic approach to environmental protection. Our initiatives
              span across multiple areas of environmental concern, from direct action projects to education and advocacy
              programs.
            </p>
            <p>
              Each of our programs is designed to create measurable impact while building community engagement and
              environmental awareness. We focus on practical, scalable solutions that can be implemented at the local
              level and replicated in other communities.
            </p>
          </CardContent>
        </Card>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {initiatives.map((initiative, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  {initiative.icon}
                  <Badge className={getStatusColor(initiative.status)}>{initiative.status}</Badge>
                </div>
                <CardTitle className="text-lg">{initiative.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-base">{initiative.description}</CardDescription>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">Impact:</p>
                  <p className="text-sm text-gray-600">{initiative.impact}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Get Involved */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How to Get Involved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-700">Volunteer Opportunities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Tree planting events (weekends)</li>
                  <li>• Community cleanup drives</li>
                  <li>• Educational workshop assistance</li>
                  <li>• Data collection and research</li>
                  <li>• Social media and outreach</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-700">Ways to Contribute</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Attend our monthly meetings</li>
                  <li>• Share your expertise and skills</li>
                  <li>• Spread awareness in your network</li>
                  <li>• Participate in fundraising events</li>
                  <li>• Adopt sustainable practices at home</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Our Impact So Far</CardTitle>
            <CardDescription>Measurable results from our environmental initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <p className="text-sm text-gray-600">Trees Planted</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2T</div>
                <p className="text-sm text-gray-600">Waste Diverted</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                <p className="text-sm text-gray-600">People Educated</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">1000L</div>
                <p className="text-sm text-gray-600">Water Saved Daily</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
