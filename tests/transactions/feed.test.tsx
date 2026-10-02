/**
 * X1–X3, Q1 and Q2 on the transactions feed, against the mock API.
 */
import { type InfiniteData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { TransactionList, type TransactionPage } from '../../src/features/transactions';
import { transactionKeys } from '../../src/features/transactions/api/keys';
import { transactions } from '../../src/mocks/data';
import { mockTransport, PAGE_SIZE } from '../../src/mocks/handlers';
import { setTransport, type Transport } from '../../src/shared/lib/api';
import { dayKey, formatDay } from '../../src/shared/lib/dates';
import { locale, timeZone } from '../../src/shared/lib/i18n';

let client: QueryClient;
let requests: string[];

/** The mock API, but it remembers every path it was asked for. */
const recordingTransport: Transport = (path) => {
  requests.push(path);
  return mockTransport(path);
};

const renderFeed = () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <TransactionList onPressTransaction={jest.fn()} />
    </QueryClientProvider>,
  );
};

/** How many pages the cache holds right now. */
const loadedPages = () =>
  client.getQueryData<InfiniteData<TransactionPage>>(transactionKeys.list())?.pages.length ?? 0;

/** Scrolls to the end once and waits for any page it asked for to arrive. */
const scrollToEnd = async () => {
  const before = requests.length;
  await fireEvent(screen.getByTestId('transaction-list'), 'onEndReached');
  await waitFor(() => {
    expect(client.isFetching()).toBe(0);
  });
  return requests.length - before;
};

beforeEach(() => {
  requests = [];
  setTransport(recordingTransport);
});

afterEach(() => {
  client.clear();
  setTransport(mockTransport);
});

describe('transactions feed', () => {
  it('shows a loading state, then the newest day first (Q1, X1)', async () => {
    await renderFeed();
    expect(screen.getByLabelText('Loading')).toBeOnTheScreen();

    const [newest] = transactions;
    if (!newest) {
      throw new Error('The mock data has no transactions');
    }
    const newestDay = formatDay(dayKey(newest.date, timeZone), locale);
    expect(await screen.findByText(newestDay)).toBeOnTheScreen();
  });

  it('loads every page and stops when nextCursor is null (X2)', async () => {
    await renderFeed();
    await screen.findByTestId('transaction-list');

    const pageCount = Math.ceil(transactions.length / PAGE_SIZE);
    // Keep scrolling until every page is in. The end of the list is often
    // reported twice in a row, so fire it twice each time.
    for (let attempt = 0; attempt < pageCount * 2 && loadedPages() < pageCount; attempt++) {
      const list = screen.getByTestId('transaction-list');
      await fireEvent(list, 'onEndReached');
      await fireEvent(list, 'onEndReached');
      await waitFor(() => {
        expect(client.isFetching()).toBe(0);
      });
    }

    expect(loadedPages()).toBe(pageCount);
    // One request per page: no page was asked for twice.
    expect(requests).toHaveLength(pageCount);
    expect(new Set(requests).size).toBe(pageCount);

    // The last page had no cursor, so scrolling further asks for nothing.
    expect(await scrollToEnd()).toBe(0);
  });

  it('keeps loaded pages and offers a retry when a later page fails (X3)', async () => {
    // Every request with a cursor fails until the test lets it through.
    let laterPagesFail = true;
    setTransport((path) => {
      requests.push(path);
      if (laterPagesFail && path.includes('cursor=')) {
        return Promise.resolve({ status: 500, body: null });
      }
      return mockTransport(path);
    });

    await renderFeed();
    const [newest] = transactions;
    expect(await screen.findAllByText(newest?.merchant ?? '')).not.toHaveLength(0);

    await scrollToEnd();
    expect(await screen.findByText("Couldn't load more transactions.")).toBeOnTheScreen();
    expect(screen.getAllByText(newest?.merchant ?? '')).not.toHaveLength(0);

    // Scrolling again does not retry by itself; only the button does.
    expect(await scrollToEnd()).toBe(0);

    laterPagesFail = false;
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => {
      expect(screen.queryByText("Couldn't load more transactions.")).not.toBeOnTheScreen();
    });
    expect(requests).toHaveLength(3);
  });

  it('shows an error with a retry when the first page fails (Q2)', async () => {
    setTransport(() => Promise.resolve({ status: 500, body: null }));
    await renderFeed();
    expect(await screen.findByText('Something went wrong')).toBeOnTheScreen();

    setTransport(mockTransport);
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByTestId('transaction-list')).toBeOnTheScreen();
  });
});
