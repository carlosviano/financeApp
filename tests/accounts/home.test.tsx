/**
 * H1, Q1 and Q2 on the Home screen, against the mock API.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { AccountsOverview } from '../../src/features/accounts';
import { mockTransport } from '../../src/mocks/handlers';
import { setTransport, type Transport } from '../../src/shared/lib/api';

const failingTransport: Transport = () => Promise.resolve({ status: 500, body: null });

let client: QueryClient;

// A fresh client per test, so no test sees another's cache. `retry: false`
// shows the error at once; the app keeps TanStack Query's three retries.
const renderHome = () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AccountsOverview />
    </QueryClientProvider>,
  );
};

afterEach(() => {
  // Clearing drops the cache's garbage-collection timers, so Jest can exit.
  client.clear();
  setTransport(mockTransport);
});

describe('Home', () => {
  it('shows a loading state while the first request is in flight (Q1)', async () => {
    setTransport(mockTransport);
    await renderHome();
    expect(screen.getByLabelText('Loading')).toBeOnTheScreen();
    expect(await screen.findByText('Total balance')).toBeOnTheScreen();
  });

  it('shows the total balance and one row per account (H1)', async () => {
    setTransport(mockTransport);
    await renderHome();
    // en-US is the Jest locale. The amounts match the fixtures in src/mocks/data.ts.
    expect(await screen.findByText('€15,262.88')).toBeOnTheScreen();
    expect(screen.getByText('Main account')).toBeOnTheScreen();
    expect(screen.getByText('Savings')).toBeOnTheScreen();
    expect(screen.getByText('Credit card')).toBeOnTheScreen();
    expect(screen.getByText('-€482.30')).toBeOnTheScreen();
  });

  it('shows an error with a retry that loads the accounts (Q2)', async () => {
    setTransport(failingTransport);
    await renderHome();
    expect(await screen.findByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.queryByText('Total balance')).not.toBeOnTheScreen();

    setTransport(mockTransport);
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Total balance')).toBeOnTheScreen();
  });
});
