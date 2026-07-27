import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CldImage from "@/components/common/cloudinary-image";

type AlbumDetailsPageProps = {
    params: Promise<{
        slug: string
    }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric"
});

export async function generateMetaData({
    params,
}: AlbumDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;

    const album = await prisma.album.findFirst({
        where: {
            slug,
            status: "PUBLISHED"
        },

        select: {
            title: true,
            description: true,
        },
    });

    if (!album) {
        return {
            title: "Album not found",
        };
    }

    return {
        title: album.title,
        description: album.description ?? `View the ${album.title} photography album from The Shutter Black.`,
    };
}

export default async function AlbumDetailsPage({
    params,
}: AlbumDetailsPageProps) {
    const { slug } = await params;

    const album = await prisma.album.findFirst({
        where: {
            slug,
            status: "PUBLISHED"
        },

        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            location: true,
            eventDate: true,
            publishedAt: true,

            photos: {
                where: {
                    isVisible: true
                },
                orderBy: [
                    {
                        displayOrder: "asc",
                    },
                    {
                        createdAt: "asc"
                    }
                ],

                select: {
                    id: true,
                    publicid: true,
                    secureUrl: true,
                    caption: true,
                    altText: true,
                    width: true,
                    height: true,
                    isCover: true
                },
            },
        },
    });

    if (!album) {
        notFound();
    }

    return (
        <main>
            <section className="">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <Link
                        href="/albums"
                        className="text-sm text-neutral-500 transition hover:text-black"
                    >
                        ← Back to albums
                    </Link>

                    <div className="mt-6 max-w-4xl">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm uppercase tracking-[0.18em] text-neutral-500">
                            <span>{album.category || "Photography"}</span>

                            {album.eventDate && (
                                <>
                                    <span aria-hidden="true">•</span>
                                    <span>{dateFormatter.format(album.eventDate)}</span>
                                </>
                            )}
                        </div>

                        <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            {album.title}
                        </h1>

                        {album.description && (
                            <p className="mt-1 max-w-3xl text-lg leading-8 text-neutral-600">
                                {album.description}
                            </p>
                        )}

                        {album.location && (
                            <p className="mt-1 text-sm text-neutral-500">
                                Location:{" "}
                                <span className="font-medium text-neutral-400">
                                    {album.location}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                            Gallery
                        </p>

                        <h2 className="mt-2 text-3xl font-semibold">
                            Album photographs
                        </h2>
                    </div>
                    <p className="text-sm text-neutral-500">
                        {album.photos.length}{" "}
                        {album.photos.length === 1 ? "photo" : "photos"}
                    </p>
                </div>

                {album.photos.length === 0 ? (
                    <div className="mt-10 flex min-h-80 items-center justify-center rounded-lg border border-dashed border-neutral-700 bg-neutral-800 p-10 text-center">
                        <div>
                            <h3 className="text-lg font-medium">
                                Photographs are coming soon
                            </h3>
                            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
                                The album has been published, but photographs have
                                not been uploaded yet.
                            </p>

                        </div>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {album.photos.map((photo, index) => (
                            <article
                                key={photo.id}
                                className="overflow-hidden rounded-lg border border-black/10 bg-white"
                            >
                                <div className="relative flex aspect-4/3 items-center justify-center bg-neutral-200">
                                    <CldImage
                                        src={photo.publicid}
                                        alt={
                                            photo.altText ??
                                            `${album.title} photograph ${index + 1}`
                                        }
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                    {photo.isCover && (
                                        <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white">
                                            Album cover
                                        </span>
                                    )}
                                </div>

                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}