import { NextRequest, NextResponse } from "next/server";
import { fetchCollections, parseCollectionParam } from "@/lib/api";
import { generateAmpStoryHtml } from "@/lib/amp-story";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = request.nextUrl.searchParams.get("c");
  if (!c) {
    return new NextResponse("Missing c parameter", { status: 400 });
  }
  const parsed = parseCollectionParam(c);
  if (!parsed) {
    return new NextResponse("Invalid c parameter", { status: 400 });
  }
  const { data } = await fetchCollections(slug);
  const collection = data.find(
    (col) => col.code === parsed.code && col.slug === parsed.slug
  );
  if (!collection) {
    return new NextResponse("Collection not found", { status: 404 });
  }
  const storyParam = request.nextUrl.searchParams.get("story");
  const startAtStoryIndex = storyParam
    ? Math.max(0, (parseInt(storyParam, 10) || 1) - 1)
    : 0;
  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname + "?c=" + encodeURIComponent(c);
  const embed = request.nextUrl.searchParams.get("embed") === "1";
  const closeUrl = embed ? undefined : `${request.nextUrl.origin}/`;
  const html = generateAmpStoryHtml(collection, baseUrl, startAtStoryIndex, closeUrl);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
