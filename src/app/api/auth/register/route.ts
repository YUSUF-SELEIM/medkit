import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";
import { hashPassword, generateToken } from "@/lib/auth";
import { PatientRegisterSchema } from "../../../../lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validatedData = PatientRegisterSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.patient.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const patient = await prisma.patient.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        DOB: new Date(validatedData.DOB),
      },
    });

    // Generate token
    const token = generateToken({
      id: patient.id,
      email: patient.email,
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: patient.id,
          email: patient.email,
          name: patient.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
