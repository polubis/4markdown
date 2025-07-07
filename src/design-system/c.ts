import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const c = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export { c };
