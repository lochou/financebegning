
export const metadata = {
  title: "Aggregator",
  description: "Simple data aggregator powered by Supabase + Vercel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body style={{ maxWidth: 960, margin: "0 auto", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0 }}>🗞️ Aggregator</h1>
          <nav>
            <a href="/" style={{ marginRight: 12 }}>首頁</a>
            <a href="https://supabase.com" target="_blank">Supabase</a>
          </nav>
        </header>
        {children}
        <footer style={{ marginTop: 48, fontSize: 12, opacity: 0.7 }}>
          以 Supabase + Vercel 建立 · 本頁每 10 分鐘自動更新
        </footer>
      </body>
    </html>
  );
}
