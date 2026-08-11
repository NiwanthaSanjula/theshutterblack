"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CldImage from "@/components/common/cloudinary-image";

gsap.registerPlugin(ScrollTrigger);

export type FeaturedAlbumItem = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string | null;
    location: string | null;
    eventDate: string | null;
    featuredImagePublicId: string;
    coverImagePublicId: string;
};

type FeaturedAlbumsSectionProps = {
    albums: FeaturedAlbumItem[];
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export default function FeaturedAlbums({
    albums,
}: FeaturedAlbumsSectionProps) {
    const sectionRef =
        useRef<HTMLElement>(null);

    const trackRef =
        useRef<HTMLDivElement>(null);

    const detailsRef =
        useRef<HTMLDivElement>(null);

    const scrollTriggerRef =
        useRef<ScrollTrigger | null>(null);

    const activeIndexRef =
        useRef(0);

    const [activeIndex, setActiveIndex] =
        useState(0);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    /*
     * Desktop-only pinned horizontal scrolling.
     */
    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;

        if (
            !section ||
            !track ||
            albums.length <= 1
        ) {
            return;
        }

        const mediaContext =
            gsap.matchMedia();

        mediaContext.add(
            "(min-width: 1024px)",
            () => {
                if (!track) {
                    return;
                }

                function getCardStep() {
                    if (!track) {
                        return 0;
                    }

                    const firstCard =
                        track.firstElementChild as
                        | HTMLElement
                        | null;

                    if (!firstCard) {
                        return 0;
                    }

                    const trackStyles =
                        window.getComputedStyle(
                            track,
                        );

                    const gap =
                        Number.parseFloat(
                            trackStyles.columnGap,
                        ) || 0;

                    return (
                        firstCard.offsetWidth +
                        gap
                    );
                }

                let currentIndex =
                    Math.min(
                        activeIndexRef.current,
                        albums.length - 1,
                    );

                gsap.set(track, {
                    x:
                        -getCardStep() *
                        currentIndex,
                });

                const scrollTrigger =
                    ScrollTrigger.create({
                        trigger: section,

                        start: "top top",

                        /*
                         * Controls how much vertical
                         * scrolling is needed per card.
                         */
                        end: () =>
                            `+=${window.innerHeight *
                            0.45 *
                            (albums.length - 1)
                            }`,

                        pin: true,

                        snap: {
                            snapTo:
                                1 /
                                (albums.length - 1),

                            duration: 0.18,
                            delay: 0.02,
                            ease: "power1.out",
                            inertia: false,
                        },

                        anticipatePin: 1,
                        invalidateOnRefresh: true,

                        onUpdate: (self) => {
                            const nextIndex =
                                Math.round(
                                    self.progress *
                                    (albums.length -
                                        1),
                                );

                            if (
                                nextIndex ===
                                currentIndex
                            ) {
                                return;
                            }

                            currentIndex =
                                nextIndex;

                            activeIndexRef.current =
                                nextIndex;

                            setActiveIndex(
                                nextIndex,
                            );

                            gsap.to(track, {
                                x:
                                    -getCardStep() *
                                    nextIndex,

                                duration: 0.25,
                                ease: "power2.out",
                                overwrite: true,
                            });
                        },
                    });

                scrollTriggerRef.current =
                    scrollTrigger;

                return () => {
                    scrollTriggerRef.current =
                        null;

                    scrollTrigger.kill();

                    gsap.killTweensOf(
                        track,
                    );

                    gsap.set(track, {
                        clearProps:
                            "transform",
                    });
                };
            },
        );

        return () => {
            mediaContext.revert();
        };
    }, [albums.length]);

    /*
     * Animate desktop album details.
     */
    useEffect(() => {
        const details =
            detailsRef.current;

        if (!details) {
            return;
        }

        const animation =
            gsap.fromTo(
                details,
                {
                    opacity: 0,
                    y: 16,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out",
                },
            );

        return () => {
            animation.kill();
        };
    }, [activeIndex]);

    function moveToAlbum(
        index: number,
    ) {
        const scrollTrigger =
            scrollTriggerRef.current;

        if (
            !scrollTrigger ||
            albums.length <= 1
        ) {
            activeIndexRef.current =
                index;

            setActiveIndex(index);
            return;
        }

        const progress =
            index /
            (albums.length - 1);

        const targetScrollPosition =
            scrollTrigger.start +
            (scrollTrigger.end -
                scrollTrigger.start) *
            progress;

        /*
         * Use an instant position change.
         * ScrollTrigger handles the snapping.
         */
        window.scrollTo({
            top: targetScrollPosition,
            behavior: "auto",
        });
    }

    if (albums.length === 0) {
        return null;
    }

    const safeActiveIndex =
        Math.min(
            activeIndex,
            albums.length - 1,
        );

    const activeAlbum =
        albums[safeActiveIndex];

    return (
        <>
            {/* Phone and tablet layout */}
            <section className="bg-neutral-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:hidden">
                <div className="mx-auto max-w-5xl">
                    <div className="flex items-end justify-between gap-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                                Selected work
                            </p>

                            <h2 className="mt-3 font-cinzel text-3xl leading-tight sm:text-4xl">
                                Featured Albums
                            </h2>
                        </div>

                        <Link
                            href="/albums"
                            className="hidden shrink-0 text-sm text-white/60 transition hover:text-white sm:block"
                        >
                            View all
                            <span
                                aria-hidden="true"
                                className="ml-2"
                            >
                                &rarr;
                            </span>
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        {albums.map(
                            (album) => (
                                <Link
                                    key={album.id}
                                    href={`/albums/${album.slug}`}
                                    className="group relative aspect-4/5 overflow-hidden rounded-2xl border border-white/10"
                                >
                                    <CldImage
                                        src={album.coverImagePublicId}
                                        alt={album.title}
                                        fill
                                        sizes="(max-width: 640px) calc(100vw - 32px), 50vw"
                                        className="object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    {/* Dark image fade — no blur here, just tint */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-transparent" />

                                    {/* Blur that fades upward, clipped to bottom ~60% */}
                                    <div
                                        className="absolute inset-x-0 bottom-0 h-[40%] backdrop-blur-xs
                                                mask-[linear-gradient(to_top,black_0%,black_40%,transparent_100%)]
                                                [-webkit-mask-image:linear-gradient(to_top,black_0%,black_40%,transparent_100%)]"
                                    />

                                    {/* All album information */}
                                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                            {album.category || "Photography"}
                                        </p>

                                        <h3 className="mt-2 line-clamp-2 font-cinzel text-xl leading-snug text-white sm:text-2xl">
                                            {album.title}
                                        </h3>

                                        {(album.location || album.eventDate) && (
                                            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65">
                                                {album.location && (
                                                    <span>{album.location}</span>
                                                )}

                                                {album.location &&
                                                    album.eventDate && (
                                                        <span
                                                            aria-hidden="true"
                                                            className="text-white/35"
                                                        >
                                                            •
                                                        </span>
                                                    )}

                                                {album.eventDate && (
                                                    <span>
                                                        {dateFormatter.format(
                                                            new Date(
                                                                album.eventDate,
                                                            ),
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                                            <span className="text-sm font-medium text-white">
                                                View album
                                            </span>

                                            <span
                                                aria-hidden="true"
                                                className="text-xl text-white transition-transform duration-300 group-hover:translate-x-1"
                                            >
                                                &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ),
                        )}
                    </div>

                    <Link
                        href="/albums"
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white hover:text-black sm:hidden"
                    >
                        View all albums

                        <span aria-hidden="true">
                            &rarr;
                        </span>
                    </Link>
                </div>
            </section>

            {/* Desktop animated layout */}
            <section
                ref={sectionRef}
                className="relative isolate hidden h-screen overflow-hidden bg-neutral-950 lg:block"
            >
                {/* Featured background images */}
                <div className="absolute inset-0 z-0">
                    {albums.map(
                        (album, index) => (
                            <div
                                key={
                                    album.id
                                }
                                aria-hidden={
                                    index !==
                                    safeActiveIndex
                                }
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index ===
                                    safeActiveIndex
                                    ? "opacity-100"
                                    : "opacity-0"
                                    }`}
                            >
                                <CldImage
                                    src={
                                        album.featuredImagePublicId
                                    }
                                    alt=""
                                    fill
                                    sizes="100vw"
                                    priority={
                                        index === 0
                                    }
                                    className="object-cover"
                                />
                            </div>
                        ),
                    )}
                </div>

                {/* Background shading */}

                <div className="absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/65 to-black/20" />

                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/70 via-transparent to-black/25" />

                {/* Desktop content */}
                <div
                    className="
                        relative z-20 mx-auto grid h-screen
                        max-w-7xl items-center
                        grid-cols-[0.8fr_1.2fr]
                        gap-12 px-8 py-20
                    "
                >
                    {/* Active album details */}
                    <div className="min-w-0">
                        <p className="text-sm font-medium uppercase tracking-wider text-primary">
                            Featured Albums
                        </p>

                        <div
                            key={`${activeAlbum.id}-details`}
                            ref={detailsRef}
                            className="mt-5"
                        >
                            <p className="w-fit rounded-full border border-primary/50 bg-primary/20 px-3 py-1 text-xs uppercase tracking-wider text-primary">
                                {activeAlbum.category ||
                                    "Featured album"}
                            </p>

                            <h2 className="mt-4 line-clamp-2 font-cinzel text-4xl leading-tight text-white xl:text-5xl">
                                {
                                    activeAlbum.title
                                }
                            </h2>

                            {activeAlbum.description && (
                                <p className="mt-5 line-clamp-4 max-w-xl text-base leading-7 text-white/70">
                                    {
                                        activeAlbum.description
                                    }
                                </p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary">
                                {activeAlbum.location && (
                                    <span>
                                        {
                                            activeAlbum.location
                                        }
                                    </span>
                                )}

                                {activeAlbum.eventDate && (
                                    <span>
                                        {dateFormatter.format(
                                            new Date(
                                                activeAlbum.eventDate,
                                            ),
                                        )}
                                    </span>
                                )}
                            </div>

                            <Link
                                href={`/albums/${activeAlbum.slug}`}
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black transition hover:bg-neutral-200"
                            >
                                View Album

                                <span aria-hidden="true">
                                    &rarr;
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop card queue */}
                    <div className="min-w-0 overflow-hidden">
                        <div
                            ref={trackRef}
                            className="flex w-max gap-6 px-5 py-10 will-change-transform"
                        >
                            {albums.map(
                                (
                                    album,
                                    index,
                                ) => {
                                    const isActive =
                                        index ===
                                        safeActiveIndex;

                                    return (
                                        <button
                                            key={
                                                album.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                moveToAlbum(
                                                    index,
                                                )
                                            }
                                            aria-label={`Show ${album.title}`}
                                            aria-pressed={
                                                isActive
                                            }
                                            className={`
                                                relative aspect-3/4
                                                w-75 shrink-0
                                                origin-center overflow-hidden
                                                rounded-2xl border text-left
                                                transition duration-300
                                                xl:w-85
                                                ${isActive
                                                    ? "scale-[1.03] border-white opacity-100"
                                                    : "scale-95 border-white/20 opacity-80 hover:opacity-100"
                                                }
                                            `}
                                        >
                                            <CldImage
                                                src={
                                                    album.coverImagePublicId
                                                }
                                                alt={
                                                    album.title
                                                }
                                                fill
                                                sizes="(max-width: 1280px) 300px, 340px"
                                                className="object-cover"
                                            />

                                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

                                            <div className="absolute inset-x-0 bottom-0 p-6">
                                                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                                                    {album.category ||
                                                        "Photography"}
                                                </p>

                                                <h3 className="mt-2 line-clamp-2 font-cinzel text-xl leading-snug text-white">
                                                    {
                                                        album.title
                                                    }
                                                </h3>
                                            </div>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}