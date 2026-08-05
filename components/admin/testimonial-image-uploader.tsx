"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

import {
    removeTestimonialImage,
    saveTestimonialImage,
} from "@/actions/testimonial-actions";
import CldImage from "@/components/common/cloudinary-image";

type TestimonialImageUploaderProps = {
    testimonialId: string;
    testimonialName: string;
    imagePublicId: string | null;
    status: "PENDING" | "PUBLISHED" | "REJECTED";
};

type CloudinaryUploadInfo = {
    public_id?: string;
};

export default function TestimonialImageUploader({
    testimonialId,
    testimonialName,
    imagePublicId,
    status,
}: TestimonialImageUploaderProps) {
    const router = useRouter();

    const [currentPublicId, setCurrentPublicId] =
        useState<string | null>(imagePublicId);

    const [prevImagePublicId, setPrevImagePublicId] =
        useState<string | null>(imagePublicId);

    if (imagePublicId !== prevImagePublicId) {
        setPrevImagePublicId(imagePublicId);
        setCurrentPublicId(imagePublicId);
    }

    const [error, setError] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const [isSaving, startSavingTransition] =
        useTransition();

    const [isRemoving, startRemovingTransition] =
        useTransition();

    const isBusy = isSaving || isRemoving;

    function saveCloudinaryResult(
        info: CloudinaryUploadInfo,
    ) {
        if (!info.public_id) {
            setError(
                "Cloudinary did not return the uploaded image ID.",
            );

            return;
        }

        const publicId = info.public_id;

        setError(null);
        setSuccessMessage(null);

        startSavingTransition(async () => {
            const result =
                await saveTestimonialImage({
                    testimonialId,
                    publicId,
                });

            if (!result.success) {
                setError(
                    result.message ??
                    "The testimonial image could not be saved.",
                );

                return;
            }

            setCurrentPublicId(publicId);

            setSuccessMessage(
                "The testimonial image has been saved.",
            );

            router.refresh();
        });
    }

    function handleRemoveImage() {
        const confirmed = window.confirm(
            status === "PUBLISHED"
                ? "Removing this image will return the published testimonial to pending. Continue?"
                : "Remove this testimonial image?",
        );

        if (!confirmed) {
            return;
        }

        setError(null);
        setSuccessMessage(null);

        startRemovingTransition(async () => {
            const result =
                await removeTestimonialImage(
                    testimonialId,
                );

            if (!result.success) {
                setError(
                    result.message ??
                    "The testimonial image could not be removed.",
                );

                return;
            }

            setCurrentPublicId(null);

            setSuccessMessage(
                result.message ??
                "The testimonial image has been removed.",
            );

            router.refresh();
        });
    }

    return (
        <section className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-neutral-200">
                        Testimonial image
                    </h3>

                    <p className="mt-1 max-w-lg text-xs leading-5 text-neutral-500">
                        Upload a suitable landscape photograph
                        related to this customer or photography
                        session.
                    </p>

                    <p className="mt-1 text-xs text-neutral-600">
                        JPEG, PNG or WebP. Minimum 1200 × 675
                        pixels. Landscape ratio between 3:2 and
                        2:1. Maximum 10 MB.
                    </p>
                </div>

                <CldUploadWidget
                    signatureEndpoint="/api/cloudinary/signature"
                    options={{
                        sources: ["local"],
                        multiple: false,
                        maxFiles: 1,
                        maxFileSize: 10_000_000,
                        minImageWidth: 1200,
                        minImageHeight: 675,

                        clientAllowedFormats: [
                            "jpg",
                            "jpeg",
                            "png",
                            "webp",
                        ],

                        resourceType: "image",

                        folder:
                            `the-shutter-black/testimonials/${testimonialId}`,

                        tags: [
                            "the-shutter-black",
                            "testimonial",
                            testimonialId,
                        ],

                        showAdvancedOptions: false,
                        showCompletedButton: true,
                        showUploadMoreButton: false,
                        singleUploadAutoClose: true,
                    }}
                    onSuccess={(result) => {
                        if (
                            !result.info ||
                            typeof result.info === "string"
                        ) {
                            setError(
                                "Cloudinary returned an invalid upload result.",
                            );

                            return;
                        }

                        saveCloudinaryResult(
                            result.info as CloudinaryUploadInfo,
                        );
                    }}
                    onError={() => {
                        setError(
                            "The Cloudinary upload failed. Please try again.",
                        );
                    }}
                >
                    {({ open, isLoading }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={
                                isLoading ||
                                isBusy
                            }
                            className="shrink-0 rounded-md bg-primary-hover px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading
                                ? "Loading uploader..."
                                : isSaving
                                    ? "Saving image..."
                                    : currentPublicId
                                        ? "Replace image"
                                        : "Upload image"}
                        </button>
                    )}
                </CldUploadWidget>
            </div>

            {currentPublicId ? (
                <div className="mt-5">
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
                        <CldImage
                            src={currentPublicId}
                            alt={`Testimonial image for ${testimonialName}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                        />
                    </div>

                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={isBusy}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isRemoving
                                ? "Removing..."
                                : "Remove image"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-5 rounded-lg border border-dashed border-neutral-700 bg-neutral-950/50 p-8 text-center">
                    <p className="text-sm font-medium text-neutral-400">
                        No testimonial image uploaded
                    </p>

                    <p className="mt-2 text-xs text-neutral-600">
                        An image must be uploaded before this
                        testimonial can be published.
                    </p>
                </div>
            )}

            {successMessage && (
                <div className="mt-4 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-lighter">
                    {successMessage}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}
        </section>
    );
}