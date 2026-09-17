"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface UserItem {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Moderator" | "Member";
    status: "Active" | "Pending" | "Suspended";
    conversationsCount: number;
    lastActive: string;
}

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Pending" | "Suspended">("all");

    const defaultUsers: UserItem[] = [
        {
            id: "u1",
            name: "Alex Morgan",
            email: "alex.morgan@example.com",
            role: "Admin",
            status: "Active",
            conversationsCount: 38,
            lastActive: "Just now",
        },
        {
            id: "u2",
            name: "Elena Rostova",
            email: "elena.r@example.com",
            role: "Admin",
            status: "Active",
            conversationsCount: 22,
            lastActive: "5 mins ago",
        },
        {
            id: "u3",
            name: "Marcus Vance",
            email: "marcus.v@example.com",
            role: "Moderator",
            status: "Active",
            conversationsCount: 15,
            lastActive: "1 hour ago",
        },
        {
            id: "u4",
            name: "Sophia Chen",
            email: "sophia.c@example.com",
            role: "Member",
            status: "Active",
            conversationsCount: 104,
            lastActive: "3 hours ago",
        },
        {
            id: "u5",
            name: "Tyler Harrison",
            email: "tyler.h@example.com",
            role: "Member",
            status: "Pending",
            conversationsCount: 0,
            lastActive: "Never",
        },
        {
            id: "u6",
            name: "Jordan Belford",
            email: "jordan.b@example.com",
            role: "Member",
            status: "Suspended",
            conversationsCount: 4,
            lastActive: "3 days ago",
        },
    ];

    const [users, setUsers] = useState<UserItem[]>([])

    const loadUsers = async () => {
        try {
            const response = await fetch("/api/admin/users");
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                console.log("====================================")
                console.log(result.data)
                console.log("====================================")
                setUsers(result.data);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <section className={styles.headerBanner}>
                <div className={styles.bannerTitleWrap}>
                    <h1 className={styles.pageTitle}>User Directory & Permissions</h1>
                    <p className={styles.pageSubtitle}>
                        Manage user accounts, assign roles, monitor activity, and handle security suspensions.
                    </p>
                </div>

                <div className={styles.bannerActions}>
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                        Invite New User
                    </button>
                </div>
            </section>

            {/* Filter and Search Bar Card */}
            <div className={styles.card} style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
                        <svg
                            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--admin-text-muted)" }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search user by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                            style={{ width: "100%", paddingLeft: "36px" }}
                        />
                    </div>

                    <div className={styles.tabFilterGroup}>
                        <button
                            type="button"
                            className={`${styles.tabFilterBtn} ${statusFilter === "all" ? styles.tabFilterBtnActive : ""}`}
                            onClick={() => setStatusFilter("all")}
                        >
                            All Users ({users.length})
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabFilterBtn} ${statusFilter === "Active" ? styles.tabFilterBtnActive : ""}`}
                            onClick={() => setStatusFilter("Active")}
                        >
                            Active
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabFilterBtn} ${statusFilter === "Pending" ? styles.tabFilterBtnActive : ""}`}
                            onClick={() => setStatusFilter("Pending")}
                        >
                            Pending
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabFilterBtn} ${statusFilter === "Suspended" ? styles.tabFilterBtnActive : ""}`}
                            onClick={() => setStatusFilter("Suspended")}
                        >
                            Suspended
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Data Table */}
            <div className={styles.card}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User Profile</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Conversations</th>
                                <th>Last Active</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className={styles.tableUserCell}>
                                            <div className={styles.tableAvatar}>
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className={styles.tableUserMeta}>
                                                <span className={styles.tableUserName}>{u.name}</span>
                                                <span className={styles.tableUserEmail}>{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.badge} ${u.role === "Admin"
                                                ? styles.badgeRoleAdmin
                                                : styles.badgeRoleUser
                                                }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.badge} ${u.status === "Active"
                                                ? styles.badgeActive
                                                : u.status === "Pending"
                                                    ? styles.badgePending
                                                    : styles.badgeFlagged
                                                }`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600 }}>{u.conversationsCount} chats</span>
                                    </td>
                                    <td style={{ color: "var(--admin-text-muted)", fontSize: "0.78rem" }}>
                                        {u.lastActive}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <div style={{ display: "inline-flex", gap: "8px" }}>
                                            <button
                                                type="button"
                                                className={`${styles.btn} ${styles.btnSecondary}`}
                                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                            >
                                                Edit
                                            </button>
                                            {u.status !== "Suspended" ? (
                                                <button
                                                    type="button"
                                                    className={`${styles.btn} ${styles.btnDanger}`}
                                                    style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={`${styles.btn} ${styles.btnSecondary}`}
                                                    style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                                >
                                                    Restore
                                                </button>
                                            )}
                                        </div>
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
