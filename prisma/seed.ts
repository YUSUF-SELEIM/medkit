import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const password = "12345678aA!"; // The password to hash
const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds

async function seed() {
  try {
    // Create the two pharmacists
    await prisma.pharmacist.createMany({
      data: [
        {
          email: "AdminI@pharmacy.com",
          password: hashedPassword,
        },
        {
          email: "AdminII@pharmacy.com",
          password: hashedPassword,
        },
      ],
    });

    console.log("Pharmacists created successfully.");
  } catch (error) {
    console.error("Error creating pharmacists:", error);
  }
}

seed().catch((error) => {
  console.error("Error in seeding process:", error);
});
