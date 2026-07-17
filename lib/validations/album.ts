import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
    if (typeof value === "string" && value.trim() === "") {
        return undefined;
    }
    return value;
};

const optionalText = (maximumLength: number) => z.preprocess(
    emptyStringToUndefined,
    z.string().trim().max(maximumLength).optional(),
);

export const albumSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "The album title must contain at least 3 characters.")
        .max(120, "The album title cannot exceed 120 characters."),

    description: optionalText(2000),
    category: optionalText(80),
    location: optionalText(120),
    eventDate: z.preprocess(
        emptyStringToUndefined,
        z.coerce.date({
            error: "Enter a valid event date.",
        }).optional()
    ),

    status: z.enum(["DRAFT", "PUBLISHED"], {
        error: "Select a valid album status."
    }),

    isFeatured: z.boolean()
});

export type AlbumInput = z.infer<typeof albumSchema>;