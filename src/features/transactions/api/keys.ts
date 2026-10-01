/** Query keys for transactions and categories. See `accounts/api/keys.ts`. */
export const transactionKeys = {
  all: ['transactions'],
  list: () => ['transactions', 'list'],
  detail: (id: string) => ['transactions', 'detail', id],
};

export const categoryKeys = {
  all: ['categories'],
  list: () => ['categories', 'list'],
};
