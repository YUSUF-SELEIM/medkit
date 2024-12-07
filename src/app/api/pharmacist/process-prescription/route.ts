import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { prescription_id, medications } = await req.json();

    // Use transaction to ensure atomic updates
    const result = await prisma.$transaction(async (prisma) => {
      // Mark prescription as processed
      await prisma.prescription.update({
        where: { prescription_id },
        data: { processed: true },
      });

      // Update medication stocks and calculate total revenue
      let totalRevenue = 0;
      for (const med of medications) {
        // Find medication details
        const medication = await prisma.medication.findUnique({
          where: { med_id: med.med_id },
        });

        if (!medication) {
          throw new Error(`Medication ${med.med_id} not found`);
        }

        // Check if sufficient stock
        if (medication.stock_quantity < med.quantity) {
          throw new Error(`Insufficient stock for ${medication.name}`);
        }

        // Deduct stock and calculate revenue
        await prisma.medication.update({
          where: { med_id: med.med_id },
          data: {
            stock_quantity: { decrement: med.quantity },
          },
        });

        // Calculate revenue for this medication
        totalRevenue += Number(medication.price) * med.quantity;
      }

      return { totalRevenue };
    });

    return NextResponse.json(
      {
        message: "Prescription processed successfully",
        revenue: result.totalRevenue,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing prescription:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process prescription",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
