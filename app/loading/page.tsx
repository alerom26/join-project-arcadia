"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Leaf, Globe, Users, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getDeviceId, setApprovalSession } from "@/lib/utils"

const loadingMessages = [
  {
    icon: <Leaf className="h-8 w-8 text-green-600" />,
    title: "Protecting Our Planet",
    description: "Every small action contributes to a larger environmental impact.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Global Community",
    description: "Connecting environmental advocates from around the world.",
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: "Together We're Stronger",
    description: "Building a sustainable future through collective action.",
  },
  {
    icon: <Heart className="h-8 w-8 text-red-600" />,
    title: "Passion for Nature",
    description: "Driven by love for our environment and future generations.",
  },
]

export default function LoadingPage() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isApproved, setIsApproved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Auto-scroll through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    // Check approval status
    const checkApproval = async () => {
      const deviceId = getDeviceId()

      const { data, error } = await supabase
        .from("access_requests")
        .select("status, approved_at")
        .eq("device_id", deviceId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (data && data.status === "approved") {
        setIsApproved(true)
        setApprovalSession()
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else if (data && data.status === "rejected") {
        router.push("/access?rejected=true")
      }
    }

    checkApproval()
    const approvalInterval = setInterval(checkApproval, 2000)

    return () => {
      clearInterval(messageInterval)
      clearInterval(approvalInterval)
    }
  }, [router])

  if (isApproved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-green-600 mb-4">
              <Leaf className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome to Project Arcadia!</h2>
            <p className="text-gray-600">Your access has been approved. Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-600" />
          </div>

          <h2 className="text-xl font-semibold mb-2">Awaiting Approval</h2>
          <p className="text-gray-600 mb-8">Your request is being reviewed by our team. Please wait...</p>

          <div className="space-y-6">
            {loadingMessages.map((message, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentMessage
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-30 transform translate-y-2"
                }`}
              >
                <div className="flex items-center justify-center mb-2">{message.icon}</div>
                <h3 className="font-semibold text-gray-800">{message.title}</h3>
                <p className="text-sm text-gray-600">{message.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {loadingMessages.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentMessage ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
