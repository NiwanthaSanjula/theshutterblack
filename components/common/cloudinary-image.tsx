"use client";

import { CldImage as BaseCldImage, CldImageProps } from "next-cloudinary";

export default function CldImage(props: CldImageProps) {
    return <BaseCldImage {...props} />;
}
