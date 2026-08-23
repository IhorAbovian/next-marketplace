// Shared fake data source for the test-loading/* demo routes.
// Not a route itself (underscore-prefixed folder is excluded from routing).

export type Item = { id: number; name: string };

const ITEMS: Item[] = [
  { id: 1, name: "Vintage Camera" },
  { id: 2, name: "Mountain Bike" },
  { id: 3, name: "Leather Jacket" },
];

// Simulates network/DB latency so every loading state is actually visible.
export function delay(ms = 3500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getItems(ms = 3500): Promise<Item[]> {
  await delay(ms);
  return ITEMS;
}

let nextId = ITEMS.length + 1;

export async function addItem(name: string, ms = 3500): Promise<Item> {
  await delay(ms);
  const item = { id: nextId++, name };
  ITEMS.push(item);
  return item;
}
