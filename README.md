# Competitor Price Monitoring SaaS MVP

A production-ready MVP for monitoring competitor prices with Salla and Trendyol integrations.

## Features

- 🔐 **Authentication**: Email/password via Supabase Auth
- 🏪 **Salla Integration**: OAuth2 flow for store connection and product sync
- 🛍️ **Trendyol Integration**: API credentials for Seller account connection
- 📦 **Product Management**: View and manage products from connected stores
- 🔗 **Competitor Tracking**: Add manual competitor URLs per product
- 🔄 **Sync System**: Manual and scheduled product synchronization
- 📊 **Dashboard**: Overview of stores, products, and sync status

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **UI Components**: Radix UI

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

SALLA_CLIENT_ID=your-salla-client-id
SALLA_CLIENT_SECRET=your-salla-client-secret
SALLA_REDIRECT_URI=http://localhost:3000/integrations/salla/callback
```

### 3. Setup Database

Run the SQL schema in your Supabase project:

```bash
# Copy contents of supabase/schema.sql to Supabase SQL Editor and execute
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
price_monitor/
├── app/
│   ├── actions/           # Server actions
│   ├── auth/              # Authentication
│   ├── dashboard/         # Dashboard
│   ├── integrations/      # Salla & Trendyol
│   ├── products/          # Product management
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # UI components
│   └── main-nav.tsx       # Navigation
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── sallaClient.ts     # Salla API
│   └── trendyolClient.ts  # Trendyol API
└── supabase/
    └── schema.sql         # Database schema
```

## Usage

1. **Register**: Create an account at `/register`
2. **Connect Store**: Go to `/integrations` and connect Salla or Trendyol
3. **Sync Products**: Click "Sync Now" on dashboard to fetch products
4. **Add Competitor Links**: Go to product details and add competitor URLs
5. **Monitor**: Track competitor prices (future feature)

## API Integrations

### Salla
- OAuth2 authorization flow
- Merchant info and product endpoints
- Token refresh handling

### Trendyol
- Supplier API with Basic Auth
- Product listing with pagination
- Stock and price synchronization

## Security

- Row Level Security (RLS) on all tables
- Multi-tenant data isolation
- Secure credential storage
- Protected routes via middleware

## Build

```bash
npm run build
```

## License

MIT
