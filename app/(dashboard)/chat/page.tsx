"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./chat.module.css";

type Contact = {
    id: string;
    name: string;
    lastSeen: string;
    colorA: string;
    colorB: string;
};

type ChatMessage = {
    id: string;
    author: "me" | "contact";
    text: string;
    time: string;
};

const contacts: Contact[] = [
    {
        id: "luna",
        name: "Luna Park",
        lastSeen: "active now",
        colorA: "#ff6b35",
        colorB: "#ef476f",
    },
    {
        id: "milo",
        name: "Milo Chen",
        lastSeen: "typing 2m ago",
        colorA: "#1982c4",
        colorB: "#3a86ff",
    },
    {
        id: "ada",
        name: "Ada Moreno",
        lastSeen: "last seen 9m ago",
        colorA: "#8ac926",
        colorB: "#4cc9f0",
    },
];

const initialThreads: Record<string, ChatMessage[]> = {
    luna: [
        {
            id: "l-1",
            author: "contact",
            text: "Can we make this chat UI feel less generic and more alive?",
            time: "09:14",
        },
        {
            id: "l-2",
            author: "me",
            text: "On it. Warm textures, strong typography, and bolder bubbles.",
            time: "09:16",
        },
    ],
    milo: [
        {
            id: "m-1",
            author: "contact",
            text: "Need a quick mock before lunch.",
            time: "11:03",
        },
    ],
    ada: [
        {
            id: "a-1",
            author: "contact",
            text: "Share the palette once you settle on one.",
            time: "08:44",
        },
    ],
};

const quickPrompts = [
    "Looks great, ship it",
    "Can you send the final mock?",
    "Let me refine the spacing",
];

function formatNow() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ChatPage() {
    const [activeContactId, setActiveContactId] = useState<string>(contacts[0].id);
    const [draft, setDraft] = useState("");
    const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(initialThreads);

    const activeContact = useMemo(() => {
        return contacts.find((contact) => contact.id === activeContactId) ?? contacts[0];
    }, [activeContactId]);

    const messages = threads[activeContactId] ?? [];

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = draft.trim();
        if (!text) {
            return;
        }

        const newMessage: ChatMessage = {
            id: `${activeContactId}-${Date.now()}`,
            author: "me",
            text,
            time: formatNow(),
        };

        setThreads((current) => ({
            ...current,
            [activeContactId]: [...(current[activeContactId] ?? []), newMessage],
        }));
        setDraft("");
    };

    return (
        <div className={styles.canvas}>
            <div className={styles.shell}>
                <aside className={styles.sidebar}>
                    <div className={styles.brand}>
                        <div>
                            <div className={styles.brandMark}>Q</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className={styles.brandTitle}>Quill Chat</div>
                            <span className={styles.brandSub}>Design-only prototype</span>
                        </div>
                        <span className={styles.badge}>No backend</span>
                    </div>

                    <input
                        type="search"
                        placeholder="Search conversations"
                        className={styles.search}
                        aria-label="Search conversations"
                    />

                    <ul className={styles.contactList}>
                        {contacts.map((contact) => {
                            const thread = threads[contact.id] ?? [];
                            const preview = thread[thread.length - 1]?.text ?? "No messages yet";
                            const unread = contact.id === activeContactId ? 0 : Math.min(thread.length, 3);

                            return (
                                <li key={contact.id}>
                                    <button
                                        type="button"
                                        className={styles.contactButton}
                                        data-active={contact.id === activeContactId}
                                        onClick={() => setActiveContactId(contact.id)}
                                    >
                                        <span
                                            className={styles.avatar}
                                            style={{
                                                background: `linear-gradient(135deg, ${contact.colorA}, ${contact.colorB})`,
                                            }}
                                        >
                                            {contact.name
                                                .split(" ")
                                                .map((part) => part[0])
                                                .join("")}
                                        </span>
                                        <div>
                                            <div className={styles.contactName}>{contact.name}</div>
                                            <span className={styles.contactSnippet}>{preview}</span>
                                        </div>
                                        <div className={styles.contactMeta}>
                                            <span className={styles.contactTime}>{contact.lastSeen}</span>
                                            {unread > 0 ? <span className={styles.unread}>{unread}</span> : null}
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <section className={styles.main}>
                    <header className={styles.topBar}>
                        <div className={styles.topIdentity}>
                            <span
                                className={styles.avatar}
                                style={{
                                    background: `linear-gradient(135deg, ${activeContact.colorA}, ${activeContact.colorB})`,
                                }}
                            >
                                {activeContact.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")}
                            </span>
                            <div>
                                <div className={styles.threadTitle}>{activeContact.name}</div>
                                <div className={styles.threadMeta}>{activeContact.lastSeen}</div>
                            </div>
                        </div>
                        <span className={styles.tag}>Visual Prototype</span>
                    </header>

                    <div className={styles.messagePane}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={styles.messageRow}
                                data-mine={message.author === "me"}
                            >
                                <article className={styles.message} data-mine={message.author === "me"}>
                                    <span className={styles.messageAuthor}>
                                        {message.author === "me" ? "You" : activeContact.name}
                                    </span>
                                    <p className={styles.messageText}>{message.text}</p>
                                    <span className={styles.messageTime}>{message.time}</span>
                                </article>
                            </div>
                        ))}
                    </div>

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

                        <form className={styles.composerForm} onSubmit={sendMessage}>
                            <input
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                placeholder="Write a message..."
                                className={styles.composerInput}
                            />
                            <button className={styles.sendButton} type="submit" disabled={!draft.trim()}>
                                Send
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
