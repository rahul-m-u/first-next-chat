import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Creadentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "you@example.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                console.log("============================================")
                console.log("credentials : ", credentials)

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email.trim();

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                console.log("user : ", user)

                if (!user) {
                    return null;
                }

                const passwordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                console.log("passwordValid : ", passwordValid)

                console.log("============================================")

                if (!passwordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                };
            },
        })
    ],

    session: {
        strategy: "jwt"
    },

    pages: {
        signIn: "/signin",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET
}
