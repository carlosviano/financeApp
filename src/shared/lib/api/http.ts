/**
 * How the app talks to the API. Every request goes through `getJson`.
 *
 * `getJson` doesn't call `fetch` directly: it hands the request to a
 * "transport". The default transport uses `fetch` against the real API. While
 * there is no backend, `src/mocks/install.ts` swaps in a mock transport that
 * answers from fake data. Features never notice the difference.
 */
import { API_URL } from '@/shared/config/constants';

/** Thrown when the API answers with an error status (400, 404, 500…). */
export class HttpError extends Error {
  status: number;

  constructor(status: number, path: string) {
    super(`Request to ${path} failed with status ${String(status)}`);
    this.status = status;
  }
}

/** Something that can answer a GET request: the real network, or the mock API. */
export type Transport = (path: string) => Promise<{ status: number; body: unknown }>;

/** The real one: a normal `fetch` to the API. */
const fetchTransport: Transport = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    return { status: response.status, body: null };
  }
  const body: unknown = await response.json();
  return { status: response.status, body };
};

let currentTransport: Transport = fetchTransport;

/** Replaces the transport. Only the mock API calls this. */
export function setTransport(transport: Transport): void {
  currentTransport = transport;
}

/**
 * Sends a GET request and returns the JSON body as `T`.
 * `T` is a promise from us, not checked at runtime: if the API sends a
 * different shape, TypeScript won't know.
 */
export async function getJson<T>(path: string): Promise<T> {
  const { status, body } = await currentTransport(path);
  if (status >= 400) {
    throw new HttpError(status, path);
  }
  return body as T;
}
