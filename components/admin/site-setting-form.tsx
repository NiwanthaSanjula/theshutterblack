"use client";

import { useActionState } from "react";

import {
    updateSiteSettings,
    type SiteSettingFormState,
    type SiteSettingFormValues,
} from "@/actions/site-setting-actions";

type SiteSettingFormProps = {
    initialValues: SiteSettingFormValues;
};

type FieldErrorProps = {
    errors?: string[];
};

function FieldError({
    errors,
}: FieldErrorProps) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p className="mt-2 text-sm text-red-500">
            {errors[0]}
        </p>
    );
}

export default function SiteSettingForm({
    initialValues,
}: SiteSettingFormProps) {
    const initialState: SiteSettingFormState = {
        success: false,
        message: undefined,
        errors: {},
        values: initialValues,
    };

    const [state, action, isPending] =
        useActionState(
            updateSiteSettings,
            initialState,
        );

    return (
        <form
            action={action}
            className="space-y-8"
        >
            {state.message && (
                <div
                    role={
                        state.success
                            ? "status"
                            : "alert"
                    }
                    className={
                        state.success
                            ? "rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary-lighter"
                            : "rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    }
                >
                    {state.message}
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                <section className="rounded-lg border border-neutral-700 border-l-2 border-l-primary bg-neutral-800 p-6 shadow-lg shadow-black/50">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Business profile
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            These details will be used on the
                            public website.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5">
                        <div>
                            <label
                                htmlFor="businessName"
                                className="block text-sm font-medium"
                            >
                                Business name
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="businessName"
                                name="businessName"
                                type="text"
                                required
                                minLength={2}
                                maxLength={120}
                                defaultValue={
                                    state.values
                                        ?.businessName
                                }
                                placeholder="The Shutter Black"
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors
                                        ?.businessName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="photographerName"
                                className="block text-sm font-medium"
                            >
                                Photographer name
                            </label>

                            <input
                                id="photographerName"
                                name="photographerName"
                                type="text"
                                maxLength={120}
                                defaultValue={
                                    state.values
                                        ?.photographerName
                                }
                                placeholder="Photographer's full name"
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors
                                        ?.photographerName
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="biography"
                                className="block text-sm font-medium"
                            >
                                Biography
                            </label>

                            <textarea
                                id="biography"
                                name="biography"
                                rows={12}
                                maxLength={5000}
                                defaultValue={
                                    state.values
                                        ?.biography
                                }
                                placeholder="Write about the photographer, experience and photography style..."
                                className="mt-2 w-full resize-y rounded-md border border-transparent bg-neutral-900 px-3 py-3 text-sm leading-7 outline-none transition focus:border-primary"
                            />

                            <div className="flex items-start justify-between gap-4">
                                <FieldError
                                    errors={
                                        state.errors
                                            ?.biography
                                    }
                                />

                                <p className="mt-2 ml-auto text-xs text-neutral-500">
                                    Maximum 5000 characters
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium"
                            >
                                Business address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                rows={4}
                                maxLength={500}
                                defaultValue={
                                    state.values
                                        ?.address
                                }
                                placeholder="Enter the studio or business address..."
                                className="mt-2 w-full resize-y rounded-md border border-transparent bg-neutral-900 px-3 py-3 text-sm leading-6 outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors?.address
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="h-fit rounded-lg border border-neutral-700 border-l-2 border-l-primary bg-neutral-800 p-6 shadow-lg shadow-black/50">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Contact and social links
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Used on the contact page, footer
                            and contact sections.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium"
                            >
                                Public email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                maxLength={254}
                                autoComplete="email"
                                defaultValue={
                                    state.values?.email
                                }
                                placeholder="hello@example.com"
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors?.email
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium"
                            >
                                Phone number
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                maxLength={30}
                                autoComplete="tel"
                                defaultValue={
                                    state.values?.phone
                                }
                                placeholder="+94 77 123 4567"
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors?.phone
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="whatsapp"
                                className="block text-sm font-medium"
                            >
                                WhatsApp number
                            </label>

                            <input
                                id="whatsapp"
                                name="whatsapp"
                                type="tel"
                                maxLength={30}
                                defaultValue={
                                    state.values
                                        ?.whatsapp
                                }
                                placeholder="+94 77 123 4567"
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors
                                        ?.whatsapp
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="instagramUrl"
                                className="block text-sm font-medium"
                            >
                                Instagram link
                            </label>

                            <input
                                id="instagramUrl"
                                name="instagramUrl"
                                type="url"
                                maxLength={500}
                                defaultValue={
                                    state.values
                                        ?.instagramUrl
                                }
                                placeholder="https://instagram.com/..."
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors
                                        ?.instagramUrl
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="facebookUrl"
                                className="block text-sm font-medium"
                            >
                                Facebook link
                            </label>

                            <input
                                id="facebookUrl"
                                name="facebookUrl"
                                type="url"
                                maxLength={500}
                                defaultValue={
                                    state.values
                                        ?.facebookUrl
                                }
                                placeholder="https://facebook.com/..."
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors
                                        ?.facebookUrl
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-7 border-t border-neutral-700 pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending
                                ? "Saving settings..."
                                : "Save settings"}
                        </button>
                    </div>
                </section>
            </div>
        </form>
    );
}