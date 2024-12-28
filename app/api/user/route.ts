import { NextResponse } from "next/server"; 
import { getServerSession } from "next-auth";
import { PrismaClient, Prisma, Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");

    const whereCondition: Prisma.UserWhereInput = {}; 
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      if (Object.values(Role).includes(role as Role)) {
        whereCondition.role = role as Role; // Cast to Role enum
      } else {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: { reports: true },
        },
      },
    });

    console.log("Fetched users:", users);
    return NextResponse.json(users);
  } catch (error: unknown) { // More specific error type
    console.error("Failed to fetch users:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") {
        return NextResponse.json(
          { error: "Cannot connect to the database. Please try again later." },
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
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    if (process.env.VERCEL) {
      await prisma.$disconnect();
    }
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) { // More specific error type
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Ensure the id is a valid number
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "User ID is required and must be a number" }, { status: 400 });
    }

    // Convert the id to a number
    const userId = Number(id);

    await prisma.user.delete({
      where: { id: userId }, // Use the number type for id
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  } finally {
    if (process.env.VERCEL) {
      await prisma.$disconnect();
    }
  }
}
