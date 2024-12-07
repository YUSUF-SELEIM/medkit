import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, verifyToken } from "@/lib/auth";
import { prisma } from "../../../lib/prismaClient";

// GET all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        Medication_Order_Detail: true,
      },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST new order
export async function POST(request: NextRequest) {
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

    const pharmacistID = decodedToken.id;
    console.log("Pharmacist ID:", pharmacistID);

    const orderData = await request.json();

    const newOrder = await prisma.order.create({
      data: {
        supplier: orderData.supplier,
        status: orderData.status,
        pharmacist_id: pharmacistID,
        Medication_Order_Detail: {
          create: orderData.Medication_Order_Detail,
        },
      },
      include: {
        Medication_Order_Detail: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
