export default function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-neutral-950 text-white">
            {/* Large background typography */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    inset-x-0 bottom-24
                    select-none whitespace-nowrap
                    text-center
                    font-serif
                    text-[clamp(5rem,16vw,15rem)]
                    leading-none
                    tracking-[-0.04em]
                    text-white/[0.025]
                "
            >
                SHUTTER
            </div>

            {/* Top accent */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-x-0 top-0 h-px
                    bg-linear-to-r
                    from-transparent
                    via-primary/60
                    to-transparent
                "
            />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                {/* Main CTA */}
                <div
                    className="
                        border-b border-white/10
                        py-20
                        sm:py-24
                        lg:py-28
                    "
                >
                    <div className="max-w-4xl">
                        <p
                            className="
                                text-[10px] font-medium
                                uppercase tracking-[0.35em]
                                text-primary
                                sm:text-xs
                            "
                        >
                            Your story deserves to be remembered
                        </p>

                        <h2
                            className="
                                mt-6
                                font-serif
                                text-4xl
                                leading-[1.05]
                                tracking-tight
                                text-white
                                sm:text-5xl
                                lg:text-7xl
                            "
                        >
                            Let's create something
                            <span className="block text-white/45">
                                timeless together.
                            </span>
                        </h2>

                        <div className="mt-8">
                            <a
                                href="/contact"
                                className="
                                    group inline-flex
                                    items-center gap-4
                                    text-sm
                                    uppercase
                                    tracking-[0.22em]
                                    text-white
                                "
                            >
                                <span
                                    className="
                                        relative
                                        after:absolute
                                        after:-bottom-2
                                        after:left-0
                                        after:h-px
                                        after:w-full
                                        after:origin-left
                                        after:scale-x-0
                                        after:bg-primary
                                        after:transition-transform
                                        after:duration-300
                                        group-hover:after:scale-x-100
                                    "
                                >
                                    Start an enquiry
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-full
                                        border border-white/15
                                        text-lg
                                        text-primary
                                        transition
                                        duration-300
                                        group-hover:border-primary
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer navigation */}
                <div
                    className="
                        grid gap-12
                        py-14
                        sm:grid-cols-2
                        lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]
                        lg:py-16
                    "
                >
                    {/* Brand */}
                    <div className="max-w-sm">
                        <p
                            className="
                                font-serif
                                text-2xl
                                tracking-wide
                                text-white
                            "
                        >
                            The Shutter Black
                        </p>

                        <p
                            className="
                                mt-4
                                max-w-xs
                                text-sm
                                leading-7
                                text-white/40
                            "
                        >
                            Photography that turns fleeting moments
                            into stories worth keeping forever.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.3em]
                                text-primary
                            "
                        >
                            Explore
                        </p>

                        <nav className="mt-5 flex flex-col gap-3">
                            <a
                                href="/"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                Home
                            </a>

                            <a
                                href="/albums"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                Albums
                            </a>

                            <a
                                href="/about"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                About
                            </a>

                            <a
                                href="/contact"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                Contact
                            </a>
                        </nav>
                    </div>

                    {/* Services */}
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.3em]
                                text-primary
                            "
                        >
                            Services
                        </p>

                        <div className="mt-5 flex flex-col gap-3">
                            <span className="text-sm text-white/55">
                                Weddings
                            </span>

                            <span className="text-sm text-white/55">
                                Portraits
                            </span>

                            <span className="text-sm text-white/55">
                                Events
                            </span>

                            <span className="text-sm text-white/55">
                                Pre-shoots
                            </span>
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.3em]
                                text-primary
                            "
                        >
                            Connect
                        </p>

                        <div className="mt-5 flex flex-col gap-3">
                            <a
                                href="/contact"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                Get in touch
                            </a>

                            <a
                                href="#"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                Instagram
                            </a>

                            <a
                                href="#"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                Facebook
                            </a>

                            <a
                                href="#"
                                className="
                                    text-sm text-white/55
                                    transition hover:text-white
                                "
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="
                        flex flex-col
                        gap-4
                        border-t border-white/10
                        py-7
                        text-[10px]
                        uppercase
                        tracking-[0.18em]
                        text-white/30
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <p>
                        © {currentYear} The Shutter Black
                    </p>

                    <p>
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}