# Web Search Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
# Required: Gemini AI (Primary search method)
GEMINI_API_KEY=your-gemini-api-key-here

# Optional: Brave Search API (Fallback for more results)
# Get free key at: https://brave.com/search/api/
BRAVE_API_KEY=your-brave-api-key-here
```

## Getting API Keys

### 1. Gemini AI API Key (FREE - 1500 requests/day)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste into `.env.local`

### 2. Brave Search API Key (OPTIONAL - 2000 requests/month)

1. Go to [Brave Search API](https://brave.com/search/api/)
2. Click "Get Started"
3. Sign up (no credit card required)
4. Get your API key from the dashboard
5. Copy and paste into `.env.local`

## How It Works

### Two-Stage Search

**Stage 1: Database Search**
- Click "Search by SKU" button
- Searches internal `CompetitorProducts` database
- Instant results if competitors exist
- If no results → "Search Web" button appears

**Stage 2: Web Search**
- Click "Search Web" button
- **Primary:** Gemini AI searches and extracts product data
- **Fallback:** If <3 results, uses Brave Search + Jina AI scraper
- Saves discovered competitors to database
- Shows results as suggestions

### Search Flow

```
User clicks "Search by SKU"
    ↓
Search Database (instant)
    ↓
Found results? → Show suggestions ✓
    ↓
No results → Show "Search Web" button
    ↓
User clicks "Search Web"
    ↓
Gemini AI searches internet
    ↓
Found 3+ results? → Save & show ✓
    ↓
<3 results → Try Brave Search
    ↓
Scrape URLs with Jina AI
    ↓
Save all to database → Show suggestions ✓
```

## Features

✅ **Completely Free** (with Gemini only)
✅ **AI-Powered** extraction
✅ **Hybrid Strategy** (DB first, then web)
✅ **Automatic Scraping** with Jina AI
✅ **Saudi Arabia Focus** (filters .sa domains)
✅ **Deduplication** (no duplicate URLs)
✅ **Shared Database** (helps all users)

## Testing

1. Add `GEMINI_API_KEY` to `.env.local`
2. Restart dev server: `npm run dev`
3. Open a product with a SKU
4. Click "Search by SKU" → searches database
5. If no results, click "Search Web" → searches internet
6. View discovered competitors in suggestions

## Cost Analysis

| Method | Free Tier | After Free |
|--------|-----------|------------|
| Gemini AI | 1500/day | N/A (always free) |
| Brave Search | 2000/month | $5/1000 |
| Jina AI | Unlimited | Always free |

**Recommended:** Use Gemini only (completely free!)
