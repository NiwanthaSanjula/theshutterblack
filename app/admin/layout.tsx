import AdminSidebar from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";

type AdminLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await requireAdmin();

    const unreadCount = await prisma.inquiry.count({
        where: {
            status: "NEW",
        },
    });

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 lg:flex">
            <AdminSidebar
                adminEmail={session.user?.email ?? "CMS Administrator"}
                unreadMessagesCount={unreadCount}
            />

            <div className="min-w-0 flex-1">
                <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}