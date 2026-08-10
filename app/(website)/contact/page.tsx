import type { Metadata } from "next";
import ContactForm from "@/components/website/contact-form";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Contact The Shutter Black for wedding, portrait, event and photography services.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            {/* Header */}
            <section className="relative isolate overflow-hidden">
                {/* Background title */}
                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        inset-x-0 top-10
                        select-none whitespace-nowrap
                        text-center font-serif
                        text-[clamp(5rem,14vw,13rem)]
                        leading-none
                        tracking-[0.04em]
                        text-white/[0.035]
                    "
                >
                    CONTACT
                </p>

                <div
                    className="
                        relative mx-auto max-w-7xl
                        px-6 pb-16 pt-28
                        sm:px-8 sm:pt-32
                        lg:px-12 lg:pb-20 lg:pt-40
                    "
                >
                    <p
                        className="
                            text-xs font-medium
                            uppercase tracking-[0.3em]
                            text-primary
                            sm:text-sm
                        "
                    >
                        Get in touch
                    </p>

                    <h1
                        className="
                            mt-5 max-w-4xl
                            font-cinzel
                            text-4xl leading-tight
                            text-white
                            sm:text-5xl
                            lg:text-6xl
                        "
                    >
                        Let&apos;s create something memorable
                    </h1>

                    <p
                        className="
                            mt-6 max-w-2xl
                            text-base leading-7
                            text-white/55
                            sm:text-lg
                        "
                    >
                        Planning a wedding, portrait session, event or
                        something completely unique? Tell us a little about
                        your project and we&apos;ll get back to you.
                    </p>
                </div>
            </section>

            {/* Contact content */}
            <section>
                <div
                    className="
                        mx-auto grid max-w-7xl
                        gap-14
                        px-6 pb-20
                        sm:px-8
                        lg:grid-cols-[0.7fr_1.3fr]
                        lg:gap-20
                        lg:px-12
                        lg:pb-28
                    "
                >
                    {/* Information */}
                    <div>
                        <p
                            className="
                                text-xs uppercase
                                tracking-[0.3em]
                                text-primary
                            "
                        >
                            Start a conversation
                        </p>

                        <h2
                            className="
                                mt-3
                                font-cinzel
                                text-3xl
                                text-white
                                sm:text-4xl
                            "
                        >
                            Tell us about your story
                        </h2>

                        <p
                            className="
                                mt-5 max-w-md
                                text-sm leading-7
                                text-white/50
                            "
                        >
                            Every project is different. Share your preferred
                            date, location and the kind of photography you
                            are looking for. The more you tell us, the better
                            we can understand what you need.
                        </p>

                        {/* Details */}
                        <div className="mt-10 space-y-7">
                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-[0.25em]
                                        text-white/30
                                    "
                                >
                                    Photography
                                </p>

                                <p className="mt-2 text-sm leading-6 text-white/70">
                                    Weddings · Portraits · Events ·
                                    Pre-shoots · Corporate
                                </p>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-[0.25em]
                                        text-white/30
                                    "
                                >
                                    Response
                                </p>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                                    We&apos;ll review your inquiry and get back
                                    to you with the next steps.
                                </p>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-[0.25em]
                                        text-white/30
                                    "
                                >
                                    Available for
                                </p>

                                <p className="mt-2 text-sm leading-6 text-white/70">
                                    Weddings · Couples · Portraits ·
                                    Events · Special occasions
                                </p>
                            </div>
                        </div>

                        {/* Small visual accent */}
                        <div className="mt-12 flex items-center gap-4">
                            <span className="h-px w-12 bg-primary" />

                            <span
                                className="
                                    text-[10px]
                                    uppercase
                                    tracking-[0.25em]
                                    text-white/30
                                "
                            >
                                The Shutter Black
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <div
                        className="
                            relative overflow-hidden
                            rounded-2xl
                            border border-white/10
                            bg-neutral-900/70
                            p-6
                            shadow-2xl shadow-black/30
                            sm:p-8
                            lg:p-10
                        "
                    >
                        {/* Subtle background accent */}
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute -right-24 -top-24
                                h-64 w-64
                                rounded-full
                                bg-primary/5
                                blur-3xl
                            "
                        />

                        <div className="relative">
                            <p
                                className="
                                    mb-7
                                    text-xs uppercase
                                    tracking-[0.25em]
                                    text-white/35
                                "
                            >
                                Booking inquiry
                            </p>

                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}