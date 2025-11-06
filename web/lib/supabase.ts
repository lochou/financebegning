// web/lib/supabase.ts
import { supabase } from "./supabaseClient";

export type Item = {
  id: number;
  title: string;
  url: string;
  source: string;
  summary: string | null;
  published_at: string | null;
};

export async function listItems(limit = 50): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("id, title, url, source, summary, published_at")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    // 讓 build log 能印出真正原因（而不是只有 400）
    throw new Error(`Failed to fetch items: ${error.message}`);
  }
  return data ?? [];
}
