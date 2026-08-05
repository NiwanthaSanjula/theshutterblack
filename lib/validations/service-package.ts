import z from "zod";

const emptyStringToUndefined = (
    value: unknown,
) => {
    if (
        typeof value === "string" &&
        value.trim() === ""
    ) {
        return undefined;
    }

    return value;
};

const optionalText = (
    maximumLength: number,
) => z.preprocess(
    emptyStringToUndefined,
    z
        .string()
        .trim()
        .max(maximumLength)
        .optional(),
);

function parseFeatureLines(
    value: string,
): string[] {
    const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    // Remove duplicate features lines.
    return [...new Set(lines)];
}

export const servicePackageSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(
                3,
                "The package name must contain at least 3 characters.",
            )
            .max(
                160,
                "The package name cannot exceed 160 characters.",
            ),

        shortDescription: optionalText(320),

        description: optionalText(3000),

        priceLabel: optionalText(120),

        durationLabel: optionalText(120),

        featuresText: z
            .string()
            .max(
                4000,
                "The package features are too long.",
            ),

        status: z.enum(
            ["DRAFT", "PUBLISHED"],
            {
                error:
                    "Select a valid package status.",
            },
        ),
    })
    .superRefine((values, context) => {
        const features = parseFeatureLines(
            values.featuresText,
        );

        if (features.length > 20) {
            context.addIssue({
                code: "custom",
                path: ["featuresText"],
                message:
                    "A package can contain a maximum of 20 features.",
            });
        }

        const featureIsTooLong =
            features.some(
                (feature) =>
                    feature.length > 180,
            );

        if (featureIsTooLong) {
            context.addIssue({
                code: "custom",
                path: ["featuresText"],
                message:
                    "Each package feature must contain 180 characters or fewer.",
            });
        }
    })
    .transform(
        ({
            featuresText,
            ...values
        }) => ({
            ...values,
            features:
                parseFeatureLines(
                    featuresText,
                ),
        }),
    );

export type ServicePackageInput =
    z.infer<
        typeof servicePackageSchema
    >;