import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prismaClient";

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Directly destructure id from context.params
    const { id } = context.params;

    // Parse the request body
    const data = await request.json();

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { order_id: id },
      data: {
        status: data.status,
        // Add other fields as necessary
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Directly destructure id from context.params
    const { id } = context.params;

    const order = await prisma.order.findUnique({
      where: { order_id: id },
      include: {
        Medication_Order_Detail: true, // Include related medication details if needed
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
