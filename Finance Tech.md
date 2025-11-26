Ini adalah blueprint final untuk membangun Kenin Budgeting System.

⭐ 1. DATABASE DESIGN (Supabase / Postgres)

Dibuat agar dinamis, scalable, dan support AI.

✅ 1.1. users
id (uuid)
name
salary (int)
payday (int)           -- user gajian tanggal berapa
created_at

✅ 1.2. budgets (baseline bulanan setiap user)

→ Budget default per kategori.

id (uuid)
user_id (uuid)
month (date)
category (text)             -- food, transport, rent, entertainment
limit_amount (int)
adjusted_from_ai (bool)     -- untuk tahu apakah disarankan AI

✅ 1.3. transactions

→ Pencatatan harian untuk belajar pola.

id (uuid)
user_id
date
category
amount
notes

✅ 1.4. monthly_summary

→ Untuk fitur “suggest sisa uang makan”.

id (uuid)
user_id
month

food_limit (int)
food_spent (int)
food_remaining (int)
food_daily_suggest (int)      -- dynamic daily cap
food_zone (text)              -- green, yellow, red

transport_limit (int)
transport_spent (int)
transport_recommendation (int)  -- jika hemat → AI sarankan turun

saving_target (int)
saving_realization (int)

✅ 1.5. ai_suggestions

→ Untuk menyimpan rekomendasi harian/bulanan Groq.

id (uuid)
user_id
date
type (daily | monthly)
suggestion_text (text)
approved (bool)     -- user menyetujui saran AI

✅ 1.6. budget_adjustment_logs

→ Untuk pelacakan auto-rebalance.

from_category
to_category
amount
reason
date

⭐ 2. FLOW APLIKASI (Dari Login → Budget → AI)
2.1. Set awal

User input:

gaji (6 juta)

tanggal gajian

biaya kos

target tabungan

kategori lain yang diinginkan

Sistem membuat baseline otomatis dengan rumus:

food = 45k × 30 (default)
transport = default 300k
rent = 1.1M
savings = 15–20%
entertainment = 5–8%

2.2. Pengeluaran harian

User input transaksi makanan, transport, dll.

Sistem menghitung:

total spent bulan ini

sisa budget kategori

daily_cap baru (untuk makanan)

2.3. Daily Budget Zone

Setiap malam:

daily_cap = (food_limit - food_spent) / hari_sisa
zone: green, yellow, red


Dikirim ke user seperti ini:

🟢 Aman
🟡 Waspada
🔴 Bahaya

Ini lebih manusiawi daripada bilang “jatah 27.500 doang”.

2.4. Bulanan (Start setiap tanggal gajian)

Sistem cek:

Food – volatile

Jika makan kadang hemat, kadang boros:

pakai daily safe-to-spend

AI beri edukasi ramah

Transport – hemat

Rule:

Jika spent < 70% limit → "AI Suggestion", bukan auto-update

User pilih: turunkan? atau tetap?

Auto Rebalance

Jika kategori A surplus, B minus:

AI memberi rekomendasi memindahkan saldo.

2.5. AI Integration (Groq)

Dipanggil hanya untuk:

insight

coaching

summary

rekomendasi

Rule-based tetap mengontrol logika uang.

⭐ 3. TEKNIS ARSITEKTUR (Hono.js + Supabase + Groq + Vue)
3.1. Frontend (Vue 3 + Pinia)

Dashboard Harian

Dashboard Bulanan

Input Transaksi

AI Suggestion Feed

Opsional: Chart dengan ECharts

3.2. Backend (Hono.js)

Endpoint:

POST /transaction
GET /daily-summary
GET /monthly-summary
POST /budget-adjustment
POST /ai/suggest-daily
POST /ai/suggest-monthly

3.3. Database (Supabase)

host transaksi

host budget baseline

trigger untuk hitung summary otomatis (cron)

3.4. AI Layer (Groq)

Backend memanggil Groq Llama3:

permintaan cuma 200–500 token

instan

hampir gratis

LLM tidak melakukan perhitungan, hanya menjelaskan.

⭐ 4. RULE-BASED ENGINE (INTI SISTEM BUDGET)
4.1. FOOD (Volatile Spending Rule)
food_remaining = food_limit - food_spent
daily_cap = food_remaining / hari_sisa

if daily_cap > 40k → zone = green
if 25k–40k → zone = yellow
if < 25k → zone = red

4.2. TRANSPORT (Underspend Learning)
if spent < 0.7 * limit:
    suggested_new_limit = spent * 1.1
    require_user_approval = true

4.3. AUTO REBALANCE RULE
if category_surplus > 20% AND other_category_deficit:
    create_rebalance_suggestion()


User setuju → database update.

4.4. SAVINGS TARGET
savings_target = salary * 0.15
savings_realization = total_income - total_expense


AI akan memberi edukasi kalau savings meleset.

⭐ 5. PROMPT AI BUDGET ADVISOR (GROQ)

Ini adalah golden prompt untuk hasil paling natural.

5.1. Prompt Daily Advisor
You are Kenin's financial budgeting coach.
You must speak using friendly, empathetic Indonesian.

Here is today’s budget data:
{JSON_DATA}

Generate:
- Budget zone (green/yellow/red) but explain in soft language.
- A human-friendly daily spending suggestion.
- If user overspent yesterday, explain gently why and how to fix.
- Provide 1 simple actionable tip only.
- Keep the tone: warm, casual, not judgmental.

5.2. Prompt Monthly Advisor
You are an AI financial planner. Evaluate user’s spending pattern this month.
Use Indonesian. Avoid technical terms; speak like a mentor.

Given this monthly summary:
{JSON_DATA}

Generate:
1. Insights about food, transport, rent, entertainment, savings.
2. Identify categories with underspend or overspend.
3. Suggest limit changes but ALWAYS ask for user approval.
4. Suggest possible category rebalance (from surplus to deficit).
5. Provide a simple short-term challenge (e.g. "hemat 20k/hari selama 3 hari").

⭐ 6. KESIMPULAN: Sistem Budget Kenin yang Final

Kamu sekarang punya:

✔ Struktur database yang kuat
✔ Alur lengkap harian → bulanan
✔ Arsitektur teknis untuk Hono.js + Supabase + Vue + Groq
✔ Rule-based engine lengkap
✔ AI advisor yang terasa manusiawi
✔ Learning behavior untuk makanan & transport
✔ Auto-rebalance
✔ Sistem budgeting yang adaptif dan personal

Semuanya sangat cocok untuk MVP dan skala besar.