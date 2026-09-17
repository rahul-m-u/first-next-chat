"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItemConfig {
    name: string;
    href: string;
    badge?: string;
    badgeType?: "default" | "active" | "alert";
    icon: React.ReactNode;
}

interface NavGroupConfig {
    title: string;
    items: NavItemConfig[];
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    const navGroups: NavGroupConfig[] = [
        {
            title: "Overview",
            items: [
                {
                    name: "Dashboard",
                    href: "/admin",
                    icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                    ),
                },
                {
                    name: "Conversations",
                    href: "/admin/chats",
                    badge: "24 New",
                    badgeType: "default",
                    icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    ),
                },
                {
                    name: "User Directory",
                    href: "/admin/users",
                    badge: "1.4k",
                    badgeType: "default",
                    icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    ),
                },
            ],
        },
        {
            title: "Intelligence & Safety",
            items: [
                {
                    name: "Analytics & Trends",
                    href: "/admin/analytics",
                    icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    ),
                },
                {
                    name: "Admin Settings",
                    href: "/admin/settings",
                    icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    ),
                },
            ],
        },
    ];

    return (
        <>
            {/* Mobile backdrop drawer overlay */}
            <div
                className={`${styles.mobileBackdrop} ${isOpen ? styles.mobileBackdropOpen : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
                {/* Sidebar Brand Header */}
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.brandWrap} onClick={onClose}>
                        <div className={styles.brandLogo}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div className={styles.brandMeta}>
                            <span className={styles.brandTitle}>Admin Center</span>
                            <span className={styles.brandBadge}>v2.4 Pro</span>
                        </div>
                    </Link>
                </div>

                {/* Sidebar Navigation Links */}
                <nav className={styles.sidebarNav}>
                    {navGroups.map((group) => (
                        <div key={group.title} className={styles.navGroup}>
                            <span className={styles.navGroupLabel}>{group.title}</span>
                            {group.items.map((item) => {
                                const isActive =
                                    item.href === "/admin"
                                        ? pathname === "/admin"
                                        : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                                        onClick={onClose}
                                    >
                                        <div className={styles.navItemLeft}>
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span
                                                className={`${styles.navBadge} ${isActive
                                                        ? styles.navBadgeActive
                                                        : item.badgeType === "alert"
                                                            ? styles.navBadgeAlert
                                                            : ""
                                                    }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}

                    {/* Quick Exit To Chat App */}
                    <div className={styles.navGroup}>
                        <span className={styles.navGroupLabel}>Shortcut</span>
                        <Link href="/chat" className={styles.navItem} onClick={onClose}>
                            <div className={styles.navItemLeft}>
                                <span className={styles.navIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </span>
                                <span>Return to Chat</span>
                            </div>
                        </Link>
                    </div>
                </nav>

                {/* User Card Profile in Sidebar Bottom */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.userCard}>
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                <span>AD</span>
                                <span className={styles.statusIndicator} title="Online" />
                            </div>
                            <div className={styles.userText}>
                                <span className={styles.userName}>Administrator</span>
                                <span className={styles.userRole}>Super Admin</span>
                            </div>
                        </div>
                        <Link
                            href="/chat"
                            className={styles.sidebarActionBtn}
                            title="Switch to Chat"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
