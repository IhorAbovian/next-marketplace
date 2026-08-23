import { NextResponse } from "next/server";
import { getItems, addItem } from "@/app/test-loading/_lib/delay";

// Backs the client-side fetch/useSWR demos with an artificially slow endpoint.
export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const item = await addItem(name);
  return NextResponse.json(item);
}
