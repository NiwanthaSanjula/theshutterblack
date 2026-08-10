import { auth } from "@/auth";
import LoginForm from "@/components/admin/login-form";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin Login | The Shutter Black",

    robots: {
        index: false,
        follow: false,
    },
};

export default async function LoginPage() {
    /**
     * Check if the admin is already logged in.
     * If yes, redirect to the admin dashboard.
     */
    const session = await auth();

    if (session?.user) {
        redirect("/admin");
    }

    return (
        <main className="relative flex min-h-screen bg-neutral-950 text-white">
            {/* Branding panel — hidden on mobile, left column on lg+ */}
            <div className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_45%)]"
                />

                {/* Large background watermark, consistent with the rest of the site */}
                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        -left-4 top-1/2
                        -translate-y-1/2
                        select-none
                        font-serif
                        text-[clamp(6rem,14vw,11rem)]
                        leading-none
                        tracking-[0.02em]
                        text-white/4
                    "
                >
                    ADMIN
                </p>

                <Link
                    href="/"
                    className="relative text-xs font-semibold uppercase tracking-[0.3em] text-primary-light transition hover:text-primary-lighter"
                >
                    The Shutter Black
                </Link>

                <div className="relative max-w-sm">
                    <span className="h-px w-10 bg-primary/60" />
                    <h2 className="mt-5 font-serif text-3xl leading-tight text-white xl:text-4xl">
                        Manage your photography portfolio
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-white/50">
                        Publish albums, curate galleries, and keep your
                        client stories up to date - all from one place.
                    </p>
                </div>

                <p className="relative text-xs text-white/30">
                    Restricted to the website administrator.
                </p>
            </div>

            {/* Form panel */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_38%)] lg:hidden"
                />

                <div className="relative w-full max-w-md">
                    {/* Branding shown only on mobile/tablet, since the left panel covers it on lg+ */}
                    <div className="mb-6 text-center lg:hidden">
                        <Link
                            href="/"
                            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary-light transition hover:text-primary-lighter"
                        >
                            The Shutter Black
                        </Link>

                        <p className="mt-3 text-sm text-white/40">
                            Photography portfolio management
                        </p>
                    </div>

                    <section className="rounded-2xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
                        <div>
                            <p className="text-sm font-medium text-primary-light">
                                Administrator access
                            </p>

                            <h1 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                                Sign in to your CMS
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-white/50">
                                Use the administrator email and password
                                configured for this website.
                            </p>
                        </div>

                        <LoginForm />

                        <div className="mt-6 border-t border-white/10 pt-5 text-center">
                            <Link
                                href="/"
                                className="text-sm text-white/40 transition hover:text-white/70"
                            >
                                Return to public website
                            </Link>
                        </div>
                    </section>

                    <p className="mt-5 text-center text-xs text-white/30 lg:hidden">
                        This area is restricted to the website
                        administrator.
                    </p>
                </div>
            </div>
        </main>
    );
}