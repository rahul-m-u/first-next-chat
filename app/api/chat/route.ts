import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const chats = await prisma.chat.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(
            {
                success: true,
                data: chats
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET chats error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error,
                message: "Failed to fetch chats",
            },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const chat = await prisma.chat.create({
            data: {
                userId: session.user.id
            }
        })

        return NextResponse.json({
            success: true,
            data: chat
        })

    } catch (error) {
        console.error('error creating chat : ', error)
        return NextResponse.json(
            {
                success: false,
                error: error,
                message: 'Failed to create chat'
            },
            { status: 500 }
        );
    }
}

