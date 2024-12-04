import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";
import { comparePassword, generateToken } from "@/lib/auth";
import { LoginSchema } from "../../../../lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    // Validate input
    const { email, password, role } = LoginSchema.parse(body);

    // Determine which model to query based on role
    const user =
      role === "patient"
        ? await prisma.patient.findUnique({ where: { email } })
        : await prisma.pharmacist.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
