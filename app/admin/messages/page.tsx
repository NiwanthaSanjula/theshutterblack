import { prisma } from "@/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat(
    "en-LK",
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    },
);

const eventDateFormatter =
    new Intl.DateTimeFormat("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

const statusStyles = {
    NEW:
        "border-primary/40 bg-primary/10 text-primary-lighter",

    READ:
        "border-blue-500/40 bg-blue-500/10 text-blue-300",

    REPLIED:
        "border-violet-500/40 bg-violet-500/10 text-violet-300",

    ARCHIVED:
        "border-neutral-600 bg-neutral-700/40 text-neutral-300",
};

export default async function AdminMessagesPage() {
    const inquiries =
        await prisma.inquiry.findMany({
            orderBy: {
                createdAt: "desc",
            },

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

    const newMessageCount =
        inquiries.filter(
            (inquiry) =>
                inquiry.status === "NEW",
        ).length;

    return (
        <div>
            <div>
                <p className="text-sm text-neutral-500">
                    Customer communication
                </p>

                <h1 className="mt-1 text-3xl font-semibold">
                    Messages
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    {inquiries.length}{" "}
                    {inquiries.length === 1
                        ? "message"
                        : "messages"}{" "}
                    in total
                    {newMessageCount > 0 &&
                        ` · ${newMessageCount} new`}
                </p>
            </div>

            {inquiries.length === 0 ? (
                <div className="mt-8 rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-12 text-center">
                    <h2 className="font-medium text-neutral-300">
                        No customer messages
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        Messages submitted through the
                        public contact form will appear
                        here.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    {inquiries.map((inquiry) => (
                        <article
                            key={inquiry.id}
                            className="rounded-xl border border-neutral-700 bg-neutral-800 p-6 shadow-lg shadow-black/40"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-neutral-100">
                                        {inquiry.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Received{" "}
                                        {dateFormatter.format(
                                            inquiry.createdAt,
                                        )}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[
                                        inquiry.status
                                        ]
                                        }`}
                                >
                                    {inquiry.status}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-3">
                                    <p className="text-xs uppercase tracking-wide text-neutral-600">
                                        Email
                                    </p>

                                    <a
                                        href={`mailto:${inquiry.email}`}
                                        className="mt-1 block break-all text-sm text-primary-light transition hover:text-primary-lighter"
                                    >
                                        {inquiry.email}
                                    </a>
                                </div>

                                <div className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-3">
                                    <p className="text-xs uppercase tracking-wide text-neutral-600">
                                        Phone
                                    </p>

                                    {inquiry.phone ? (
                                        <a
                                            href={`tel:${inquiry.phone}`}
                                            className="mt-1 block text-sm text-primary-light transition hover:text-primary-lighter"
                                        >
                                            {inquiry.phone}
                                        </a>
                                    ) : (
                                        <p className="mt-1 text-sm text-neutral-500">
                                            Not provided
                                        </p>
                                    )}
                                </div>
                            </div>

                            {(inquiry.eventType ||
                                inquiry.eventDate ||
                                inquiry.location) && (
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-lg border border-neutral-700 bg-neutral-900/40 p-3">
                                            <p className="text-xs uppercase tracking-wide text-neutral-600">
                                                Event
                                            </p>

                                            <p className="mt-1 text-sm text-neutral-300">
                                                {inquiry.eventType ||
                                                    "Not specified"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-neutral-700 bg-neutral-900/40 p-3">
                                            <p className="text-xs uppercase tracking-wide text-neutral-600">
                                                Date
                                            </p>

                                            <p className="mt-1 text-sm text-neutral-300">
                                                {inquiry.eventDate
                                                    ? eventDateFormatter.format(
                                                        inquiry.eventDate,
                                                    )
                                                    : "Not specified"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-neutral-700 bg-neutral-900/40 p-3">
                                            <p className="text-xs uppercase tracking-wide text-neutral-600">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm text-neutral-300">
                                                {inquiry.location ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            <div className="mt-5">
                                <p className="text-xs uppercase tracking-wide text-neutral-600">
                                    Message
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-300">
                                    {inquiry.message}
                                </p>
                            </div>

                            <p className="mt-5 border-t border-neutral-700 pt-4 text-xs text-neutral-600">
                                Message ID:{" "}
                                {inquiry.id.slice(-8)}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}