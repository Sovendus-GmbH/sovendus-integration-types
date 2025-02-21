import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(prefixClass(inputs));
}

function prefixClass(classNames: ClassValue[]): string {
  const prefix = "";
  return clsx(classNames)
    .split(" ")
    .map((className) => `${prefix}${className}`)
    .join(" ");
}
