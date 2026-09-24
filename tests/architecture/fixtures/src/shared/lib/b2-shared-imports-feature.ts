// B2 — shared code must not know that features exist.
import { signIn } from '../../features/auth';

export const call = signIn;
