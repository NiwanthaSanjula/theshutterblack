import SiteFooter from "@/components/website/site-footer";
import SiteHeader from "@/components/website/site-header";

type WebsitelayoutProps = Readonly<{
    children: React.ReactNode
}>

export default function Websitelayout({
    children,
}: WebsitelayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />

            <main className="flex-1">
                {children}
            </main>

            <SiteFooter />
        </div>
    )
}