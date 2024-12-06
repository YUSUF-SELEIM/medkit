import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const medications = [
  {
    name: "Aspirin",
    supplier: "PharmaCo Distributors",
    price: 5.99,
    stock_quantity: 500,
  },
  {
    name: "Ibuprofen",
    supplier: "MedSup Inc",
    price: 7.5,
    stock_quantity: 350,
  },
  {
    name: "Amoxicillin",
    supplier: "GlobalMed Pharmaceuticals",
    price: 12.75,
    stock_quantity: 200,
  },
  {
    name: "Metformin",
    supplier: "DiabetesCare Pharma",
    price: 9.25,
    stock_quantity: 275,
  },
  {
    name: "Lisinopril",
    supplier: "CardioHealth Solutions",
    price: 11.5,
    stock_quantity: 225,
  },
];

async function main() {
  try {
    for (const med of medications) {
      await prisma.medication.create({
        data: {
          name: med.name,
          supplier: med.supplier,
          price: med.price,
          stock_quantity: med.stock_quantity,
        },
      });
    }
    console.log("Medications seeded successfully");
  } catch (error) {
    console.error("Error seeding medications:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
