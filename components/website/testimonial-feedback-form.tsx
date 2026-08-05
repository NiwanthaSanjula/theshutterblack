"use client";

import { useActionState } from "react";

import {
    submitTestimonial,
    type PublicTestimonialFormState,
} from "@/actions/testimonial-actions";

type FieldErrorProps = {
    errors?: string[];
};

const initialState: PublicTestimonialFormState = {
    success: false,
    message: undefined,
    errors: {},
    values: {
        name: "",
        email: "",
        rating: "",
        message: "",
        consentToPublish: false,
    },
};

function FieldError({
    errors,
}: FieldErrorProps) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p className="mt-2 text-sm text-red-400">
            {errors[0]}
        </p>
    );
}

export default function TestimonialFeedbackForm() {
    const [state, action, isPending] =
        useActionState(
            submitTestimonial,
            initialState,
        );

    if (state.success) {
        return (
            <div
                role="status"
                className="rounded-xl border border-primary/30 bg-primary/10 p-6"
            >
                <h3 className="text-lg font-semibold text-primary-lighter">
                    Feedback submitted
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-300">
                    {state.message ??
                        "Thank you. Your feedback has been submitted for review."}
                </p>
            </div>
        );
    }

    return (
        <form
            action={action}
            className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 shadow-xl shadow-black/20"
        >
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
                    Share your experience
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                    Leave feedback
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Your feedback will be reviewed before
                    appearing publicly.
                </p>
            </div>

            {state.message && (
                <div
                    role="alert"
                    className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {state.message}
                </div>
            )}

            <div className="mt-6 grid gap-5">
                <div>
                    <label
                        htmlFor="testimonial-name"
                        className="block text-sm font-medium text-neutral-200"
                    >
                        Name
                        <span className="ml-1 text-red-400">
                            *
                        </span>
                    </label>

                    <input
                        id="testimonial-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={120}
                        autoComplete="name"
                        defaultValue={
                            state.values?.name
                        }
                        placeholder="Your name"
                        className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-primary"
                    />

                    <FieldError
                        errors={state.errors?.name}
                    />
                </div>

                <div>
                    <label
                        htmlFor="testimonial-email"
                        className="block text-sm font-medium text-neutral-200"
                    >
                        Email
                        <span className="ml-2 text-xs font-normal text-neutral-500">
                            Optional and kept private
                        </span>
                    </label>

                    <input
                        id="testimonial-email"
                        name="email"
                        type="email"
                        maxLength={254}
                        autoComplete="email"
                        defaultValue={
                            state.values?.email
                        }
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-primary"
                    />

                    <FieldError
                        errors={state.errors?.email}
                    />
                </div>

                <div>
                    <label
                        htmlFor="testimonial-rating"
                        className="block text-sm font-medium text-neutral-200"
                    >
                        Rating
                        <span className="ml-1 text-red-400">
                            *
                        </span>
                    </label>

                    <select
                        id="testimonial-rating"
                        name="rating"
                        required
                        defaultValue={
                            state.values?.rating ?? ""
                        }
                        className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm text-white outline-none transition focus:border-primary"
                    >
                        <option value="" disabled>
                            Select a rating
                        </option>

                        <option value="5">
                            5 — Excellent
                        </option>

                        <option value="4">
                            4 — Very good
                        </option>

                        <option value="3">
                            3 — Good
                        </option>

                        <option value="2">
                            2 — Fair
                        </option>

                        <option value="1">
                            1 — Poor
                        </option>
                    </select>

                    <FieldError
                        errors={state.errors?.rating}
                    />
                </div>

                <div>
                    <label
                        htmlFor="testimonial-message"
                        className="block text-sm font-medium text-neutral-200"
                    >
                        Feedback
                        <span className="ml-1 text-red-400">
                            *
                        </span>
                    </label>

                    <textarea
                        id="testimonial-message"
                        name="message"
                        required
                        minLength={10}
                        maxLength={1500}
                        rows={5}
                        defaultValue={
                            state.values?.message
                        }
                        placeholder="Tell us about your experience..."
                        className="mt-2 w-full resize-y rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-neutral-600 focus:border-primary"
                    />

                    <div className="flex items-start justify-between gap-4">
                        <FieldError
                            errors={
                                state.errors?.message
                            }
                        />

                        <p className="mt-2 ml-auto text-xs text-neutral-600">
                            Maximum 1500 characters
                        </p>
                    </div>
                </div>

                {/* Spam honeypot. Real visitors should never use this field. */}
                <div
                    aria-hidden="true"
                    className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
                >
                    <label htmlFor="testimonial-website">
                        Website
                    </label>

                    <input
                        id="testimonial-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-700 bg-neutral-900/60 p-4">
                        <input
                            name="consentToPublish"
                            type="checkbox"
                            required
                            defaultChecked={
                                state.values
                                    ?.consentToPublish
                            }
                            className="mt-1 h-4 w-4 shrink-0 accent-primary"
                        />

                        <span>
                            <span className="block text-sm font-medium text-neutral-200">
                                Publishing permission
                            </span>

                            <span className="mt-1 block text-xs leading-5 text-neutral-500">
                                I allow my name, rating and
                                feedback to be displayed on
                                this website after review.
                            </span>
                        </span>
                    </label>

                    <FieldError
                        errors={
                            state.errors
                                ?.consentToPublish
                        }
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="mt-6 w-full rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending
                    ? "Submitting feedback..."
                    : "Submit feedback"}
            </button>
        </form>
    );
}