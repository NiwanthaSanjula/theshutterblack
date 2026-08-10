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
    index?: number;
    featured?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
    index,
    featured = false,
}: AlbumCardProps) {
    return (
        <article
            className={`
                group relative overflow-hidden rounded-2xl
                bg-neutral-900
                ${featured ? "aspect-4/3 sm:aspect-video" : "aspect-4/5"}
            `}
        >
            <Link
                href={`/albums/${slug}`}
                className="absolute inset-0 block"
            >
                {/* Cover image */}
                {coverPublicId ? (
                    <CldImage
                        src={coverPublicId}
                        alt={coverAlt ?? `${title} album cover`}
                        fill
                        sizes={
                            featured
                                ? "(max-width: 1024px) 100vw, 66vw"
                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                        className="
                            object-cover
                            transition duration-700
                            ease-out
                            group-hover:scale-110
                        "
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-neutral-800">
                        <div className="text-center">
                            <p className="text-sm font-medium text-neutral-400">
                                Album cover
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                                No photographs uploaded
                            </p>
                        </div>
                    </div>
                )}

                {/* Base gradient — always visible, keeps text readable */}
                <div
                    className="
                        absolute inset-0
                        bg-linear-to-t
                        from-black/85 via-black/10 to-black/0
                        transition-opacity duration-500
                        group-hover:from-black/90
                    "
                />

                {/* Index number */}
                {typeof index === "number" && (
                    <span
                        className="
                            absolute left-5 top-5
                            font-cinzel text-xs
                            tracking-[0.2em]
                            text-white/50
                        "
                    >
                        {String(index).padStart(2, "0")}
                    </span>
                )}

                {/* Category badge */}
                <span
                    className="
                        absolute right-5 top-5
                        rounded-full border border-white/20
                        bg-black/30
                        px-3 py-1.5
                        text-[10px] font-medium
                        uppercase tracking-[0.2em]
                        text-white/80
                        backdrop-blur-sm
                    "
                >
                    {category || "Photography"}
                </span>

                {/* Content */}
                <div
                    className="
                        absolute inset-x-0 bottom-0
                        p-5
                        sm:p-6
                    "
                >
                    <h2
                        className={`
                            font-serif text-white
                            transition-transform duration-500
                            group-hover:-translate-y-1
                            ${featured
                                ? "text-3xl sm:text-4xl lg:text-5xl"
                                : "text-xl sm:text-2xl"
                            }
                        `}
                    >
                        {title}
                    </h2>

                    {(location || eventDate) && (
                        <div
                            className="
                                mt-2 flex flex-wrap items-center gap-x-3
                                text-xs text-white/50
                                sm:text-sm
                            "
                        >
                            {location && <span>{location}</span>}
                            {location && eventDate && (
                                <span aria-hidden="true">•</span>
                            )}
                            {eventDate && (
                                <span>{dateFormatter.format(eventDate)}</span>
                            )}
                        </div>
                    )}

                    {/* Reveal row — hidden until hover */}
                    <div
                        className="
                            mt-0 grid grid-rows-[0fr]
                            opacity-0
                            transition-all duration-500
                            ease-out
                            group-hover:mt-4
                            group-hover:grid-rows-[1fr]
                            group-hover:opacity-100
                        "
                    >
                        <div
                            className="
                                flex items-center justify-between
                                overflow-hidden
                                border-t border-white/10 pt-4
                            "
                        >
                            <span className="text-xs text-white/50">
                                {photoCount}{" "}
                                {photoCount === 1 ? "photo" : "photos"}
                            </span>

                            <span
                                className="
                                    inline-flex items-center gap-1.5
                                    font-cinzel text-xs
                                    uppercase tracking-[0.15em]
                                    text-primary
                                "
                            >
                                View album
                                <span
                                    className="
                                        transition-transform duration-300
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}