
import { listItems } from "../lib/supabase";

export const revalidate = 600; // ISR：10 分鐘自動更新

export default async function Page() {
  const items = await listItems(50);
  return (
    <main>
      <h2 style={{ marginTop: 0 }}>最新彙整</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map(it => (
          <li key={it.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
            <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 18, fontWeight: 600 }}>
              {it.title}
            </a>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              來源：{it.source} · {it.published_at ? new Date(it.published_at).toLocaleString() : "無時間"}
            </div>
            {it.summary && <p style={{ marginTop: 8 }}>{it.summary}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
