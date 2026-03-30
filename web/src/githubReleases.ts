export const DESKTOP_RELEASES_URL = "https://github.com/joshua-bone/DATTools/releases";
export const LATEST_DESKTOP_RELEASE_URL = "https://github.com/joshua-bone/DATTools/releases/latest";
const LATEST_DESKTOP_RELEASE_API_URL =
  "https://api.github.com/repos/joshua-bone/DATTools/releases/latest";

export type LatestDesktopRelease = Readonly<{
  version: string;
  htmlUrl: string;
  publishedAt: string | null;
}>;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

export function parseLatestDesktopRelease(value: unknown): LatestDesktopRelease {
  if (!isRecord(value)) {
    throw new Error("Latest desktop release payload must be an object.");
  }

  const version = value.tag_name;
  if (typeof version !== "string" || version.length === 0) {
    throw new Error("Latest desktop release payload is missing tag_name.");
  }

  const htmlUrl = value.html_url;
  if (typeof htmlUrl !== "string" || htmlUrl.length === 0) {
    throw new Error("Latest desktop release payload is missing html_url.");
  }

  const publishedAt = value.published_at;
  if (publishedAt !== null && typeof publishedAt !== "string") {
    throw new Error("Latest desktop release payload has an invalid published_at value.");
  }

  return {
    version,
    htmlUrl,
    publishedAt,
  };
}

export async function fetchLatestDesktopRelease(
  signal?: AbortSignal,
): Promise<LatestDesktopRelease> {
  const requestInit: RequestInit = {
    headers: {
      Accept: "application/vnd.github+json",
    },
  };
  if (signal) requestInit.signal = signal;

  const response = await fetch(LATEST_DESKTOP_RELEASE_API_URL, requestInit);
  if (!response.ok) {
    throw new Error(`Couldn't load the latest desktop release (${response.status}).`);
  }
  return parseLatestDesktopRelease(await response.json());
}
