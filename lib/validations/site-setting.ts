import { z } from "zod";

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
) =>
    z.preprocess(
        emptyStringToUndefined,
        z
            .string()
            .trim()
            .max(maximumLength)
            .optional(),
    );

const optionalEmail = z.preprocess(
    emptyStringToUndefined,
    z
        .string()
        .trim()
        .email("Enter a valid email address.")
        .max(
            254,
            "The email address is too long.",
        )
        .optional(),
);

const optionalPhoneNumber = z.preprocess(
    emptyStringToUndefined,
    z
        .string()
        .trim()
        .min(
            7,
            "The contact number is too short.",
        )
        .max(
            30,
            "The contact number is too long.",
        )
        .regex(
            /^[0-9+\-()\s]+$/,
            "Use only numbers, spaces, +, -, and parentheses.",
        )
        .optional(),
);

const optionalHttpUrl = z.preprocess(
    emptyStringToUndefined,
    z
        .string()
        .trim()
        .max(
            500,
            "The link is too long.",
        )
        .url("Enter a valid web address.")
        .refine(
            (value) => {
                try {
                    const url = new URL(value);

                    return (
                        url.protocol === "https:" ||
                        url.protocol === "http:"
                    );
                } catch {
                    return false;
                }
            },
            {
                message:
                    "The link must start with http:// or https://.",
            },
        )
        .optional(),
);

export const siteSettingSchema = z.object({
    businessName: z
        .string()
        .trim()
        .min(
            2,
            "The business name must contain at least 2 characters.",
        )
        .max(
            120,
            "The business name cannot exceed 120 characters.",
        ),

    photographerName: optionalText(120),

    biography: optionalText(5000),

    email: optionalEmail,

    phone: optionalPhoneNumber,

    whatsapp: optionalPhoneNumber,

    address: optionalText(500),

    instagramUrl: optionalHttpUrl,

    facebookUrl: optionalHttpUrl,
});

export type SiteSettingInput =
    z.infer<typeof siteSettingSchema>;