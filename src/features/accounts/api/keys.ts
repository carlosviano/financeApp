/**
 * Query keys for accounts. TanStack Query stores each request's result under
 * its key, so every screen asking for the same key shares the same data.
 */
export const accountKeys = {
  // Every accounts query starts with this. Invalidating it refreshes them all.
  all: ['accounts'],
  list: () => ['accounts', 'list'],
};
