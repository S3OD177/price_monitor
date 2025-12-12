# Scraping & Data Quality Enhancements

This plan covers improvements to the scraping functionality and a new system for community-driven data quality with admin oversight.

## User Review Required
> [!IMPORTANT]
> **Database Changes**: This plan requires creating a new collection `ProductChangeRequests` in Appwrite.
> **Admin Role**: We will assume a simple "admin" check for now (e.g., specific user ID or email) to approve changes, as a full role-based system might be out of scope.

## Proposed Changes

### Scraping Improvements

#### [MODIFY] [product-scraper.ts](file:///c:/Users/m_ah1/Desktop/price_monitor/lib/scraper/product-scraper.ts)
- Enhance `extractSKU` to look for SKU in the URL itself (common in some stores).
- Improve regex for SKU extraction from page content.

#### [MODIFY] [actions.ts](file:///c:/Users/m_ah1/Desktop/price_monitor/app/[locale]/dashboard/products/[id]/actions.ts)
- Add `forceScrapeCompetitor(competitorId)` action.
- This action will bypass the cache check and force a fresh scrape.

#### [MODIFY] [suggested-competitor-card.tsx](file:///c:/Users/m_ah1/Desktop/price_monitor/components/products/suggested-competitor-card.tsx)
- Add "Scrape Now" button (or refresh icon) if the user is already tracking this competitor.
- Add a visual indicator for "Next Scrape" (e.g., "Updates in 2h").
    - *Note*: Since we don't have a real background job, we'll simulate "Next Scrape" as `lastScraped + 24h`.

### Community Data Editing

#### [NEW] [product-change-request.ts](file:///c:/Users/m_ah1/Desktop/price_monitor/lib/types/product-change-request.ts)
- Define interface for `ProductChangeRequest`.

#### [NEW] [change-request-dialog.tsx](file:///c:/Users/m_ah1/Desktop/price_monitor/components/products/change-request-dialog.tsx)
- A dialog allowing users to suggest edits for a competitor product (Name, SKU, Image, etc.).

#### [NEW] [admin-dashboard.tsx](file:///c:/Users/m_ah1/Desktop/price_monitor/app/[locale]/dashboard/admin/page.tsx)
- A simple page for admins to view and approve/reject change requests.

#### [MODIFY] [setup-db.ts](file:///c:/Users/m_ah1/Desktop/price_monitor/scripts/setup-db.ts)
- Add `ProductChangeRequests` collection creation logic.

## Verification Plan

### Automated Tests
- None (no test suite exists).

### Manual Verification
1.  **Scrape Now**:
    - Go to a product page.
    - Click "Refresh/Scrape Now" on a competitor card.
    - Verify `lastScraped` updates to "Just now".
2.  **SKU Extraction**:
    - Add a competitor with a known tricky URL (e.g., Salla URL with SKU in path).
    - Verify SKU is correctly extracted.
3.  **Suggest Edit**:
    - As a normal user, open "Suggest Edit" on a competitor.
    - Change the name or SKU and submit.
    - Verify success message.
4.  **Admin Approval**:
    - Log in as Admin (or simulate admin privileges).
    - Go to Admin Dashboard.
    - See the pending request.
    - Approve it.
    - Verify the actual competitor product is updated in the database.
