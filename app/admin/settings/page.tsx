import SiteSettingForm from "@/components/admin/site-setting-form";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
    const siteSetting =
        await prisma.siteSetting.findUnique({
            where: {
                id: "main",
            },

            select: {
                businessName: true,
                photographerName: true,
                biography: true,
                email: true,
                phone: true,
                whatsapp: true,
                address: true,
                instagramUrl: true,
                facebookUrl: true,
            },
        });

    const initialValues = {
        businessName:
            siteSetting?.businessName ??
            "The Shutter Black",

        photographerName:
            siteSetting?.photographerName ?? "",

        biography:
            siteSetting?.biography ?? "",

        email:
            siteSetting?.email ?? "",

        phone:
            siteSetting?.phone ?? "",

        whatsapp:
            siteSetting?.whatsapp ?? "",

        address:
            siteSetting?.address ?? "",

        instagramUrl:
            siteSetting?.instagramUrl ?? "",

        facebookUrl:
            siteSetting?.facebookUrl ?? "",
    };

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <p className="text-sm text-neutral-500">
                    Website configuration
                </p>

                <h1 className="mt-1 text-3xl font-semibold">
                    Site settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                    Manage the business information,
                    biography, contact details and social
                    links displayed on the public website.
                </p>
            </div>

            <SiteSettingForm
                initialValues={initialValues}
            />
        </div>
    );
}