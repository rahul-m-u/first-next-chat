import { Space_Grotesk, Syne } from "next/font/google";

const displayFont = Syne({
	variable: "--font-chat-display",
	subsets: ["latin"],
	weight: ["500", "700"],
});

const bodyFont = Space_Grotesk({
	variable: "--font-chat-body",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
});

export default function ChatLayout({ children }: LayoutProps<"/chat">) {
	return (
		<div className={`${displayFont.variable} ${bodyFont.variable} min-h-full`}>
			{children}
		</div>
	);
}
