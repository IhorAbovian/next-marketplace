import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Decimal } from "@prisma/client/runtime/client";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: Decimal | number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(Number(price));
}

export function formatDate(
  date: Date | string,
  format: string = "YYYY-MM-DD",
): string {
  return dayjs(date).format(format);
}
