"use client";

import Link from "next/link";
import { useActionState } from "react";

import type {
    AlbumFormState,
    AlbumFormValues,
} from "@/actions/album-actions";


type AlbumServerAction = (
    previousState: AlbumFormState,
    formData: FormData
) => Promise<AlbumFormState>

type AlbumFormProps = {
    formAction: AlbumServerAction;
    mode: "create" | "edit";
    initialValues?: AlbumFormValues;
}

type FieldErrorProps = {
    errors?: string[];
};

const emptyAlbumValues: AlbumFormValues = {
    title: "",
    description: "",
    category: "",
    location: "",
    eventDate: "",
    status: "DRAFT",
    isFeatured: false,
}

function FieldError({ errors }: FieldErrorProps) {
    if (!errors?.length) {
        return null;
    }

    return (
        <p className="mt-2 text-sm text-red-500">
            {errors[0]}
        </p>
    )
}

export default function AlbumForm({
    formAction,
    mode,
    initialValues = emptyAlbumValues,
}: AlbumFormProps) {

    const initialState: AlbumFormState = {
        message: undefined,
        errors: {},
        values: initialValues
    }

    const [state, action, isPending] = useActionState(
        formAction,
        initialState
    );

    const isEditing = mode === "edit";

    return (
        <form action={action} className="space-y-8">

            {state.message && (
                <div
                    role="alert"
                    className="rounded-md border text-red-500 border-red-500 bg-red-500/10 px-4 py-3"
                >
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-[2fr_1fr] gap-5">



                <section className="border border-neutral-700 border-l-2 border-l-primary bg-neutral-800 rounded-lg shadow-lg shadow-black/75 p-6">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Album information
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Enter the main details of the photography album.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-3">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium"
                            >
                                Album title
                                <span className="ml-1 text-red-500">*</span>

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    required
                                    maxLength={120}
                                    defaultValue={state.values?.title}
                                    placeholder="Example: Tharindu and Sanduni Wedding"
                                    className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />

                                <FieldError errors={state.errors?.title} />

                            </label>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium"
                            >
                                Description
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows={6}
                                required
                                maxLength={2000}
                                defaultValue={state.values?.description}
                                placeholder="Enter a short description about the album..."
                                className="mt-2 w-full rounded-md border border-transparent bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                            />

                            <div className="flex items-center justify-between">
                                <FieldError errors={state.errors?.description} />

                                <p className="mt-1 ml-auto text-xs text-neutral-500">
                                    Maxium 2000 characters
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium"
                                >
                                    Category
                                </label>

                                <input
                                    id="category"
                                    name="category"
                                    type="text"
                                    maxLength={80}
                                    defaultValue={state.values?.category}
                                    placeholder="Wedding, Portrait, Event..."
                                    className="mt-2 w-full rounded-md border border-transparent  bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                                />
                                <FieldError errors={state.errors?.category} />
                            </div>

                            <div>
                                <label
                                    htmlFor="location"
                                    className="block text-sm font-medium"
                                >
                                    Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    maxLength={120}
                                    defaultValue={state.values?.location}
                                    placeholder="Example: Kandy, Sri Lanka"
                                    className="mt-2 w-full rounded-md border border-transparent  bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"

                                />

                                <FieldError errors={state.errors?.location} />
                            </div>
                        </div>

                        <div className="grid-cols-2">
                            <label
                                htmlFor="eventDate"
                                className="block text-sm font-medium"
                            >
                                Event date
                            </label>

                            <input
                                id="eventDate"
                                name="eventDate"
                                type="date"
                                defaultValue={state.values?.eventDate}
                                className="mt-2 w-full rounded-md border border-transparent  bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                            />

                            <FieldError errors={state.errors?.eventDate} />
                        </div>
                    </div>
                </section>


                <section className="border border-neutral-700 border-l-2 border-l-primary bg-neutral-800 rounded-lg shadow-lg shadow-black/75 p-6">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Publishing settings
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Control whether the album is publicly visible.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-6">
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium"
                            >
                                Album status
                            </label>

                            <select
                                name="status"
                                id="status"
                                defaultValue={state.values?.status ?? "DRAFT"}
                                className="mt-2 w-full rounded-md border border-neutral-700  bg-neutral-900 px-3 py-2 text-sm outline-none transition focus:border-primary"
                            >
                                <option value="DRAFT">
                                    Draft (Not visible publicly)
                                </option>

                                <option value="PUBLISHED">
                                    Published (Visible publicly)
                                </option>
                            </select>

                            <FieldError errors={state.errors?.status} />
                        </div>

                        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-neutral-600 p-4">
                            <input
                                name="isFeatured"
                                type="checkbox"
                                defaultChecked={state.values?.isFeatured}
                                className="mt-1 h-4 w-4"
                            />

                            <span>
                                <span className="block text-sm font-medium">
                                    Feature this album
                                </span>

                                <span className="block text-xs text-neutral-500">
                                    Save this setting to enable the homepage featured-image uploader.
                                </span>
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4">
                        <Link
                            href="/admin/albums"
                            className="rounded-md border border-neutral-600 bg-neutral-900 px-5 py-3 text-sm font-medium transition hover:bg-neutral-800"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-md border border-primary-hover bg-primary-hover px-5 py-3 text-sm font-medium transition hover:bg-neutral-800"
                        >
                            {isPending
                                ? isEditing
                                    ? "Saving changes..."
                                    : "Creating album..."
                                : isEditing
                                    ? "Save changes"
                                    : "Create album"
                            }
                        </button>
                    </div>
                </section>

            </div>


        </form>
    );
}