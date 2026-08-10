import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import PhotoGallery from "@/components/website/photo-gallery";
import CldImage from "@/components/common/cloudinary-image";

type AlbumDetailsPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

const PHOTO_LIMIT = 60;

// Wrapped in React's cache() so generateMetadata and the page component
// share one DB round-trip per request instead of two separate ones.
const getAlbum = cache(async (slug: string) => {
    return prisma.album.findFirst({
        where: {
            slug,
            status: "PUBLISHED",
        },
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            location: true,
            eventDate: true,
            publishedAt: true,
            _count: {
                select: { photos: { where: { isVisible: true } } },
            },
            photos: {
                where: { isVisible: true },
                orderBy: [{ isCover: "desc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
                take: PHOTO_LIMIT,
                select: {
                    id: true,
                    publicid: true,
                    secureUrl: true,
                    caption: true,
                    altText: true,
                    width: true,
                    height: true,
                    isCover: true,
                },
            },
        },
    });
});

export async function generateMetadata({
    params,
}: AlbumDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const album = await getAlbum(slug);

        if (!album) {
            return { title: "Album not found" };
        }

        const description =
            album.description ??
            `View the ${album.title} photography album from The Shutter Black.`;
        const coverImage = album.photos.find((photo) => photo.isCover) ?? album.photos[0];

        return {
            title: album.title,
            description,
            openGraph: {
                title: album.title,
                description,
                images: coverImage ? [{ url: coverImage.secureUrl }] : undefined,
            },
            twitter: {
                card: "summary_large_image",
                title: album.title,
                description,
                images: coverImage ? [coverImage.secureUrl] : undefined,
            },
        };
    } catch (error) {
        // generateMetadata runs before error.tsx exists for this render pass,
        // so a thrown error here can produce a blank <head> instead of a
        // graceful fallback. Fall back to generic metadata instead.
        console.error("Failed to load album metadata:", error);
        return { title: "The Shutter Black" };
    }
}

export default async function AlbumDetailsPage({ params }: AlbumDetailsPageProps) {
    const { slug } = await params;

    let album: Awaited<ReturnType<typeof getAlbum>>;

    try {
        album = await getAlbum(slug);
    } catch (error) {
        // Let error.tsx (in this same route folder) handle rendering the
        // fallback UI — re-throwing is what triggers that boundary.
        console.error("Failed to load album:", error);
        throw error;
    }

    if (!album) {
        notFound();
    }

    const coverPhoto = album.photos.find((photo) => photo.isCover) ?? null;
    const isTruncated = album._count.photos > album.photos.length;

    return (
        <main className="min-h-screen bg-neutral-950">
            <section className="relative overflow-hidden">
                {/* Cover photo as a fading hero background */}
                {coverPhoto && (
                    <div className="absolute inset-0">
                        <CldImage
                            src={coverPhoto.publicid}
                            alt=""
                            aria-hidden="true"
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                        {/* Fades the image into the page's bg-neutral-950 at the bottom,
                            plus a top-down darken so nav/text stay readable over any photo. */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-neutral-950" />
                    </div>
                )}

                <div
                    className={`
                        relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12
                        pb-16
                        ${coverPhoto ? "pt-40 sm:pt-48 lg:pt-56" : "pt-28 sm:pt-32"}
                    `}
                >
                    <Link
                        href="/albums"
                        className="text-sm text-white/60 transition hover:text-white"
                    >
                        ← Back to albums
                    </Link>

                    <div className="mt-6 max-w-4xl">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-primary">
                            <span>{album.category || "Photography"}</span>

                            {album.eventDate && (
                                <>
                                    <span aria-hidden="true">•</span>
                                    <span>{dateFormatter.format(album.eventDate)}</span>
                                </>
                            )}
                        </div>

                        <h1 className="mt-4 font-serif text-3xl leading-tight text-white sm:text-5xl">
                            {album.title}
                        </h1>

                        {album.description && (
                            <p className="mt-4 w-full text-lg leading-8 text-white/60">
                                {album.description}
                            </p>
                        )}

                        {album.location && (
                            <p className="mt-4 text-sm text-white/40">
                                Location:{" "}
                                <span className="font-medium text-white/70">
                                    {album.location}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
                <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-primary">
                            Gallery
                        </p>
                        <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                            Album photographs
                        </h2>
                    </div>
                    <p className="text-sm text-white/40">
                        {album._count.photos}{" "}
                        {album._count.photos === 1 ? "photo" : "photos"}
                    </p>
                </div>

                {album.photos.length === 0 ? (
                    <div className="mt-10 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
                        <div>
                            <h3 className="font-serif text-lg text-white">
                                Photographs are coming soon
                            </h3>
                            <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                                The album has been published, but photographs
                                have not been uploaded yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <PhotoGallery
                            albumTitle={album.title}
                            coverPhoto={null}
                            photos={album.photos}
                        />

                        {isTruncated && (
                            <p className="mt-8 text-center text-sm text-white/40">
                                Showing the first {album.photos.length} of{" "}
                                {album._count.photos} photographs.
                            </p>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}