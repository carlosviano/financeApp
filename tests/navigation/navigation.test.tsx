/**
 * N1–N2 against the real routes in src/app, served by the mock API.
 *
 * `renderRouter` switches Jest to fake timers, so a test must not await the
 * mock API directly: its delay is a timer that would never fire. The
 * `findBy*` queries advance fake timers themselves.
 */
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import { transactions } from '../../src/mocks/data';
import { mockTransport } from '../../src/mocks/handlers';
import { setTransport } from '../../src/shared/lib/api';

beforeAll(() => {
  setTransport(mockTransport);
});

describe('navigation', () => {
  it('shows the four tabs (N1)', async () => {
    await renderRouter('./src/app');

    // React Navigation labels each tab like "Home, tab, 1 of 4".
    expect(screen.getByRole('button', { name: 'Home, tab, 1 of 4' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Transactions, tab, 2 of 4' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Budgets, tab, 3 of 4' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Settings, tab, 4 of 4' })).toBeOnTheScreen();
  });

  it('opens the detail screen when a transaction is tapped (N2)', async () => {
    // The fixtures are newest first, so this is the top row of the list.
    const [first] = transactions;
    if (!first) {
      throw new Error('The mock data has no transactions');
    }

    // With RNTL 14 `render` returns a promise, and `renderRouter` attaches
    // `getPathname` to that promise, so keep it before awaiting.
    const app = renderRouter('./src/app', { initialUrl: '/transactions' });
    await app;
    // The same merchant can appear more than once; the first match is the top row.
    const [topRow] = await screen.findAllByRole('button', { name: new RegExp(first.merchant) });
    if (!topRow) {
      throw new Error('The list did not render the first transaction');
    }
    await fireEvent.press(topRow);

    expect(app.getPathname()).toBe(`/transactions/${first.id}`);
    expect(await screen.findByText(first.merchant)).toBeOnTheScreen();
  });
});
