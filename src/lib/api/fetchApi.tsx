import type { ApiError } from "@/types/api";

// Accepts the request, parses response, throws typed errors
export async function fetchApi<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(input, init);

    let data: any;
    try {
        data = await res.json();
    } catch {
        if (!res.ok) throw new Error(res.statusText || "Unknown error");
        return {} as T;
    }

    if (!res.ok) {
        console.warn("[API Error]", data);
        if (data && typeof data === "object" && "userMessage" in data && "message" in data) {
            throw data as ApiError;
        }
        throw new Error(data?.message || res.statusText || "API Error");
    }

    return data as T;
}

/**
 * Reads access token from localStorage and injects into headers.
 */
function getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
}

function mergeHeaders(initHeaders?: HeadersInit, authHeader?: string): Headers {
    const h = new globalThis.Headers(initHeaders);
    h.set("Authorization", `Bearer ${authHeader}`);
    return h;
}
/**
 * Fetch wrapper that adds auth header if token exists
 */
export async function fetchApiWithAuth<T>(
    input: RequestInfo,
    init: RequestInit = {}
): Promise<T> {
    const token = getAccessToken();
    console.log(token)
    const mergedHeaders = mergeHeaders(init.headers, token || undefined);

    console.log(mergedHeaders)
    return fetchApi<T>(input, {
        ...init,
        headers: mergedHeaders,
    });
}