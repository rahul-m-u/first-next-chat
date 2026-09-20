import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { invokeRai } from "@/lib/agent";


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
                    error: "Unauthorized",
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { chatId } = await params;
        const messages = await prisma.message.findMany({
            where: { chatId: chatId },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return NextResponse.json({
            success: true,
            data: messages
        })
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json(
            {
                success: false,
                error: error,
                message: "Failed to fetch conversations",
            },
            { status: 500 }
        );
    }
}


export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
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

        const { chatId } = await params;
        const { message } = await request.json();

        let chat;

        chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        })

        if (!chat) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Chat not found",
                    message: "Chat not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Make sure the chat belongs to current user
        if (chat.userId !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Forbidden",
                    message: "You don't have access to this chat",
                },
                { status: 403 }
            );
        }

        // Set title for first message
        if (!chat.title) {
            chat = await prisma.chat.update({
                where: {
                    id: chatId,
                },
                data: {
                    title: message.substring(0, 50),
                },
            });
        }

        // Save user message
        await prisma.message.create({
            data: {
                content: message,
                isUser: true,
                chatId: chat.id,
            },
        });


        const readableStream = await invokeRai(message)

        const reader = readableStream.getReader();
        const decoder = new TextDecoder();

        let fullAIResponse = "";

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });

                        if (!chunk) continue;

                        fullAIResponse += chunk;

                        controller.enqueue(value)

                    }

                    const remaining = decoder.decode();

                    if (remaining) {
                        fullAIResponse += remaining;
                        controller.enqueue(new TextEncoder().encode(remaining));
                    }

                    // Save complete AI response
                    await prisma.message.create({
                        data: {
                            content: fullAIResponse,
                            isUser: false,
                            chatId: chat.id,
                        },
                    });

                    console.log(
                        "AI response saved:",
                        fullAIResponse
                    );

                    controller.close();
                } catch (error) {
                    console.error("Error while streaming AI response : ", error);
                    controller.error(error);
                }
            }
        })

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "Transfer-Encoding": "chunked",
            },
        })

    } catch (error) {
        console.error('error creating chat : ', error)
        return NextResponse.json(
            {
                success: false,
                error: error,
                message: 'Something went wrong!!'
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
                    error: "Unauthorized",
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
            return NextResponse.json(
                {
                    success: false,
                    error: "Title is required",
                    message: "Title is required"
                }, { status: 400 }
            )
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
                error: error,
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
                    error: "Unauthorized",
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
                error: error,
                message: "Failed to delete chat",
            },
            { status: 500 }
        );
    }
}
