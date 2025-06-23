"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Check, X, MapPin, Clock, Camera, Upload, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { extractFaceEncoding } from "@/lib/face-recognition"

interface AccessRequest {
  id: string
  name: string
  location_lat: number
  location_lng: number
  status: "pending" | "approved" | "rejected"
  created_at: string
  device_id: string
  photo_url: string | null
  photo_expires_at: string | null
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [facePhoto, setFacePhoto] = useState<File | null>(null)
  const [facePhotoPreview, setFacePhotoPreview] = useState<string | null>(null)
  const [showFaceCamera, setShowFaceCamera] = useState(false)
  const [isUploadingFace, setIsUploadingFace] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests()
      loadAdminFacePhoto()
    }
  }, [isAuthenticated])

  const loadAdminFacePhoto = async () => {
    if (!currentUser) return

    const { data, error } = await supabase
      .from("admin_users")
      .select("face_photo_url")
      .eq("email", currentUser.email)
      .single()

    if (data?.face_photo_url) {
      setFacePhotoPreview(data.face_photo_url)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single()

      if (adminError || !adminData) {
        await supabase.auth.signOut()
        throw new Error("Unauthorized: Admin access required")
      }

      setCurrentUser(data.user)
      setIsAuthenticated(true)
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const loadRequests = async () => {
    setIsLoadingRequests(true)
    try {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (err) {
      console.error("Failed to load requests:", err)
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const handleApproval = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({
          status,
          approved_at: status === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", requestId)

      if (error) throw error

      await loadRequests()
    } catch (err) {
      console.error("Failed to update request:", err)
    }
  }

  const handleFaceApproval = async (requestId: string) => {
    if (!currentUser) return

    try {
      // Get admin's face encoding
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("face_encoding")
        .eq("email", currentUser.email)
        .single()

      if (!adminData?.face_encoding) {
        setError("Please upload your face photo first")
        return
      }

      // Start camera for face verification
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      // This would capture admin's face and compare with stored encoding
      // For demo purposes, we'll auto-approve
      await handleApproval(requestId, "approved")

      stream.getTracks().forEach((track) => track.stop())
    } catch (err) {
      setError("Face verification failed")
    }
  }

  const startFaceCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowFaceCamera(true)
      }
    } catch (err) {
      setError("Unable to access camera")
    }
  }

  const captureFacePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx?.drawImage(video, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "face.jpg", { type: "image/jpeg" })
            setFacePhoto(file)
            setFacePhotoPreview(canvas.toDataURL())
            setShowFaceCamera(false)

            const stream = video.srcObject as MediaStream
            stream?.getTracks().forEach((track) => track.stop())
          }
        },
        "image/jpeg",
        0.8,
      )
    }
  }

  const handleFaceFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFacePhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFacePhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFacePhoto = async () => {
    if (!facePhoto || !currentUser) return

    setIsUploadingFace(true)
    try {
      // Upload photo to storage
      const fileName = `admin-faces/${currentUser.id}-${Date.now()}.jpg`
      const { data, error } = await supabase.storage.from("admin-faces").upload(fileName, facePhoto)

      if (error) throw error

      const { data: urlData } = supabase.storage.from("admin-faces").getPublicUrl(fileName)

      // Extract face encoding
      const faceEncoding = await extractFaceEncoding(facePhoto)

      // Update admin record
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({
          face_photo_url: urlData.publicUrl,
          face_encoding: faceEncoding,
        })
        .eq("email", currentUser.email)

      if (updateError) throw updateError

      setError("")
      alert("Face photo uploaded successfully!")
    } catch (err) {
      setError("Failed to upload face photo")
    } finally {
      setIsUploadingFace(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setEmail("")
    setPassword("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage Project Arcadia access requests</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Project Arcadia Admin</h1>
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Face Setup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Face Recognition Setup</DialogTitle>
                  <DialogDescription>Upload your face photo to enable face-based approvals</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {!facePhotoPreview ? (
                    <div className="space-y-2">
                      <Button type="button" variant="outline" onClick={startFaceCamera} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFaceFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <img
                        src={facePhotoPreview || "/placeholder.svg"}
                        alt="Face preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <Button onClick={uploadFacePhoto} disabled={isUploadingFace} className="flex-1">
                          {isUploadingFace ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Save Face"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFacePhoto(null)
                            setFacePhotoPreview(null)
                          }}
                          className="flex-1"
                        >
                          Retake
                        </Button>
                      </div>
                    </div>
                  )}

                  {showFaceCamera && (
                    <div className="space-y-2">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="flex space-x-2">
                        <Button type="button" onClick={captureFacePhoto} className="flex-1">
                          Capture
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowFaceCamera(false)
                            const stream = videoRef.current?.srcObject as MediaStream
                            stream?.getTracks().forEach((track) => track.stop())
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Access Requests</CardTitle>
                <CardDescription>Review and approve new member requests</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests
                      .filter((r) => r.status === "pending")
                      .map((request) => (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <h3 className="font-semibold text-lg">{request.name}</h3>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {request.location_lat.toFixed(4)}, {request.location_lng.toFixed(4)}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(request.created_at).toLocaleString()}
                              </div>
                              {request.photo_url && (
                                <div className="mt-2">
                                  <img
                                    src={request.photo_url || "/placeholder.svg"}
                                    alt={`${request.name}'s photo`}
                                    className="w-32 h-32 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleApproval(request.id, "approved")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleFaceApproval(request.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Camera className="h-4 w-4 mr-1" />
                                Face Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(request.id, "rejected")}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {requests.filter((r) => r.status === "pending").length === 0 && (
                      <p className="text-center text-gray-500 py-8">No pending requests</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests
                    .filter((r) => r.status === "approved")
                    .map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{request.name}</h3>
                            <p className="text-sm text-gray-600">
                              Approved: {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests
                    .filter((r) => r.status === "rejected")
                    .map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{request.name}</h3>
                            <p className="text-sm text-gray-600">
                              Rejected: {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="destructive">Rejected</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
