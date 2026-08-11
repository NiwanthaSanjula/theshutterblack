"use client";

import { useActionState, useState } from "react";

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

function FieldError({ errors }: FieldErrorProps) {
    if (!errors?.length) return null;

    return <p className="mt-2 text-sm text-red-500">{errors[0]}</p>;
}

function ViewRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <p className="text-sm font-medium text-white/50">{label}</p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-white sm:col-span-2">
                {value?.trim() ? value : <span className="text-white/30">Not set</span>}
            </p>
        </div>
    );
}

function TextField({
    label,
    required,
    errors,
    ...inputProps
}: {
    label: string;
    required?: boolean;
    errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label htmlFor={inputProps.id} className="block text-sm font-medium text-white/80">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <input
                {...inputProps}
                required={required}
                className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary"
            />

            <FieldError errors={errors} />
        </div>
    );
}

export default function SiteSettingForm({ initialValues }: SiteSettingFormProps) {
    const initialState: SiteSettingFormState = {
        success: false,
        message: undefined,
        errors: {},
        values: initialValues,
    };

    const [state, action, isPending] = useActionState(updateSiteSettings, initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [prevState, setPrevState] = useState(state);

    // Drop back into view mode automatically once a save succeeds during render
    if (state !== prevState) {
        setPrevState(state);
        if (state.success) {
            setIsEditing(false);
        }
    }

    const values = state.values ?? initialValues;

    // --- View mode ---
    if (!isEditing) {
        return (
            <div className="space-y-6">
                {state.message && state.success && (
                    <div
                        role="status"
                        className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary-lighter"
                    >
                        {state.message}
                    </div>
                )}

                <div className="rounded-lg border border-white/10 bg-neutral-950 shadow-lg shadow-black/50 border-l-3 border-l-primary">
                    <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Business profile
                            </h2>
                            <p className="mt-1 text-sm text-white/50">
                                Shown across the public website.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="w-full shrink-0 rounded-md bg-primary-hover px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary sm:w-auto"
                        >
                            Edit settings
                        </button>
                    </div>

                    <div className="divide-y divide-white/10 px-5 sm:px-6">
                        <ViewRow label="Business name" value={values.businessName} />
                        <ViewRow label="Photographer name" value={values.photographerName} />
                        <ViewRow label="Biography" value={values.biography} />
                        <ViewRow label="Business address" value={values.address} />
                    </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-neutral-950 shadow-lg shadow-black/50 border-l-3 border-l-primary">
                    <div className="border-b border-white/10 p-5 sm:p-6">
                        <h2 className="text-lg font-semibold text-white">
                            Contact and social links
                        </h2>
                        <p className="mt-1 text-sm text-white/50">
                            Used on the contact page, footer and contact sections.
                        </p>
                    </div>

                    <div className="divide-y divide-white/10 px-5 sm:px-6">
                        <ViewRow label="Public email" value={values.email} />
                        <ViewRow label="Phone number" value={values.phone} />
                        <ViewRow label="WhatsApp number" value={values.whatsapp} />
                        <ViewRow label="Instagram link" value={values.instagramUrl} />
                        <ViewRow label="Facebook link" value={values.facebookUrl} />
                    </div>
                </div>
            </div>
        );
    }

    // --- Edit mode ---
    return (
        <form action={action} className="space-y-6">
            {state.message && !state.success && (
                <div
                    role="alert"
                    className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {state.message}
                </div>
            )}

            <section className="rounded-lg border border-white/10 bg-neutral-950 p-5 shadow-lg shadow-black/50 sm:p-6 border-l-3 border-l-primary">
                <div>
                    <h2 className="text-lg font-semibold text-white">Business profile</h2>
                    <p className="mt-1 text-sm text-white/50">
                        These details will be used on the public website.
                    </p>
                </div>

                <div className="mt-6 grid gap-5">
                    <TextField
                        id="businessName"
                        name="businessName"
                        label="Business name"
                        required
                        minLength={2}
                        maxLength={120}
                        defaultValue={values.businessName}
                        placeholder="The Shutter Black"
                        errors={state.errors?.businessName}
                    />

                    <TextField
                        id="photographerName"
                        name="photographerName"
                        label="Photographer name"
                        maxLength={120}
                        defaultValue={values.photographerName}
                        placeholder="Photographer's full name"
                        errors={state.errors?.photographerName}
                    />

                    <div>
                        <label htmlFor="biography" className="block text-sm font-medium text-white/80">
                            Biography
                        </label>

                        <textarea
                            id="biography"
                            name="biography"
                            rows={10}
                            maxLength={5000}
                            defaultValue={values.biography}
                            placeholder="Write about the photographer, experience and photography style..."
                            className="mt-2 w-full resize-y rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm leading-7 text-white outline-none transition focus:border-primary"
                        />

                        <div className="flex items-start justify-between gap-4">
                            <FieldError errors={state.errors?.biography} />
                            <p className="mt-2 ml-auto shrink-0 text-xs text-white/40">
                                Max 5000 characters
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-white/80">
                            Business address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            rows={3}
                            maxLength={500}
                            defaultValue={values.address}
                            placeholder="Enter the studio or business address..."
                            className="mt-2 w-full resize-y rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm leading-6 text-white outline-none transition focus:border-primary"
                        />

                        <FieldError errors={state.errors?.address} />
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-neutral-950 p-5 shadow-lg shadow-black/50 sm:p-6 border-l-3 border-l-primary">
                <div>
                    <h2 className="text-lg font-semibold text-white">Contact and social links</h2>
                    <p className="mt-1 text-sm text-white/50">
                        Used on the contact page, footer and contact sections.
                    </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Public email"
                        maxLength={254}
                        autoComplete="email"
                        defaultValue={values.email}
                        placeholder="hello@example.com"
                        errors={state.errors?.email}
                    />

                    <TextField
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Phone number"
                        maxLength={30}
                        autoComplete="tel"
                        defaultValue={values.phone}
                        placeholder="+94 77 123 4567"
                        errors={state.errors?.phone}
                    />

                    <TextField
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        label="WhatsApp number"
                        maxLength={30}
                        defaultValue={values.whatsapp}
                        placeholder="+94 77 123 4567"
                        errors={state.errors?.whatsapp}
                    />

                    <TextField
                        id="instagramUrl"
                        name="instagramUrl"
                        type="url"
                        label="Instagram link"
                        maxLength={500}
                        defaultValue={values.instagramUrl}
                        placeholder="https://instagram.com/..."
                        errors={state.errors?.instagramUrl}
                    />

                    <TextField
                        id="facebookUrl"
                        name="facebookUrl"
                        type="url"
                        label="Facebook link"
                        maxLength={500}
                        defaultValue={values.facebookUrl}
                        placeholder="https://facebook.com/..."
                        errors={state.errors?.facebookUrl}
                        className="sm:col-span-2"
                    />
                </div>
            </section>

            {/* Sticky-ish action bar — stacks full-width on mobile, inline on larger screens */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isPending}
                    className="rounded-md border border-white/15 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-40"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-48"
                >
                    {isPending ? "Saving settings..." : "Save settings"}
                </button>
            </div>
        </form>
    );
}