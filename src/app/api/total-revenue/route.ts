import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  try {
    const medicationRevenues = await prisma.prescription_Medication.findMany({
      where: {
        Prescription: {
          processed: true,
        },
      },
      include: {
        Medication: true,
      },
    });

    const medicationBreakdown = medicationRevenues.map((med) => ({
      name: med.Medication.name,
      revenue: Number(med.Medication.price) * med.quantity,
    }));

    const totalRevenue = medicationBreakdown.reduce(
      (total, med) => total + med.revenue,
      0
    );

    return NextResponse.json({
      totalRevenue: totalRevenue,
      medicationBreakdown: medicationBreakdown,
      salesData: [{ name: "Total", sales: Number(totalRevenue.toFixed(2)) }],
    });
  } catch (error) {
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Detailed Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });

      return NextResponse.json(
        {
          message: "Failed to calculate revenue",
          errorDetails: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);

      return NextResponse.json(
        {
          message: "Failed to calculate revenue",
          errorDetails: "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}
