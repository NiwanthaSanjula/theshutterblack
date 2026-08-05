"use client"

import gsap from "gsap";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type HeroSlide = {
    id: string;
    desktopImage: string;
    mobileImage: string;
    icon: string;
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
};

const heroSlides: HeroSlide[] = [
    {
        id: "wedding",
        desktopImage: "/hero-1.jpg",
        mobileImage: "/hero-1-mobile.jpg",
        icon: "/engagement-icon.png",
        eyebrow: "Wedding Photography",
        title: "Stories of love, preserved forever.",
        description:
            "Natural and timeless wedding photography that captures every meaningful moment, emotion and detail.",
        primaryLabel: "Explore albums",
        primaryHref: "/albums",
        secondaryLabel: "Book your date",
        secondaryHref: "/contact",
    },
    {
        id: "portrait",
        desktopImage: "/hero-2.2.jpg",
        mobileImage: "/hero-2-mobile.png",
        icon: "/portraits-icon.png",
        eyebrow: "Portrait Photography",
        title: "Portraits that feel completely like you.",
        description:
            "Thoughtful portrait sessions created with beautiful light, natural direction and genuine expression.",
        primaryLabel: "View our work",
        primaryHref: "/albums",
        secondaryLabel: "Plan a session",
        secondaryHref: "/contact",
    },
    {
        id: "event",
        desktopImage: "/albumCover-4.png",
        mobileImage: "/hero-3-mobile.jpg",
        icon: "/videography-icon.png",
        eyebrow: "Event Photography",
        title: "Every celebration deserves to be remembered.",
        description:
            "Professional photography for birthdays, celebrations, corporate occasions and important life events.",
        primaryLabel: "View event albums",
        primaryHref: "/albums",
        secondaryLabel: "Contact photographer",
        secondaryHref: "/contact",
    },
];

const AUTO_SLIDE_DELAY = 7000;

export default function HeroSlider() {
    const backgroundRef =
        useRef<HTMLDivElement>(null);

    const contentRef =
        useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const activeSlide = heroSlides[activeIndex];

    /**
     * Animate the bg and text
     */
    useEffect(() => {
        const background =
            backgroundRef.current;

        const content =
            contentRef.current;

        if (!background || !content) {
            return;
        }

        const contentItems =
            content.children;

        const timeline = gsap.timeline();

        timeline.fromTo(
            background,
            {
                opacity: 0,
                scale: 1.05,
            },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out",
            },
        );

        timeline.fromTo(
            contentItems,
            {
                opacity: 0,
                y: 25,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.3,
                ease: "power2.out",
            },
            "-=0.6",
        );

        return () => {
            timeline.kill();
        };
    }, [activeIndex]);

    /**
     * Automatically move to next slide
     * The timer restarts after manual naviagtion
     */
    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        const intervalId =
            window.setInterval(() => {
                setActiveIndex(
                    (currentIndex) => (currentIndex + 1) % heroSlides.length,
                );
            }, AUTO_SLIDE_DELAY);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isPlaying, activeIndex]);

    function showPreviousSlide() {
        setActiveIndex((currentIndex) =>
            currentIndex === 0
                ? heroSlides.length - 1
                : currentIndex - 1,
        );
    }

    function showNextSlide() {
        setActiveIndex(
            (currentIndex) =>
                (currentIndex + 1) % heroSlides.length,
        );
    }

    return (
        <section
            aria-label="Photography introduction"
            className="relative isolate min-h-screen overflow-hidden bg-neutral-950"
        >
            {/* Active background */}
            <div
                key={`${activeSlide.id}-background`}
                ref={backgroundRef}
                className="absolute inset-0"
            >
                {/* Mobile image */}
                <Image
                    src={activeSlide.mobileImage}
                    alt=""
                    fill
                    priority={activeIndex === 0}
                    sizes="100vw"
                    className="object-cover md:hidden"
                />

                {/* Desktop image */}
                <Image
                    src={activeSlide.desktopImage}
                    alt=""
                    fill
                    priority={activeIndex === 0}
                    sizes="100vw"
                    className="hidden object-cover md:block"
                />
            </div>

            {/* Readability overlays */}
            {/* Warm cinematic overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(22,13,8,0.62)_0%,rgba(11,7,4,0.65)_50%,rgba(0,0,0,0.08)_100%)]" />



            {/* Matching slide content */}
            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center justify-center px-4 lg:px-8">
                <div
                    key={`${activeSlide.id}-content`}
                    ref={contentRef}
                    className="max-w-6xl text-center flex flex-col items-center justify-center mt-40"
                >
                    <div className="mb-6 flex justify-center">
                        <Image
                            src={activeSlide.icon}
                            width={64}
                            height={64}
                            alt=""
                            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    <p
                        className="text-xs  font-medium uppercase tracking-[0.28em] text-primary/75 sm:text-sm"
                    >
                        {activeSlide.eyebrow}
                    </p>

                    <h1
                        className="mt-5 text-xl font-semibold font-cinzel leading-[1.07] tracking-wider text-white sm:text-3xl md:text-4xl lg:text-6xl"
                    >
                        {activeSlide.title}
                    </h1>

                    <p
                        className="mt-6 max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8"
                    >
                        {activeSlide.description}
                    </p>

                    <div
                        className="mt-9 font-cinzel flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                    >
                        <Link
                            href={activeSlide.primaryHref}
                            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200"
                        >
                            {activeSlide.primaryLabel}
                        </Link>

                        <Link
                            href={activeSlide.secondaryHref}
                            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/20 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-neutral-950"
                        >
                            {activeSlide.secondaryLabel}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-20 inset-x-0 z-20">
                {/* Indicators */}
                <div className="flex items-center justify-center gap-2">
                    {heroSlides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() =>
                                setActiveIndex(index)
                            }
                            aria-label={`Show slide ${index + 1}`}
                            aria-current={
                                index === activeIndex
                                    ? "true"
                                    : undefined
                            }
                            className={
                                index === activeIndex
                                    ? "h-1.5 w-10 rounded-full bg-white transition-all"
                                    : "h-1.5 w-5 rounded-full bg-white/35 transition-all hover:bg-white/70"
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <button
                type="button"
                onClick={() => {
                    window.scrollTo({
                        top: window.innerHeight,
                        behavior: "smooth"
                    });
                }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                aria-label="Scroll down to featured content"
            >
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/50 group-hover:text-white/80 transition-colors duration-300">Scroll</span>
                <div className="w-4.5 h-7.5 rounded-full border border-white/20 group-hover:border-white/45 transition-colors duration-300 flex justify-center pt-1.5">
                    <div className="w-0.75 h-1.5 rounded-full bg-primary group-hover:bg-primary-hover transition-colors duration-300 animate-bounce" />
                </div>
            </button>
        </section>
    );
}