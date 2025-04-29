"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function AddDoctorForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    description: "",
    priceRange: "",
    image: "",
    url: "",
    address: {
      locality: "",
      region: "",
    },
    location: {
      latitude: "",
      longitude: "",
    },
  })

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Gynecologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
  ]

  const languageOptions = [
    { label: "English", value: "English" },
    { label: "Spanish", value: "Spanish" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Mandarin", value: "Mandarin" },
    { label: "Hindi", value: "Hindi" },
    { label: "Arabic", value: "Arabic" },
    { label: "Bengali", value: "Bengali" },
    { label: "Russian", value: "Russian" },
    { label: "Portuguese", value: "Portuguese" },
    { label: "Korean", value: "Korean" },
  ]

  const availabilityOptions = [
    { label: "Today 9:00 AM", value: "Today 9:00 AM" },
    { label: "Today 10:00 AM", value: "Today 10:00 AM" },
    { label: "Today 11:00 AM", value: "Today 11:00 AM" },
    { label: "Today 12:00 PM", value: "Today 12:00 PM" },
    { label: "Today 1:00 PM", value: "Today 1:00 PM" },
    { label: "Today 2:00 PM", value: "Today 2:00 PM" },
    { label: "Today 3:00 PM", value: "Today 3:00 PM" },
    { label: "Today 4:00 PM", value: "Today 4:00 PM" },
    { label: "Tomorrow 9:00 AM", value: "Tomorrow 9:00 AM" },
    { label: "Tomorrow 10:00 AM", value: "Tomorrow 10:00 AM" },
    { label: "Tomorrow 11:00 AM", value: "Tomorrow 11:00 AM" },
    { label: "Tomorrow 12:00 PM", value: "Tomorrow 12:00 PM" },
    { label: "Tomorrow 1:00 PM", value: "Tomorrow 1:00 PM" },
    { label: "Tomorrow 2:00 PM", value: "Tomorrow 2:00 PM" },
    { label: "Tomorrow 3:00 PM", value: "Tomorrow 3:00 PM" },
    { label: "Tomorrow 4:00 PM", value: "Tomorrow 4:00 PM" },
    { label: "This Week Wed 10:00 AM", value: "This Week Wed 10:00 AM" },
    { label: "This Week Thu 10:00 AM", value: "This Week Thu 10:00 AM" },
    { label: "This Week Fri 10:00 AM", value: "This Week Fri 10:00 AM" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.name ||
      !formData.specialization ||
      !formData.description ||
      !formData.priceRange ||
      !formData.url ||
      !formData.image
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.address.locality || !formData.address.region) {
      toast({
        title: "Error",
        description: "Please fill address information",
        variant: "destructive",
      })
      return
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      toast({
        title: "Error",
        description: "Please fill location information",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          priceRange: Number.parseInt(formData.priceRange),
          rating: null, // New doctors start with null rating
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add doctor")
      }

      toast({
        title: "Success",
        description: "Doctor added successfully",
      })

      // Reset form
      setFormData({
        name: "",
        specialization: "",
        description: "",
        priceRange: "",
        image: "",
        url: "",
        address: {
          locality: "",
          region: "",
        },
        location: {
          latitude: "",
          longitude: "",
        },
      })

      // Refresh doctor list
      router.refresh()
    } catch (error) {
      console.error("Error adding doctor:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add doctor",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Doctor</CardTitle>
        <CardDescription>Fill in the details to add a new doctor to the platform</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Doctor Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">
                Specialization <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => handleSelectChange("specialization", value)}
              >
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceRange">
                Price Range (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="priceRange"
                name="priceRange"
                type="number"
                min="0"
                placeholder="1500"
                value={formData.priceRange}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">
                Booking URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                name="url"
                placeholder="https://example.com/book/doctor"
                value={formData.url}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="Experienced doctor specializing in..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Image URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image"
              name="image"
              placeholder="/images/doctor.jpg"
              value={formData.image}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address.locality">
                Locality <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address.locality"
                name="address.locality"
                placeholder="Downtown Medical Center"
                value={formData.address.locality}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      locality: e.target.value,
                    },
                  }))
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.region">
                Region <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.address.region}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      region: value,
                    },
                  }))
                }}
              >
                <SelectTrigger id="address.region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {["North", "South", "East", "West", "Central"].map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location.latitude">
                Latitude <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location.latitude"
                name="location.latitude"
                placeholder="40.7128"
                value={formData.location.latitude}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      latitude: e.target.value,
                    },
                  }))
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location.longitude">
                Longitude <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location.longitude"
                name="location.longitude"
                placeholder="-74.0060"
                value={formData.location.longitude}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      longitude: e.target.value,
                    },
                  }))
                }}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Doctor"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
