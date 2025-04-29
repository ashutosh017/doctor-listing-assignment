import { prisma } from "./index.js";
import {doctors} from '../doctors.js'
async function main() {
  console.log(doctors.length)

  for (const doctor of doctors) {
    await prisma.doctor.create({
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
    console.log(`Inserted doctor: ${doctor.name}`);
  }
}
main()
  .then(async () => {
    console.log('✅ Seeding complete');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
