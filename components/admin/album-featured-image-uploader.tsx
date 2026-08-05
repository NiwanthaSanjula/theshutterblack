"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

import {
    removeAlbumFeaturedImage,
    saveAlbumFeaturedImage,
} from "@/actions/album-actions";
import CldImage from "@/components/common/cloudinary-image";

type AlbumFeaturedImageUploaderProps = {
    albumId: string;
    featuredImagePublicId: string | null;
};

type CloudinaryUploadInfo = {
    public_id?: string;
};

export default function AlbumFeaturedImageUploader({
    albumId,
    featuredImagePublicId,
}: AlbumFeaturedImageUploaderProps) {
    const router = useRouter();

    const [currentPublicId, setCurrentPublicId] =
        useState<string | null>(
            featuredImagePublicId,
        );

    const [prevFeaturedImagePublicId, setPrevFeaturedImagePublicId] =
        useState<string | null>(
            featuredImagePublicId,
        );

    if (featuredImagePublicId !== prevFeaturedImagePublicId) {
        setPrevFeaturedImagePublicId(featuredImagePublicId);
        setCurrentPublicId(featuredImagePublicId);
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
                await saveAlbumFeaturedImage({
                    albumId,
                    publicId,
                });

            if (!result.success) {
                setError(
                    result.message ??
                    "The featured image could not be saved.",
                );

                return;
            }

            setCurrentPublicId(publicId);

            setSuccessMessage(
                "The homepage featured image has been saved.",
            );

            router.refresh();
        });
    }

    function handleRemoveImage() {
        const confirmed = window.confirm(
            "Remove this homepage featured image?",
        );

        if (!confirmed) {
            return;
        }

        setError(null);
        setSuccessMessage(null);

        startRemovingTransition(async () => {
            const result =
                await removeAlbumFeaturedImage(
                    albumId,
                );

            if (!result.success) {
                setError(
                    result.message ??
                    "The featured image could not be removed.",
                );

                return;
            }

            setCurrentPublicId(null);

            setSuccessMessage(
                result.message ??
                "The homepage featured image has been removed.",
            );

            router.refresh();
        });
    }

    return (
        <section className="rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-lg shadow-black/50">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Homepage featured image
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                        This landscape image will be used
                        when the album appears in the
                        featured albums section.
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                        Required crop: 16:9. Minimum size:
                        1200 × 675 pixels. Maximum file size:
                        10 MB.
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
                            `the-shutter-black/albums/${albumId}/featured`,

                        tags: [
                            "the-shutter-black",
                            "featured-album",
                            albumId,
                        ],

                        cropping: true,
                        croppingAspectRatio: 16 / 9,
                        croppingDefaultSelectionRatio: 1,
                        croppingShowDimensions: true,
                        croppingValidateDimensions: true,
                        showSkipCropButton: false,

                        showAdvancedOptions: false,
                        showCompletedButton: true,
                        showUploadMoreButton: false,
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
                            className="rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
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
                <div className="mt-6">
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900">
                        <CldImage
                            src={currentPublicId}
                            alt="Album homepage featured image"
                            fill
                            sizes="(max-width: 1280px) 100vw, 900px"
                            className="object-cover"
                        />
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={isBusy}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isRemoving
                                ? "Removing..."
                                : "Remove image"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-6 rounded-lg border border-dashed border-neutral-700 bg-neutral-900/40 p-10 text-center">
                    <p className="text-sm font-medium text-neutral-300">
                        No featured image uploaded
                    </p>

                    <p className="mt-2 text-xs text-neutral-500">
                        This album cannot appear in the
                        large homepage feature section until
                        a landscape image is uploaded.
                    </p>
                </div>
            )}

            {successMessage && (
                <div className="mt-5 rounded-md border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                    {successMessage}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-5 rounded-md border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}
        </section>
    );
}