import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";


// Mock next/font/google
vi.mock("next/font/google", () => ({
    Syne: () => ({
        variable: "--font-auth-display",
        subsets: ["latin"],
        weight: ["600", "700", "800"],
    }),

    Space_Grotesk: () => ({
        variable: "--font-auth-body",
        subsets: ["latin"],
        weight: ["400", "500", "700"],
    }),
}));


// Create mocks before vi.mock() factories are evaluated
const {
    pushMock,
    refreshMock,
    signInMock,
} = vi.hoisted(() => ({
    pushMock: vi.fn(),
    refreshMock: vi.fn(),
    signInMock: vi.fn(),
}));


// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: refreshMock,
        prefetch: vi.fn(),
    }),
}));


// Mock NextAuth
vi.mock("next-auth/react", () => ({
    signIn: signInMock,
}));


import LoginPage from "./page";


describe("LoginPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("renders the heading", () => {
        render(<LoginPage />);

        const heading = screen.getByRole("heading", {
            name: /Login/i,
        });

        expect(heading).toBeInTheDocument();
    });


    it("renders the sub heading", () => {
        render(<LoginPage />);

        const subHeading = screen.getByText(
            /Enter your details to access your chat workspace/i
        );

        expect(subHeading).toBeInTheDocument();
    });


    it("renders the form", () => {
        render(<LoginPage />);

        const form = screen.getByRole("form");

        expect(form).toBeInTheDocument();
    });


    it("renders the form fields", () => {
        render(<LoginPage />);

        const emailField = screen.getByLabelText(/Email/i);
        const passwordField = screen.getByPlaceholderText(/Enter password/i);

        expect(emailField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
    });


    it("renders the form submit button", () => {
        render(<LoginPage />);

        const submitButton = screen.getByRole("button", {
            name: /Login/i,
        });

        expect(submitButton).toBeInTheDocument();
    });


    it("renders the sign up link", () => {
        render(<LoginPage />);

        const signUpLink = screen.getByRole("link", {
            name: /Create an account/i,
        });

        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink).toHaveAttribute("href", "/signup");
    });


    it("navigates to chat after successful login", async () => {
        // Mock successful NextAuth login
        signInMock.mockResolvedValueOnce({
            error: null,
        });

        render(<LoginPage />);

        const emailField = screen.getByLabelText(/Email/i);
        const passwordField = screen.getByPlaceholderText(/Enter password/i);
        const submitButton = screen.getByRole("button", {
            name: /Login/i,
        });

        fireEvent.change(emailField, {
            target: {
                value: "Rahul.U@radisys.com",
            },
        });

        fireEvent.change(passwordField, {
            target: {
                value: "q1w2e3r4",
            },
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signInMock).toHaveBeenCalledWith("credentials", {
                email: "Rahul.U@radisys.com",
                password: "q1w2e3r4",
                redirect: false,
            });
        });

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/chat");
            expect(refreshMock).toHaveBeenCalled();
        });
    });


    it("shows an error when login fails", async () => {
        // Mock failed NextAuth login
        signInMock.mockResolvedValueOnce({
            error: "CredentialsSignin",
        });

        render(<LoginPage />);

        const emailField = screen.getByLabelText(/Email/i);
        const passwordField = screen.getByPlaceholderText(/Enter password/i);
        const submitButton = screen.getByRole("button", {
            name: /Login/i,
        });

        fireEvent.change(emailField, {
            target: {
                value: "wrong@example.com",
            },
        });

        fireEvent.change(passwordField, {
            target: {
                value: "wrongpassword",
            },
        });

        fireEvent.click(submitButton);

        expect(
            await screen.findByText("Invalid email or password.")
        ).toBeInTheDocument();

        expect(pushMock).not.toHaveBeenCalled();
        expect(refreshMock).not.toHaveBeenCalled();
    });


    it("shows loading state while logging in", async () => {
        let resolveSignIn!: (value: unknown) => void;

        // Keep signIn pending
        signInMock.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolveSignIn = resolve;
                })
        );

        render(<LoginPage />);

        const emailField = screen.getByLabelText(/Email/i);
        const passwordField = screen.getByPlaceholderText(/Enter password/i);
        const submitButton = screen.getByRole("button", {
            name: /Login/i,
        });

        fireEvent.change(emailField, {
            target: {
                value: "test@example.com",
            },
        });

        fireEvent.change(passwordField, {
            target: {
                value: "password123",
            },
        });

        fireEvent.click(submitButton);

        // Loading state
        const loadingButton = await screen.findByRole("button", {
            name: /Logging in/i,
        });

        expect(loadingButton).toBeDisabled();

        // Finish login
        resolveSignIn({
            error: null,
        });

        // Loading state should disappear
        await waitFor(() => {
            const loginButton = screen.getByRole("button", {
                name: /Login/i,
            });

            expect(loginButton).not.toBeDisabled();
        });
    });


    it("handles unexpected login errors", async () => {
        // Mock an unexpected error
        signInMock.mockRejectedValueOnce(
            new Error("Network error")
        );

        render(<LoginPage />);

        const emailField = screen.getByLabelText(/Email/i);
        const passwordField = screen.getByPlaceholderText(/Enter password/i);
        const submitButton = screen.getByRole("button", {
            name: /Login/i,
        });

        fireEvent.change(emailField, {
            target: {
                value: "test@example.com",
            },
        });

        fireEvent.change(passwordField, {
            target: {
                value: "password123",
            },
        });

        fireEvent.click(submitButton);

        expect(
            await screen.findByText("Something went wrong.")
        ).toBeInTheDocument();

        expect(pushMock).not.toHaveBeenCalled();
        expect(refreshMock).not.toHaveBeenCalled();
    });

});