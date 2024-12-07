import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  try {
    // Calculate total inventory value
    const medications = await prisma.medication.findMany();

    const totalInventoryValue = medications.reduce((total, med) => {
      return total + Number(med.price) * med.stock_quantity;
    }, 0);

    // Calculate inventory capacity (assuming max capacity is 100%)
    const totalCapacity = medications.reduce(
      (total, med) => total + med.stock_quantity,
      0
    );
    const maxPossibleCapacity = totalCapacity * 1.2; // Assuming 20% buffer
    const currentCapacityPercentage =
      (totalCapacity / maxPossibleCapacity) * 100;

    return NextResponse.json({
      totalValue: totalInventoryValue,
      uniqueProducts: medications.length,
      capacityPercentage: currentCapacityPercentage,
    });
  } catch (error) {
    console.error("Error calculating inventory value:", error);
    return NextResponse.json(
      { error: "Failed to calculate inventory value" },
      { status: 500 }
    );
  }
}
