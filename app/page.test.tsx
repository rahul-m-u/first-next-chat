import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";


vi.mock("next/font/google", () => ({
    Syne: () => ({
        variable: "--font-landing-display",
        subsets: ["latin"],
        weight: ["600", "700", "800"],
    }),
    Space_Grotesk: () => ({
        variable: "--font-landing-body",
        subsets: ["latin"],
        weight: ["400", "500", "700"],
    }),
}));


import Home from "./page";

describe("Home", () => {
    it("renders the main heading", () => {
        render(<Home />);
        const heading = screen.getByRole("heading", {
            name: /Conversations, Designed With Personality./i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("renders CTA buttons", () => {
        render(<Home />);

        expect(screen.getByRole("link", { name: /go to chat/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /login \/ sign up/i })).toBeInTheDocument();
    });
});
