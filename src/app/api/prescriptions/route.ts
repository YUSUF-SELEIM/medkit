import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prismaClient";
import { createErrorResponse, verifyToken } from "@/lib/auth";

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

    const patientId = decodedToken.id;
    console.log("Patient ID:", patientId);

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    // Fetch prescriptions for the authenticated patient
    const prescriptions = await prisma.prescription.findMany({
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
        issue_date: "desc", // Most recent prescriptions first
      },
    });

    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error) {
    console.error("Prescription fetch error:", error);

    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch prescriptions",
      500
    );
  } finally {
    // Disconnect Prisma client to prevent connection leaks
    await prisma.$disconnect();
  }
}
