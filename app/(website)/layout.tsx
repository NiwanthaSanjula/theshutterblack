import SiteHeader from "@/components/website/site-header";
import WhatsAppButton from "@/components/website/whatsapp-button";
import { prisma } from "@/lib/prisma";

type WebsitelayoutProps = Readonly<{
    children: React.ReactNode
}>

export default async function Websitelayout({
    children,
}: WebsitelayoutProps) {
    const settings = await prisma.siteSetting.findFirst({
        select: {
            whatsapp: true,
            phone: true,
        },
    });

    const activeWhatsApp = settings?.whatsapp || settings?.phone;

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-neutral-950 text-neutral-100">
            <SiteHeader />

            <main className="flex-1">
                {children}
            </main>

            {activeWhatsApp && (
                <WhatsAppButton phoneNumber={activeWhatsApp} />
            )}
        </div>
    )
}