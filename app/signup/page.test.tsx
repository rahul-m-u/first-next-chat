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


import SignupPage from "./page";


describe("SignupPage", () => {

    it("render the main heading", () => {
        render(<SignupPage />);
        const heading = screen.getByRole("heading", {
            name: /Sign Up/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("render the form fields", () => {
        render(<SignupPage />);
        const fullnameField = screen.getByLabelText(/Full Name/i);
        const emailField = screen.getByLabelText(/Email/i);
        const passwordField = screen.getByPlaceholderText(/Create password/i);
        const confirmPasswordField = screen.getByPlaceholderText(/Confirm Password/i);
        expect(fullnameField).toBeInTheDocument();
        expect(emailField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
        expect(confirmPasswordField).toBeInTheDocument();
    });

    it("render the form submit button", () => {
        render(<SignupPage />);
        const submitButton = screen.getByRole("button", {
            name: /Create Account/i,
        });
        expect(submitButton).toBeInTheDocument();
    });

    it("render the sign in button", () => {
        render(<SignupPage />);

        const signInButton = screen.getByRole("link", {
            name: /Sign In/i,
        });

        expect(signInButton).toBeInTheDocument();
    });

});
