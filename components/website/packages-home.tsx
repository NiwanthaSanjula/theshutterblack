

export type HomePackageItem = {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    priceLabel: string | null;
    durationLabel: string | null;
    features: string[];
};

type PackagesHomeProps = {
    packages: HomePackageItem[];
};

export default function PackagesHome({
    packages,
}: PackagesHomeProps) {
    return (
        <section
            className="
                relative isolate overflow-hidden
                bg-neutral-950 px-4 py-20 text-white
                sm:px-6 sm:py-24
                lg:h-screen lg:px-8 lg:py-12
            "
        >
            {/* Large faded background title */}
            <p
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-8 whitespace-nowrap font-cinzel text-[clamp(4rem,13vw,11rem)] leading-none text-white/[0.035]"
            >
                PACKAGES
            </p>

            <div className="relative mx-auto flex max-w-7xl flex-col lg:h-full">
                {/* Section heading */}
                <div className="flex shrink-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary sm:text-sm">
                            Photography collections
                        </p>

                        <h2 className="mt-3 font-cinzel text-3xl leading-tight sm:text-4xl lg:text-5xl">
                            Choose Your Package
                        </h2>
                    </div>

                    <p className="max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                        Flexible photography packages designed
                        for different occasions, requirements
                        and meaningful celebrations.
                    </p>
                </div>

                {/* Package cards */}
                <div
                    className="
                        mt-12 grid gap-5
                        md:grid-cols-2
                        lg:mt-8 lg:min-h-0 lg:flex-1
                        lg:grid-cols-3 lg:auto-rows-fr
                        lg:gap-5
                    "
                >
                    {packages.map((servicePackage, index) => (
                        <article
                            key={servicePackage.id}
                            className="
                                group relative flex min-h-90 flex-col
                                overflow-hidden rounded-4xl
                                border border-white/10
                                bg-linear-to-br
                                from-white/8
                                via-white/[0.035]
                                to-transparent
                                p-6 transition duration-500
                                hover:-translate-y-1
                                hover:border-primary/45
                                sm:p-7
                                lg:min-h-0
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
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary">
                                        Photography collection
                                    </p>

                                    <h3 className="mt-2 line-clamp-2 font-cinzel text-2xl leading-snug text-white">
                                        {servicePackage.name}
                                    </h3>

                                    {servicePackage.shortDescription && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">
                                            {servicePackage.shortDescription}
                                        </p>
                                    )}
                                </div>

                                {/* Price area */}
                                <div className="mt-2 border-y border-white/10 py-5">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                                        Starting from
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                                        <p className="font-cinzel text-2xl text-white xl:text-3xl">
                                            {servicePackage.priceLabel ||
                                                "Custom quote"}
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
                                            {servicePackage.features.map(
                                                (feature, featureIndex) => (
                                                    <li
                                                        key={`${servicePackage.id}-feature-${featureIndex}`}
                                                        className="flex items-start gap-3 text-sm leading-5 text-white/65"
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                                                        />

                                                        <span>
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-white/45">
                                            Package details available upon request.
                                        </p>
                                    )}
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
            </div>
        </section>
    );
}