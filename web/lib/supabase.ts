
export type Item = {
  id: number;
  source: string;
  title: string;
  url: string;
  summary: string | null;
  published_at: string | null;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function listItems(limit = 30): Promise<Item[]> {
  const url = new URL(`${SUPABASE_URL}/rest/v1/items`);
  url.searchParams.set("select", "*");
  url.searchParams.set("order", "published_at.desc,nullsLast");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    // 使用 ISR 快取提示（Next 14）
    next: { revalidate: 600, tags: ["items"] },
  });
  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
  return res.json();
}
