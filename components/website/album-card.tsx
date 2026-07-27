import Link from "next/link";
import CldImage from "@/components/common/cloudinary-image";

type AlbumCardProps = {
    title: string;
    slug: string;
    category: string | null;
    location: string | null;
    eventDate: Date | null;
    photoCount: number;
    coverPublicId: string | null;
    coverAlt: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric"
});

export default function AlbumCard({
    title,
    slug,
    category,
    location,
    eventDate,
    photoCount,
    coverPublicId,
    coverAlt,
}: AlbumCardProps) {
    return (
        <article className="group overflow-hidden rounded-lg border border-neutral-900 bg-neutral-800 shadow shadow-black">
            <Link
                href={`/albums/${slug}`}
                className="group block"
            >
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-700">
                    {coverPublicId ? (
                        <CldImage
                            src={coverPublicId}
                            alt={coverAlt ?? `${title} album cover`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-500">
                                    Album cover
                                </p>

                                <p className="mt-1 text-xs text-neutral-400">
                                    No photographs uploaded
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15cm] text-neutral-500">
                        <span>{category || "Photography"}</span>

                        <span aria-hidden="true">•</span>

                        <span>
                            {photoCount} {photoCount === 1 ? "photo" : "photos"}
                        </span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold transition group-hover:text-neutral-600">
                        {title}
                    </h2>

                    {(location || eventDate) && (
                        <div className="mt-3 space-x-4 text-sm text-neutral-500">
                            {location && <span>{location}</span>}
                            {location && eventDate && <span>•</span>}
                            {eventDate && <span>{dateFormatter.format(eventDate)}</span>}
                        </div>
                    )}

                    <p className="mt-5 text-sm font-medium">
                        View album →
                    </p>
                </div>

            </Link>
        </article>
    )
}