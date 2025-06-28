"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, CheckCircle, Lock, Unlock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface UserApplication {
  id: string
  user_id: string
  name: string
  email: string
  stage: "application" | "test" | "interview" | "completed"
  test_unlocked: boolean
  assigned_interviewer: string | null
  created_at: string
  updated_at: string
}

export default function ApplicationStatus() {
  const [userApp, setUserApp] = useState<UserApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserApplication = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) {
          setError("User not logged in.")
          setIsLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 means no rows found
          throw fetchError
        }

        if (data) {
          setUserApp(data)
        } else {
          setUserApp(null) // No application found for this user
        }
      } catch (err: any) {
        console.error("Error fetching user application:", err)
        setError(err.message || "Failed to load application status.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserApplication()

    // Set up real-time subscription for application changes
    const channel = supabase
      .channel("public:applications")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, (payload) => {
        if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
          const updatedApp = payload.new as UserApplication
          if (userApp && updatedApp.user_id === userApp.user_id) {
            setUserApp(updatedApp)
          } else if (!userApp && updatedApp.user_id === supabase.auth.getUser().data.user?.id) {
            // If no app was found initially, but now one is inserted for this user
            setUserApp(updatedApp)
          }
        } else if (payload.eventType === "DELETE") {
          const deletedApp = payload.old as UserApplication
          if (userApp && deletedApp.user_id === userApp.user_id) {
            setUserApp(null) // Application deleted
          }
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const openApplication = () => {
    window.open("https://tally.so/r/m6zWyk", "_blank")
  }

  const openTest = () => {
    if (userApp?.test_unlocked) {
      window.open("https://www.autoproctor.co/tests/3m2EI3BXwn/load", "_blank")
    }
  }

  const calculateProgress = (app: UserApplication) => {
    if (app.stage === "completed") return 100
    if (app.stage === "interview") return 90 // Higher progress for interview
    if (app.stage === "test" && app.test_unlocked) return 66
    if (app.stage === "application") return 33
    return 0
  }

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2 text-gray-600">Loading application status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-600">
        <p>Error: {error}</p>
        <p>Please ensure you are logged in and have an application.</p>
      </div>
    )
  }

  if (!userApp) {
    return (
      <div className="mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Leaf className="h-6 w-6 text-green-600 mr-2" />
              Start Your Application
            </CardTitle>
            <CardDescription>
              You don't have an active application yet. Click below to begin your journey with Project Arcadia!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openApplication} className="w-full bg-blue-600 hover:bg-blue-700">
              Start New Application
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = calculateProgress(userApp)

  return (
    <div className="mt-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Leaf className="h-6 w-6 text-green-600 mr-2" />
            Continue with Application
          </CardTitle>
          <CardDescription>
            Complete your Project Arcadia membership application through our 3-stage process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Application Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1: Application Form */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 33 ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {progress >= 33 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className="text-gray-600 font-semibold">1</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg">Application Stage</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Fill out our comprehensive application form to tell us about yourself and your environmental interests.
              </p>
              <Button
                onClick={openApplication}
                className={`w-full ${
                  progress >= 33 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={userApp.stage !== "application"} // Disable if not in this stage
              >
                {userApp.stage === "application" ? "Start Application" : "Application Submitted"}
              </Button>
            </div>

            {/* Stage 2: Online Test */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 66 ? "bg-green-100" : userApp.test_unlocked ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {progress >= 66 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : userApp.test_unlocked ? (
                    <Unlock className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <h3 className="font-semibold text-lg">Test Stage</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Complete our online assessment to demonstrate your knowledge and commitment to environmental causes.
              </p>
              <Button
                onClick={openTest}
                disabled={!userApp.test_unlocked || userApp.stage !== "test"}
                className={`w-full ${
                  progress >= 66
                    ? "bg-green-600 hover:bg-green-700"
                    : userApp.test_unlocked
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                }`}
                variant={userApp.test_unlocked && userApp.stage === "test" ? "default" : "outline"}
              >
                {userApp.stage === "test" && userApp.test_unlocked ? "Take Test" : "Test Locked"}
              </Button>
              {!userApp.test_unlocked && userApp.stage === "application" && (
                <p className="text-xs text-gray-500">Complete Stage 1 and wait for admin approval to unlock</p>
              )}
            </div>

            {/* Stage 3: Interview */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 100 ? "bg-green-100" : userApp.assigned_interviewer ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  {progress >= 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <span
                      className={`font-semibold ${userApp.assigned_interviewer ? "text-purple-600" : "text-gray-600"}`}
                    >
                      3
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg">Interview Stage</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Meet with one of our team members for a final discussion about your application.
              </p>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Assigned Interviewer:</strong>
                </div>
                <div
                  className={`p-2 rounded text-sm ${
                    userApp.assigned_interviewer ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {userApp.assigned_interviewer || "Not yet assigned"}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Application Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
