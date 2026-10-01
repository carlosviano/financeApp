# 0005 — The mock API is a transport, not MSW

- **Status:** Accepted
- **Date:** 2026-10-01
- **Supersedes:** constitution §3, "Mock API (v1)" row

## Context

The MVP has no backend, so it needs a mock API. The constitution named MSW. When the time came, MSW 3 had just dropped its React Native entry point. MSW 2 loaded only after stubbing three browser APIs (`MessageEvent`, `EventTarget`, `BroadcastChannel`), and then it intercepted requests but returned empty bodies: it builds responses from a `ReadableStream`, and React Native's `fetch` polyfill can't read one.

## Decision

`getJson` in `src/shared/lib/api` sends every request through a swappable `Transport`. The default transport uses `fetch`. `src/mocks/install.ts`, imported first in `index.ts`, swaps in a mock transport that answers from in-memory data with simulated latency and cursor pagination.

## Alternatives considered

- **MSW with `fetch`/stream polyfills.** It is possible, but it means replacing React Native's networking stack for a dev-only tool, with more breakage likely on each upgrade.
- **A local HTTP server (`json-server`).** Real requests, but a separate process, and devices can't reach `localhost`.

## Consequences

- No mocking dependency, no polyfills and no Jest ESM workarounds.
- The real `fetch` path is not exercised until a backend exists. When it does, delete the `install` import, and requests go to `API_URL`.
- Feature code is unaffected: it only calls `getJson`.
