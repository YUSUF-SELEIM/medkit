import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createErrorResponse } from "@/lib/auth";
import { prisma } from "../../../../lib/prismaClient";

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

    // Fetch unprocessed prescriptions for the patient
    const pendingPrescriptions = await prisma.prescription.findMany({
      where: {
        patient_id: patientId,
        processed: false,
      },
      include: {
        Prescription_Medication: {
          include: {
            Medication: true,
          },
        },
      },
      orderBy: {
        issue_date: "desc",
      },
    });

    return NextResponse.json(pendingPrescriptions, { status: 200 });
  } catch (error) {
    console.error("Fetch pending prescriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
