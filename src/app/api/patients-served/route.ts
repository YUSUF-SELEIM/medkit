import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prismaClient";

export async function GET() {
  try {
    // Get prescriptions from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const prescriptions = await prisma.prescription.findMany({
      where: {
        issue_date: {
          gte: oneWeekAgo,
        },
      },
      select: {
        issue_date: true,
        patient_id: true,
      },
    });

    // Group prescriptions by day
    const patientData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (day) => {
        const dayPatients = prescriptions.filter(
          (p) =>
            new Date(p.issue_date).toLocaleString("default", {
              weekday: "short",
            }) === day
        ).length;

        return { name: day, patients: dayPatients };
      }
    );

    return NextResponse.json({
      totalPatients: prescriptions.length,
      growthRate: 5, // This would typically be calculated based on previous week's data
      patientData: patientData,
    });
  } catch (error) {
    console.error("Error calculating patients served:", error);
    return NextResponse.json(
      { error: "Failed to calculate patients served" },
      { status: 500 }
    );
  }
}
