"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "quill-theme";

export default function SiteHeader() {
    const [theme, setTheme] = useState<ThemeMode>("light");
    const { data: session } = useSession();

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
            document.documentElement.setAttribute("data-theme", stored);
            return;
        }

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme: ThemeMode = prefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
    }, []);

    const toggleTheme = () => {
        setTheme((current) => {
            const next: ThemeMode = current === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", next);
            window.localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    };

    return (
        <header className="siteHeader">
            <div className="siteHeaderInner">
                <Link href="/" className="siteBrand">
                    <span className="siteBrandMark">Q</span>
                    <span>Quill Chat</span>
                </Link>

                <div className="siteHeaderActions">
                    <nav className="siteNav" aria-label="Main navigation">
                        <Link href="/">Home</Link>
                        {session ? (
                            <>
                                <Link href="/chat">Chat</Link>
                                <form action={async () => await signOut()} method="POST">
                                    <button type="submit">Logout</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/login">Login</Link>
                                <Link href="/signup">Sign Up</Link>
                            </>
                        )}
                    </nav>

                    <button type="button" className="siteThemeSwitch" onClick={toggleTheme}>
                        {theme === "dark" ? "Light" : "Dark"} Theme
                    </button>
                </div>
            </div>
        </header>
    );
}
