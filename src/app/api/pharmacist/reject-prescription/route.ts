import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { prescription_id } = await req.json();

    // Mark prescription as processed (rejected)
    await prisma.prescription.update({
      where: { prescription_id },
      data: { processed: true },
    });

    return NextResponse.json(
      {
        message: "Prescription rejected successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting prescription:", error);
    return NextResponse.json(
      {
        error: "Failed to reject prescription",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
