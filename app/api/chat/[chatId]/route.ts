import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { chatId } = await params;

        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                userId: session.user.id,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                userId: true
            }
        })

        if (!chat) {
            return NextResponse.json({ error: "Chat Not Found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: chat
        })
    } catch (error) {
        console.error("GET chats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch chats",
            },
            { status: 500 }
        );
    }
}


export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { chatId } = await params;
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "message is required" }, { status: 400 })
        }

        const chat = await prisma.chat.update({
            where: {
                id: chatId,
                userId: session.user.id,
            },
            data: {
                message: {
                    create: [
                        {
                            content: message,
                            isUser: true
                        }
                    ]
                }
            },
            include: {
                message: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: chat
        })
    } catch (error) {
        console.error("GET chats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch chats",
            },
            { status: 500 }
        );
    }
}


export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { chatId } = await params;
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 })
        }

        const chat = await prisma.chat.update({
            where: {
                id: chatId,
                userId: session.user.id,
            },
            data: {
                title,
            },
        })

        return NextResponse.json({
            success: true,
            data: chat
        })
    } catch (error) {
        console.error("GET chats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch chats",
            },
            { status: 500 }
        );
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { chatId } = await params;

        const chat = await prisma.chat.delete({
            where: {
                id: chatId,
                userId: session.user.id,
            },
        })

        return NextResponse.json({
            success: true,
            data: chat
        })
    } catch (error) {
        console.error("Delete chats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete chat",
            },
            { status: 500 }
        );
    }
}
