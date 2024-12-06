import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  try {
    const medications = await prisma.medication.findMany();
    return NextResponse.json(medications);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json(
      { error: "Failed to fetch medications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newMedication = await prisma.medication.create({
      data: {
        name: data.name,
        supplier: data.supplier,
        price: data.price,
        stock_quantity: data.stock_quantity,
      },
    });
    return NextResponse.json(newMedication, { status: 201 });
  } catch (error) {
    console.error("Error creating medication:", error);
    return NextResponse.json(
      { error: "Failed to create medication" },
      { status: 500 }
    );
  }
}
