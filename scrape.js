import fs from "fs/promises";
import * as cheerio from "cheerio";

async function scrapeDoctors(url) {
//   const html = await fs.readFile("./doctors.html", "utf8");
const res = await fetch(url);
const html = await res.text();

  const $ = cheerio.load(html);

  const doctors = [];

  $('script[type="application/ld+json"]').each((_, elem) => {
    const jsonText = $(elem).html();
    try {
      const data = JSON.parse(jsonText);

      // Only process if type is Physician
      if (data["@type"] === "Physician") {
        doctors.push({
          name: data.name || "",
          specialization: data.medicalSpecialty || "",
          description: data.description || "",
          priceRange: data.priceRange || 0,
          image: data.image || "",
          url: data.url || "",
          address: {
            locality: data.address?.addressLocality || "",
            region: data.address?.addressRegion || "",
          },
          location: {
            latitude: data.geo?.latitude || "",
            longitude: data.geo?.longitude || "",
          },
          rating: data.aggregateRating?.ratingValue || null, // sometimes empty
        });
      }
    } catch (error) {
      console.error("Failed parsing JSON:", error.message);
    }
  });

  return doctors;
}
let doctors = [];

for (let i = 1; i < 11; i++) {
  const pageDoctors = await scrapeDoctors(`https://www.apollo247.com/specialties/general-physician-internal-medicine?page=${i}`);
  doctors.push(...pageDoctors); // use spread to flatten
  console.log(`Scraping done for page ${i}, total doctors collected: ${doctors.length}`);
}

await fs.writeFile('doctors.json', JSON.stringify(doctors, null, 2));

