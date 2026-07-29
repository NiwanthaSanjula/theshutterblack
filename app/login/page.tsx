import { auth } from "@/auth";
import LoginForm from "@/components/admin/login-form";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin Login | The Shuter Black",

    robots: {
        index: false,
        follow: false
    },
};

export default async function LoginPage() {
    /**
     * Check if the admin is already logged in.
     * If yes, redirect to the admin dashboard.
     */
    const session = await auth();

    if (session?.user) {
        redirect("/admin")
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12 text-white">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_38%)]"
            />

            <div className="relative w-full max-w-md">
                <div className="mb-6 text-center">
                    <Link
                        href="/"
                        className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 transition hover:text-emerald-300"
                    >
                        The Shutter Black
                    </Link>

                    <p className="mt-3 text-sm text-neutral-500">
                        Photography portfolio management
                    </p>
                </div>

                <section className="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
                    <div>
                        <p className="text-sm font-medium text-emerald-400">
                            Administrator access
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                            Sign in to your CMS
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-neutral-400">
                            Use the administrator email and
                            password configured for this website.
                        </p>
                    </div>

                    <LoginForm />

                    <div className="mt-6 border-t border-neutral-800 pt-5 text-center">
                        <Link
                            href="/"
                            className="text-sm text-neutral-500 transition hover:text-neutral-300"
                        >
                            Return to public website
                        </Link>
                    </div>
                </section>

                <p className="mt-5 text-center text-xs text-neutral-600">
                    This area is restricted to the website
                    administrator.
                </p>
            </div>
        </main>
    )
}