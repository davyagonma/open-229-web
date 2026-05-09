import { NextResponse } from "next/server";
import { CATEGORY_OPTIONS } from "@/lib/constants";

export function GET() {
  return NextResponse.json({
    data: CATEGORY_OPTIONS.map((c) => ({
      value: c.value,
      label: c.label,
    })),
  });
}
