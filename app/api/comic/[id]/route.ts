import { NextResponse } from "next/server";
import { getComic } from "@/lib/notion";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comic = await getComic(id);
  return NextResponse.json({ comic });
}
