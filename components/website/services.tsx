import Image from "next/image";

type ServiceItem = {
    title: string;
    description: string;
    image: string;
};

const services: ServiceItem[] = [
    {
        title: "Wedding Photography",
        description:
            "Natural and timeless wedding photography that preserves the emotions, details and meaningful moments of your special day.",
        image: "/service-wedding.jpg",
    },
    {
        title: "Portrait Photography",
        description:
            "Relaxed portrait sessions created with beautiful light, natural direction and genuine expression.",
        image: "/service-portrait-bg.jpg",
    },
    {
        title: "Event Photography",
        description:
            "Professional coverage for birthdays, engagements, corporate occasions and special celebrations.",
        image: "/service-event-bg.jpg",
    },
    {
        title: "Videography",
        description:
            "Cinematic films that preserve the movement, emotion and atmosphere of your important moments.",
        image: "/service-videography-bg.jpg",
    },
    {
        title: "Pre-Shoot Sessions",
        description:
            "Creative indoor or outdoor sessions planned around your story, personality and preferred location.",
        image: "/service-preshoot-bg.jpg",
    },
    {
        title: "Album Design",
        description:
            "Carefully designed printed albums that transform your favourite photographs into a lasting visual story.",
        image: "/service-album-bg.jpg",
    },
];

function getDesktopLayout(index: number) {
    switch (index) {
        case 0:
            return "xl:col-span-5 xl:row-span-2";

        case 1:
            return "xl:col-span-3 xl:row-span-1";

        case 2:
            return "xl:col-span-4 xl:row-span-1";

        case 3:
            return "xl:col-span-2 xl:row-span-1";

        case 4:
            return "xl:col-span-2 xl:row-span-1";

        case 5:
            return "xl:col-span-3 xl:row-span-1";

        default:
            return "";
    }
}

export default function Services() {
    return (
        <section
            className="
                relative isolate overflow-hidden bg-neutral-950
                px-4 py-20 text-white
                sm:px-6 sm:py-24
                lg:px-8
                xl:h-screen xl:px-10 xl:pb-8 xl:pt-28
            "
        >
            {/* Wireframe background image */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <Image
                    src="/services-grid-background.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-bottom opacity-45 mix-blend-screen"
                />
            </div>

            {/* Background shading */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0
                    bg-linear-to-b
                    from-neutral-950
                    via-neutral-950/85
                    to-neutral-950/60
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0
                    bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08),transparent_48%)]
                "
            />

            <div
                className="
                    relative mx-auto flex max-w-[1600px]
                    flex-col
                    xl:h-full
                "
            >
                {/* Section heading */}
                <header
                    className="
                        flex shrink-0 flex-col gap-8
                        xl:flex-row
                        xl:items-end
                        xl:justify-between
                    "
                >
                    {/* Overlapping title on the right */}
                    <div className="xl:text-right">
                        <p
                            aria-hidden="true"
                            className="
                                whitespace-nowrap font-cinzel
                                text-4xl leading-none tracking-wide
                                text-white/6
                                sm:text-6xl
                                xl:text-7xl
                                2xl:text-8xl
                            "
                        >
                            WHAT WE OFFER
                        </p>

                        <h2
                            className="
                                relative -mt-3 font-cinzel
                                text-3xl leading-none text-primary
                                sm:-mt-5 sm:text-4xl
                                xl:-mt-7 xl:text-5xl
                                2xl:text-6xl
                            "
                        >
                            OUR SERVICES
                        </h2>
                    </div>

                    {/* Description on the left */}
                    <p
                        className="
                            max-w-xl text-sm leading-7 text-white/55
                            sm:text-base sm:leading-8
                            xl:pb-2
                        "
                    >
                        Professional photography and visual
                        storytelling created for meaningful
                        people, moments and celebrations.
                    </p>


                </header>

                {/* 
                    Mobile: one column
                    Tablet: two columns
                    Desktop: 12-column, two-row bento grid
                */}
                <div
                    className="
                        mt-12 grid gap-4
                        sm:grid-cols-2 sm:gap-5
                        xl:mt-10
                        xl:min-h-0
                        xl:flex-1
                        xl:grid-cols-12
                        xl:grid-rows-2
                        xl:gap-4
                    "
                >
                    {services.map((service, index) => {
                        const isMainService =
                            index === 0;

                        return (
                            <article
                                key={service.title}
                                className={`
                                    group relative flex min-h-60
                                    overflow-hidden rounded-3xl
                                    border border-white/10
                                    bg-neutral-500
                                    backdrop-blur-sm
                                    transition duration-300
                                    hover:border-primary/50
                                    hover:bg-neutral-900/75
                                    sm:p-7
                                    xl:h-full
                                    xl:min-h-0
                                    ${getDesktopLayout(index)}
                                `}
                            >

                                <div className="absolute inset-0">
                                    <Image
                                        src={service.image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 33vw"
                                        className="object-cover transition duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/20" />

                                {/* Card glow */}
                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none absolute
                                        -right-16 -top-16
                                        h-40 w-40 rounded-full
                                        bg-primary/5 blur-3xl
                                        transition duration-500
                                        group-hover:bg-primary/15
                                    "
                                />

                                {/* Card number */}
                                <span
                                    aria-hidden="true"
                                    className="
                                        absolute right-5 top-4
                                        font-cinzel text-4xl
                                        text-white/4
                                        sm:text-5xl
                                    "
                                >
                                    {String(index + 1).padStart(
                                        2,
                                        "0",
                                    )}
                                </span>

                                <div className="relative flex w-full flex-col justify-between">
                                    {/* Text */}
                                    <div className="mt-auto px-4 py-4 lg:px-0 lg:py-0">
                                        <h3
                                            className={`
                                                font-cinzel leading-snug
                                                text-white
                                                ${isMainService
                                                    ? "text-2xl sm:text-3xl xl:text-4xl"
                                                    : "text-xl xl:text-2xl"
                                                }
                                            `}
                                        >
                                            {service.title}
                                        </h3>

                                        <p
                                            className={`
                                                mt-3 text-white/55
                                                ${isMainService
                                                    ? "max-w-xl text-sm leading-7 sm:text-base"
                                                    : "line-clamp-3 text-sm leading-6"
                                                }
                                            `}
                                        >
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom hover line */}
                                <div
                                    aria-hidden="true"
                                    className="
                                        absolute inset-x-0 bottom-0
                                        h-px origin-left scale-x-0
                                        bg-linear-to-r
                                        from-primary
                                        via-primary/50
                                        to-transparent
                                        transition-transform
                                        duration-500
                                        group-hover:scale-x-100
                                    "
                                />
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}