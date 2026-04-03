#!/usr/bin/env bash
# verify-s02.sh — End-to-end verification for S02 (Wire Contact Form to Form Builder)
#
# Proves:
#   R003 — contact form submits to /api/form-submissions (not the dead /api/quotes route)
#   R005 — /api/quotes route is deleted (returns 404)
#   R001 — submission appears in Payload admin (GET /api/form-submissions returns it)
#
# Usage: bash scripts/verify-s02.sh
#        SKIP_SERVER=1 bash scripts/verify-s02.sh   (if dev server already running)
#        VERBOSE=1 bash scripts/verify-s02.sh        (print full response bodies)
#        PAYLOAD_ADMIN_EMAIL=x PAYLOAD_ADMIN_PASS=y bash scripts/verify-s02.sh

set -euo pipefail

# ── Colour helpers ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
BLU='\033[0;34m'
NC='\033[0m'

PASS="${GRN}✅ PASS${NC}"
FAIL="${RED}❌ FAIL${NC}"
WARN="${YLW}⚠️  WARN${NC}"

ts() { date '+%H:%M:%S'; }

log()  { echo -e "[$(ts)] $*"; }
pass() { echo -e "[$(ts)] ${PASS}  $*"; PASSES=$((PASSES+1)); }
fail() { echo -e "[$(ts)] ${FAIL}  $*"; FAILURES=$((FAILURES+1)); }
warn() { echo -e "[$(ts)] ${WARN}  $*"; }

PASSES=0
FAILURES=0
DEV_PID=""
AUTH_TOKEN=""
ADMIN_EMAIL="${PAYLOAD_ADMIN_EMAIL:-admin@s02verify.test}"
ADMIN_PASS="${PAYLOAD_ADMIN_PASS:-s02verify-pass}"

# ── Cleanup ─────────────────────────────────────────────────────────────────
cleanup() {
  if [[ -n "$DEV_PID" ]]; then
    log "Stopping dev server (PID $DEV_PID)..."
    kill "$DEV_PID" 2>/dev/null || true
    sleep 2
    pkill -f "next dev" 2>/dev/null || true
    log "Dev server stopped."
  fi
}
trap cleanup EXIT

# ── Step 0: Static file checks (no server needed) ───────────────────────────
log "${BLU}── Step 0: Static file checks${NC}"

# Check 4: frontend wired to /api/form-submissions
if grep -q '/api/form-submissions' src/app/contact/page.tsx 2>/dev/null; then
  pass "Check 4 — grep: /api/form-submissions found in src/app/contact/page.tsx"
else
  fail "Check 4 — grep: /api/form-submissions NOT found in src/app/contact/page.tsx"
fi

# Check 5: old /api/quotes reference removed
if ! grep -q '/api/quotes' src/app/contact/page.tsx 2>/dev/null; then
  pass "Check 5 — grep: /api/quotes NOT found in src/app/contact/page.tsx (old route removed)"
else
  fail "Check 5 — grep: /api/quotes still referenced in src/app/contact/page.tsx"
fi

# Also verify form ID is read from NEXT_PUBLIC_FORM_ID env var (MongoDB ObjectId string)
if grep -q 'NEXT_PUBLIC_FORM_ID' src/app/contact/page.tsx 2>/dev/null; then
  pass "Check 5b — grep: NEXT_PUBLIC_FORM_ID found in src/app/contact/page.tsx (MongoDB form ID via env var)"
else
  fail "Check 5b — grep: NEXT_PUBLIC_FORM_ID NOT found in src/app/contact/page.tsx"
fi

# Check that /api/quotes route file is deleted
if ! test -f src/app/api/quotes/route.ts 2>/dev/null; then
  pass "Check 5c — file: src/app/api/quotes/route.ts is deleted"
else
  fail "Check 5c — file: src/app/api/quotes/route.ts still exists"
fi

# ── Step 1: Start dev server ─────────────────────────────────────────────────
log "${BLU}── Step 1: Start dev server${NC}"

BASE_URL="http://localhost:3000"
SERVER_LOG="$(mktemp -t verify-s02-server.XXXXXX)"

if [[ "${SKIP_SERVER:-0}" == "1" ]]; then
  log "SKIP_SERVER=1: assuming dev server already running at $BASE_URL"
else
  log "Starting Next.js dev server (logging to $SERVER_LOG)..."
  npm run dev > "$SERVER_LOG" 2>&1 &
  DEV_PID=$!
  log "Dev server PID: $DEV_PID"

  log "Waiting for port 3000 to be ready (timeout 120s)..."
  WAITED=0
  READY=0
  while [[ $WAITED -lt 120 ]]; do
    HTTP_STATUS=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "$BASE_URL" 2>/dev/null || echo "000")
    if [[ "$HTTP_STATUS" != "000" ]]; then
      READY=1
      log "Server responded with HTTP $HTTP_STATUS after ${WAITED}s"
      break
    fi
    sleep 3
    WAITED=$((WAITED+3))
  done

  if [[ "$READY" == "0" ]]; then
    fail "Dev server did not become ready within 120s"
    log "Server log tail:"
    tail -20 "$SERVER_LOG" || true
    rm -f "$SERVER_LOG"
    exit 1
  fi

  # Extra settle time for Next.js route compilation
  sleep 5
fi

# Verify server health
HTTP_STATUS=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$BASE_URL" 2>/dev/null || echo "000")
if [[ "$HTTP_STATUS" == "000" ]]; then
  fail "Cannot reach $BASE_URL — aborting"
  exit 1
fi
pass "Dev server reachable (HTTP $HTTP_STATUS)"

# ── Step 2: Authenticate ─────────────────────────────────────────────────────
log "${BLU}── Step 2: Authenticate with Payload admin${NC}"

AUTH_LOG="$(mktemp -t verify-s02-auth.XXXXXX)"

# Try login first (in case admin already exists from S01 run)
HTTP_LOGIN=$(curl -s -o "$AUTH_LOG" -w '%{http_code}' \
  --max-time 10 \
  -X POST "$BASE_URL/api/users/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" 2>/dev/null || echo "000")

if [[ "$HTTP_LOGIN" == "200" ]]; then
  AUTH_TOKEN=$(python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token',''))" < "$AUTH_LOG" 2>/dev/null || true)
fi

if [[ -z "$AUTH_TOKEN" ]]; then
  # Try first-register (only works if no users exist yet)
  HTTP_REG=$(curl -s -o "$AUTH_LOG" -w '%{http_code}' \
    --max-time 10 \
    -X POST "$BASE_URL/api/users/first-register" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" 2>/dev/null || echo "000")

  if [[ "$HTTP_REG" == "200" ]]; then
    AUTH_TOKEN=$(python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token',''))" < "$AUTH_LOG" 2>/dev/null || true)
  fi
fi

if [[ -z "$AUTH_TOKEN" ]]; then
  # Last resort: seed the stable verify admin via createVerifyAdmin.ts
  log "Login and first-register failed — running createVerifyAdmin.ts to seed stable admin..."
  ADMIN_SEED_LOG="$(mktemp -t verify-s02-adminseed.XXXXXX)"
  if timeout 30 npm run seed:admin > "$ADMIN_SEED_LOG" 2>&1; then
    HTTP_LOGIN2=$(curl -s -o "$AUTH_LOG" -w '%{http_code}' \
      --max-time 10 \
      -X POST "$BASE_URL/api/users/login" \
      -H 'Content-Type: application/json' \
      -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" 2>/dev/null || echo "000")
    if [[ "$HTTP_LOGIN2" == "200" ]]; then
      AUTH_TOKEN=$(python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token',''))" < "$AUTH_LOG" 2>/dev/null || true)
    fi
  fi
  rm -f "$ADMIN_SEED_LOG"
fi

if [[ -z "$AUTH_TOKEN" ]]; then
  warn "Could not obtain JWT token — GET /api/form-submissions check will use unauthenticated attempt"
else
  pass "Obtained admin JWT token"
fi
rm -f "$AUTH_LOG"

# ── Step 3: Run seed if needed ───────────────────────────────────────────────
log "${BLU}── Step 3: Ensure Contact Form exists (seed)${NC}"

FORM_ID=""   # will be read from .form-id (MongoDB ObjectId string)
if [[ -f ".form-id" ]]; then
  FORM_ID=$(cat .form-id | tr -d '[:space:]')
  log "Using form ID from .form-id: $FORM_ID"
else
  log "No .form-id file found — running npm run seed:form to ensure form exists"
  SEED_LOG="$(mktemp -t verify-s02-seed.XXXXXX)"
  if timeout 60 npm run seed:form > "$SEED_LOG" 2>&1; then
    if [[ -f ".form-id" ]]; then
      FORM_ID=$(cat .form-id | tr -d '[:space:]')
      log "Seed succeeded — form ID: $FORM_ID"
    else
      FORM_ID=$(grep -Eo 'id: [a-f0-9]+' "$SEED_LOG" 2>/dev/null | awk '{print $NF}' | head -1 || echo "")
      log "Seed succeeded — form ID from log: $FORM_ID"
    fi
  else
    SEED_EXIT=$?
    warn "Seed script exited $SEED_EXIT — form may already exist; check .form-id manually"
    FORM_ID=""
    if [[ "${VERBOSE:-0}" == "1" ]]; then cat "$SEED_LOG"; fi
  fi
  rm -f "$SEED_LOG"
fi

log "Will use form ID: $FORM_ID"

# ── Step 4: Check 1 — POST to /api/form-submissions (R003, R001) ────────────
log "${BLU}── Step 4: Check 1 — POST /api/form-submissions${NC}"

SUBMIT_LOG="$(mktemp -t verify-s02-post.XXXXXX)"
HTTP_POST=$(curl -s -o "$SUBMIT_LOG" -w '%{http_code}' \
  --max-time 20 \
  -X POST "$BASE_URL/api/form-submissions" \
  -H 'Content-Type: application/json' \
  -d "{
    \"form\": \"${FORM_ID}\",
    \"submissionData\": [
      {\"field\": \"fullName\",  \"value\": \"S02 Test\"},
      {\"field\": \"email\",     \"value\": \"s02@test.com\"},
      {\"field\": \"phone\",     \"value\": \"804-555-0202\"},
      {\"field\": \"services\",  \"value\": \"Lawn Mowing & Maintenance\"},
      {\"field\": \"lotSize\",   \"value\": \"1/4 acre or less\"},
      {\"field\": \"serviceAddress\", \"value\": \"123 S02 St, Richmond VA\"},
      {\"field\": \"preferredDay\",   \"value\": \"Monday\"},
      {\"field\": \"message\",        \"value\": \"S02 E2E verify run\"}
    ]
  }" 2>/dev/null || echo "000")

log "POST /api/form-submissions → HTTP $HTTP_POST"

if [[ "${VERBOSE:-0}" == "1" ]] || [[ "$HTTP_POST" != "201" && "$HTTP_POST" != "200" ]]; then
  log "Response body:"
  cat "$SUBMIT_LOG"
  echo ""
fi

SUBMISSION_ID=""
if [[ "$HTTP_POST" == "201" ]] || [[ "$HTTP_POST" == "200" ]]; then
  if grep -q '"id"' "$SUBMIT_LOG" 2>/dev/null; then
    SUBMISSION_ID=$(python3 -c "import sys,json; d=json.load(sys.stdin); doc=d.get('doc',d); print(doc.get('id',''))" < "$SUBMIT_LOG" 2>/dev/null || \
                    grep -Eo '"id":[^,}]+' "$SUBMIT_LOG" | head -1 | sed 's/"id"://' | tr -d '" ')
    pass "Check 1 — POST /api/form-submissions → HTTP $HTTP_POST, submission ID: $SUBMISSION_ID"
  else
    fail "Check 1 — POST returned $HTTP_POST but response has no 'id' field"
    cat "$SUBMIT_LOG"
  fi
else
  fail "Check 1 — POST /api/form-submissions → HTTP $HTTP_POST (expected 201)"
  cat "$SUBMIT_LOG"
  echo ""
fi
rm -f "$SUBMIT_LOG"

# ── Step 5: Check 2 — GET /api/form-submissions (R004) ──────────────────────
log "${BLU}── Step 5: Check 2 — GET /api/form-submissions${NC}"

GET_LOG="$(mktemp -t verify-s02-get.XXXXXX)"
CURL_AUTH_ARGS=()
if [[ -n "$AUTH_TOKEN" ]]; then
  CURL_AUTH_ARGS=(-H "Authorization: JWT $AUTH_TOKEN")
fi

HTTP_GET=$(curl -s -o "$GET_LOG" -w '%{http_code}' \
  --max-time 10 \
  "${CURL_AUTH_ARGS[@]}" \
  "$BASE_URL/api/form-submissions" 2>/dev/null || echo "000")

log "GET /api/form-submissions → HTTP $HTTP_GET"

if [[ "${VERBOSE:-0}" == "1" ]]; then
  log "Response body:"; cat "$GET_LOG"; echo ""
fi

if [[ "$HTTP_GET" == "200" ]]; then
  TOTAL_DOCS=$(python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('totalDocs',0))" < "$GET_LOG" 2>/dev/null || \
               grep -Eo '"totalDocs":[0-9]+' "$GET_LOG" | head -1 | sed 's/"totalDocs"://' || echo "0")
  log "totalDocs: $TOTAL_DOCS"
  if [[ "${TOTAL_DOCS:-0}" -ge 1 ]]; then
    pass "Check 2 — GET /api/form-submissions → totalDocs=${TOTAL_DOCS} (≥1)"
  else
    fail "Check 2 — GET /api/form-submissions → totalDocs=${TOTAL_DOCS} (expected ≥1)"
  fi
elif [[ "$HTTP_GET" == "403" ]] && [[ -z "$AUTH_TOKEN" ]]; then
  # POST succeeded, auth not available — verify the individual submission
  warn "Check 2 — GET /api/form-submissions → HTTP 403 (no auth token)"
  if [[ -n "$SUBMISSION_ID" ]]; then
    DOC_LOG="$(mktemp -t verify-s02-doc.XXXXXX)"
    HTTP_DOC=$(curl -s -o "$DOC_LOG" -w '%{http_code}' \
      --max-time 10 \
      "$BASE_URL/api/form-submissions/$SUBMISSION_ID" 2>/dev/null || echo "000")
    if [[ "$HTTP_DOC" == "200" ]]; then
      pass "Check 2 — GET /api/form-submissions/$SUBMISSION_ID → HTTP 200 (submission persisted)"
    else
      fail "Check 2 — GET /api/form-submissions/$SUBMISSION_ID → HTTP $HTTP_DOC"
      cat "$DOC_LOG"
    fi
    rm -f "$DOC_LOG"
  else
    fail "Check 2 — GET returned 403, no auth token, and no submission ID to fall back to"
  fi
else
  fail "Check 2 — GET /api/form-submissions → HTTP $HTTP_GET (expected 200)"
  cat "$GET_LOG"
  echo ""
fi
rm -f "$GET_LOG"

# ── Step 6: Check 3 — /api/quotes custom route stub is deleted (R005) ───────
log "${BLU}── Step 6: Check 3 — /api/quotes route stub deleted (R005)${NC}"

# Note: /api/quotes is ALSO a Payload collection REST endpoint, so even after deleting
# src/app/api/quotes/route.ts the URL still exists (returning 403 requiring auth).
# The R005 requirement is that the *custom Next.js stub* is removed — verified by the
# file check already done in Step 0 (Check 5c). We confirm here that the stub file is
# gone and additionally verify via HTTP that it's not serving a custom handler response.

QUOTES_LOG="$(mktemp -t verify-s02-quotes.XXXXXX)"
HTTP_QUOTES=$(curl -s -o "$QUOTES_LOG" -w '%{http_code}' \
  --max-time 10 \
  -X POST "$BASE_URL/api/quotes" \
  -H 'Content-Type: application/json' \
  -d '{"test": true}' 2>/dev/null || echo "000")

log "POST /api/quotes → HTTP $HTTP_QUOTES"

# Check file deletion is the definitive R005 proof
if ! test -f src/app/api/quotes/route.ts; then
  # 404 = route stub removed and no Payload collection
  # 403 = Payload collection exists but no custom handler (stub removed — this project has a quotes collection)
  # Both prove the custom stub is deleted
  if [[ "$HTTP_QUOTES" == "404" ]] || [[ "$HTTP_QUOTES" == "403" ]] || [[ "$HTTP_QUOTES" == "405" ]]; then
    if [[ "$HTTP_QUOTES" == "403" ]]; then
      log "Note: /api/quotes returns 403 — Payload quotes collection exists (auth required); custom route stub is deleted"
    fi
    pass "Check 3 — src/app/api/quotes/route.ts deleted (HTTP $HTTP_QUOTES confirms no custom stub serving)"
  else
    fail "Check 3 — /api/quotes → HTTP $HTTP_QUOTES (unexpected; stub file is deleted but server response is unexpected)"
    cat "$QUOTES_LOG"
  fi
else
  fail "Check 3 — src/app/api/quotes/route.ts still exists (R005: stub must be deleted)"
fi
rm -f "$QUOTES_LOG"

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════"
echo -e "  S02 Verification Summary"
echo "  Passed:  $PASSES"
echo "  Failed:  $FAILURES"
echo "════════════════════════════════════════════════"

if [[ "$FAILURES" -gt 0 ]]; then
  echo -e "  ${RED}RESULT: FAIL ($FAILURES failure(s))${NC}"
  exit 1
else
  echo -e "  ${GRN}RESULT: ALL CHECKS PASS${NC}"
  exit 0
fi
