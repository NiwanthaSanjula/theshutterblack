import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z, { email } from "zod";

/**
 * Credentials arrive from the browser as unknown data.
 * Zod Validates their types and basic format before authentication continues.
 */
const credentialsSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
        .max(254),

    password: z
        .string()
        .min(1)
        .max(128)
});

/**
 * Decode the base64 envitonment value back into the original bcrypt hash.
 */
function getAdminPasswordHash(): string | null {
    const encodedHash = process.env.ADMIN_PASSWORD_HASH_B64;

    if (!encodedHash) {
        return null;
    }

    try {
        return Buffer.from(
            encodedHash,
            "base64"
        ).toString("utf8")
    } catch (error) {
        console.error(
            "The admin password hash could not be decoded: ",
            error,
        );

        return null;

    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    /**
     * Store the authenticated session in an encrypted
     * JWT cookie instead of creating database sessions.
     */
    session: {
        strategy: "jwt",

        /**
         * Session lifetime: 8 hours.
         */
        maxAge: 8 * 60 * 60
    },

    pages: {
        signIn: "/login"
    },

    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },

                password: {
                    label: "Password",
                    type: "password"
                },
            },

            async authorize(credentials) {
                /**
                 * Never trust values received from the browser.
                 */
                const validationResult = credentialsSchema.safeParse(credentials);

                if (!validationResult.success) {
                    return null;
                }

                const submitedEmail = validationResult.data.email.trim().toLocaleLowerCase();
                const submittedPassword = validationResult.data.password;

                const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLocaleLowerCase();
                const configuredPasswordHash = getAdminPasswordHash();

                /**
                 * Authentication cannot work when required server configuration is missing.
                 */
                if (!configuredEmail || !configuredPasswordHash) {
                    console.error("Admin authentication environment variables are missing.");
                    return null;
                };

                /**
                 * Check the email first
                 */
                if (submitedEmail !== configuredEmail) {
                    return null;
                }

                /**
                 * bcrypt.compare() hashes the submitted password internally and safely checks it against the stored bcrypt hash.
                 */
                try {
                    const passwordMatches = await compare(
                        submittedPassword,
                        configuredPasswordHash
                    );

                    if (!passwordMatches) {
                        return null;
                    }

                } catch (error) {
                    console.error("Admin password verification failed.", error);
                    return null;
                }

                /**
                 * Returning a user object means authentication succeeded.
                 * Returning null means authentication failed.
                 */
                return {
                    id: "cms-administrator",
                    name: "CMS Administrator",
                    email: configuredEmail,
                };
            },
        }),
    ],
});