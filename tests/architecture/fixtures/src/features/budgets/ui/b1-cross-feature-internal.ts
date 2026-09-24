// B1 — reaches past the auth feature's index.ts into its internals.
import { SESSION_KEY } from '../../auth/model/session';

export const leak = SESSION_KEY;
