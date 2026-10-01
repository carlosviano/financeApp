/**
 * Routes every API request to the mock API. Imported first in index.ts while
 * there is no backend; delete this import the day one exists.
 */
import { setTransport } from '@/shared/lib/api';

import { mockTransport } from './handlers';

setTransport(mockTransport);
