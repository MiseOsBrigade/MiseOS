import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Display-only rebrand: the API still calls the five agent swarms "… Kitchen",
 * but the dashboard presents them as "… Station" (collectively "The Stations").
 */
export function stationName(name: string) {
  return name.replace(/\bKitchen\b/g, "Station")
}
