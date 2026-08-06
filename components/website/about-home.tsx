"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AboutHomeProps = {
    photographerName?: string | null;
    biography?: string | null;
};

function createShortBiography(
    biography?: string | null,
) {
    const fallback =
        "The Shutter Black is focused on capturing natural emotions, meaningful moments and timeless stories through photography.";

    if (!biography?.trim()) {
        return fallback;
    }

    const cleanBiography = biography.trim();

    if (cleanBiography.length <= 360) {
        return cleanBiography;
    }

    return `${cleanBiography
        .slice(0, 360)
        .trimEnd()}...`;
}

export default function AboutHome({
    photographerName,
    biography,
}: AboutHomeProps) {
    const desktopSectionRef =
        useRef<HTMLElement>(null);

    const coverRef =
        useRef<HTMLDivElement>(null);

    const photographRef =
        useRef<HTMLDivElement>(null);

    const detailsRef =
        useRef<HTMLDivElement>(null);

    const displayName =
        photographerName?.trim() ||
        "The Photographer";

    const shortBiography =
        createShortBiography(biography);

    useEffect(() => {
        const section =
            desktopSectionRef.current;

        const cover =
            coverRef.current;

        const photograph =
            photographRef.current;

        const details =
            detailsRef.current;

        if (
            !section ||
            !cover ||
            !photograph ||
            !details
        ) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const mediaContext =
            gsap.matchMedia();

        /*
         * Run the shutter reveal only
         * on desktop screens.
         */
        mediaContext.add(
            "(min-width: 1024px)",
            () => {
                gsap.set(cover, {
                    scale: 1,
                    rotation: 0,
                    autoAlpha: 1,
                    transformOrigin: "50% 50%",
                    force3D: true,
                });

                gsap.set(photograph, {
                    scale: 1.08,
                });

                gsap.set(details, {
                    autoAlpha: 0,
                    y: 45,
                });

                const timeline =
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "+=170%",
                            pin: true,
                            scrub: 0.8,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                /*
                 * The photograph slowly settles
                 * into its original scale.
                 */
                timeline.to(
                    photograph,
                    {
                        scale: 1,
                        duration: 1,
                        ease: "none",
                    },
                    0,
                );

                /*
                 * Zooming the shutter cover enlarges
                 * its transparent centre opening.
                 */
                timeline.to(
                    cover,
                    {
                        scale: 5.5,
                        rotation: 100,
                        duration: 1,
                        ease: "none",
                        force3D: true,
                    },
                    0,
                );

                /*
                 * Hide the remaining cover near
                 * the end of the zoom.
                 */
                timeline.to(
                    cover,
                    {
                        autoAlpha: 0,
                        duration: 0.18,
                        ease: "none",
                    },
                    0.78,
                );

                /*
                 * Reveal the photographer details.
                 */
                timeline.to(
                    details,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                    },
                    0.7,
                );

                return () => {
                    timeline.kill();
                };
            },
        );

        return () => {
            mediaContext.revert();
        };
    }, []);

    return (
        <>
            {/* Mobile and tablet layout */}
            <section className="overflow-hidden bg-neutral-950 px-4 py-20 text-white sm:px-6 sm:py-24 lg:hidden">
                <div className="mx-auto max-w-5xl">
                    <p className="font-cinzel text-5xl leading-none text-white/5 sm:text-7xl">
                        BEHIND THE LENS
                    </p>

                    <div className="-mt-3 grid items-center gap-10 sm:-mt-5 md:grid-cols-2 md:gap-12">
                        {/* Mobile photographer image */}
                        <div className="relative mx-auto w-full max-w-md">
                            <div
                                aria-hidden="true"
                                className="absolute -bottom-4 -left-4 h-full w-full rounded-4xl border border-primary/30"
                            />

                            <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-white/10 bg-neutral-900">
                                <Image
                                    src="/aboutBg-mobile.jpg"
                                    alt={`${displayName}, photographer behind The Shutter Black`}
                                    fill
                                    sizes="(max-width: 767px) calc(100vw - 32px), 45vw"
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <p className="text-xs uppercase tracking-[0.25em] text-primary">
                                        Photographer
                                    </p>

                                    <p className="mt-2 font-cinzel text-2xl">
                                        {displayName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile information */}
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                                Behind the camera
                            </p>

                            <h2 className="mt-4 font-cinzel text-3xl leading-tight sm:text-4xl">
                                Meet the Photographer
                            </h2>

                            <p className="mt-6 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                                {shortBiography}
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
                                >
                                    Discover the story

                                    <span aria-hidden="true">
                                        &rarr;
                                    </span>
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm transition hover:bg-white hover:text-black"
                                >
                                    Work together
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Desktop shutter reveal */}
            <section
                ref={desktopSectionRef}
                className="relative hidden h-screen overflow-hidden bg-neutral-950 text-white lg:block"
            >
                {/* Original photograph underneath */}
                <div
                    ref={photographRef}
                    className="absolute inset-0 will-change-transform"
                >
                    <Image
                        src="/aboutBg.jpg"
                        alt={`${displayName}, photographer behind The Shutter Black`}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Image readability shading */}
                <div className="absolute inset-0 z-10 bg-linear-to-l from-black/90 via-black/35 to-black/10" />

                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/55 via-transparent to-black/15" />

                {/* Large decorative title */}
                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        left-0 top-6 z-10
                        whitespace-nowrap font-cinzel
                        text-[clamp(5rem,11vw,13rem)]
                        leading-none tracking-wide
                        text-white/4.5
                    "
                >
                    BEHIND THE LENS
                </p>

                {/* Photographer information */}
                <div className="relative z-20 mx-auto grid h-full max-w-7xl grid-cols-2 items-center px-8 py-16">
                    <div />

                    <div
                        ref={detailsRef}
                        className="ml-auto max-w-xl"
                    >
                        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
                            Behind the camera
                        </p>

                        <p className="mt-5 font-cinzel text-5xl leading-tight xl:text-6xl">
                            Meet
                        </p>

                        <h2 className="font-cinzel text-5xl leading-tight text-primary xl:text-6xl">
                            {displayName}
                        </h2>

                        <p className="mt-7 line-clamp-6 text-base leading-8 text-white/70 xl:text-lg">
                            {shortBiography}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                                    Specialised in
                                </p>

                                <p className="mt-2 text-white/75">
                                    Weddings, portraits and events
                                </p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                                    Photography style
                                </p>

                                <p className="mt-2 text-white/75">
                                    Natural and timeless
                                </p>
                            </div>
                        </div>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-neutral-200"
                            >
                                Discover the story

                                <span aria-hidden="true">
                                    &rarr;
                                </span>
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex items-center rounded-full border border-white/25 bg-black/15 px-7 py-3.5 text-sm backdrop-blur-sm transition hover:bg-white hover:text-black"
                            >
                                Work together
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Transparent shutter cover */}
                <div
                    ref={coverRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 will-change-transform"
                >
                    <Image
                        src="/aboutHomeCoverV1.png"
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Scroll hint */}
                <div className="pointer-events-none absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/45">
                        Reveal
                    </span>

                    <div className="flex h-8 w-5 justify-center rounded-full border border-white/25 pt-1.5">
                        <div className="h-1.5 w-1 rounded-full bg-primary" />
                    </div>
                </div>
            </section>
        </>
    );
}