import { prisma } from "@/lib/prisma";
import InquiryActionControls from "@/components/admin/inquiry-action-controls";

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

const eventDateFormatter = new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

// Matches the InquiryStatus enum in schema.prisma exactly.
// `satisfies` forces a compile error here (not at the indexing site below)
// if a status is ever added/removed in the schema without updating this map.
type InquiryStatusKey = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

const statusStyles = {
    NEW: "border-primary/40 bg-primary/10 text-primary-lighter",
    READ: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    REPLIED: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    ARCHIVED: "border-white/15 bg-white/5 text-white/50",
} satisfies Record<InquiryStatusKey, string>;

const statusBorderStyles = {
    NEW: "border-l-primary",
    READ: "border-l-blue-500",
    REPLIED: "border-l-violet-500",
    ARCHIVED: "border-l-white/20",
} satisfies Record<InquiryStatusKey, string>;

export default async function AdminMessagesPage() {
    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            eventType: true,
            eventDate: true,
            location: true,
            message: true,
            status: true,
            createdAt: true,
        },
    });

    const newMessageCount = inquiries.filter((inquiry) => inquiry.status === "NEW").length;

    return (
        <div>
            <div>
                <p className="text-sm text-neutral-500">Customer communication</p>
                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl font-cinzel">messages</h1>
                <p className="mt-2 text-sm text-neutral-500">
                    {inquiries.length} {inquiries.length === 1 ? "message" : "messages"} in total
                    {newMessageCount > 0 && ` · ${newMessageCount} new`}
                </p>
            </div>

            {inquiries.length === 0 ? (
                <div className="mt-8 rounded-lg border border-dashed border-white/15 bg-white/5 p-12 text-center">
                    <h2 className="font-medium text-white">No customer messages</h2>
                    <p className="mt-2 text-sm text-white/50">
                        Messages submitted through the public contact form will appear here.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    {inquiries.map((inquiry) => (
                        <article
                            key={inquiry.id}
                            className={`
                                overflow-hidden rounded-xl border border-white/10
                                border-l-3 bg-neutral-950
                                shadow-lg shadow-black/40
                                ${statusBorderStyles[inquiry.status]}
                            `}
                        >
                            <div className="p-5 sm:p-6">
                                {/* Header */}
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold text-white">
                                            {inquiry.name}
                                        </h2>
                                        <p className="mt-1 text-xs text-white/40">
                                            Received {dateFormatter.format(inquiry.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[inquiry.status]}`}
                                    >
                                        {inquiry.status}
                                    </span>
                                </div>

                                {/* Contact — inline, not boxed */}
                                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                    <a
                                        href={`mailto:${inquiry.email}`}
                                        className="break-all text-primary-light transition hover:text-primary-lighter"
                                    >
                                        {inquiry.email}
                                    </a>

                                    {inquiry.phone && (
                                        <a
                                            href={`tel:${inquiry.phone}`}
                                            className="text-primary-light transition hover:text-primary-lighter"
                                        >
                                            {inquiry.phone}
                                        </a>
                                    )}
                                </div>

                                {/* Event details — compact inline row instead of a 3-box grid */}
                                {(inquiry.eventType || inquiry.eventDate || inquiry.location) && (
                                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/50">
                                        {inquiry.eventType && (
                                            <span>
                                                <span className="text-white/30">Event:</span> {inquiry.eventType}
                                            </span>
                                        )}
                                        {inquiry.eventDate && (
                                            <span>
                                                <span className="text-white/30">Date:</span>{" "}
                                                {eventDateFormatter.format(inquiry.eventDate)}
                                            </span>
                                        )}
                                        {inquiry.location && (
                                            <span>
                                                <span className="text-white/30">Location:</span> {inquiry.location}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Message — treated as a quote, consistent with the testimonials page */}
                                <blockquote className="mt-5 border-l-2 border-primary pl-4 text-sm leading-7 text-white/70">
                                    <p className="whitespace-pre-wrap">{inquiry.message}</p>
                                </blockquote>

                                <div className="mt-6 border-t border-white/10 pt-5">
                                    <InquiryActionControls
                                        inquiryId={inquiry.id}
                                        inquiryName={inquiry.name}
                                        status={inquiry.status}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 sm:px-6">
                                <p className="text-xs text-white/30">
                                    Message ID: {inquiry.id.slice(-8)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}