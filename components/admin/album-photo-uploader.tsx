"use client";

import { saveUploadedPhotosBatch } from "@/actions/photo-action";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";

type AlbumPhotoUploaderProps = {
    albumId: string;
};

type CloudinaryUploadInfo = {
    public_id?: string;
    secure_url?: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
};

export default function AlbumPhotoUploader({
    albumId,
}: AlbumPhotoUploaderProps) {
    const router = useRouter();

    const [isSaving, startSavingTransition] = useTransition();
    const [savedCount, setSavedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Keep track of Cloudinary files uploaded in the current session
    const pendingPhotos = useRef<CloudinaryUploadInfo[]>([]);

    function saveCloudinaryResult(
        info: CloudinaryUploadInfo,
    ) {
        if (!info.public_id || !info.secure_url) {
            setError(
                "Cloudinary did not return the required image information.",
            );
            return;
        }

        // Prevent duplicate results in the batch
        const isDuplicate = pendingPhotos.current.some(
            (p) => p.public_id === info.public_id
        );

        if (isDuplicate) {
            return;
        }

        pendingPhotos.current.push(info);
    }

    function handleUploadOpen() {
        setError(null);
        setSavedCount(0);
        pendingPhotos.current = [];
    }

    function handleUploadClose() {
        if (pendingPhotos.current.length === 0) {
            return;
        }

        setError(null);

        startSavingTransition(async () => {
            const result = await saveUploadedPhotosBatch({
                albumId,
                photos: pendingPhotos.current.map((info) => ({
                    publicId: info.public_id!,
                    secureUrl: info.secure_url!,
                    width: info.width ?? null,
                    height: info.height ?? null,
                    format: info.format ?? null,
                    fileSize: info.bytes ?? null,
                })),
            });

            if (!result.success) {
                setError(
                    result.message ??
                    "The images could not be saved.",
                );

                return;
            }

            setSavedCount(pendingPhotos.current.length);
            pendingPhotos.current = [];
            router.refresh();
        });
    }

    return (
        <section className="rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-lg shadow-black/50">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Upload photographs
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">
                        Upload JPEG, PNG or WebP photographs.
                        You may select multiple images at once.
                    </p>
                </div>

                <CldUploadWidget
                    signatureEndpoint="/api/cloudinary/signature"
                    options={{
                        uploadPreset: "ml_default",
                        sources: ["local"],
                        multiple: true,
                        maxFiles: 50,
                        maxFileSize: 20_000_000,
                        maxImageWidth: 2000,
                        maxImageHeight: 2000,
                        clientAllowedFormats: [
                            "jpg",
                            "jpeg",
                            "png",
                            "webp",
                        ],
                        resourceType: "image",
                        folder: `the-shutter-black/albums/${albumId}`,
                        tags: [
                            "the-shutter-black",
                            "photography-album",
                            albumId,
                        ],
                        showAdvancedOptions: false,
                        showCompletedButton: true,
                        showUploadMoreButton: true,
                    }}
                    onOpen={handleUploadOpen}
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
                    onClose={handleUploadClose}
                >
                    {({ open, isLoading }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={isLoading || isSaving}
                            className="
                                rounded-md
                                bg-primary-hover
                                px-5 py-3
                                text-sm font-medium
                                text-white
                                transition
                                hover:bg-primary
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {isLoading
                                ? "Loading uploader..."
                                : isSaving
                                    ? "Saving photos..."
                                    : "Upload"}
                        </button>
                    )}
                </CldUploadWidget>
            </div>

            {savedCount > 0 && (
                <div className="mt-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {savedCount}{" "}
                    {savedCount === 1
                        ? "photo has"
                        : "photos have"}{" "}
                    been added to this album.
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <p className="mt-5 text-xs leading-5 text-neutral-400">
                Upload web-ready photographs rather than original
                RAW camera files. The current limit is 20 MB per
                image and 50 images per upload batch.
            </p>
        </section>
    );
}