"use client";

import { useState } from "react";
import styles from "../admin.module.css";

export default function AdminSettingsPage() {
    const [allowSignups, setAllowSignups] = useState(true);
    const [autoModerate, setAutoModerate] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(false);

    return (
        <>
            <section className={styles.headerBanner}>
                <div className={styles.bannerTitleWrap}>
                    <h1 className={styles.pageTitle}>Admin & Platform Settings</h1>
                    <p className={styles.pageSubtitle}>
                        Configure security controls, auto-moderation thresholds, and global platform parameters.
                    </p>
                </div>

                <div className={styles.bannerActions}>
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Save Changes
                    </button>
                </div>
            </section>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
                {/* General System Preferences */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2 className={styles.cardTitle}>General Platform Access</h2>
                            <span className={styles.cardSubtitle}>Control who can access and create chats</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Public User Registration</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)" }}>
                                    Allow new users to sign up via /signup
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={allowSignups}
                                onChange={(e) => setAllowSignups(e.target.checked)}
                                style={{ width: "18px", height: "18px", accentColor: "var(--admin-accent)", cursor: "pointer" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Automated Content Moderation</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)" }}>
                                    Auto-flag messages containing suspected spam or malicious links
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={autoModerate}
                                onChange={(e) => setAutoModerate(e.target.checked)}
                                style={{ width: "18px", height: "18px", accentColor: "var(--admin-accent)", cursor: "pointer" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Emergency Email Notifications</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)" }}>
                                    Send alert emails to Super Admins upon critical system events
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                                style={{ width: "18px", height: "18px", accentColor: "var(--admin-accent)", cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Security & Sessions */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2 className={styles.cardTitle}>Session Security & Limits</h2>
                            <span className={styles.cardSubtitle}>Token expiration and rate limit thresholds</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>
                                Max WebSocket Connections / User
                            </label>
                            <input
                                type="number"
                                defaultValue={5}
                                className={styles.searchInput}
                                style={{ width: "100%", paddingLeft: "14px" }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>
                                Message Rate Limit (per min)
                            </label>
                            <input
                                type="number"
                                defaultValue={60}
                                className={styles.searchInput}
                                style={{ width: "100%", paddingLeft: "14px" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
