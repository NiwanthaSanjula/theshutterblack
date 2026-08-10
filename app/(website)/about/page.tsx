import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn more about The Shutter Black and the photography services we offer.",
};

const services = [
    {
        number: "01",
        title: "Wedding Photography",
        description:
            "Natural and timeless coverage that preserves the emotions, details and meaningful moments of your special day.",
    },
    {
        number: "02",
        title: "Portrait Photography",
        description:
            "Relaxed portrait sessions created with beautiful light, natural direction and genuine expression.",
    },
    {
        number: "03",
        title: "Pre-Shoot Sessions",
        description:
            "Creative indoor or outdoor sessions planned around your story, personality and vision.",
    },
    {
        number: "04",
        title: "Event Photography",
        description:
            "Professional coverage for birthdays, engagements, corporate occasions and special celebrations.",
    },
    {
        number: "05",
        title: "Videography",
        description:
            "Cinematic films that preserve the movement, emotion and atmosphere of your most important moments.",
    },
    {
        number: "06",
        title: "Album Design",
        description:
            "Carefully designed albums that turn your favourite photographs into a beautiful physical story.",
    },
    {
        number: "07",
        title: "Corporate Photography",
        description:
            "Professional photography for businesses, teams, events, products and brand communication.",
    },
    {
        number: "08",
        title: "Product & Brand Photography",
        description:
            "Clean, purposeful imagery created to present your products and brand with confidence.",
    },
];

const page = async () => {
    const siteSetting = await prisma.siteSetting.findUnique({
        where: {
            id: "main",
        },
        select: {
            businessName: true,
            photographerName: true,
            biography: true,
        },
    });

    const businessName =
        siteSetting?.businessName || "The Shutter Black";

    const photographerName =
        siteSetting?.photographerName || "The Photographer";

    const biography =
        siteSetting?.biography ||
        "The Shutter Black is built around one simple idea — photographs should preserve more than how a moment looked. They should bring back how it felt.";

    return (
        <main className="bg-neutral-950 text-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section
                className="
                    relative flex min-h-[70vh]
                    items-center justify-center
                    overflow-hidden
                    px-6
                    text-center
                "
            >
                {/* Large background typography */}

                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute inset-x-0 top-10
                        select-none
                        whitespace-nowrap
                        text-center
                        font-cinzel
                        text-[clamp(5rem,18vw,17rem)]
                        leading-none
                        tracking-[0.03em]
                        text-white/[0.035]
                    "
                >
                    ABOUT
                </p>

                <div className="relative z-10 mx-auto max-w-4xl">

                    <p
                        className="
                            text-xs font-medium
                            uppercase tracking-[0.35em]
                            text-primary
                            sm:text-sm
                        "
                    >
                        {businessName}
                    </p>

                    <h1
                        className="
                            mt-6
                            font-cinzel
                            text-5xl
                            leading-[1.05]
                            sm:text-6xl
                            lg:text-8xl
                        "
                    >
                        Photography
                        <br />
                        with meaning.
                    </h1>

                    <p
                        className="
                            mx-auto mt-8
                            max-w-2xl
                            text-base
                            leading-8
                            text-white/50
                            sm:text-lg
                        "
                    >
                        We create honest, timeless photographs
                        that preserve the people, emotions and
                        little details behind every story.
                    </p>

                </div>

                {/* Bottom indicator */}

                <div
                    className="
                        absolute bottom-8 left-1/2
                        flex -translate-x-1/2
                        flex-col items-center gap-3
                        text-[9px]
                        uppercase
                        tracking-[0.3em]
                        text-white/25
                    "
                >
                    <span>Discover</span>

                    <span className="h-7 w-px bg-white/20" />
                </div>
            </section>


            {/* =====================================================
                ABOUT / PHOTOGRAPHER
            ===================================================== */}

            <section
                className="
                    border-t border-white/5
                    px-6 py-20
                    sm:px-8
                    lg:px-12
                    lg:py-24
                "
            >
                <div
                    className="
                        mx-auto grid max-w-6xl
                        gap-12
                        lg:grid-cols-[0.7fr_1.3fr]
                        lg:gap-24
                    "
                >

                    {/* Small editorial heading */}

                    <div>
                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-primary
                            "
                        >
                            Behind the lens
                        </p>

                        <h2
                            className="
                                mt-4
                                font-cinzel
                                text-4xl
                                leading-tight
                                sm:text-5xl
                            "
                        >
                            The person
                            <br />
                            behind the
                            <br />
                            photographs.
                        </h2>
                    </div>


                    {/* Story */}

                    <div className="max-w-2xl">

                        <p
                            className="
                                font-cinzel
                                text-2xl
                                leading-relaxed
                                text-white/85
                                sm:text-3xl
                            "
                        >
                            {photographerName}
                        </p>

                        <div
                            className="
                                mt-6 h-px
                                w-16
                                bg-primary
                            "
                        />

                        <p
                            className="
                                mt-7
                                whitespace-pre-line
                                text-base
                                leading-8
                                text-white/55
                                sm:text-lg
                            "
                        >
                            {biography}
                        </p>

                        <p
                            className="
                                mt-6
                                text-base
                                leading-8
                                text-white/45
                            "
                        >
                            From intimate portraits to full wedding
                            celebrations, every session is approached
                            with the same intention — to create images
                            that feel genuine today and remain meaningful
                            years from now.
                        </p>

                    </div>
                </div>
            </section>


            {/* =====================================================
                SERVICES
            ===================================================== */}

            <section
                className="
                    border-t border-white/5
                    px-6 py-20
                    sm:px-8
                    lg:px-12
                    lg:py-24
                "
            >
                <div className="mx-auto max-w-7xl">

                    {/* Section heading */}

                    <div
                        className="
                            flex flex-col
                            gap-5
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div className="relative">

                            <p
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute -top-8 left-0
                                    whitespace-nowrap
                                    font-cinzel
                                    text-6xl
                                    leading-none
                                    text-white/[0.035]
                                    sm:text-8xl
                                "
                            >
                                SERVICES
                            </p>

                            <p
                                className="
                                    relative
                                    text-xs
                                    uppercase
                                    tracking-[0.3em]
                                    text-primary
                                "
                            >
                                What we do
                            </p>

                            <h2
                                className="
                                    relative mt-3
                                    font-cinzel
                                    text-4xl
                                    sm:text-5xl
                                "
                            >
                                Photography for
                                <br className="sm:hidden" />
                                every story.
                            </h2>

                        </div>

                        <p
                            className="
                                max-w-md
                                text-sm
                                leading-6
                                text-white/40
                            "
                        >
                            From weddings and portraits to
                            professional brand imagery, we create
                            photographs around the moments that
                            matter to you.
                        </p>
                    </div>


                    {/* Service cards */}

                    <div
                        className="
                            mt-12
                            grid
                            gap-px
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/10
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        {services.map((service) => (
                            <article
                                key={service.number}
                                className="
                                    group
                                    relative
                                    bg-neutral-950
                                    p-6
                                    transition
                                    duration-300
                                    hover:bg-white/[0.035]
                                    sm:p-7
                                "
                            >

                                {/* Number */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <span
                                        className="
                                            font-mono
                                            text-[10px]
                                            tracking-[0.25em]
                                            text-primary
                                        "
                                    >
                                        {service.number}
                                    </span>

                                    <span
                                        className="
                                            text-lg
                                            text-white/15
                                            transition
                                            duration-300
                                            group-hover:text-primary
                                        "
                                    >
                                        ↗
                                    </span>
                                </div>


                                {/* Title */}

                                <h3
                                    className="
                                        mt-8
                                        font-cinzel
                                        text-xl
                                        leading-tight
                                        text-white
                                    "
                                >
                                    {service.title}
                                </h3>


                                {/* Description */}

                                <p
                                    className="
                                        mt-4
                                        text-sm
                                        leading-6
                                        text-white/40
                                    "
                                >
                                    {service.description}
                                </p>

                            </article>
                        ))}
                    </div>

                </div>
            </section>


            {/* =====================================================
                APPROACH
            ===================================================== */}

            <section
                className="
                    border-t border-white/5
                    px-6 py-20
                    sm:px-8
                    lg:px-12
                    lg:py-24
                "
            >
                <div className="mx-auto max-w-6xl">

                    <div className="max-w-2xl">

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-primary
                            "
                        >
                            Our approach
                        </p>

                        <h2
                            className="
                                mt-4
                                font-cinzel
                                text-4xl
                                leading-tight
                                sm:text-5xl
                            "
                        >
                            Simple. Personal.
                            <br />
                            Intentional.
                        </h2>

                    </div>


                    <div
                        className="
                            mt-12
                            grid
                            gap-8
                            border-t
                            border-white/10
                            pt-10
                            sm:grid-cols-3
                        "
                    >

                        <div>
                            <span
                                className="
                                    font-mono
                                    text-[10px]
                                    tracking-[0.25em]
                                    text-primary
                                "
                            >
                                01
                            </span>

                            <h3
                                className="
                                    mt-3
                                    font-cinzel
                                    text-xl
                                "
                            >
                                Authentic
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-white/40
                                "
                            >
                                Genuine expressions and natural
                                moments instead of photographs
                                that feel forced.
                            </p>
                        </div>


                        <div>
                            <span
                                className="
                                    font-mono
                                    text-[10px]
                                    tracking-[0.25em]
                                    text-primary
                                "
                            >
                                02
                            </span>

                            <h3
                                className="
                                    mt-3
                                    font-cinzel
                                    text-xl
                                "
                            >
                                Timeless
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-white/40
                                "
                            >
                                Images created to remain
                                beautiful and meaningful
                                long after the moment.
                            </p>
                        </div>


                        <div>
                            <span
                                className="
                                    font-mono
                                    text-[10px]
                                    tracking-[0.25em]
                                    text-primary
                                "
                            >
                                03
                            </span>

                            <h3
                                className="
                                    mt-3
                                    font-cinzel
                                    text-xl
                                "
                            >
                                Personal
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-white/40
                                "
                            >
                                Every session is shaped around
                                your people, personality and
                                story.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section
                className="
                    relative flex min-h-[48vh]
                    items-center justify-center
                    overflow-hidden
                    border-t border-white/5
                    px-6
                    text-center
                "
            >

                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute inset-x-0 top-10
                        select-none
                        whitespace-nowrap
                        font-cinzel
                        text-[clamp(4rem,15vw,14rem)]
                        leading-none
                        text-white/2.5
                    "
                >
                    YOUR STORY
                </p>

                <div className="relative z-10 max-w-3xl">

                    <p
                        className="
                            text-xs
                            uppercase
                            tracking-[0.35em]
                            text-primary
                        "
                    >
                        Let's create something meaningful
                    </p>

                    <h2
                        className="
                            mt-5
                            font-cinzel
                            text-4xl
                            leading-tight
                            sm:text-6xl
                        "
                    >
                        Your story deserves
                        <br />
                        to be remembered.
                    </h2>

                    <Link
                        href="/contact"
                        className="
                            mt-9
                            inline-flex
                            items-center
                            gap-3
                            border-b
                            border-primary
                            pb-2
                            text-sm
                            font-medium
                            uppercase
                            tracking-[0.2em]
                            transition
                            hover:text-primary
                        "
                    >
                        Start a conversation
                        <span aria-hidden="true">→</span>
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default page;