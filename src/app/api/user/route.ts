import { NextResponse, NextRequest } from "next/server";
import { createErrorResponse, verifyToken } from "@/lib/auth";
import { prisma } from "../../../lib/prismaClient";

export async function GET(request: NextRequest) {
  console.log("Authorization Header:", request.headers.get("Authorization"));

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

    const userId = decodedToken.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("userId", userId);
    // Fetch patient or pharmacist based on userId
    const [patient, pharmacist] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: userId },
        include: {
          Prescription: true,
        },
      }),
      prisma.pharmacist.findUnique({
        where: { id: userId },
        include: {
          Prescription: true,
        },
      }),
    ]);

    if (patient) {
      return NextResponse.json(patient);
    }

    if (pharmacist) {
      return NextResponse.json(pharmacist);
    }

    // If neither user type is found, return a 404 error
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
