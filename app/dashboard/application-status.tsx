"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, CheckCircle, Lock, Unlock } from "lucide-react"

interface UserApplication {
  stage: "application" | "test" | "interview" | "completed"
  test_unlocked: boolean
  assigned_interviewer: string | null
  progress: number
}

export default function ApplicationStatus() {
  const [userApp, setUserApp] = useState<UserApplication>({
    stage: "application",
    test_unlocked: false,
    assigned_interviewer: null,
    progress: 33,
  })

  const openApplication = () => {
    window.open("https://tally.so/r/w2g76D", "_blank")
  }

  const openTest = () => {
    if (userApp.test_unlocked) {
      window.open("https://www.autoproctor.co/tests/3m2EI3BXwn/load", "_blank")
    }
  }

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
                    userApp.progress >= 33 ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {userApp.progress >= 33 ? (
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
                  userApp.progress >= 33 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {userApp.progress >= 33 ? "Application Submitted" : "Start Application"}
              </Button>
            </div>

            {/* Stage 2: Online Test */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userApp.progress >= 66 ? "bg-green-100" : userApp.test_unlocked ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {userApp.progress >= 66 ? (
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
                disabled={!userApp.test_unlocked}
                className={`w-full ${
                  userApp.progress >= 66
                    ? "bg-green-600 hover:bg-green-700"
                    : userApp.test_unlocked
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                }`}
                variant={userApp.test_unlocked ? "default" : "outline"}
              >
                {userApp.progress >= 66 ? "Test Completed" : userApp.test_unlocked ? "Take Test" : "Test Locked"}
              </Button>
              {!userApp.test_unlocked && (
                <p className="text-xs text-gray-500">Complete Stage 1 and wait for admin approval to unlock</p>
              )}
            </div>

            {/* Stage 3: Interview */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userApp.progress >= 100
                      ? "bg-green-100"
                      : userApp.assigned_interviewer
                        ? "bg-purple-100"
                        : "bg-gray-100"
                  }`}
                >
                  {userApp.progress >= 100 ? (
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
              <span>{userApp.progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${userApp.progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
