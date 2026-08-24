"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./chat.module.css";

interface Chat {
    id: string;
    title: string | null;
    createdAt: string;
    userId?: string | null;
    message?: Conversation[];
}

interface Conversation {
    id: string;
    content: string;
    isUser: boolean;
    chatId: string | null;
    createdAt: string;
}

const promptCards = [
    {
        id: "brainstorm",
        icon: "💡",
        title: "Brainstorm Ideas",
        desc: "Fresh product concepts, marketing angles, or creative names",
        prompt: "Brainstorm 5 innovative startup ideas in the AI productivity space",
    },
    {
        id: "draft",
        icon: "✍️",
        title: "Draft Content",
        desc: "Craft polished emails, blog posts, outlines, or proposals",
        prompt: "Help me draft a friendly and professional follow-up email after a client pitch",
    },
    {
        id: "code",
        icon: "⚡",
        title: "Code & Debug",
        desc: "Explain tricky algorithms, architecture patterns, or fix bugs",
        prompt: "Explain how React 19 Server Actions work and when to use them",
    },
    {
        id: "summarize",
        icon: "🎯",
        title: "Analyze & Summarize",
        desc: "Distill complex topics, meeting notes, or long documentation",
        prompt: "Summarize the key advantages and trade-offs of using PostgreSQL with Prisma ORM",
    },
];

const quickPrompts = [
    "Tell me more",
    "Can you give an example?",
    "Make it more concise",
    "Explain step-by-step",
];

const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #ff6b35, #ef476f)",
    "linear-gradient(135deg, #1982c4, #3a86ff)",
    "linear-gradient(135deg, #8ac926, #4cc9f0)",
    "linear-gradient(135deg, #8b5cf6, #ec4899)",
    "linear-gradient(135deg, #f59e0b, #d97706)",
    "linear-gradient(135deg, #06b6d4, #3b82f6)",
];

function getAvatarGradient(text: string = "") {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
}

function getInitials(title: string | null = "") {
    if (!title) return "Q";
    const parts = title.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelativeTime(dateStr: string) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

function formatMessageTime(dateStr: string) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
}

export default function ChatPage() {
    const [activeChatId, setActiveChatId] = useState<string>("");
    const [draft, setDraft] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [chats, setChats] = useState<Chat[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversations, isSubmitting]);

    const getChats = async () => {
        try {
            setIsLoadingChats(true);
            const response = await fetch("/api/chat");
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                setChats(result.data);
            }
        } catch (error) {
            console.error("Failed to load chats:", error);
        } finally {
            setIsLoadingChats(false);
        }
    };

    useEffect(() => {
        getChats();
    }, []);

    const activeChat = useMemo(() => {
        return chats.find((chat) => chat.id === activeChatId);
    }, [chats, activeChatId]);

    const getConversations = async (chatId: string) => {
        if (!chatId) {
            setConversations([]);
            return;
        }

        try {
            setIsLoadingMessages(true);
            const response = await fetch(`/api/chat/${chatId}/conversations`);
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                setConversations(result.data);
            } else {
                setConversations([]);
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
            setConversations([]);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (activeChatId) {
            getConversations(activeChatId);
        } else {
            setConversations([]);
        }
    }, [activeChatId]);

    const filteredChats = useMemo(() => {
        if (!searchQuery.trim()) return chats;
        const query = searchQuery.toLowerCase();
        return chats.filter((chat) => (chat.title || "Untitled").toLowerCase().includes(query));
    }, [chats, searchQuery]);

    const handleStartNewConversation = () => {
        setActiveChatId("");
        setConversations([]);
        setDraft("");
    };

    const handlePromptCardClick = (promptText: string) => {
        setDraft(promptText);
    };

    const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = draft.trim();
        if (!text || isSubmitting) return;

        setIsSubmitting(true);

        // Case 1: Starting a NEW conversation
        if (!activeChatId) {
            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text }),
                });

                const result = await response.json();
                if (result.success && result.data) {
                    const newChat: Chat = result.data;
                    setChats((prev) => [newChat, ...prev]);
                    setActiveChatId(newChat.id);
                    setConversations(newChat.message || [
                        {
                            id: `temp-${Date.now()}`,
                            content: text,
                            isUser: true,
                            chatId: newChat.id,
                            createdAt: new Date().toISOString(),
                        },
                    ]);
                    setDraft("");
                } else if (result.chatId) {
                    await getChats();
                    setActiveChatId(result.chatId);
                    setDraft("");
                }
            } catch (error) {
                console.error("Error creating new chat:", error);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Case 2: Appending to an EXISTING conversation
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: Conversation = {
            id: tempId,
            content: text,
            isUser: true,
            chatId: activeChatId,
            createdAt: new Date().toISOString(),
        };

        setConversations((prev) => [...prev, optimisticMsg]);
        setDraft("");

        try {
            const response = await fetch(`/api/chat/${activeChatId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            const result = await response.json();
            if (result.success && result.data?.message) {
                setConversations(result.data.message);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteChat = async (e: MouseEvent, chatIdToDelete: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this conversation?")) return;

        try {
            const res = await fetch(`/api/chat/${chatIdToDelete}`, {
                method: "DELETE",
            });
            const result = await res.json();
            if (result.success) {
                setChats((prev) => prev.filter((c) => c.id !== chatIdToDelete));
                if (activeChatId === chatIdToDelete) {
                    handleStartNewConversation();
                }
            }
        } catch (error) {
            console.error("Failed to delete chat:", error);
        }
    };

    return (
        <div className={styles.canvas}>
            <div className={styles.shell} id="shell">
                {/* ================= SIDEBAR ================= */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.sidebarTitleGroup}>
                            <span className={styles.sidebarTitle}>Conversations</span>
                            <span className={styles.chatCountBadge}>{chats.length}</span>
                        </div>
                    </div>

                    {/* NEW CONVERSATION BUTTON */}
                    <button
                        type="button"
                        className={styles.newChatButton}
                        data-active={!activeChatId}
                        onClick={handleStartNewConversation}
                        aria-label="Start a new conversation"
                    >
                        <svg
                            className={styles.newChatIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>New Conversation</span>
                    </button>

                    {/* SEARCH INPUT */}
                    <div className={styles.searchWrapper}>
                        <svg
                            className={styles.searchIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className={styles.search}
                            aria-label="Search conversations"
                        />
                    </div>

                    {/* CONVERSATION LIST */}
                    <ul className={styles.contactList}>
                        {isLoadingChats ? (
                            <div className={styles.emptySidebar}>
                                <div className={styles.typingIndicator}>
                                    <span className={styles.dot}></span>
                                    <span className={styles.dot}></span>
                                    <span className={styles.dot}></span>
                                </div>
                                <span className={styles.emptySidebarSubtext}>Loading chats...</span>
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <div className={styles.emptySidebar}>
                                <div className={styles.emptySidebarIcon}>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <span className={styles.emptySidebarText}>
                                    {searchQuery ? "No matches found" : "No conversations yet"}
                                </span>
                                <span className={styles.emptySidebarSubtext}>
                                    {searchQuery
                                        ? "Try a different search term"
                                        : "Click 'New Conversation' above to start your first chat!"}
                                </span>
                            </div>
                        ) : (
                            filteredChats.map((chat) => {
                                const title = chat.title || "Untitled Conversation";
                                const initials = getInitials(title);
                                const gradient = getAvatarGradient(title + chat.id);
                                const timeStr = formatRelativeTime(chat.createdAt);

                                return (
                                    <li key={chat.id} className={styles.contactItem}>
                                        <button
                                            type="button"
                                            className={styles.contactButton}
                                            data-active={chat.id === activeChatId}
                                            onClick={() => setActiveChatId(chat.id)}
                                        >
                                            <span
                                                className={styles.avatar}
                                                style={{ background: gradient }}
                                            >
                                                {initials}
                                            </span>
                                            <div className={styles.contactInfo}>
                                                <div className={styles.contactName} title={title}>
                                                    {title}
                                                </div>
                                                <span className={styles.contactSnippet}>
                                                    Click to view discussion
                                                </span>
                                            </div>
                                            <div className={styles.contactMeta}>
                                                <span className={styles.contactTime}>{timeStr}</span>
                                                <button
                                                    type="button"
                                                    className={styles.deleteChatButton}
                                                    title="Delete conversation"
                                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </aside>

                {/* ================= MAIN DISPLAY ================= */}
                {!activeChatId ? (
                    /* CASE 1: NEW CONVERSATION SCREEN */
                    <section className={styles.newConversationView}>
                        <div className={styles.heroContent}>
                            <div className={styles.heroBadge}>
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    <line x1="9" y1="10" x2="15" y2="10"></line>
                                    <line x1="12" y1="7" x2="12" y2="13"></line>
                                </svg>
                            </div>

                            <div className={styles.heroTextGroup}>
                                <h1 className={styles.heroTitle}>
                                    Start a <span className={styles.heroTitleHighlight}>New Conversation</span>
                                </h1>
                                <p className={styles.heroSubtitle}>
                                    Ask a question, brainstorm creative ideas, draft content, or pick a starter prompt below to begin.
                                </p>
                            </div>

                            {/* PROMPT SUGGESTION CARDS */}
                            <div className={styles.promptGrid}>
                                {promptCards.map((card) => (
                                    <button
                                        key={card.id}
                                        type="button"
                                        className={styles.promptCard}
                                        onClick={() => handlePromptCardClick(card.prompt)}
                                    >
                                        <div className={styles.promptCardHeader}>
                                            <span className={styles.promptCardIcon}>{card.icon}</span>
                                            <span className={styles.promptCardTitle}>{card.title}</span>
                                        </div>
                                        <span className={styles.promptCardDesc}>{card.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {/* HERO COMPOSER */}
                            <div className={styles.heroComposerWrapper}>
                                <form className={styles.composerForm} onSubmit={handleSendMessage}>
                                    <input
                                        value={draft}
                                        onChange={(event) => setDraft(event.target.value)}
                                        placeholder="Type your message to begin a new conversation..."
                                        className={styles.composerInput}
                                        autoFocus
                                    />
                                    <button
                                        className={styles.sendButton}
                                        type="submit"
                                        disabled={!draft.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span>Starting...</span>
                                        ) : (
                                            <>
                                                <span>Send</span>
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : (
                    /* CASE 2: ACTIVE CONVERSATION SCREEN */
                    <section className={styles.main}>
                        <header className={styles.topBar}>
                            <div className={styles.topIdentity}>
                                <span
                                    className={styles.avatar}
                                    style={{
                                        background: getAvatarGradient(
                                            (activeChat?.title || "Chat") + activeChat?.id
                                        ),
                                    }}
                                >
                                    {getInitials(activeChat?.title || "Chat")}
                                </span>
                                <div className={styles.topInfo}>
                                    <div className={styles.threadTitle}>
                                        {activeChat?.title || "Conversation"}
                                    </div>
                                    <div className={styles.threadMetaGroup}>
                                        <span className={styles.onlineIndicator}></span>
                                        <span className={styles.threadMeta}>
                                            Created {formatRelativeTime(activeChat?.createdAt || "")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.topActions}>
                                <button
                                    type="button"
                                    className={styles.topNewChatButton}
                                    onClick={handleStartNewConversation}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    <span>New Chat</span>
                                </button>
                            </div>
                        </header>

                        {/* MESSAGE PANE */}
                        <div className={styles.messagePane}>
                            {isLoadingMessages ? (
                                <div className={styles.emptyThreadNotice}>
                                    <div className={styles.typingIndicator} style={{ margin: "0 auto" }}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                    </div>
                                    <p style={{ marginTop: "10px" }}>Loading messages...</p>
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className={styles.emptyThreadNotice}>
                                    <p>No messages in this chat yet. Send a message below to get started!</p>
                                </div>
                            ) : (
                                conversations.map((conversation) => {
                                    const time = formatMessageTime(conversation.createdAt);
                                    const isMe = conversation.isUser;

                                    return (
                                        <div
                                            key={conversation.id}
                                            className={styles.messageRow}
                                            data-mine={isMe}
                                        >
                                            {!isMe && (
                                                <span
                                                    className={styles.messageAvatar}
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, #10b981, #06b6d4)",
                                                    }}
                                                >
                                                    AI
                                                </span>
                                            )}
                                            <article className={styles.message} data-mine={isMe}>
                                                <span className={styles.messageAuthor}>
                                                    {isMe ? "You" : "Quill Assistant"}
                                                </span>
                                                <p className={styles.messageText}>{conversation.content}</p>
                                                {time && <span className={styles.messageTime}>{time}</span>}
                                            </article>
                                            {isMe && (
                                                <span
                                                    className={styles.messageAvatar}
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, #ff6b35, #ef476f)",
                                                    }}
                                                >
                                                    You
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {isSubmitting && (
                                <div className={styles.messageRow} data-mine={false}>
                                    <span
                                        className={styles.messageAvatar}
                                        style={{
                                            background: "linear-gradient(135deg, #10b981, #06b6d4)",
                                        }}
                                    >
                                        AI
                                    </span>
                                    <div className={styles.typingIndicator}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ACTIVE CHAT COMPOSER */}
                        <div className={styles.composer}>
                            <div className={styles.chipRow}>
                                {quickPrompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        type="button"
                                        className={styles.chip}
                                        onClick={() => setDraft(prompt)}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>

                            <form className={styles.composerForm} onSubmit={handleSendMessage}>
                                <input
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    placeholder="Write a reply..."
                                    className={styles.composerInput}
                                    autoFocus
                                />
                                <button
                                    className={styles.sendButton}
                                    type="submit"
                                    disabled={!draft.trim() || isSubmitting}
                                >
                                    <span>Send</span>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
