import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ReportStatus, ReportType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";  // Import Prisma error types

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Detailed session logging

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ReportStatus | null;
    const type = searchParams.get("type") as ReportType | null;

    const where = {
      ...(status && { status }),
      ...(type && { type }),
    };

    const reports = await prisma.report.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        reportId: true,
        type: true,
        title: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        userId: true,  // Include userId if needed
        user: {  // Use include within select to include user fields
          select: {
            id: true,
            name: true, // Example fields from user
          },
        },
      },
    });

    console.log("Fetched reports:", reports); // Log the reports
    console.log("Reports count:", reports.length); // Log the number of reports

    return NextResponse.json(reports);
  } catch (error: unknown) {
    console.error("Failed to fetch reports:", error);

    // Handle the error safely
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") {
        return NextResponse.json(
          { error: "Cannot connect to database. Please try again later." },
          { status: 503 }
        );
      }

      if (error.code === "P2024") {
        return NextResponse.json(
          { error: "Database connection timeout. Please try again." },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  } finally {
    // Optional: Disconnect for serverless environments
    if (process.env.VERCEL) {
      await prisma.$disconnect();
    }
  }
}
