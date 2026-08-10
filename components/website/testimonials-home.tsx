"use client";

import CldImage from "@/components/common/cloudinary-image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type TestimonialHomeItem = {
    id: string;
    name: string;
    message: string;
    rating: number | null;
    imagePublicId: string;
};

type TestimonialsHomeProps = {
    testimonials: TestimonialHomeItem[];
};

const AUTO_SLIDE_SECONDS = 6;

export default function TestimonialsHome({
    testimonials,
}: TestimonialsHomeProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const segmentFillRefs = useRef<(HTMLDivElement | null)[]>([]);
    const progressTween = useRef<gsap.core.Tween | null>(null);
    const hasMounted = useRef(false);

    const nextTestimonial = useCallback(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
    }, [testimonials.length]);

    const previousTestimonial = () => {
        setActiveIndex(
            (current) =>
                (current - 1 + testimonials.length) % testimonials.length,
        );
    };

    const goTo = (index: number) => setActiveIndex(index);

    // Image crossfade + wipe + ken-burns
    useEffect(() => {
        if (testimonials.length === 0) return;

        const ctx = gsap.context(() => {
            testimonials.forEach((_, i) => {
                const imageEl = imageRefs.current[i];
                if (!imageEl) return;
                const kbEl = imageEl.querySelector<HTMLElement>("[data-kb]");

                if (i === activeIndex) {
                    gsap.set(imageEl, { zIndex: 1 });

                    if (!hasMounted.current) {
                        gsap.set(imageEl, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
                    } else {
                        gsap.fromTo(
                            imageEl,
                            { autoAlpha: 0, clipPath: "inset(0% 0% 0% 100%)" },
                            {
                                autoAlpha: 1,
                                clipPath: "inset(0% 0% 0% 0%)",
                                duration: 1,
                                ease: "power3.inOut",
                            },
                        );
                    }

                    if (kbEl) {
                        gsap.fromTo(
                            kbEl,
                            { scale: 1 },
                            {
                                scale: 1.08,
                                duration: AUTO_SLIDE_SECONDS + 1.5,
                                ease: "none",
                                overwrite: "auto",
                            },
                        );
                    }
                } else {
                    gsap.set(imageEl, { zIndex: 0 });
                    gsap.to(imageEl, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
                }
            });
        });

        hasMounted.current = true;
        return () => ctx.revert();
    }, [activeIndex, testimonials]);

    // Text stagger entrance
    useEffect(() => {
        if (!contentRef.current) return;
        const children = contentRef.current.querySelectorAll("[data-stagger]");
        const underline = contentRef.current.querySelector("[data-underline]");

        const tl = gsap.timeline();
        tl.fromTo(
            children,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
        );
        if (underline) {
            tl.fromTo(
                underline,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.6, ease: "power3.out", transformOrigin: "left" },
                "-=0.4",
            );
        }

        return () => {
            tl.kill();
        };
    }, [activeIndex]);

    // Autoplay via story-style progress segments
    useEffect(() => {
        if (testimonials.length <= 1) return;

        segmentFillRefs.current.forEach((fillEl, i) => {
            if (!fillEl) return;
            if (i < activeIndex) gsap.set(fillEl, { scaleX: 1 });
            if (i > activeIndex) gsap.set(fillEl, { scaleX: 0 });
        });

        const activeFill = segmentFillRefs.current[activeIndex];
        progressTween.current?.kill();

        if (activeFill) {
            gsap.set(activeFill, { scaleX: 0 });
            progressTween.current = gsap.to(activeFill, {
                scaleX: 1,
                duration: AUTO_SLIDE_SECONDS,
                ease: "none",
                onComplete: nextTestimonial,
            });
            if (isPaused) progressTween.current.pause();
        }

        return () => {
            progressTween.current?.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, testimonials.length]);

    useEffect(() => {
        if (isPaused) {
            progressTween.current?.pause();
        } else {
            progressTween.current?.play();
        }
    }, [isPaused]);

    if (testimonials.length === 0) {
        return null;
    }

    const active = testimonials[activeIndex];

    return (
        <section
            className="
                relative isolate overflow-hidden
                bg-neutral-950 text-white
                lg:h-screen
            "
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Large background title */}
            <p
                aria-hidden="true"
                className="
                    pointer-events-none absolute
                    inset-x-0 top-8
                    select-none whitespace-nowrap
                    text-center font-serif
                    text-[clamp(4rem,13vw,12rem)]
                    leading-none
                    tracking-[0.04em]
                    text-white/[0.035]
                "
            >
                CLIENT STORIES
            </p>

            <div
                className="
                    relative mx-auto flex min-h-162.5
                    max-w-7xl items-center
                    px-6 py-20
                    sm:px-8
                    lg:h-full lg:min-h-0
                    lg:px-12
                "
            >
                <div className="w-full">
                    {/* Section heading */}
                    <div className="mb-10 flex items-center gap-4 lg:mb-12">
                        <span className="h-px w-10 bg-primary/60" />
                        <p
                            className="
                                text-xs font-medium
                                uppercase tracking-[0.3em]
                                text-primary
                                sm:text-sm
                            "
                        >
                            Client stories
                        </p>
                    </div>

                    <div
                        className="
                            mx-auto grid max-w-6xl
                            items-center
                            gap-10
                            lg:grid-cols-[1.15fr_0.85fr]
                            lg:gap-16
                        "
                    >
                        {/* Stacked crossfading image */}
                        <div
                            className="
                                relative overflow-hidden
                                rounded-4xl
                                border border-white/10
                                bg-neutral-900
                            "
                        >
                            <div className="relative aspect-video">
                                {testimonials.map((testimonial, i) => (
                                    <div
                                        key={testimonial.id}
                                        ref={(el) => {
                                            imageRefs.current[i] = el;
                                        }}
                                        className="absolute inset-0"
                                        style={{ visibility: "hidden" }}
                                    >
                                        <div data-kb className="relative h-full w-full">
                                            <CldImage
                                                src={testimonial.imagePublicId}
                                                alt={testimonial.name}
                                                fill
                                                sizes="
                                                    (max-width: 1024px) 100vw,
                                                    65vw
                                                "
                                                className="object-cover"
                                            />
                                        </div>

                                        <div
                                            className="
                                                absolute inset-0
                                                bg-linear-to-t
                                                from-black/55
                                                via-transparent
                                                to-transparent
                                            "
                                        />

                                        <div
                                            className="
                                                absolute right-5
                                                top-5
                                                rounded-full
                                                border
                                                border-white/15
                                                bg-black/30
                                                px-3 py-1.5
                                                text-[10px]
                                                tracking-[0.2em]
                                                text-white/70
                                                backdrop-blur-sm
                                            "
                                        >
                                            CLIENT STORY
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonial content */}
                        <div className="relative max-w-xl">
                            <span
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -left-5
                                    -top-16
                                    select-none
                                    font-serif
                                    text-[10rem]
                                    leading-none
                                    text-primary/20
                                "
                            >
                                “
                            </span>

                            <div ref={contentRef} key={active.id} className="relative">
                                <p
                                    data-stagger
                                    className="
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.3em]
                                        text-primary
                                        sm:text-xs
                                    "
                                >
                                    What clients say
                                </p>

                                <p
                                    data-stagger
                                    className="
                                        mt-7
                                        font-serif
                                        text-2xl
                                        leading-relaxed
                                        text-white/90
                                        sm:text-lg
                                        lg:text-xl
                                        lg:leading-normal
                                    "
                                >
                                    {active.message}
                                </p>

                                {active.rating && (
                                    <div
                                        data-stagger
                                        className="mt-7 flex gap-1"
                                        aria-label={`${active.rating} out of 5 stars`}
                                    >
                                        {Array.from({ length: active.rating }).map((_, index) => (
                                            <span key={index} className="text-primary">
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div
                                    data-stagger
                                    className="
                                        mt-8
                                        border-t
                                        border-white/10
                                        pt-6
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            uppercase
                                            tracking-[0.3em]
                                            text-white/35
                                        "
                                    >
                                        Client
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            font-cinzel
                                            text-xl
                                            text-white
                                        "
                                    >
                                        {active.name}
                                    </p>
                                    <span
                                        data-underline
                                        className="mt-2 block h-px w-16 bg-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation: story-style progress + arrows */}
                    {testimonials.length > 1 && (
                        <div
                            className="
                                mx-auto mt-10
                                max-w-6xl
                                border-t border-white/10
                                pt-6
                                lg:mt-12
                            "
                        >
                            {/* Segmented progress bars */}
                            <div className="flex gap-2">
                                {testimonials.map((testimonial, i) => (
                                    <button
                                        key={testimonial.id}
                                        type="button"
                                        onClick={() => goTo(i)}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                        className="
                                            group relative h-1 flex-1
                                            overflow-hidden rounded-full
                                            bg-white/10
                                        "
                                    >
                                        <div
                                            ref={(el) => {
                                                segmentFillRefs.current[i] = el;
                                            }}
                                            className="
                                                absolute inset-y-0 left-0
                                                w-full origin-left
                                                rounded-full bg-primary
                                            "
                                            style={{ transform: "scaleX(0)" }}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={previousTestimonial}
                                        aria-label="Previous testimonial"
                                        className="
                                            flex h-11 w-11
                                            items-center justify-center
                                            rounded-full
                                            border border-white/15
                                            text-white
                                            transition
                                            hover:border-primary
                                            hover:text-primary
                                        "
                                    >
                                        ←
                                    </button>

                                    <button
                                        type="button"
                                        onClick={nextTestimonial}
                                        aria-label="Next testimonial"
                                        className="
                                            flex h-11 w-11
                                            items-center justify-center
                                            rounded-full
                                            border border-white/15
                                            text-white
                                            transition
                                            hover:border-primary
                                            hover:text-primary
                                        "
                                    >
                                        →
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsPaused((p) => !p)}
                                        aria-label={isPaused ? "Play" : "Pause"}
                                        className="
                                            ml-1 flex h-11 w-11
                                            items-center justify-center
                                            rounded-full
                                            border border-white/15
                                            text-xs text-white/70
                                            transition
                                            hover:border-primary
                                            hover:text-primary
                                        "
                                    >
                                        {isPaused ? "▶" : "❚❚"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-cinzel text-sm text-primary">
                                        {String(activeIndex + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-white/20">/</span>
                                    <span className="text-sm text-white/35">
                                        {String(testimonials.length).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}