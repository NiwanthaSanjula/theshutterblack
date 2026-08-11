import SiteHeader from "@/components/website/site-header";

type WebsitelayoutProps = Readonly<{
    children: React.ReactNode
}>

export default function Websitelayout({
    children,
}: WebsitelayoutProps) {
    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-neutral-950 text-neutral-100">
            <SiteHeader />

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}