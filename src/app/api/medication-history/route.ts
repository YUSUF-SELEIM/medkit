import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, verifyToken } from "@/lib/auth";
import { prisma } from "../../../lib/prismaClient";

export async function GET(request: NextRequest) {
  try {
    // Extract token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createErrorResponse(
        "Authorization header is missing or invalid",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the token and extract the patient ID
    const decodedToken = verifyToken(token);
    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.id) {
      return createErrorResponse("Invalid or expired token", 401);
    }

    // Extract patient ID from the decoded token
    const patientId = decodedToken.id;

    // Fetch medication history for the specific patient
    const medicationHistory = await prisma.prescription.findMany({
      where: {
        patient_id: patientId,
      },
      include: {
        Prescription_Medication: {
          include: {
            Medication: true, // Include medication details
          },
        },
      },
      orderBy: {
        issue_date: "desc", // Sort by most recent first
      },
    });

    // Transform the data to a more frontend-friendly format
    const formattedHistory = medicationHistory
      .map((prescription) =>
        prescription.Prescription_Medication.map((pm) => ({
          id: pm.med_id,
          name: pm.Medication.name,
          dosage: pm.dosage,
          quantity: pm.quantity,
          startDate: prescription.issue_date.toISOString(),
          endDate: prescription.end_date.toISOString(),
          processed: prescription.processed,
        }))
      )
      .flat();

    return NextResponse.json(formattedHistory, { status: 200 });
  } catch (error) {
    console.error("Error fetching medication history:", error);
    return NextResponse.json(
      { error: "Failed to fetch medication history" },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma Client to prevent connection leaks
    await prisma.$disconnect();
  }
}
