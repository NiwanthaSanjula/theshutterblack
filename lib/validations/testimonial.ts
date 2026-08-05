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

export const publicTestimonialSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(
                2,
                "Your name must contain at least 2 characters.",
            )
            .max(
                120,
                "Your name cannot exceed 120 characters.",
            ),

        email: optionalEmail,

        rating: z.coerce
            .number({
                error:
                    "Select a rating between 1 and 5.",
            })
            .int(
                "The rating must be a whole number.",
            )
            .min(
                1,
                "Select a rating between 1 and 5.",
            )
            .max(
                5,
                "Select a rating between 1 and 5.",
            ),

        message: z
            .string()
            .trim()
            .min(
                10,
                "Your feedback must contain at least 10 characters.",
            )
            .max(
                1500,
                "Your feedback cannot exceed 1500 characters.",
            ),

        consentToPublish: z
            .boolean()
            .refine(
                (value) => value,
                {
                    message:
                        "You must agree before submitting your feedback.",
                },
            ),
    });

export const testimonialImageSchema =
    z.object({
        testimonialId: z
            .string()
            .trim()
            .min(
                1,
                "A valid testimonial ID is required.",
            ),

        publicId: z
            .string()
            .trim()
            .min(
                1,
                "The uploaded image ID is required.",
            ),
    });

export type PublicTestimonialInput =
    z.infer<
        typeof publicTestimonialSchema
    >;