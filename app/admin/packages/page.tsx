import Link from "next/link";

import DeleteServicePackageButton from "@/components/admin/delete-service-package-button";
import { prisma } from "@/lib/prisma";

const dateFormatter =
    new Intl.DateTimeFormat("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

export default async function PackagesPage() {
    const packages =
        await prisma.servicePackage.findMany({
            orderBy: {
                createdAt: "desc",
            },

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
            <div className="flex items-center justify-between gap-6">
                <div>
                    <p className="text-sm text-neutral-500">
                        Content management
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold">
                        Packages
                    </h1>

                    <p className="mt-1 text-sm text-neutral-500">
                        {packages.length}{" "}
                        {packages.length === 1
                            ? "package"
                            : "packages"}{" "}
                        in total
                    </p>
                </div>

                <Link
                    href="/admin/packages/new"
                    className="rounded-md bg-primary-hover px-5 py-3 text-sm font-medium text-white transition hover:bg-primary"
                >
                    Create new package
                </Link>
            </div>

            <div className="mt-8">
                {packages.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-12 text-center">
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
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {packages.map((servicePackage) => (
                            <article
                                key={servicePackage.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800 shadow-lg shadow-black/40"
                            >
                                <div className="border-b border-neutral-700 bg-linear-to-br from-neutral-800 to-neutral-950 p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-xs text-neutral-500">
                                                /packages/{servicePackage.slug}
                                            </p>

                                            <h2 className="mt-3 text-xl font-semibold text-neutral-100">
                                                {servicePackage.name}
                                            </h2>
                                        </div>

                                        <span
                                            className={
                                                servicePackage.status === "PUBLISHED"
                                                    ? "shrink-0 rounded-full border border-green-500/50 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500"
                                                    : "shrink-0 rounded-full bg-neutral-600 px-3 py-1 text-xs font-medium text-neutral-100"
                                            }
                                        >
                                            {servicePackage.status === "PUBLISHED"
                                                ? "Published"
                                                : "Draft"}
                                        </span>
                                    </div>

                                    {servicePackage.shortDescription && (
                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-400">
                                            {servicePackage.shortDescription}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-3">
                                            <p className="text-xs uppercase tracking-wide text-neutral-600">
                                                Price
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-neutral-300">
                                                {servicePackage.priceLabel ||
                                                    "Not specified"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-3">
                                            <p className="text-xs uppercase tracking-wide text-neutral-600">
                                                Duration
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-neutral-300">
                                                {servicePackage.durationLabel ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    {servicePackage.features.length > 0 ? (
                                        <div className="mt-6">
                                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                                Included features
                                            </p>

                                            <ul className="mt-3 space-y-2">
                                                {servicePackage.features
                                                    .slice(0, 5)
                                                    .map((feature, index) => (
                                                        <li
                                                            key={`${servicePackage.id}-feature-${index}`}
                                                            className="flex items-start gap-2 text-sm text-neutral-400"
                                                        >
                                                            <span className="text-primary">
                                                                ✓
                                                            </span>

                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                            </ul>

                                            {servicePackage.features.length > 5 && (
                                                <p className="mt-3 text-xs text-neutral-500">
                                                    +{" "}
                                                    {servicePackage.features.length -
                                                        5}{" "}
                                                    more
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="mt-6 text-sm text-neutral-600">
                                            No package features added.
                                        </p>
                                    )}

                                    <p className="mt-6 text-xs text-neutral-600">
                                        Created{" "}
                                        {dateFormatter.format(
                                            servicePackage.createdAt,
                                        )}
                                    </p>

                                    <div className="mt-auto flex items-center gap-3 border-t border-neutral-700 pt-5">
                                        <Link
                                            href={`/admin/packages/${servicePackage.id}/edit`}
                                            className="rounded-md bg-primary-hover px-4 py-2 text-sm font-medium text-white transition hover:bg-primary"
                                        >
                                            Edit
                                        </Link>

                                        {servicePackage.status === "PUBLISHED" && (
                                            <Link
                                                href={`/packages/${servicePackage.slug}`}
                                                target="_blank"
                                                className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-700"
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
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}