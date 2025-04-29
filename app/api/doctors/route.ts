import { prisma } from "@/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Parse query parameters
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const specializations = searchParams.getAll("specialization")
  const priceRange = searchParams.get("priceRange") || ""
  const region = searchParams.get("region") || ""
  const sortBy = searchParams.get("sortBy") || "relevance"

  const doctors = await prisma.doctor.findMany(
    {
      include:{
        address:true
      }
    }
  )

  // Filter doctors based on query parameters
  let filteredDoctors = [...doctors]
  console.log("filtered docs: ",doctors)

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredDoctors = filteredDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchLower) ||
        doctor.specialization.toLowerCase().includes(searchLower) ||
        doctor.description.toLowerCase().includes(searchLower),
    )
  }

  // Apply specialization filter
  if (specializations.length > 0) {
    filteredDoctors = filteredDoctors.filter((doctor) => specializations.includes(doctor.specialization))
  }

  // Apply price range filter
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number)
    if (max) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.priceRange >= min && doctor.priceRange < max)
    } else {
      // For "3000+" case
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.priceRange >= min)
    }
  }

  // Apply region filter
  if (region) {
    const regionLower = region.toLowerCase()
    // filteredDoctors = filteredDoctors.filter((doctor) => doctor.address.region.toLowerCase() === regionLower)
    filteredDoctors = await prisma.doctor.findMany({
      where: {
        address: {
          region: {
            equals: regionLower,
            mode: 'insensitive' // Case-insensitive comparison
          }
        }
      },
      include: {
        address: true,
        location: true
      }
    })
    
  }

  // Apply sorting
  switch (sortBy) {
    case "rating":
      filteredDoctors.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case "price_low":
      filteredDoctors.sort((a, b) => a.priceRange - b.priceRange)
      break
    case "price_high":
      filteredDoctors.sort((a, b) => b.priceRange - a.priceRange)
      break
    default:
      // Default sorting (relevance) - no change
      break
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex)
  console.log("paginated doctors: ",paginatedDoctors)

  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / limit)

  return NextResponse.json({
    doctors: paginatedDoctors,
    totalPages,
    currentPage: page,
    totalDoctors: filteredDoctors.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "specialization", "description", "priceRange", "image", "url"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate address and location
    if (!body.address || !body.address.locality || !body.address.region) {
      return NextResponse.json({ error: "Missing or invalid address information" }, { status: 400 })
    }

    if (!body.location || !body.location.latitude || !body.location.longitude) {
      return NextResponse.json({ error: "Missing or invalid location information" }, { status: 400 })
    }

    // Create new address
    // const newAddressId = `addr${addresses.length + 1}`
    // const newAddress = {
    //   id: newAddressId,
    //   locality: body.address.locality,
    //   region: body.address.region,
    // }
    // addresses.push(newAddress)

    // Create new location
    // const newLocationId = `loc${locations.length + 1}`
    // const newLocation = {
    //   id: newLocationId,
    //   latitude: body.location.latitude,
    //   longitude: body.location.longitude,
    // }
    // locations.push(newLocation)

    // Create new doctor
    const doctor = body.data
    const newDoctor = await prisma.doctor.create({
      data: {
        name: doctor.name,
        specialization: doctor.specialization,
        description: doctor.description,
        priceRange: doctor.priceRange,
        image: doctor.image,
        url: doctor.url,
        rating: doctor.rating ?? null, // Handle null

        address: {
          create: {
            locality: doctor.address.locality || '',
            region: doctor.address.region || '',
          },
        },
        location: {
          create: {
            latitude: doctor.location.latitude || '',
            longitude: doctor.location.longitude || '',
          },
        },
      },
    });

    // Add to doctors array
    // doctors.push(newDoctor)

    return NextResponse.json({ message: "Doctor added successfully", doctor: newDoctor }, { status: 201 })
  } catch (error) {
    console.error("Error adding doctor:", error)
    return NextResponse.json({ error: "Failed to add doctor" }, { status: 500 })
  }
}
