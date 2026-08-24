"use client";

import Link from "next/link";
import { Space_Grotesk, Syne } from "next/font/google";
import styles from "./home.module.css";
import { useSession } from "next-auth/react";

const displayFont = Syne({
    variable: "--font-landing-display",
    subsets: ["latin"],
    weight: ["600", "700", "800"],
});

const bodyFont = Space_Grotesk({
    variable: "--font-landing-body",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className={`${styles.page} ${displayFont.variable} ${bodyFont.variable}`}>
            <div className={styles.shell}>
                <section className={styles.hero}>
                    <div>
                        <h1 className={styles.heading}>Conversations, Designed With Personality.</h1>
                        <p className={styles.sub}>
                            A playful and modern UI prototype for your chat product. Smooth layout, clean
                            structure, and ready-to-style screens for auth and messaging.
                        </p>

                        <div className={styles.ctaRow}>

                            {session ? (
                                <Link href="/chat" className={styles.primary}>
                                    Go To Chat
                                </Link>
                            ) : (
                                <Link href="/login" className={styles.secondary}>
                                    Login / Sign Up
                                </Link>
                            )}

                        </div>

                        <div className={styles.featureGrid}>
                            <div className={styles.feature}>
                                <span className={styles.featureLabel}>Mood</span>
                                <span className={styles.featureValue}>Warm + Crisp</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureLabel}>Stack</span>
                                <span className={styles.featureValue}>Next.js App Router</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureLabel}>Backend</span>
                                <span className={styles.featureValue}>Next.js</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.previewCard}>
                        <h2 className={styles.previewTitle}>Live UI Snapshot</h2>
                        <p className={styles.previewSub}>
                            Quick visual of the conversation style used inside the chat route.
                        </p>
                        <div className={styles.previewThread}>
                            <div className={styles.bubble}>Can we keep the layout modern but friendly?</div>
                            <div className={styles.bubbleMine}>
                                Absolutely. I added strong type, gradient accents, and soft textures.
                            </div>
                            <div className={styles.bubble}>
                                Perfect. Let us add auth screens next.
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
