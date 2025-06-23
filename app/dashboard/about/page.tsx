"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Leaf, Users, Target, Heart } from "lucide-react"
import { isSessionValid } from "@/lib/utils"

export default function AboutPage() {
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
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-green-700">Project Arcadia</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Project Arcadia</h2>
          <p className="text-xl text-gray-600">
            Building a sustainable future through community action and environmental stewardship.
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="h-6 w-6 text-green-600 mr-3" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg leading-relaxed">
              <p className="mb-4">
                Project Arcadia is dedicated to creating positive environmental change through community engagement,
                education, and direct action. We believe that every individual has the power to make a difference in
                protecting our planet for future generations.
              </p>
              <p>
                Our mission is to foster environmental awareness, promote sustainable practices, and implement tangible
                solutions to address climate change and environmental degradation in our local community and beyond.
              </p>
            </CardContent>
          </Card>

          {/* Vision Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Leaf className="h-6 w-6 text-blue-600 mr-3" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg leading-relaxed">
              <p>
                We envision a world where communities are empowered to take meaningful action against environmental
                challenges. A future where sustainable living is not just an aspiration but a way of life, where green
                spaces flourish in urban environments, and where every person understands their role in environmental
                stewardship.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="h-6 w-6 text-red-600 mr-3" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Sustainability</h3>
                  <p className="text-gray-600">
                    We promote practices that meet present needs without compromising future generations' ability to
                    meet their own needs.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">Community</h3>
                  <p className="text-gray-600">
                    We believe in the power of collective action and building strong relationships within our
                    environmental community.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-purple-700">Education</h3>
                  <p className="text-gray-600">
                    We strive to educate and raise awareness about environmental issues and sustainable solutions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-700">Action</h3>
                  <p className="text-gray-600">
                    We turn awareness into action through practical projects and initiatives that create real
                    environmental impact.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">
                Project Arcadia is powered by a diverse group of passionate individuals committed to environmental
                protection and community engagement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Environmental Scientists</h3>
                  <p className="text-sm text-gray-600">Research and policy experts</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Community Organizers</h3>
                  <p className="text-sm text-gray-600">Grassroots engagement specialists</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Leaf className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Volunteers</h3>
                  <p className="text-sm text-gray-600">Dedicated community members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="text-lg leading-relaxed">
              <p className="mb-4">
                Founded in 2020, Project Arcadia began as a small group of concerned citizens in Hong Kong who wanted to
                make a tangible difference in their community's environmental health. What started as weekend cleanup
                activities has grown into a comprehensive environmental organization.
              </p>
              <p className="mb-4">
                Over the years, we've expanded our reach and impact, launching initiatives in urban reforestation, waste
                reduction, renewable energy advocacy, and environmental education. Our community has grown to include
                hundreds of active members across Hong Kong.
              </p>
              <p>
                Today, Project Arcadia continues to evolve, always staying true to our core mission of creating positive
                environmental change through community action and sustainable practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
