"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
        image: "/service-wedding-background.jpg",
    },
    {
        title: "Portrait Photography",
        description:
            "Relaxed portrait sessions created with beautiful light, natural direction and genuine expression.",
        image: "/service-portrait-background.jpg",
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
            return "xl:col-span-8 xl:row-span-2";

        case 1:
            return "xl:col-span-8 xl:row-span-1";

        case 2:
            return "xl:col-span-8 xl:row-span-1";

        case 3:
            return "xl:col-span-5 xl:row-span-1";

        case 4:
            return "xl:col-span-5 xl:row-span-1";

        case 5:
            return "xl:col-span-6 xl:row-span-1";

        default:
            return "";
    }
}

export default function Services() {
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = cardsRef.current;

        if (!container) {
            return;
        }

        const cards = Array.from(
            container.querySelectorAll<HTMLElement>("[data-parallax-card]"),
        );

        let frameId: number | null = null;

        const updateParallax = () => {
            frameId = null;

            const viewportHeight = window.innerHeight;

            cards.forEach((card) => {
                const image =
                    card.querySelector<HTMLElement>(
                        "[data-parallax-image]",
                    );

                if (!image) {
                    return;
                }

                const rect = card.getBoundingClientRect();

                /*
                 * progress:
                 * 0   = card enters from the bottom
                 * 0.5 = card is around the middle of viewport
                 * 1   = card leaves through the top
                 */
                const progress =
                    (viewportHeight - rect.top) /
                    (viewportHeight + rect.height);

                const clampedProgress = Math.max(
                    0,
                    Math.min(1, progress),
                );

                /*
                 * Move the image upward by up to 70px.
                 *
                 * The card itself does not move.
                 */
                const translateY =
                    -80 * clampedProgress + 5;

                image.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.12)`;
            });
        };

        const requestUpdate = () => {
            if (frameId !== null) {
                return;
            }

            frameId = window.requestAnimationFrame(
                updateParallax,
            );
        };

        updateParallax();

        window.addEventListener(
            "scroll",
            requestUpdate,
            { passive: true },
        );

        window.addEventListener(
            "resize",
            requestUpdate,
        );

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            window.removeEventListener(
                "scroll",
                requestUpdate,
            );

            window.removeEventListener(
                "resize",
                requestUpdate,
            );
        };
    }, []);

    return (
        <section
            className="
                relative isolate overflow-hidden bg-neutral-950
                px-4 py-20 text-white
                sm:px-6 sm:py-24
                lg:px-8
                xl:min-h-screen xl:h-auto xl:px-10 xl:pb-16 xl:pt-28
                max-w-7xl mx-auto
            "
        >
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
                        xl:flex-row-reverse
                        xl:items-end
                        xl:justify-between
                    "
                >
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

                {/* Services grid */}
                <div
                    ref={cardsRef}
                    className="
                        mt-12 grid gap-3
                        sm:grid-cols-2 sm:gap-4
                        xl:mt-10
                        xl:min-h-145
                        xl:flex-1
                        xl:grid-cols-24
                        xl:grid-rows-2
                        xl:gap-3
                    "
                >
                    {services.map((service, index) => {
                        const isMainService =
                            index === 0;

                        return (
                            <article
                                key={service.title}
                                data-parallax-card
                                className={`
                                    group relative flex min-h-68
                                    overflow-hidden rounded-xl
                                    border border-white/10
                                    bg-neutral-950
                                    p-6 sm:p-7
                                    backdrop-blur-sm
                                    transition duration-300
                                    hover:border-primary/50
                                    hover:bg-neutral-900/75
                                    xl:h-full
                                    xl:min-h-0
                                    ${getDesktopLayout(index)}
                                `}
                            >
                                {/* Parallax background image */}
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 overflow-hidden"
                                >
                                    <div
                                        data-parallax-image
                                        className="
                                            absolute
                                            -inset-y-10
                                            inset-x-0
                                            will-change-transform
                                            transition-transform
                                            duration-100
                                            ease-out
                                        "
                                    >
                                        <Image
                                            src={service.image}
                                            alt=""
                                            fill
                                            sizes="
                                                (max-width: 640px) 100vw,
                                                (max-width: 1279px) 50vw,
                                                33vw
                                            "
                                            className="
                                                object-cover
                                                transition-transform
                                                duration-700
                                                group-hover:scale-105
                                            "
                                        />
                                    </div>
                                </div>

                                {/* Dark overlay */}
                                <div
                                    className="
                                        absolute inset-0
                                        bg-linear-to-t
                                        from-black/90
                                        via-black/55
                                        to-black/20
                                    "
                                />

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
                                        absolute right-6 top-6
                                        font-cinzel text-4xl
                                        text-white/5
                                        sm:text-5xl
                                    "
                                >
                                    {String(index + 1).padStart(
                                        2,
                                        "0",
                                    )}
                                </span>

                                {/* Content */}
                                <div className="relative z-10 flex flex-1 flex-col justify-end transition-transform duration-300 group-hover:-translate-y-1">
                                    <div>
                                        <h3
                                            className={`
                                                font-cinzel leading-snug
                                                text-white
                                                ${isMainService
                                                    ? "text-2xl sm:text-3xl xl:text-3xl"
                                                    : "text-lg xl:text-xl"
                                                }
                                            `}
                                        >
                                            {service.title}
                                        </h3>

                                        <p
                                            className={`
                                                mt-2 text-white/70
                                                ${isMainService
                                                    ? "max-w-xl text-sm leading-7 sm:text-base"
                                                    : "line-clamp-3 text-xs leading-5 xl:text-sm xl:leading-6"
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