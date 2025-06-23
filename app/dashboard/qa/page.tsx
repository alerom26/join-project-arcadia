"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Leaf, Search, ChevronDown, ChevronUp } from "lucide-react"
import { isSessionValid } from "@/lib/utils"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

export default function QAPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    if (!isSessionValid()) {
      router.push("/access")
    }
  }, [router])

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What is Project Arcadia?",
      answer:
        "Project Arcadia is an environmental organization dedicated to creating positive environmental change through community engagement, education, and direct action. We focus on practical, scalable solutions that can be implemented at the local level.",
      category: "General",
    },
    {
      id: 2,
      question: "How can I join Project Arcadia?",
      answer:
        "To join Project Arcadia, you need to request access through our location-verified system. You must be within 1km of our headquarters at 7 Lam Hing Street, Kowloon Bay, Hong Kong. After submitting your request, our admin team will review and approve your access.",
      category: "Membership",
    },
    {
      id: 3,
      question: "Do I need any special skills or experience to volunteer?",
      answer:
        "No special skills are required! We welcome volunteers from all backgrounds. Whether you're interested in hands-on environmental work, education, research, or administrative support, there's a place for you in our community.",
      category: "Volunteering",
    },
    {
      id: 4,
      question: "How often do you hold meetings?",
      answer:
        "We hold monthly community gatherings on the first Saturday of each month, project planning sessions on the third Wednesday, and volunteer coordination meetings every two weeks. Check our Meetings page for the most current schedule.",
      category: "Meetings",
    },
    {
      id: 5,
      question: "What types of environmental projects do you work on?",
      answer:
        "Our projects include urban reforestation, waste reduction programs, renewable energy advocacy, water conservation, environmental education, and promoting sustainable living practices. Each project is designed to create measurable environmental impact.",
      category: "Projects",
    },
    {
      id: 6,
      question: "Is there a membership fee?",
      answer:
        "No, there are no membership fees to join Project Arcadia. We are a community-driven organization that relies on volunteer contributions and occasional fundraising events to support our initiatives.",
      category: "Membership",
    },
    {
      id: 7,
      question: "Can I participate if I can't attend meetings regularly?",
      answer:
        "We understand that people have different schedules and commitments. You can participate in specific projects, attend events when available, or contribute in other ways that fit your schedule.",
      category: "Volunteering",
    },
    {
      id: 8,
      question: "How do you measure the impact of your projects?",
      answer:
        "We track various metrics depending on the project: trees planted, waste diverted from landfills, water saved, people educated, and carbon footprint reduction. We publish regular impact reports to keep our community informed.",
      category: "Projects",
    },
    {
      id: 9,
      question: "Do you collaborate with other environmental organizations?",
      answer:
        "Yes, we actively collaborate with other environmental groups, government agencies, and educational institutions. We believe that collective action is more effective than working in isolation.",
      category: "General",
    },
    {
      id: 10,
      question: "How can I suggest a new project or initiative?",
      answer:
        "We encourage new ideas! You can propose new projects during our monthly meetings, contact our project planning team, or submit your ideas through our internal communication channels once you're a member.",
      category: "Projects",
    },
    {
      id: 11,
      question: "What safety measures do you have for field activities?",
      answer:
        "Safety is our top priority. All field activities include safety briefings, proper equipment provision, and trained supervisors. We follow established safety protocols and provide necessary protective gear for all participants.",
      category: "Safety",
    },
    {
      id: 12,
      question: "How do I stay updated on Project Arcadia activities?",
      answer:
        "Once you're a member, you'll have access to our internal communication channels, meeting announcements, and project updates. We also maintain this member portal with the latest information.",
      category: "Communication",
    },
  ]

  const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions & Answers</h2>
          <p className="text-xl text-gray-600">Find answers to frequently asked questions about Project Arcadia.</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions and answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No questions found matching your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="cursor-pointer" onClick={() => toggleExpanded(faq.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                      <CardDescription className="mt-1">Category: {faq.category}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {expandedItems.includes(faq.id) && (
                  <CardContent className="pt-0">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you can't find the answer you're looking for, don't hesitate to reach out to us during our meetings or
              through our community channels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Ask During Meetings</h3>
                <p className="text-green-700 text-sm">
                  Bring your questions to our monthly community gatherings. We always have a Q&A session.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Connect with Members</h3>
                <p className="text-blue-700 text-sm">
                  Our experienced members are always happy to help newcomers and answer questions about our projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
