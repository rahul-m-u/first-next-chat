"use client";

import styles from "../admin.module.css";

export default function AdminAnalyticsPage() {
    const metricCards = [
        { title: "Daily Active Users (DAU)", value: "8,940", change: "+14.2%", positive: true },
        { title: "Avg. Session Duration", value: "24m 18s", change: "+6.8%", positive: true },
        { title: "Peak Concurrent Connections", value: "3,120", change: "+22.5%", positive: true },
        { title: "Failed Auth Attempts", value: "48", change: "-18.0%", positive: true },
    ];

    const hourlyTraffic = [
        { hour: "00:00", value: 30 },
        { hour: "04:00", value: 15 },
        { hour: "08:00", value: 65 },
        { hour: "12:00", value: 95 },
        { hour: "16:00", value: 85 },
        { hour: "20:00", value: 100 },
    ];

    return (
        <>
            <section className={styles.headerBanner}>
                <div className={styles.bannerTitleWrap}>
                    <h1 className={styles.pageTitle}>Analytics & Platform Telemetry</h1>
                    <p className={styles.pageSubtitle}>
                        Track engagement trends, real-time concurrent active sockets, and message throughput.
                    </p>
                </div>

                <div className={styles.bannerActions}>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>
                        Last 30 Days
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Download Metrics CSV
                    </button>
                </div>
            </section>

            {/* Metrics Grid */}
            <section className={styles.statsGrid}>
                {metricCards.map((m, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statCardTop}>
                            <span className={styles.statLabel}>{m.title}</span>
                            <span className={m.positive ? styles.statBadgePositive : styles.statBadgeNegative}>
                                {m.change}
                            </span>
                        </div>
                        <div className={styles.statValue}>{m.value}</div>
                    </div>
                ))}
            </section>

            {/* Visual Analytics Grid */}
            <div className={styles.dashboardGrid}>
                {/* Hourly Volume Visual */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2 className={styles.cardTitle}>24-Hour Message Throughput</h2>
                            <span className={styles.cardSubtitle}>Volume distribution across time zones</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "200px", padding: "20px 10px 0" }}>
                        {hourlyTraffic.map((t, idx) => (
                            <div
                                key={idx}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "8px",
                                    height: "100%",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: `${t.value}%`,
                                        background: "var(--admin-accent-gradient)",
                                        borderRadius: "6px 6px 0 0",
                                        transition: "height 300ms ease",
                                    }}
                                />
                                <span style={{ fontSize: "0.72rem", color: "var(--admin-text-muted)" }}>
                                    {t.hour}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Platforms Breakdown */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Client Distribution</h2>
                        <span className={styles.cardSubtitle}>Active OS / Devices</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "6px" }}>
                                <span>Desktop (Web & Electron)</span>
                                <span style={{ fontWeight: 700 }}>58%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: "58%" }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "6px" }}>
                                <span>Mobile Web (iOS & Android)</span>
                                <span style={{ fontWeight: 700 }}>34%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: "34%" }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "6px" }}>
                                <span>API & Bots / Integrations</span>
                                <span style={{ fontWeight: 700 }}>8%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: "8%" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
