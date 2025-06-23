"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isSessionValid } from "@/lib/utils"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (isSessionValid()) {
      router.push("/dashboard")
    } else {
      router.push("/access")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
