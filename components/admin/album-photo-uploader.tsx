"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { saveUploadedPhoto } from "@/actions/photo-action"

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
}

export default function AlbumPhotoUploader({
    albumId,
}: AlbumPhotoUploaderProps) {
    const router = useRouter();

    const [isSaving, startSavingTransition] = useTransition();
    const [savedCount, setSavedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    function saveCloudinaryResult(
        info: CloudinaryUploadInfo,
    ) {
        if (!info.public_id || !info.secure_url) {
            setError(
                "Cloudinary did not return the required image information"
            );
            return;
        }

        const publicId = info.public_id;
        const secureUrl = info.secure_url;

        setError(null);

        startSavingTransition(async () => {
            const result = await saveUploadedPhoto({
                albumId,
                publicId,
                secureUrl,
                width: info.width ?? null,
                height: info.height ?? null,
                format: info.format ?? null,
                fileSize: info.bytes ?? null,
            });

            if (!result.success) {
                setError(
                    result.message ?? "The image could not be saved."
                );
                return;
            }

            setSavedCount((currentCount) => {
                return currentCount + 1;
            });
            router.refresh();
        });
    }

    return (
        <section className="rounded-lg border border-neutral-700 shadow-lg shadow-black/50 bg-neutral-800 p-6">
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
                        sources: ["local"],
                        multiple: true,
                        maxFiles: 50,
                        maxFileSize: 20_000_000,
                        maxImageWidth: 2400,
                        maxImageHeight: 2400,
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
                    onSuccess={(result) => {
                        if (!result.info || typeof result.info === "string") {
                            setError(
                                "Cloudinary retured an invalid upload result."
                            );

                            return;
                        }

                        saveCloudinaryResult(
                            result.info as CloudinaryUploadInfo
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
                            disabled={isLoading || isSaving}
                            className="rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading
                                ? "Loading uploader..."
                                : isSaving
                                    ? "Saving photo..."
                                    : "Upload"
                            }
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
    )
}