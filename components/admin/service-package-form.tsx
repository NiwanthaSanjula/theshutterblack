"use client";

import Link from "next/link";
import { useActionState } from "react";

import type {
    ServicePackageFormState,
    ServicePackageFormValues,
} from "@/actions/service-package-actions";

type ServicePackageServerAction = (
    previousState: ServicePackageFormState,
    formData: FormData,
) => Promise<ServicePackageFormState>;

type ServicePackageFormProps = {
    formAction: ServicePackageServerAction;
    mode: "create" | "edit";
    initialValues?: ServicePackageFormValues;
};

type FieldErrorProps = {
    errors?: string[];
};

const emptyPackageValues: ServicePackageFormValues = {
    name: "",
    shortDescription: "",
    description: "",
    priceLabel: "",
    durationLabel: "",
    featuresText: "",
    status: "DRAFT",
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

export default function ServicePackageForm({
    formAction,
    mode,
    initialValues = emptyPackageValues,
}: ServicePackageFormProps) {
    const initialState: ServicePackageFormState = {
        message: undefined,
        errors: {},
        values: initialValues,
    };

    const [state, action, isPending] =
        useActionState(
            formAction,
            initialState,
        );

    const isEditing = mode === "edit";

    return (
        <form
            action={action}
            className="space-y-8"
        >
            {state.message && (
                <div
                    role="alert"
                    className="rounded-md border border-red-500 bg-red-500/10 px-4 py-3 text-red-500"
                >
                    {state.message}
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
                <section className="rounded-lg border border-neutral-700 border-l-2 border-l-primary bg-neutral-800 p-6 shadow-lg shadow-black/75">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Package information
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Enter the package name, description,
                            pricing and included services.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium"
                            >
                                Package name
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                maxLength={160}
                                defaultValue={
                                    state.values?.name
                                }
                                placeholder="Example: Essential Wedding Package"
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError
                                errors={
                                    state.errors?.name
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="shortDescription"
                                className="block text-sm font-medium"
                            >
                                Short description
                            </label>

                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                rows={3}
                                maxLength={320}
                                defaultValue={
                                    state.values
                                        ?.shortDescription
                                }
                                placeholder="A short summary displayed on the package card..."
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                            />

                            <div className="flex items-start justify-between gap-4">
                                <FieldError
                                    errors={
                                        state.errors
                                            ?.shortDescription
                                    }
                                />

                                <p className="mt-1 ml-auto text-xs text-neutral-500">
                                    Maximum 320 characters
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium"
                            >
                                Full description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows={7}
                                maxLength={3000}
                                defaultValue={
                                    state.values
                                        ?.description
                                }
                                placeholder="Enter the complete package description..."
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                            />

                            <div className="flex items-start justify-between gap-4">
                                <FieldError
                                    errors={
                                        state.errors
                                            ?.description
                                    }
                                />

                                <p className="mt-1 ml-auto text-xs text-neutral-500">
                                    Maximum 3000 characters
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="priceLabel"
                                    className="block text-sm font-medium"
                                >
                                    Price label
                                </label>

                                <input
                                    id="priceLabel"
                                    name="priceLabel"
                                    type="text"
                                    maxLength={120}
                                    defaultValue={
                                        state.values
                                            ?.priceLabel
                                    }
                                    placeholder="Starting from LKR 85,000"
                                    className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />

                                <FieldError
                                    errors={
                                        state.errors
                                            ?.priceLabel
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="durationLabel"
                                    className="block text-sm font-medium"
                                >
                                    Duration
                                </label>

                                <input
                                    id="durationLabel"
                                    name="durationLabel"
                                    type="text"
                                    maxLength={120}
                                    defaultValue={
                                        state.values
                                            ?.durationLabel
                                    }
                                    placeholder="Up to 6 hours"
                                    className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />

                                <FieldError
                                    errors={
                                        state.errors
                                            ?.durationLabel
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="featuresText"
                                className="block text-sm font-medium"
                            >
                                Package features
                            </label>

                            <textarea
                                id="featuresText"
                                name="featuresText"
                                rows={9}
                                maxLength={4000}
                                defaultValue={
                                    state.values
                                        ?.featuresText
                                }
                                placeholder={`One photographer
Up to 6 hours of coverage
Professionally edited photographs
Private online gallery`}
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm leading-7 outline-none transition focus:border-primary"
                            />

                            <p className="mt-2 text-xs text-neutral-500">
                                Enter one feature per line. A
                                maximum of 20 features is allowed.
                            </p>

                            <FieldError
                                errors={
                                    state.errors
                                        ?.featuresText
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="h-fit rounded-lg border border-neutral-700 border-l-2 border-l-primary bg-neutral-800 p-6 shadow-lg shadow-black/75">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Publishing settings
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Control whether this package is
                            visible on the public website.
                        </p>
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium"
                        >
                            Package status
                        </label>

                        <select
                            id="status"
                            name="status"
                            defaultValue={
                                state.values?.status ??
                                "DRAFT"
                            }
                            className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                        >
                            <option value="DRAFT">
                                Draft — not publicly visible
                            </option>

                            <option value="PUBLISHED">
                                Published — publicly visible
                            </option>
                        </select>

                        <FieldError
                            errors={
                                state.errors?.status
                            }
                        />
                    </div>

                    <div className="mt-6 rounded-md border border-neutral-700 bg-neutral-900/50 p-4">
                        <p className="text-xs leading-5 text-neutral-400">
                            The package section will appear on
                            the public website only when at
                            least one package is published.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-md border border-primary-hover bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending
                                ? isEditing
                                    ? "Saving changes..."
                                    : "Creating package..."
                                : isEditing
                                    ? "Save changes"
                                    : "Create package"}
                        </button>

                        <Link
                            href="/admin/packages"
                            className="rounded-md border border-neutral-600 bg-neutral-900 px-5 py-3 text-center text-sm font-medium transition hover:bg-neutral-700"
                        >
                            Cancel
                        </Link>
                    </div>
                </section>
            </div>
        </form>
    );
}