'use client'

import Link from "next/link";
import { redirect } from "next/navigation";
import { Space_Grotesk, Syne } from "next/font/google";
import styles from "../auth.module.css";
import { useState } from "react";

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



export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async function (event?: React.FormEvent) {
        event?.preventDefault();

        if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        console.log("Signup response:", response);

        if (response.ok) {
            alert("Account created successfully! Please log in.");
            // Redirect to login page after successful signup
            redirect("/login");
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    };

    return (
        <main className={`${styles.authPage} ${displayFont.variable} ${bodyFont.variable}`}>
            <section className={styles.authCard}>
                <aside className={styles.infoSide}>
                    <span className={styles.infoBadge}>Get Started</span>
                    <h1 className={styles.infoTitle}>Create your account in a clean flow.</h1>
                    <p className={styles.infoText}>
                        This is a visual prototype for signup only. Inputs and actions are present for
                        UI design without backend integration.
                    </p>
                    <ul className={styles.infoList}>
                        <li className={styles.infoItem}>Friendly onboarding composition</li>
                        <li className={styles.infoItem}>Consistent color and typography system</li>
                        <li className={styles.infoItem}>Ready for future auth wiring</li>
                    </ul>
                </aside>

                <div className={styles.formSide}>
                    <div className={styles.topLinks}>
                        <Link href="/" className={styles.topLink}>
                            Back to Home
                        </Link>
                    </div>

                    <h2 className={styles.formTitle}>Sign Up</h2>
                    <p className={styles.formSub}>Create your profile and personalize your chats.</p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.field}>
                            <span className={styles.label}>Full Name</span>
                            <input className={styles.input}
                                value={formData.fullname}
                                type="text"
                                placeholder="Your full name"
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                required />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Email</span>
                            <input
                                className={styles.input}
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                required
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Password</span>
                            <input
                                className={styles.input}
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Create password"
                                required
                                minLength={4}
                                maxLength={20}
                            />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Confirm Password</span>
                            <input
                                className={styles.input}
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm password"
                                required
                                minLength={4}
                                maxLength={20}
                            />
                        </label>

                        <button type="submit" className={styles.cta}>
                            Create Account
                        </button>
                    </form>

                    <p className={styles.altLink}>
                        Already have an account? <Link href="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
