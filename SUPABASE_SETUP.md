# Supabase Setup Guide for JustLink

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from Settings → API

## 2. Run the Database Migration

In the Supabase SQL Editor, paste and run the contents of:
```
supabase/migrations/001_initial.sql
```

## 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Settings → API → service_role
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 4. Configure Auth

1. Go to Authentication → URL Configuration
2. Set **Site URL** to your app URL (e.g., `https://justlink.app`)
3. Add redirect URLs:
   - `https://justlink.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

## 5. Deploy Edge Function (Optional)

The Edge Function provides the redirect engine. It's optional since the
Next.js app also handles redirects via `app/[slug]/page.tsx`.

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the redirect function
supabase functions deploy redirect

# Set function secrets
supabase secrets set APP_URL=https://justlink.app
```

## 6. Database Schema Overview

### `links` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| name | text | Display name |
| slug | text | Unique URL slug |
| ios_url | text | iOS destination |
| android_url | text | Android destination |
| web_url | text | Web/fallback URL |
| is_active | boolean | Enable/disable |
| expires_at | timestamptz | Optional expiry |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update |

### `clicks` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| link_id | uuid | FK → links |
| timestamp | timestamptz | Click time |
| device | text | ios/android/web |
| country | text | Country code |
| referrer | text | Referring URL |
| ip | text | Client IP |

## 7. Row Level Security

RLS is enabled. Key policies:
- Users can only CRUD their own links
- Anyone can read active links (needed for redirect)
- Anyone can insert clicks (needed for analytics logging)

## 8. Local Development

```bash
npm run dev
# Visit http://localhost:3000
```
