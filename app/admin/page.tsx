"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

interface StatItem {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
}

interface RecentChat {
    id: string;
    title: string;
    participants: string;
    lastMessage: string;
    messageCount: number;
    status: "active" | "idle" | "flagged";
    updatedAt: string;
}

interface RecentUser {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Moderator" | "User";
    status: "Active" | "Pending" | "Suspended";
    joined: string;
}

export default function AdminDashboardPage() {
    const [chatFilter, setChatFilter] = useState<"all" | "active" | "flagged">("all");

    const stats: StatItem[] = [
        {
            label: "Total Registered Users",
            value: "14,820",
            change: "+12.5% this month",
            isPositive: true,
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            label: "Active Conversations",
            value: "1,248",
            change: "+8.2% vs yesterday",
            isPositive: true,
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
        {
            label: "Messages Sent Today",
            value: "89,410",
            change: "+24.8% peak",
            isPositive: true,
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },
        {
            label: "Flagged Content Items",
            value: "12",
            change: "-4.2% resolving",
            isPositive: false,
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            ),
        },
    ];

    const recentChats: RecentChat[] = [
        {
            id: "c1",
            title: "Product Architecture & Roadmap",
            participants: "Alex M., Sarah K., David R.",
            lastMessage: "Let's align the WebSocket retry schema for Next.js 16.",
            messageCount: 142,
            status: "active",
            updatedAt: "2 mins ago",
        },
        {
            id: "c2",
            title: "Design System Revamp 2026",
            participants: "Emma T., Liam N.",
            lastMessage: "Glassmorphic sidebar tokens are ready for inspection.",
            messageCount: 88,
            status: "active",
            updatedAt: "14 mins ago",
        },
        {
            id: "c3",
            title: "Security & Auth Sync",
            participants: "SecurityBot, Marcus W.",
            lastMessage: "Automated JWT rotation executed successfully without errors.",
            messageCount: 34,
            status: "idle",
            updatedAt: "45 mins ago",
        },
        {
            id: "c4",
            title: "Reported Channel #general-offtopic",
            participants: "User4901, User8812",
            lastMessage: "Potential spam pattern detected by automated moderation rule.",
            messageCount: 19,
            status: "flagged",
            updatedAt: "1 hour ago",
        },
    ];

    const recentUsers: RecentUser[] = [
        {
            id: "u1",
            name: "Elena Rostova",
            email: "elena.r@example.com",
            role: "Admin",
            status: "Active",
            joined: "Today, 10:14 AM",
        },
        {
            id: "u2",
            name: "Marcus Vance",
            email: "marcus.v@example.com",
            role: "Moderator",
            status: "Active",
            joined: "Yesterday",
        },
        {
            id: "u3",
            name: "Sophia Chen",
            email: "sophia.c@example.com",
            role: "User",
            status: "Active",
            joined: "2 days ago",
        },
        {
            id: "u4",
            name: "Tyler Harrison",
            email: "tyler.h@example.com",
            role: "User",
            status: "Pending",
            joined: "3 days ago",
        },
    ];

    const filteredChats =
        chatFilter === "all"
            ? recentChats
            : recentChats.filter((chat) => chat.status === chatFilter);

    return (
        <>
            {/* Top Banner */}
            <section className={styles.headerBanner}>
                <div className={styles.bannerTitleWrap}>
                    <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                    <p className={styles.pageSubtitle}>
                        Welcome back, Admin. Monitor platform health, user sessions, and real-time messaging activity.
                    </p>
                </div>

                <div className={styles.bannerActions}>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export Report
                    </button>
                    <Link href="/admin/users" className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Manage Users
                    </Link>
                </div>
            </section>

            {/* KPI Stats Grid */}
            <section className={styles.statsGrid}>
                {stats.map((stat, idx) => (
                    <div key={idx} className={styles.statCard}>
                        <div className={styles.statCardTop}>
                            <div className={styles.statIconWrap}>{stat.icon}</div>
                            <span
                                className={
                                    stat.isPositive
                                        ? styles.statBadgePositive
                                        : styles.statBadgeNegative
                                }
                            >
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Main Grid Content */}
            <div className={styles.dashboardGrid}>
                {/* Left Side: Tables & Activities */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Recent Conversations Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h2 className={styles.cardTitle}>Live Conversations</h2>
                                <span className={styles.cardSubtitle}>
                                    Real-time active channels and moderation status
                                </span>
                            </div>

                            <div className={styles.tabFilterGroup}>
                                <button
                                    type="button"
                                    className={`${styles.tabFilterBtn} ${chatFilter === "all" ? styles.tabFilterBtnActive : ""}`}
                                    onClick={() => setChatFilter("all")}
                                >
                                    All ({recentChats.length})
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.tabFilterBtn} ${chatFilter === "active" ? styles.tabFilterBtnActive : ""}`}
                                    onClick={() => setChatFilter("active")}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.tabFilterBtn} ${chatFilter === "flagged" ? styles.tabFilterBtnActive : ""}`}
                                    onClick={() => setChatFilter("flagged")}
                                >
                                    Flagged
                                </button>
                            </div>
                        </div>

                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Channel / Topic</th>
                                        <th>Participants</th>
                                        <th>Messages</th>
                                        <th>Status</th>
                                        <th>Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredChats.map((chat) => (
                                        <tr key={chat.id}>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ fontWeight: 600 }}>{chat.title}</span>
                                                    <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                                                        "{chat.lastMessage}"
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ color: "var(--admin-text-secondary)" }}>
                                                {chat.participants}
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 600 }}>{chat.messageCount}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.badge} ${chat.status === "active"
                                                        ? styles.badgeActive
                                                        : chat.status === "idle"
                                                            ? styles.badgePending
                                                            : styles.badgeFlagged
                                                        }`}
                                                >
                                                    {chat.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ color: "var(--admin-text-muted)", fontSize: "0.78rem" }}>
                                                {chat.updatedAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick User List Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h2 className={styles.cardTitle}>Recent User Registrations</h2>
                                <span className={styles.cardSubtitle}>
                                    Latest accounts joined on Rai Chat
                                </span>
                            </div>
                            <Link href="/admin/users" className={`${styles.btn} ${styles.btnSecondary}`} style={{ padding: "5px 12px", fontSize: "0.78rem" }}>
                                View All Directory
                            </Link>
                        </div>

                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className={styles.tableUserCell}>
                                                    <div className={styles.tableAvatar}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className={styles.tableUserMeta}>
                                                        <span className={styles.tableUserName}>{user.name}</span>
                                                        <span className={styles.tableUserEmail}>{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.badge} ${user.role === "Admin"
                                                        ? styles.badgeRoleAdmin
                                                        : styles.badgeRoleUser
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.badge} ${user.status === "Active"
                                                        ? styles.badgeActive
                                                        : styles.badgePending
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td style={{ color: "var(--admin-text-muted)", fontSize: "0.78rem" }}>
                                                {user.joined}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Side: Infrastructure Vitals & Audit Stream */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* System Vitals Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>System Vitals</h2>
                            <span className={styles.statBadgePositive}>Healthy</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "6px" }}>
                                    <span style={{ color: "var(--admin-text-secondary)" }}>API Gateway Latency</span>
                                    <span style={{ fontWeight: 700, color: "var(--admin-success)" }}>38ms (Fast)</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: "25%" }} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "6px" }}>
                                    <span style={{ color: "var(--admin-text-secondary)" }}>Database Pool Utilization</span>
                                    <span style={{ fontWeight: 700 }}>24%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: "24%" }} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "6px" }}>
                                    <span style={{ color: "var(--admin-text-secondary)" }}>Storage & Media Cache</span>
                                    <span style={{ fontWeight: 700 }}>4.8 GB / 50 GB</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: "12%" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Audit Stream Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Audit Activity Feed</h2>
                            <span className={styles.cardSubtitle}>Live Events</span>
                        </div>

                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon} style={{ background: "var(--admin-info-bg)", color: "var(--admin-info)" }}>
                                    🛡️
                                </div>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityText}>
                                        <strong>Elena Rostova</strong> granted Admin credentials.
                                    </span>
                                    <span className={styles.activityTime}>12 minutes ago</span>
                                </div>
                            </div>

                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon} style={{ background: "var(--admin-warning-bg)", color: "var(--admin-warning)" }}>
                                    ⚡
                                </div>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityText}>
                                        Automated rate limit triggered on IP <code>192.168.1.44</code>
                                    </span>
                                    <span className={styles.activityTime}>48 minutes ago</span>
                                </div>
                            </div>

                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon} style={{ background: "var(--admin-success-bg)", color: "var(--admin-success)" }}>
                                    📦
                                </div>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityText}>
                                        Automated database snapshot backup verified.
                                    </span>
                                    <span className={styles.activityTime}>2 hours ago</span>
                                </div>
                            </div>

                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon} style={{ background: "var(--admin-accent-glow)", color: "var(--admin-accent)" }}>
                                    ✨
                                </div>
                                <div className={styles.activityContent}>
                                    <span className={styles.activityText}>
                                        New channel <strong>#announcements</strong> created.
                                    </span>
                                    <span className={styles.activityTime}>5 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
