#!/usr/bin/env bash
set -euo pipefail

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI is required. Install with: brew install supabase/tap/supabase"
  exit 1
fi

echo "Starting local Supabase (Docker)..."
supabase start --network-id txlio-supabase-net --exclude logflare,vector,mailpit >/dev/null

eval "$(supabase status -o env | awk -F= '
  $1=="API_URL" {print "export NEXT_PUBLIC_SUPABASE_URL=\"" $2 "\""}
  $1=="ANON_KEY" {print "export NEXT_PUBLIC_SUPABASE_ANON_KEY=\"" $2 "\""}
  $1=="SERVICE_ROLE_KEY" {print "export SUPABASE_SERVICE_ROLE_KEY=\"" $2 "\""}
')"

export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-http://127.0.0.1:3000}"

echo "Using local Supabase URL: ${NEXT_PUBLIC_SUPABASE_URL}"
if [[ "${TXLIO_DB_RESET:-0}" == "1" ]]; then
  echo "Resetting local DB (migrations + seed)..."
  supabase db reset --local --yes >/dev/null
else
  echo "Skipping DB reset. Set TXLIO_DB_RESET=1 to force migrations + seed."
fi

echo "Starting Next.js dev server..."
exec npm run dev
