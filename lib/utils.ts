import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in kilometers
  return d
}

export function generateDeviceId(): string {
  return "device_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return ""

  let deviceId = localStorage.getItem("arcadia_device_id")
  if (!deviceId) {
    deviceId = generateDeviceId()
    localStorage.setItem("arcadia_device_id", deviceId)
  }
  return deviceId
}

export function isSessionValid(): boolean {
  if (typeof window === "undefined") return false

  const approvedAt = localStorage.getItem("arcadia_approved_at")
  if (!approvedAt) return false

  const approvedTime = new Date(approvedAt)
  const now = new Date()
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000

  return now.getTime() - approvedTime.getTime() < threeDaysInMs
}

export function setApprovalSession(): void {
  if (typeof window === "undefined") return
  localStorage.setItem("arcadia_approved_at", new Date().toISOString())
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("arcadia_approved_at")
  localStorage.removeItem("arcadia_device_id")
}

// Target location: 7 Lam Hing Street, Kowloon Bay, Hong Kong
export const TARGET_LOCATION = {
  lat: 22.3193,
  lng: 114.2057,
}
