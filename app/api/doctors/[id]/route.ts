import { prisma } from "@/prisma"
import { type NextRequest, NextResponse } from "next/server"

// This would be imported from a shared location in a real app
// Using the same mock data as in the main route file


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  const doctors = await prisma.doctor.findMany()

  // Find doctor by ID
  const doctor = doctors.find((doc) => doc.id === id)

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
  }

  return NextResponse.json(doctor)
}

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id
//     const body = await request.json()

//   const doctors = await prisma.doctor.findMany()

//     // Find doctor index
//     const doctorIndex = doctors.findIndex((doc) => doc.id === id)

//     if (doctorIndex === -1) {
//       return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
//     }

//     const currentDoctor = doctors[doctorIndex]

//     // Update address if provided
//     if (body.address) {
//       await prisma.address.update({
//         where:{
//           id:body.addressId
//         },
//         data:{
//           address:
//         }
//       })
//       const addressIndex = addresses.findIndex((addr) => addr.id === currentDoctor.addressId)
//       if (addressIndex !== -1) {
//         addresses[addressIndex] = {
//           ...addresses[addressIndex],
//           locality: body.address.locality || addresses[addressIndex].locality,
//           region: body.address.region || addresses[addressIndex].region,
//         }
//       }
//     }

//     // Update location if provided
//     if (body.location) {
//       const locationIndex = locations.findIndex((loc) => loc.id === currentDoctor.locationId)
//       if (locationIndex !== -1) {
//         locations[locationIndex] = {
//           ...locations[locationIndex],
//           latitude: body.location.latitude || locations[locationIndex].latitude,
//           longitude: body.location.longitude || locations[locationIndex].longitude,
//         }
//       }
//     }

//     // Update doctor
//     const updatedDoctor = {
//       ...currentDoctor,
//       name: body.name || currentDoctor.name,
//       specialization: body.specialization || currentDoctor.specialization,
//       description: body.description || currentDoctor.description,
//       priceRange: body.priceRange || currentDoctor.priceRange,
//       image: body.image || currentDoctor.image,
//       url: body.url || currentDoctor.url,
//       rating: body.rating !== undefined ? body.rating : currentDoctor.rating,
//       updatedAt: new Date().toISOString(),
//       // Keep the existing address and location references
//       address: addresses.find((addr) => addr.id === currentDoctor.addressId),
//       location: locations.find((loc) => loc.id === currentDoctor.locationId),
//     }

//     doctors[doctorIndex] = updatedDoctor

//     return NextResponse.json({ message: "Doctor updated successfully", doctor: updatedDoctor })
//   } catch (error) {
//     console.error("Error updating doctor:", error)
//     return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   const id = params.id

//   // Find doctor index
//   const doctorIndex = doctors.findIndex((doc) => doc.id === id)

//   if (doctorIndex === -1) {
//     return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
//   }

//   // Remove doctor
//   doctors.splice(doctorIndex, 1)

//   return NextResponse.json({ message: "Doctor deleted successfully" })
// }
