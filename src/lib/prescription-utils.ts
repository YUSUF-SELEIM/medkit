import { prisma } from "./prismaClient";

// Function to generate random medications for a prescription
export async function generateRandomPrescription(patientId: string) {
  // Fetch all available medications
  const medications = await prisma.medication.findMany({
    where: {
      stock_quantity: {
        gt: 0, // Only select medications with stock
      },
    },
  });

  // If no medications available, return null
  if (medications.length === 0) {
    return null;
  }

  // Select a random pharmacist
  const pharmacists = await prisma.pharmacist.findMany();
  if (pharmacists.length === 0) {
    throw new Error("No pharmacists available");
  }
  const randomPharmacist =
    pharmacists[Math.floor(Math.random() * pharmacists.length)];

  // Determine number of medications to prescribe (1-3)
  const medicationCount = Math.floor(Math.random() * 3) + 1;

  // Randomly select unique medications
  const selectedMedications = medications
    .sort(() => 0.5 - Math.random())
    .slice(0, medicationCount);

  // Create prescription
  const prescription = await prisma.prescription.create({
    data: {
      end_date: new Date(new Date().getTime() + (Math.floor(Math.random() * (90 - 7 + 1)) + 7) * 24 * 60 * 60 * 1000), // Random number of days between 7 and 90
      patient_id: patientId,
      pharmacist_id: randomPharmacist.id,
      Prescription_Medication: {
        create: selectedMedications.map((med) => ({
          med_id: med.med_id,
          dosage: `${Math.floor(Math.random() * 3) + 1}x daily`, // 1-3 times daily
          quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
        })),
      },
    },
    include: {
      Prescription_Medication: {
        include: {
          Medication: true,
        },
      },
    },
  });

  return prescription;
}
