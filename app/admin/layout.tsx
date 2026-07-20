import AdminSidebar from "@/components/admin/admin-sidebar";

type AdminLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-neutral-900">
            <AdminSidebar />

            <div className="min-w-0 max-w-6xl mx-auto flex-1">
                {/**                 
                  <header className="border rounded-lg mt-3 px-8 py-3 border-neutral-700 bg-neutral-950 ">
                        <p className="text-sm text-emerald-500 tracking-widest uppercase">
                            Admin panel
                        </p>
                 </header>
                */}

                <main className="py-8">
                    {children}
                </main>
            </div>
        </div>
    )
}