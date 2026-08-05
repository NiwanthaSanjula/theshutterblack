import { createServicePackage } from "@/actions/service-package-actions";
import ServicePackageForm from "@/components/admin/service-package-form";

export default function NewServicePackagePage() {
    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <p className="text-sm text-neutral-500">
                    Package management
                </p>

                <h1 className="mt-1 text-3xl font-semibold">
                    Create package
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Add a new photography service package.
                </p>
            </div>

            <ServicePackageForm
                mode="create"
                formAction={createServicePackage}
            />
        </div>
    );
}