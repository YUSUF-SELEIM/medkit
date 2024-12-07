import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";

export async function GET() {
  try {
    // Fetch unprocessed prescriptions with related patient and medication details
    const pendingPrescriptions = await prisma.prescription.findMany({
      where: { processed: false },
      include: {
        Patient: true,
        Prescription_Medication: {
          include: {
            Medication: true,
          },
        },
      },
    });

    // Transform data to match our frontend interface
    const formattedPrescriptions = pendingPrescriptions.map((prescription) => ({
      prescription_id: prescription.prescription_id,
      patient_id: prescription.patient_id,
      patient_name: prescription.Patient.name,
      issue_date: prescription.issue_date.toISOString(),
      processed: prescription.processed,
      Prescription_Medication: prescription.Prescription_Medication.map(
        (pm) => ({
          med_id: pm.med_id,
          name: pm.Medication.name,
          quantity: pm.quantity,
        })
      ),
    }));

    return NextResponse.json(formattedPrescriptions, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
