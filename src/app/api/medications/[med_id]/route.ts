import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ med_id: string }> }
) {
  try {
    const data = await request.json();
    const { med_id } = await params;
    const updatedMedication = await prisma.medication.update({
      where: { med_id: med_id },
      data: {
        name: data.name,
        supplier: data.supplier,
        price: data.price,
        stock_quantity: data.stock_quantity,
      },
    });
    return NextResponse.json(updatedMedication);
  } catch (error) {
    console.error("Error updating medication:", error);
    return NextResponse.json(
      { error: "Failed to update medication" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ med_id: string }> }
) {
  try {
    const { med_id } = await params;
    await prisma.medication.delete({
      where: { med_id: med_id },
    });
    return NextResponse.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    return NextResponse.json(
      { error: "Failed to delete medication" },
      { status: 500 }
    );
  }
}
