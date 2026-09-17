"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "./admin-sidebar";
import styles from "./admin.module.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Helper to format breadcrumb title
    const getBreadcrumbTitle = () => {
        if (pathname === "/admin") return "Overview";
        if (pathname.includes("/admin/users")) return "User Directory";
        if (pathname.includes("/admin/chats")) return "Conversations";
        if (pathname.includes("/admin/analytics")) return "Analytics & Trends";
        if (pathname.includes("/admin/settings")) return "Settings";
        return "Admin";
    };

    return (
        <div className={styles.adminWrapper}>
            {/* Left-side Navigation Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                {/* Top Context & Actions Bar */}
                <header className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        {/* Mobile Hamburger Button */}
                        <button
                            type="button"
                            className={styles.mobileMenuBtn}
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            aria-label="Toggle navigation menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        {/* Breadcrumbs */}
                        <nav className={styles.breadcrumbWrap} aria-label="Breadcrumb">
                            <Link href="/admin" style={{ color: "inherit", textDecoration: "none" }}>
                                Admin
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                            <span className={styles.breadcrumbCurrent}>
                                {getBreadcrumbTitle()}
                            </span>
                        </nav>
                    </div>

                    <div className={styles.topBarRight}>
                        {/* Quick Search Box */}
                        <div className={styles.searchBox}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className={styles.searchInput}
                                aria-label="Admin search"
                            />
                            <span className={styles.searchKeyHint}>⌘K</span>
                        </div>

                        {/* Live System Indicator */}
                        <div className={styles.systemStatusPill}>
                            <span className={styles.statusDot} />
                            <span>System Live</span>
                        </div>
                    </div>
                </header>

                {/* Page Content View */}
                <div className={styles.pageBody}>{children}</div>
            </div>
        </div>
    );
}
