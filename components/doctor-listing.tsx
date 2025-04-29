"use client"

import { useState, useEffect } from "react"
import { Filter, Search, MapPin, Star, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Types
interface Doctor {
  id: string
  name: string
  specialization: string
  description: string
  priceRange: number
  image: string
  url: string
  address: {
    id: string
    locality: string
    region: string
  }
  location: {
    id: string
    latitude: string
    longitude: string
  }
  rating: number | null
  createdAt: string
  updatedAt: string
}

interface FilterOptions {
  specialization: string[]
  priceRange: string
  region: string
  sortBy: string
  search: string
}

export default function DoctorListing() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    specialization: [],
    priceRange: "",
    region: "",
    sortBy: "relevance",
    search: "",
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Gynecologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
  ]

  // Fetch doctors with filters and pagination
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        queryParams.append("page", currentPage.toString())
        queryParams.append("limit", "10")

        if (filterOptions.search) {
          queryParams.append("search", filterOptions.search)
        }

        if (filterOptions.specialization.length > 0) {
          filterOptions.specialization.forEach((spec) => {
            queryParams.append("specialization", spec)
          })
        }

        if (filterOptions.priceRange) {
          queryParams.append("priceRange", filterOptions.priceRange)
        }

        if (filterOptions.region) {
          queryParams.append("region", filterOptions.region)
        }

        if (filterOptions.sortBy) {
          queryParams.append("sortBy", filterOptions.sortBy)
        }

        const response = await fetch(`/api/doctors?${queryParams.toString()}`)
        const data = await response.json()

        setDoctors(data.doctors)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [currentPage, filterOptions])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filterOptions.specialization.length > 0) count++
    if (filterOptions.priceRange) count++
    if (filterOptions.region) count++
    if (filterOptions.sortBy !== "relevance") count++
    setActiveFiltersCount(count)
  }, [filterOptions])

  const handleSpecializationChange = (specialization: string) => {
    setFilterOptions((prev) => {
      const newSpecializations = prev.specialization.includes(specialization)
        ? prev.specialization.filter((s) => s !== specialization)
        : [...prev.specialization, specialization]

      return {
        ...prev,
        specialization: newSpecializations,
      }
    })
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (priceRange: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      priceRange,
    }))
    setCurrentPage(1)
  }

  const handleRegionChange = (region: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      region,
    }))
    setCurrentPage(1)
  }

  const handleSortChange = (sortBy: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      sortBy,
    }))
    setCurrentPage(1)
  }

  const handleSearchChange = (search: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      search,
    }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilterOptions({
      specialization: [],
      priceRange: "",
      region: "",
      sortBy: "relevance",
      search: "",
    })
    setCurrentPage(1)
  }

  const removeSpecialization = (specialization: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== specialization),
    }))
  }

  const removePriceRange = () => {
    setFilterOptions((prev) => ({
      ...prev,
      priceRange: "",
    }))
  }

  const removeRegion = () => {
    setFilterOptions((prev) => ({
      ...prev,
      region: "",
    }))
  }

  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg mb-3">Specialization</h3>
        <div className="space-y-2">
          {specializations.map((specialization) => (
            <div key={specialization} className="flex items-center space-x-2">
              <Checkbox
                id={`specialization-${specialization}`}
                checked={filterOptions.specialization.includes(specialization)}
                onCheckedChange={() => handleSpecializationChange(specialization)}
              />
              <Label htmlFor={`specialization-${specialization}`}>{specialization}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium text-lg mb-3">Price Range</h3>
        <div className="space-y-2">
          {["0-1000", "1000-2000", "2000-3000", "3000+"].map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <Checkbox
                id={`priceRange-${range}`}
                checked={filterOptions.priceRange === range}
                onCheckedChange={() => handlePriceRangeChange(filterOptions.priceRange === range ? "" : range)}
              />
              <Label htmlFor={`priceRange-${range}`}>₹{range}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium text-lg mb-3">Region</h3>
        <div className="space-y-2">
          {["North", "South", "East", "West", "Central"].map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <Checkbox
                id={`region-${region}`}
                checked={filterOptions.region === region.toLowerCase()}
                onCheckedChange={() =>
                  handleRegionChange(filterOptions.region === region.toLowerCase() ? "" : region.toLowerCase())
                }
              />
              <Label htmlFor={`region-${region}`}>{region}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
          

  const toggleDescription = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find Doctors</h1>
        <p className="text-gray-600 mt-2">Book appointments with top doctors in your area</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search doctors, specialties..."
            className="pl-10"
            value={filterOptions.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{renderFilters()}</div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                <Button onClick={() => setMobileFiltersOpen(false)} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={filterOptions.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="fees_low">Fees: Low to High</SelectItem>
              <SelectItem value="fees_high">Fees: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.specialization.map((spec) => (
            <Badge key={spec} variant="outline" className="flex items-center gap-1">
              {spec}
              <X size={14} className="cursor-pointer" onClick={() => removeSpecialization(spec)} />
            </Badge>
          ))}

          {filterOptions.priceRange && (
            <Badge variant="outline" className="flex items-center gap-1">
              ₹{filterOptions.priceRange}
              <X size={14} className="cursor-pointer" onClick={removePriceRange} />
            </Badge>
          )}

          {filterOptions.region && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filterOptions.region}
              <X size={14} className="cursor-pointer" onClick={removeRegion} />
            </Badge>
          )}

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-sm">
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Filters</h2>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-sm">
                  Clear all
                </Button>
              )}
            </div>
            {renderFilters()}
          </div>
        </div>

        {/* Doctor Listing */}
        <div className="flex-1">
          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No doctors found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="grid gap-4">
            {doctors.map((doctor) => {
  const isExpanded = expandedIds[doctor.id] || false;
             
          
              return (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 p-6 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                          <Image
                            src={doctor.image || "/placeholder.svg?height=96&width=96"}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                          <span className="ml-1 font-medium">{doctor.rating || "N/A"}</span>
                        </div>
                      </div>
          
                      <div className="flex-1 p-6 border-t md:border-t-0 md:border-l">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className="text-lg font-bold">Dr. {doctor.name}</h3>
                          <Badge variant="outline" className="self-start md:self-auto mt-2 md:mt-0">
                            ₹{doctor.priceRange} Consultation
                          </Badge>
                        </div>
          
                        <p className="text-gray-600 mb-2">{doctor.specialization}</p>
          
                        <p
                          className="text-gray-600 mb-4 cursor-pointer"
                          onClick={() => toggleDescription(doctor.id)}
                        >
                          {isExpanded
                            ? doctor.description
                            : doctor.description?.slice(0, 150) + (doctor.description?.length > 150 ? "..." : "")}
                        </p>
          
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={16} className="mr-1" />
                          <span>
                            {doctor.address.locality}, {doctor.address.region}
                          </span>
                        </div>
          
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <Button className="shrink-0" asChild>
                            <a href={doctor.url} target="_blank" rel="noopener noreferrer">
                              Book Appointment
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          )}

          {/* Pagination */}
          {!loading && doctors.length > 0 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}
