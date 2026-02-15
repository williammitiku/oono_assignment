import type { CollectionsResponse, TopicsResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_OONO_API_BASE || "https://staging-apis-v2.oono.ai";
const APP_TOKEN = process.env.OONO_APP_TOKEN || "9f8e7d6c5b4a3e2f1a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f";

const defaultHeaders = { "App-Token": APP_TOKEN };

export async function fetchCollections(slug: string, topicId?: string): Promise<CollectionsResponse> {
  const params = new URLSearchParams({ slug });
  if (topicId) params.set("topicId", topicId);
  const url = `${API_BASE}/api/public/stories-collection/?${params.toString()}`;
  const res = await fetch(url, {
    headers: defaultHeaders,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch collections: ${res.status}`);
  return res.json();
}

export async function fetchTopics(brandId: string): Promise<TopicsResponse> {
  const url = `${API_BASE}/api/public/topics?brandId=${encodeURIComponent(brandId)}`;
  const res = await fetch(url, {
    headers: defaultHeaders,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch topics: ${res.status}`);
  return res.json();
}

/** Returns c param with raw slug (no encoding). Encode once when building URL so we get %23 not %2523. */
export function buildCollectionParam(collection: { code: string; slug: string }): string {
  return `${collection.code}-${collection.slug}`;
}

export function parseCollectionParam(c: string): { code: string; slug: string } | null {
  const dash = c.indexOf("-");
  if (dash <= 0) return null;
  try {
    return {
      code: c.slice(0, dash),
      slug: decodeURIComponent(c.slice(dash + 1)),
    };
  } catch {
    return null;
  }
}

/** Base URL for the oono staging brand player (used when opening/playing stories). */
export function getStagingPlayerBase(): string {
  return process.env.NEXT_PUBLIC_OONO_STAGING_PLAYER_BASE || "https://staging-brand.oono.ai";
}

/**
 * Build full URL for thumbnails/images using the path from the API.
 * If path is already a full URL (http/https), return it as-is.
 * Otherwise prepend the oono media base (path used as-is, no extension added).
 */
export function getAssetUrl(path: string): string {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const base = process.env.NEXT_PUBLIC_OONO_ASSET_BASE || "https://media.oono.ai/uploads";
  const normalized = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${base.replace(/\/$/, "")}/${normalized}`;
}
