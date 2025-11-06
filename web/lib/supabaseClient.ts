// web/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// 這兩個環境變數會自動從 Vercel 設定中讀取
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase 環境變數未設定，請檢查 Vercel → Settings → Environment Variables")
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// 確認連線成功（可選）
supabase
  .from('items')
  .select('id', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error("⚠️ 無法連線 Supabase:", error.message)
    } else {
      console.log("✅ Supabase client 已成功初始化")
    }
  })
