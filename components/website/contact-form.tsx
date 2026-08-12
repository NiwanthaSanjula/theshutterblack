"use client";

import { FormEvent, useState } from "react";

const eventTypes = [
    "Wedding",
    "Portrait",
    "Pre-shoot",
    "Event",
    "Corporate",
    "Family",
    "Other",
];

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const honeypot = String(formData.get("honeypot") || "");

        // If honeypot is filled out, it's a bot! Intercept and mock success silently.
        if (honeypot) {
            setSuccess(true);
            form.reset();
            return;
        }

        setIsSubmitting(true);
        setSuccess(false);
        setError("");

        const data = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            eventType: String(formData.get("eventType") || "").trim(),
            eventDate: String(formData.get("eventDate") || "").trim(),
            location: String(formData.get("location") || "").trim(),
            message: String(formData.get("message") || "").trim(),
            honeypot,
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Something went wrong. Please try again.",
                );
            }

            setSuccess(true);
            form.reset();
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from humans but filled by bots */}
            <div className="hidden" aria-hidden="true">
                <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-neutral-400"
                    >
                        Your name *
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        placeholder="Your full name"
                        className="
                            mt-2 w-full rounded-lg border
                            border-neutral-700 bg-neutral-900 px-4 py-3
                            text-sm text-white outline-none
                            transition
                            placeholder:text-neutral-500
                            focus:border-primary
                            focus:ring-1 focus:ring-primary
                        "
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-neutral-400"
                    >
                        Email address *
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={150}
                        placeholder="you@example.com"
                        className="
                            mt-2 w-full rounded-lg border
                            border-neutral-700 bg-neutral-900 px-4 py-3
                            text-sm text-white outline-none
                            transition
                            placeholder:text-neutral-500
                            focus:border-primary
                            focus:ring-1 focus:ring-primary
                        "
                    />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="phone"
                        className="text-sm font-medium text-neutral-400"
                    >
                        Phone number
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={30}
                        placeholder="+94 7X XXX XXXX"
                        className="
                            mt-2 w-full rounded-lg border
                            border-neutral-700 bg-neutral-900 px-4 py-3
                            text-sm text-white outline-none
                            transition
                            placeholder:text-neutral-500
                            focus:border-primary
                            focus:ring-1 focus:ring-primary
                        "
                    />
                </div>

                <div>
                    <label
                        htmlFor="eventType"
                        className="text-sm font-medium text-neutral-400"
                    >
                        Photography service
                    </label>

                    <select
                        id="eventType"
                        name="eventType"
                        className="
                            mt-2 w-full rounded-lg border
                            border-neutral-700 bg-neutral-900 px-4 py-3
                            text-sm text-white outline-none
                            transition
                            focus:border-primary
                            focus:ring-1 focus:ring-primary
                        "
                        defaultValue=""
                    >
                        <option value="">Select a service</option>

                        {eventTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="eventDate"
                        className="text-sm font-medium text-neutral-400"
                    >
                        Event date
                    </label>

                    <input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        className="
                            mt-2 w-full rounded-lg border
                            border-neutral-300 bg-neutral-800 px-4 py-3
                            text-sm text-neutral-400 outline-none
                            transition
                            focus:border-neutral-900
                            focus:ring-1 focus:ring-neutral-900
                        "
                    />
                </div>

                <div>
                    <label
                        htmlFor="location"
                        className="text-sm font-medium text-neutral-400"
                    >
                        Location
                    </label>

                    <input
                        id="location"
                        name="location"
                        type="text"
                        maxLength={150}
                        placeholder="Event location"
                        className="
                            mt-2 w-full rounded-lg border
                            border-neutral-700 bg-neutral-900 px-4 py-3
                            text-sm text-white outline-none
                            transition
                            placeholder:text-neutral-500
                            focus:border-primary
                            focus:ring-1 focus:ring-primary
                        "
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="text-sm font-medium text-neutral-400"
                >
                    Tell us about your project *
                </label>

                <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={2000}
                    rows={7}
                    placeholder="Tell us about your event, photography needs, preferred date, or anything else you would like us to know..."
                    className="
                        mt-2 w-full resize-none rounded-lg border
                        border-neutral-700 bg-neutral-900 px-4 py-3
                        text-sm leading-7 text-white outline-none
                        transition
                        placeholder:text-neutral-500
                        focus:border-primary
                        focus:ring-1 focus:ring-primary
                    "
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="
                        rounded-lg border border-red-200
                        bg-red-50 px-4 py-3 text-sm text-red-700
                    "
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="
                        rounded-lg border border-green-200
                        bg-green-50 px-4 py-3 text-sm text-green-700
                    "
                >
                    Thank you. Your inquiry has been sent successfully.
                    We&apos;ll get back to you soon.
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="
                    inline-flex items-center justify-center
                    rounded-full bg-primary px-7 py-3
                    text-sm font-medium text-neutral-800
                    transition hover:bg-primary/50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {isSubmitting ? "Sending..." : "Send inquiry"}
            </button>
        </form>
    );
}