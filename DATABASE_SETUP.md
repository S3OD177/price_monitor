# Database Setup Guide

## Quick Setup (Recommended)

### Step 1: Create API Key with Database Permissions

1. Go to your Appwrite Console → **Overview** → **API Keys**
2. Click "**Create API Key**"
3. Name: `Database Setup Key`
4. Scopes: Check **ALL** of these:
   - ✅ `databases.read`
   - ✅ `databases.write`
   - ✅ `collections.read`
   - ✅ `collections.write`
   - ✅ `attributes.read`
   - ✅ `attributes.write`
5. Click "**Create**"
6. Copy the API key

### Step 2: Update Environment Variable

Add the new API key to your `.env.local`:

```bash
APPWRITE_API_KEY=your_new_api_key_here
```

### Step 3: Run Setup Script

```bash
npx tsx scripts/setup-database.ts
```

The script will:
- ✅ Create the database
- ✅ Create 4 collections (stores, products, competitor-links, price-history)
- ✅ Add all required attributes
- ✅ Set proper permissions

**Total time: ~2 minutes**

---

## Manual Setup (Alternative)

If you prefer to set up manually via Appwrite Console:

### 1. Create Database
- Name: `Price Monitor Database`
- ID: `price-monitor-db`

### 2. Create Collections

#### stores
```
userId (String, 255, required)
platform (String, 50, required)
storeName (String, 255, required)
storeUrl (String, 500)
apiKey (String, 500)
status (String, 50, required)
lastSync (DateTime)
```

#### products
```
userId (String, 255, required)
storeId (String, 255, required)
productId (String, 255, required)
name (String, 500, required)
sku (String, 255)
currentPrice (Float, required)
currency (String, 10, required)
imageUrl (String, 1000)
productUrl (String, 1000)
```

#### competitor-links
```
userId (String, 255, required)
productId (String, 255, required)
competitorUrl (String, 1000, required)
competitorName (String, 255)
lastPrice (Float)
lastChecked (DateTime)
```

#### price-history
```
userId (String, 255, required)
productId (String, 255)
competitorLinkId (String, 255)
price (Float, required)
currency (String, 10, required)
recordedAt (DateTime, required)
```

**Permissions for all collections:**
- Document Security enabled
- Users can read/write their own documents

---

## Verification

After setup, test by:
1. Navigate to `http://localhost:3000/ar/auth`
2. Sign up with a new account
3. Dashboard should load without "Database not found" error
4. You should see "No Stores Connected" message

✅ **Your Price Monitor SaaS is ready!**
