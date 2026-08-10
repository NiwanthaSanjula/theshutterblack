"use client";

import { FormEvent, useState } from "react";

export default function TestimonialPage() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");

        const form =
            event.currentTarget;

        const formData =
            new FormData(form);

        if (rating === 0) {
            setError(
                "Please select a rating.",
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response =
                await fetch(
                    "/api/testimonials",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name:
                                formData.get(
                                    "name",
                                ),
                            email:
                                formData.get(
                                    "email",
                                ),
                            message:
                                formData.get(
                                    "message",
                                ),
                            rating,
                            consentToPublish:
                                formData.get(
                                    "consentToPublish",
                                ) === "on",
                        }),
                    },
                );

            const data =
                await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Something went wrong. Please try again.",
                );
                return;
            }

            setSubmitted(true);
            form.reset();
            setRating(0);
        } catch {
            setError(
                "Unable to submit your testimonial. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white">
                <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">

                    <p
                        aria-hidden="true"
                        className="
                            pointer-events-none absolute
                            left-0 top-8
                            select-none whitespace-nowrap
                            font-cinzel
                            text-[clamp(4rem,13vw,12rem)]
                            leading-none
                            tracking-[0.04em]
                            text-white/[0.035]
                        "
                    >
                        THANK YOU
                    </p>

                    <div className="relative w-full max-w-2xl text-center">

                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                            Testimonial received
                        </p>

                        <h1 className="mt-5 font-cinzel text-4xl sm:text-5xl lg:text-6xl">
                            Thank you for sharing.
                        </h1>

                        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
                            Your experience has been
                            submitted successfully.
                            It will be reviewed before
                            appearing on The Shutter
                            Black website.
                        </p>

                        <a
                            href="/"
                            className="
                                mt-9 inline-flex
                                rounded-full
                                bg-white
                                px-7 py-3.5
                                text-sm font-medium
                                text-black
                                transition
                                hover:bg-neutral-200
                            "
                        >
                            Back to home
                        </a>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <section className="relative isolate overflow-hidden px-6 py-24 sm:px-10 lg:min-h-screen lg:px-12 lg:py-28">

                {/* Large background title */}
                <p
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        left-0 top-8
                        select-none whitespace-nowrap
                        font-cinzel
                        text-[clamp(4rem,13vw,12rem)]
                        leading-none
                        tracking-[0.04em]
                        text-white/[0.035]
                    "
                >
                    YOUR STORY
                </p>

                <div className="relative mx-auto max-w-3xl">

                    {/* Heading */}
                    <div className="text-center">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary sm:text-sm">
                            Client feedback
                        </p>

                        <h1 className="mt-4 font-cinzel text-4xl leading-tight sm:text-5xl lg:text-6xl">
                            Share your experience
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                            We would love to hear
                            about your experience
                            with The Shutter Black.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-12 space-y-6"
                    >

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="text-sm text-white/70"
                            >
                                Your name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                maxLength={120}
                                placeholder="Your name"
                                className="
                                    mt-2 w-full rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3.5
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-white/25
                                    focus:border-primary/60
                                    focus:bg-white/[0.07]
                                "
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="text-sm text-white/70"
                            >
                                Email
                                <span className="ml-2 text-white/30">
                                    Optional
                                </span>
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                maxLength={254}
                                placeholder="you@example.com"
                                className="
                                    mt-2 w-full rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3.5
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-white/25
                                    focus:border-primary/60
                                    focus:bg-white/[0.07]
                                "
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <p className="text-sm text-white/70">
                                Your rating
                            </p>

                            <div
                                className="mt-3 flex gap-2"
                                onMouseLeave={() =>
                                    setHoveredRating(0)
                                }
                            >
                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setRating(
                                                    star,
                                                )
                                            }
                                            onMouseEnter={() =>
                                                setHoveredRating(
                                                    star,
                                                )
                                            }
                                            aria-label={`${star} stars`}
                                            className="
                                                text-3xl
                                                transition
                                            "
                                        >
                                            <span
                                                className={
                                                    star <=
                                                        (hoveredRating ||
                                                            rating)
                                                        ? "text-primary"
                                                        : "text-white/20"
                                                }
                                            >
                                                ★
                                            </span>
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label
                                htmlFor="message"
                                className="text-sm text-white/70"
                            >
                                Your experience
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                required
                                maxLength={5000}
                                rows={6}
                                placeholder="Tell us about your experience..."
                                className="
                                    mt-2 w-full resize-none rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4 py-3.5
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-white/25
                                    focus:border-primary/60
                                    focus:bg-white/[0.07]
                                "
                            />
                        </div>

                        {/* Consent */}
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-white/50">
                            <input
                                type="checkbox"
                                name="consentToPublish"
                                required
                                className="mt-1 h-4 w-4 accent-primary"
                            />

                            <span>
                                I agree that my testimonial
                                may be published on The
                                Shutter Black website.
                            </span>
                        </label>

                        {/* Error */}
                        {error && (
                            <p
                                role="alert"
                                className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
                            >
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                w-full rounded-full
                                bg-white px-6 py-3.5
                                text-sm font-medium text-black
                                transition
                                hover:bg-neutral-200
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit your experience"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}