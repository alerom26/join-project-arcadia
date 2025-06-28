"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Loader2 } from "lucide-react" // Removed Camera, Upload
import { supabase } from "@/lib/supabase"
import { calculateDistance, getDeviceId, TARGET_LOCATION, isSessionValid } from "@/lib/utils"
// Removed import for detectFace as it's no longer used for candidate access

export default function AccessPage() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  // Removed photo, photoPreview, showCamera states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  // Removed videoRef, canvasRef, fileInputRef

  const router = useRouter()

  useEffect(() => {
    if (isSessionValid()) {
      router.push("/dashboard")
    }
  }, [router])

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(userLocation)
        setIsGettingLocation(false)

        const distance = calculateDistance(userLocation.lat, userLocation.lng, TARGET_LOCATION.lat, TARGET_LOCATION.lng)

        if (distance > 1) {
          setError("Access Denied")
        }
      },
      (error) => {
        setError("Unable to retrieve your location. Please enable location services.")
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  // Removed startCamera, capturePhoto, handleFileUpload, uploadPhoto functions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (!location) {
      setError("Please allow access to your location.")
      return
    }

    const distance = calculateDistance(location.lat, location.lng, TARGET_LOCATION.lat, TARGET_LOCATION.lng)

    if (distance > 1) {
      setError("Access Denied")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const deviceId = getDeviceId()

      const { error: insertError } = await supabase.from("access_requests").insert({
        name: name.trim(),
        location_lat: location.lat,
        location_lng: location.lng,
        device_id: deviceId,
        status: "pending",
        photo_url: null, // Explicitly set to null as photo verification is removed
        photo_expires_at: null, // Explicitly set to null
      })

      if (insertError) throw insertError

      router.push("/loading")
    } catch (err) {
      setError("Failed to submit request. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700">Project Arcadia</CardTitle>
          <CardDescription>Check out more information on Project Arcadia and joining! But first, please fill out this access request since some confidential info is stored. After that, please get the member who invited you to approve your request!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location Access</Label>
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : location ? (
                  <>
                    <MapPin className="mr-2 h-4 w-4 text-green-600" />
                    Location Verified
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Allow Location Access
                  </>
                )}
              </Button>
              {location && <p className="text-sm text-green-600">✓ Location verified within required area</p>}
            </div>

            {/* Removed Photo Verification Section */}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || !location} // Photo is no longer required
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                "Request Access"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
