import { notFound } from "next/navigation";

import { updateServicePackage } from "@/actions/service-package-actions";
import ServicePackageForm from "@/components/admin/service-package-form";
import { prisma } from "@/lib/prisma";

type EditServicePackagePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditServicePackagePage({
    params,
}: EditServicePackagePageProps) {
    const { id } = await params;

    const servicePackage =
        await prisma.servicePackage.findUnique({
            where: {
                id,
            },

            select: {
                id: true,
                name: true,
                shortDescription: true,
                description: true,
                priceLabel: true,
                durationLabel: true,
                features: true,
                status: true,
            },
        });

    if (!servicePackage) {
        notFound();
    }

    const updateServicePackageWithId =
        updateServicePackage.bind(
            null,
            servicePackage.id,
        );

    const initialValues = {
        name: servicePackage.name,

        shortDescription:
            servicePackage.shortDescription ?? "",

        description:
            servicePackage.description ?? "",

        priceLabel:
            servicePackage.priceLabel ?? "",

        durationLabel:
            servicePackage.durationLabel ?? "",

        featuresText:
            servicePackage.features.join("\n"),

        status: servicePackage.status,
    };

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <p className="text-sm text-neutral-500">
                    Package management
                </p>

                <h1 className="mt-1 text-3xl font-semibold">
                    Edit package
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Update {servicePackage.name}.
                </p>
            </div>

            <ServicePackageForm
                mode="edit"
                formAction={
                    updateServicePackageWithId
                }
                initialValues={initialValues}
            />
        </div>
    );
}