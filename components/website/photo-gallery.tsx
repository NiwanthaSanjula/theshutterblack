"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CldImage from "@/components/common/cloudinary-image";

type Photo = {
    id: string;
    publicid: string;
    secureUrl: string;
    caption: string | null;
    altText: string | null;
    width: number | null;
    height: number | null;
    isCover: boolean;
};

type PhotoGalleryProps = {
    albumTitle: string;
    coverPhoto: Photo | null;
    photos: Photo[];
};

const FALLBACK_RATIO = "4 / 3";

function getAspectRatio(photo: Photo): string {
    if (!photo.width || !photo.height) return FALLBACK_RATIO;
    return `${photo.width} / ${photo.height}`;
}

export default function PhotoGallery({
    albumTitle,
    coverPhoto,
    photos,
}: PhotoGalleryProps) {
    // Lightbox indexes into the combined list (cover first, if present)
    // so prev/next navigation covers every photo in the album, not just the grid.
    const allPhotos = useMemo(
        () => (coverPhoto ? [coverPhoto, ...photos] : photos),
        [coverPhoto, photos],
    );

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const closeLightbox = useCallback(() => setActiveIndex(null), []);

    const showPrev = useCallback(() => {
        setActiveIndex((current) =>
            current === null ? null : (current - 1 + allPhotos.length) % allPhotos.length,
        );
    }, [allPhotos.length]);

    const showNext = useCallback(() => {
        setActiveIndex((current) =>
            current === null ? null : (current + 1) % allPhotos.length,
        );
    }, [allPhotos.length]);

    useEffect(() => {
        if (activeIndex === null) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeLightbox();
            if (event.key === "ArrowLeft") showPrev();
            if (event.key === "ArrowRight") showNext();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [activeIndex, closeLightbox, showPrev, showNext]);

    const activePhoto = activeIndex !== null ? allPhotos[activeIndex] : null;

    return (
        <>
            {/* Hero — the album's cover photo, full width */}
            {coverPhoto && (
                <button
                    type="button"
                    onClick={() => setActiveIndex(0)}
                    className="group relative mt-10 block w-full overflow-hidden rounded-2xl border border-white/10"
                    style={{ aspectRatio: "16 / 9" }}
                >
                    <CldImage
                        src={coverPhoto.publicid}
                        alt={coverPhoto.altText ?? `${albumTitle} cover photograph`}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                        Album cover
                    </span>
                    {coverPhoto.caption && (
                        <span className="absolute bottom-5 left-5 right-5 text-left text-sm text-white/80">
                            {coverPhoto.caption}
                        </span>
                    )}
                </button>
            )}

            {/* Bento-style masonry — real image aspect ratios via CSS columns */}
            {photos.length > 0 && (
                <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {photos.map((photo, index) => (
                        <button
                            key={photo.id}
                            type="button"
                            onClick={() => setActiveIndex(coverPhoto ? index + 1 : index)}
                            className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 break-inside-avoid"
                            style={{ aspectRatio: getAspectRatio(photo) }}
                        >
                            <CldImage
                                src={photo.publicid}
                                alt={photo.altText ?? `${albumTitle} photograph ${index + 1}`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition duration-500 group-hover:scale-105"
                            />
                            {photo.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <p className="text-left text-xs text-white/85">
                                        {photo.caption}
                                    </p>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {activePhoto && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${albumTitle} photograph viewer`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-10"
                    onClick={closeLightbox}
                >
                    <button
                        type="button"
                        onClick={closeLightbox}
                        aria-label="Close"
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-primary hover:text-primary"
                    >
                        ✕
                    </button>

                    {allPhotos.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    showPrev();
                                }}
                                aria-label="Previous photograph"
                                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-primary hover:text-primary sm:left-8"
                            >
                                ←
                            </button>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    showNext();
                                }}
                                aria-label="Next photograph"
                                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-primary hover:text-primary sm:right-8"
                            >
                                →
                            </button>
                        </>
                    )}

                    <div
                        className="relative flex max-h-full max-w-5xl flex-col items-center"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="relative h-[min(80vh,900px)] w-[min(90vw,1200px)]">
                            <CldImage
                                src={activePhoto.publicid}
                                alt={
                                    activePhoto.altText ??
                                    `${albumTitle} photograph ${activeIndex! + 1}`
                                }
                                fill
                                sizes="90vw"
                                className="object-contain"
                            />
                        </div>

                        {activePhoto.caption && (
                            <p className="mt-4 max-w-2xl text-center text-sm text-white/70">
                                {activePhoto.caption}
                            </p>
                        )}

                        <p className="mt-2 text-xs text-white/40">
                            {activeIndex! + 1} / {allPhotos.length}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}