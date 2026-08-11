import Link from "next/link";

import DeleteServicePackageButton from "@/components/admin/delete-service-package-button";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

export default async function PackagesPage() {
    const packages = await prisma.servicePackage.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            priceLabel: true,
            durationLabel: true,
            features: true,
            status: true,
            createdAt: true,
        },
    });

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-neutral-500">Content management</p>
                    <h1 className="mt-1 text-2xl font-semibold sm:text-3xl font-cinzel">packages</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        {packages.length} {packages.length === 1 ? "package" : "packages"} in total
                    </p>
                </div>

                <Link
                    href="/admin/packages/new"
                    className="inline-block rounded-md bg-primary-hover px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-primary"
                >
                    Create new package
                </Link>
            </div>

            {packages.length === 0 ? (
                <div className="mt-8 rounded-lg border border-dashed border-neutral-700 bg-neutral-900/50 p-12 text-center">
                    <p className="text-neutral-500">
                        No packages have been created yet.
                    </p>
                    <Link
                        href="/admin/packages/new"
                        className="mt-5 inline-block text-sm font-medium text-primary"
                    >
                        + Create your first package
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {packages.map((servicePackage, index) => (
                        <article
                            key={servicePackage.id}
                            className="
                                group relative flex min-h-96 flex-col
                                overflow-hidden rounded-4xl
                                border border-white/10
                                bg-black
                                p-6 transition duration-500
                                hover:-translate-y-1
                                hover:border-primary/45
                                sm:p-7
                            "
                        >
                            {/* Decorative package number */}
                            <span
                                aria-hidden="true"
                                className="
                                    absolute right-5 top-3
                                    font-cinzel text-6xl
                                    leading-none text-white/4
                                    transition duration-500
                                    group-hover:text-primary/8
                                "
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Soft gold light */}
                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none absolute
                                    -right-20 -top-20
                                    h-56 w-56 rounded-full
                                    bg-primary/6 blur-3xl
                                    transition duration-500
                                    group-hover:bg-primary/12
                                "
                            />

                            {/* Top accent line */}
                            <div
                                aria-hidden="true"
                                className="
                                    absolute inset-x-8 top-0 h-px
                                    bg-linear-to-r
                                    from-transparent via-primary/70 to-transparent
                                "
                            />

                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-[10px] font-medium uppercase tracking-[0.28em] text-primary">
                                            /packages/{servicePackage.slug}
                                        </p>

                                        <h3 className="mt-2 line-clamp-2 font-cinzel text-2xl leading-snug text-white">
                                            {servicePackage.name}
                                        </h3>
                                    </div>

                                    <span
                                        className={`
                                            shrink-0 rounded-full px-3 py-1
                                            text-xs font-medium
                                            ${servicePackage.status === "PUBLISHED"
                                                ? "border border-green-500/50 bg-green-500/10 text-green-500"
                                                : "border border-white/15 bg-white/5 text-white/70"
                                            }
                                        `}
                                    >
                                        {servicePackage.status === "PUBLISHED" ? "Published" : "Draft"}
                                    </span>
                                </div>

                                {servicePackage.shortDescription && (
                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">
                                        {servicePackage.shortDescription}
                                    </p>
                                )}

                                {/* Price area */}
                                <div className="mt-5 border-y border-white/10 py-5">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                                        Starting from
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                                        <p className="font-cinzel text-2xl text-white xl:text-3xl">
                                            {servicePackage.priceLabel || "Custom quote"}
                                        </p>

                                        {servicePackage.durationLabel && (
                                            <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
                                                {servicePackage.durationLabel}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                                        Package includes
                                    </p>

                                    {servicePackage.features.length > 0 ? (
                                        <ul className="mt-2 grid gap-1.5">
                                            {servicePackage.features.slice(0, 5).map((feature, featureIndex) => (
                                                <li
                                                    key={`${servicePackage.id}-feature-${featureIndex}`}
                                                    className="flex items-start gap-3 text-sm leading-5 text-white/65"
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                                                    />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}

                                            {servicePackage.features.length > 5 && (
                                                <li className="pl-4 text-xs text-white/40">
                                                    + {servicePackage.features.length - 5} more
                                                </li>
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-white/45">
                                            No package features added.
                                        </p>
                                    )}
                                </div>

                                <p className="mt-4 text-xs text-white/35">
                                    Created {dateFormatter.format(servicePackage.createdAt)}
                                </p>

                                {/* Actions */}
                                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
                                    <Link
                                        href={`/admin/packages/${servicePackage.id}/edit`}
                                        className="text-sm font-medium text-primary-light transition hover:text-primary-lighter"
                                    >
                                        Edit
                                    </Link>

                                    {servicePackage.status === "PUBLISHED" && (
                                        <Link
                                            href={`/packages/${servicePackage.slug}`}
                                            target="_blank"
                                            className="text-sm font-medium text-white/60 transition hover:text-white"
                                        >
                                            View
                                        </Link>
                                    )}

                                    <div className="ml-auto">
                                        <DeleteServicePackageButton
                                            packageId={servicePackage.id}
                                            packageName={servicePackage.name}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom hover accent */}
                            <div
                                aria-hidden="true"
                                className="
                                    absolute inset-x-0 bottom-0 h-px
                                    origin-left scale-x-0
                                    bg-linear-to-r
                                    from-primary via-primary/40 to-transparent
                                    transition-transform duration-500
                                    group-hover:scale-x-100
                                "
                            />
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}