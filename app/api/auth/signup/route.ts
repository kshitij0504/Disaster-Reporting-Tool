//@ts-nocheck
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { email, password, name, role, recaptchaToken } = await request.json();

    if (!email || !password || !name || !recaptchaToken) {
      return NextResponse.json(
        { error: "Missing Required Fields" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY; // Add your secret key in the environment variables
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const recaptchaResponse = await axios.post(recaptchaUrl, null, {
      params: {
        secret: recaptchaSecret,
        response: recaptchaToken,
      },
    });

    const recaptchaSuccess = recaptchaResponse.data.success;
    if (!recaptchaSuccess) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role as "ADMIN" | "MODERATOR" | "USER",
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("SignUp Error: ", error);
    return NextResponse.json(
      {
        error: "Error Creating User",
      },
      {
        status: 500,
      }
    );
  }
}
