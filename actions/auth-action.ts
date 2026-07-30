"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import z from "zod"

/**
 * Login values arrive from the browser and must therefore be treated as untrusted input.
 */
const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .max(254),

    password: z
        .string()
        .min(1, "Enter your password")
        .max(128)
});

export type LoginActionState = {
    error: string | null;
};

export async function loginAdmin(
    _previousState: LoginActionState,
    formData: FormData,
): Promise<LoginActionState> {

    /**
     * FormData.get() returns FormDataEntruValue | null.
     * Zod checks that the values are valid strings.
     */
    const validationResult = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!validationResult.success) {
        return {
            error: "Enter a valid email address and password",
        };
    }

    try {
        /**
         * Calls the Credentials provider configured inside auth.ts
         */
        await signIn("credentials", {
            email: validationResult.data.email,
            password: validationResult.data.password,

            /**
             * 
             * Auth.js redirects here after successfullt creating the session.
             */
            redirectTo: "/admin"
        });
    } catch (error) {
        /**
         * Expected authentication errors are converted into safe values that the UI can display.
         */
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        error: "The email or password is incorrect."
                    };

                default:
                    console.error(
                        "Admin authentication failed",
                        error
                    );

                    return {
                        error: "Unable to sign in right now. Please try again."
                    };
            }
        }

        /**
         * A successful Auth.js redirect is internally implemented by throwing a special redirect.
         * 
         * Therefore, unknown errors must be re-thrown instead of being converted into login errors.
         */
        throw error;
    }

    /**
     * Normally unreachable because successfull login redirect to /admin 
     */
    return {
        error: null
    };
}

export async function logoutAdmin(): Promise<void> {
    await signOut({
        redirectTo: "/login",
    });
}