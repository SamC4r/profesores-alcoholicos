import { clsx, type ClassValue } from "clsx"
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const compactDate = (commentDate?: string | Date | number | null) => {
    if (!commentDate) return "";

    let date: Date;
    if (typeof commentDate === "string" || typeof commentDate === "number") {
        date = new Date(commentDate as string);
    } else {
        date = commentDate as Date;
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) return "";

    return formatDistanceToNow(date, { addSuffix: true });
}

export const DEFAULT_LIMIT = 5
