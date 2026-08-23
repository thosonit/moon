"use client";

import { useRouter } from "next/navigation";
import { useBackKey } from "@/hooks/useBackKey";

interface BackKeyNavProps {
  href: string;
}

export function BackKeyNav({ href }: BackKeyNavProps) {
  const router = useRouter();
  useBackKey(() => router.push(href));
  return null;
}
