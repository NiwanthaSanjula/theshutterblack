import TestimonialImageUploader from "@/components/admin/testimonial-image-uploader";
import TestimonialModerationControls from "@/components/admin/testimonial-moderation-controls";
import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

const statusStyles = {
    PENDING: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    PUBLISHED: "border-primary/40 bg-primary/10 text-primary-lighter",
    REJECTED: "border-red-500/40 bg-red-500/10 text-red-300",
};

export default async function AdminTestimonialsPage() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            message: true,
            rating: true,
            consentToPublish: true,
            imagePublicId: true,
            status: true,
            publishedAt: true,
            createdAt: true,
        },
    });

    const pendingTestimonials = testimonials.filter((t) => t.status === "PENDING");
    const publishedTestimonials = testimonials.filter((t) => t.status === "PUBLISHED");
    const rejectedTestimonials = testimonials.filter((t) => t.status === "REJECTED");

    const statCards = [
        { label: "Pending review", value: pendingTestimonials.length },
        { label: "Published", value: publishedTestimonials.length },
        { label: "Rejected", value: rejectedTestimonials.length },
        { label: "Total received", value: testimonials.length },
    ];

    const sections = [
        {
            title: "Pending review",
            description: "New feedback waiting for moderation.",
            testimonials: pendingTestimonials,
        },
        {
            title: "Published",
            description: "Testimonials currently visible on the public website.",
            testimonials: publishedTestimonials,
        },
        {
            title: "Rejected",
            description: "Feedback that has not been approved for publishing.",
            testimonials: rejectedTestimonials,
        },
    ];

    return (
        <div>
            <div>
                <p className="text-sm text-neutral-500">Content management</p>
                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl font-cinzel">testimonials</h1>
                <p className="mt-2 text-sm text-neutral-500">
                    {testimonials.length} {testimonials.length === 1 ? "testimonial" : "testimonials"} in total
                </p>
            </div>

            {testimonials.length === 0 ? (
                <div className="mt-8 rounded-lg border border-dashed border-white/15 bg-white/5 p-12 text-center">
                    <h2 className="font-medium text-white">No testimonials received</h2>
                    <p className="mt-2 text-sm text-white/50">
                        Customer feedback will appear here after submission.
                    </p>
                </div>
            ) : (
                <>
                    <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((card) => (
                            <article
                                key={card.label}
                                className="rounded-xl border border-white/10 border-l-3 border-l-primary bg-neutral-950 p-6"
                            >
                                <p className="text-sm text-white/50">{card.label}</p>
                                <p className="mt-3 text-3xl font-semibold text-primary">{card.value}</p>
                            </article>
                        ))}
                    </section>

                    <div className="mt-10 space-y-12">
                        {sections.map((section) => {
                            if (section.testimonials.length === 0) return null;

                            return (
                                <section key={section.title}>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">
                                            {section.title}
                                        </h2>
                                        <p className="mt-1 text-sm text-white/50">
                                            {section.description}
                                        </p>
                                    </div>

                                    <div className="mt-5 grid gap-6 xl:grid-cols-2">
                                        {section.testimonials.map((testimonial) => (
                                            <article
                                                key={testimonial.id}
                                                className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-lg shadow-black/40"
                                            >
                                                <div className="p-5 sm:p-6">
                                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-lg font-semibold font-cinzel text-white">
                                                                {testimonial.name}
                                                            </h3>
                                                            <p className="mt-1 text-xs text-white/40">
                                                                Submitted {dateFormatter.format(testimonial.createdAt)}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[testimonial.status]}`}
                                                        >
                                                            {testimonial.status}
                                                        </span>
                                                    </div>

                                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                                                            <p className="text-xs uppercase tracking-wide text-white/35">
                                                                Rating
                                                            </p>
                                                            <p
                                                                aria-label={
                                                                    testimonial.rating
                                                                        ? `${testimonial.rating} out of 5 stars`
                                                                        : "No rating"
                                                                }
                                                                className="mt-1 text-sm text-amber-400"
                                                            >
                                                                {testimonial.rating
                                                                    ? `${"★".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)}`
                                                                    : "Not provided"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                                                            <p className="text-xs uppercase tracking-wide text-white/35">
                                                                Permission
                                                            </p>
                                                            <p
                                                                className={`mt-1 text-sm font-medium ${testimonial.consentToPublish
                                                                    ? "text-primary-light"
                                                                    : "text-red-400"
                                                                    }`}
                                                            >
                                                                {testimonial.consentToPublish ? "Granted" : "Not granted"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {testimonial.email && (
                                                        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                                                            <p className="text-xs uppercase tracking-wide text-white/35">
                                                                Private email
                                                            </p>
                                                            <p className="mt-1 break-all text-sm text-white/60">
                                                                {testimonial.email}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <blockquote className="mt-5 border-l-2 border-primary pl-4 text-sm leading-7 text-white/70">
                                                        “{testimonial.message}”
                                                    </blockquote>
                                                </div>

                                                {testimonial.status !== "REJECTED" && (
                                                    <div className="border-t border-white/10 p-5 sm:p-6">
                                                        <TestimonialImageUploader
                                                            testimonialId={testimonial.id}
                                                            testimonialName={testimonial.name}
                                                            imagePublicId={testimonial.imagePublicId}
                                                            status={testimonial.status}
                                                        />
                                                    </div>
                                                )}

                                                <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                                                    <TestimonialModerationControls
                                                        testimonialId={testimonial.id}
                                                        testimonialName={testimonial.name}
                                                        status={testimonial.status}
                                                        hasImage={Boolean(testimonial.imagePublicId)}
                                                        hasConsent={testimonial.consentToPublish}
                                                    />
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}