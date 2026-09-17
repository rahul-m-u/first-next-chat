"use client";

import { useState } from "react";
import styles from "../admin.module.css";

interface ConversationItem {
    id: string;
    name: string;
    type: "Direct" | "Group" | "Public";
    participantsCount: number;
    messageTotal: number;
    flaggedCount: number;
    created: string;
    lastActive: string;
}

export default function AdminChatsPage() {
    const [filterType, setFilterType] = useState<"all" | "Direct" | "Group" | "Flagged">("all");

    const conversations: ConversationItem[] = [
        {
            id: "ch-101",
            name: "Engineering & Frontend Sync",
            type: "Group",
            participantsCount: 8,
            messageTotal: 342,
            flaggedCount: 0,
            created: "Jan 12, 2026",
            lastActive: "4 mins ago",
        },
        {
            id: "ch-102",
            name: "Alex Morgan & Elena Rostova",
            type: "Direct",
            participantsCount: 2,
            messageTotal: 96,
            flaggedCount: 0,
            created: "Feb 01, 2026",
            lastActive: "12 mins ago",
        },
        {
            id: "ch-103",
            name: "Community General Hub",
            type: "Public",
            participantsCount: 1420,
            messageTotal: 8412,
            flaggedCount: 3,
            created: "Nov 15, 2025",
            lastActive: "Just now",
        },
        {
            id: "ch-104",
            name: "Flagged Spam Review #402",
            type: "Direct",
            participantsCount: 2,
            messageTotal: 14,
            flaggedCount: 5,
            created: "Today",
            lastActive: "1 hour ago",
        },
    ];

    const filtered = conversations.filter((c) => {
        if (filterType === "all") return true;
        if (filterType === "Flagged") return c.flaggedCount > 0;
        return c.type === filterType;
    });

    return (
        <>
            <section className={styles.headerBanner}>
                <div className={styles.bannerTitleWrap}>
                    <h1 className={styles.pageTitle}>Conversations & Chat Moderation</h1>
                    <p className={styles.pageSubtitle}>
                        Inspect channels, review moderation flags, message volumes, and enforce chat policies.
                    </p>
                </div>

                <div className={styles.bannerActions}>
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Audit Channels
                    </button>
                </div>
            </section>

            {/* Filter Tabs */}
            <div className={styles.card} style={{ padding: "14px 20px" }}>
                <div className={styles.tabFilterGroup}>
                    <button
                        type="button"
                        className={`${styles.tabFilterBtn} ${filterType === "all" ? styles.tabFilterBtnActive : ""}`}
                        onClick={() => setFilterType("all")}
                    >
                        All Channels ({conversations.length})
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabFilterBtn} ${filterType === "Group" ? styles.tabFilterBtnActive : ""}`}
                        onClick={() => setFilterType("Group")}
                    >
                        Group Chats
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabFilterBtn} ${filterType === "Direct" ? styles.tabFilterBtnActive : ""}`}
                        onClick={() => setFilterType("Direct")}
                    >
                        Direct Messages
                    </button>
                    <button
                        type="button"
                        className={`${styles.tabFilterBtn} ${filterType === "Flagged" ? styles.tabFilterBtnActive : ""}`}
                        onClick={() => setFilterType("Flagged")}
                    >
                        Flagged for Review
                    </button>
                </div>
            </div>

            {/* Conversations Table */}
            <div className={styles.card}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Channel Name & ID</th>
                                <th>Type</th>
                                <th>Members</th>
                                <th>Messages</th>
                                <th>Safety Status</th>
                                <th>Last Active</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                                            <span style={{ fontSize: "0.74rem", color: "var(--admin-text-muted)" }}>
                                                ID: {c.id}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.badgeRoleUser}`}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600 }}>{c.participantsCount}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600 }}>{c.messageTotal}</span>
                                    </td>
                                    <td>
                                        {c.flaggedCount > 0 ? (
                                            <span className={`${styles.badge} ${styles.badgeFlagged}`}>
                                                ⚠️ {c.flaggedCount} Flags
                                            </span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.badgeActive}`}>
                                                ✓ Clean
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ color: "var(--admin-text-muted)", fontSize: "0.78rem" }}>
                                        {c.lastActive}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            type="button"
                                            className={`${styles.btn} ${styles.btnSecondary}`}
                                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                        >
                                            Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
