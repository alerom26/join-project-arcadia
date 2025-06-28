"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react"
import { isSessionValid } from "@/lib/utils"

export default function ContactPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isSessionValid()) {
      router.push("/access")
    }
  }, [router])

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
              <Mail className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-blue-700">Project Arcadia</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600">
            We're here to help! Reach out to us with any questions, feedback, or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">For general inquiries, partnerships, or support:</p>
              <a href="mailto:info@projectarcadia.org" className="text-blue-600 hover:underline">
                info@projectarcadia.xyz
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-purple-600" />
                Call Us
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                Our Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">Chat to us at school!
          
              </p>
              <address className="not-italic text-gray-700">
                Kellett School
                <br />
                KLB Campus
                <br />
                Hong Kong
              </address>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
