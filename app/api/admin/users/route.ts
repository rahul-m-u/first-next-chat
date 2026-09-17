import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        chats: true,
                    },
                },
            },
        });

        const formattedUsers = users.map((user) => ({
            ...user,
            conversationCount: user._count.chats,
            conversationsCount: user._count.chats,
        }));

        return NextResponse.json({
            success: true,
            data: formattedUsers,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch users",
            error: error
        }, { status: 500 });
    }
}
