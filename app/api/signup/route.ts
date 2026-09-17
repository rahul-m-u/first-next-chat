import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    const { fullname, email, password, confirmPassword } = await request.json();

    if (!fullname || !email || !password || !confirmPassword) {
        return NextResponse.json({
            success: false,
            message: "Please fill in all fields."
        }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({
            success: false,
            message: "Please enter a valid email address."
        }, { status: 400 });
    }

    if (password !== confirmPassword) {
        return NextResponse.json({
            success: false,
            message: "Passwords do not match!"
        }, { status: 400 });
    }

    if (confirmPassword.length < 4 || confirmPassword.length > 20) {
        return NextResponse.json({
            success: false,
            message: "Password must be between 4 and 20 characters."
        }, { status: 400 });
    }

    try {

        const hashedPassword = await bcrypt.hash(confirmPassword, 12);

        const user = await prisma.user.create({
            data: {
                name: fullname,
                email: email,
                password: hashedPassword,
            }
        });
        return NextResponse.json({
            success: true,
            message: "User created successfully",
            user: user
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error creating user",
            error: error
        }, { status: 500 });
    }
}
