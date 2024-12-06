import { generateRandomPrescription } from "@/lib/prescription-utils"; // adjust path as needed
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prismaClient";

export async function POST(request: NextRequest) {
  try {
    // Extract patient ID from request body
    const { id } = await request.json();
    console.log("Patient ID:", id);
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: id },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Check if patient already has an unprocessed prescription
    const existingPrescription = await prisma.prescription.findFirst({
      where: {
        patient_id: id,
        processed: false,
      },
    });

    if (existingPrescription) {
      return NextResponse.json(
        {
          message: "Pending prescription already exists",
          prescription: existingPrescription,
        },
        { status: 200 }
      );
    }

    // Generate new prescription
    const newPrescription = await generateRandomPrescription(id);

    if (!newPrescription) {
      return NextResponse.json(
        { error: "Could not generate prescription" },
        { status: 500 }
      );
    }

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error("Prescription generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate prescription" },
      { status: 500 }
    );
  }
}
