'use client';

import Link from "next/link";
import { Space_Grotesk, Syne } from "next/font/google";
import styles from "../auth.module.css";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const displayFont = Syne({
    variable: "--font-auth-display",
    subsets: ["latin"],
    weight: ["600", "700", "800"],
});

const bodyFont = Space_Grotesk({
    variable: "--font-auth-body",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

export default function LoginPage() {

    const router = useRouter();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password.");
                return;
            }

            router.push("/chat");
            router.refresh();
        } catch (error) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <main className={`${styles.authPage} ${displayFont.variable} ${bodyFont.variable}`}>
            <section className={styles.authCard}>
                <aside className={styles.infoSide}>
                    <span className={styles.infoBadge}>Welcome Back</span>
                    <h1 className={styles.infoTitle}>Sign in and continue your flow.</h1>
                    <p className={styles.infoText}>
                        This is a design-only login page. No backend auth is wired, so you can focus
                        on visual polish first.
                    </p>
                    <ul className={styles.infoList}>
                        <li className={styles.infoItem}>Fast entry layout with clear hierarchy</li>
                        <li className={styles.infoItem}>Mobile-ready responsive card design</li>
                        <li className={styles.infoItem}>Shared visual language with chat UI</li>
                    </ul>
                </aside>

                <div className={styles.formSide}>
                    <div className={styles.topLinks}>
                        <Link href="/" className={styles.topLink}>
                            Back to Home
                        </Link>
                    </div>

                    <h2 className={styles.formTitle}>Login</h2>
                    <p className={styles.formSub}>Enter your details to access your chat workspace.</p>

                    <form aria-label="form" className={styles.form} onSubmit={handleSubmit}>
                        {error && (
                            <p className={styles.error}>{error}</p>
                        )}
                        <label className={styles.field}>
                            <span className={styles.label}>Email</span>
                            <input
                                className={styles.input}
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Password</span>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </label>

                        <button type="submit" className={styles.cta} disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className={styles.altLink}>
                        New here? <Link href="/signup">Create an account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
