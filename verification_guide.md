# Verification Guide

This guide outlines the steps to verify the functionality and UI of the Price Monitoring SaaS MVP.

## 1. Prerequisites
- Ensure the development server is running: `npm run dev`
- Ensure you have the Appwrite instance running and accessible.
- Ensure you have valid credentials for Salla (if testing OAuth) and Trendyol (if testing API).

## 2. Authentication Flow
1.  **Sign Up**:
    - Go to `/auth`.
    - Toggle to "Sign Up".
    - Enter a valid email and password.
    - Click "Create Account".
    - Verify you are redirected to `/dashboard`.
2.  **Sign In**:
    - Log out (if logged in).
    - Go to `/auth`.
    - Enter the email and password created above.
    - Click "Sign In".
    - Verify redirection to `/dashboard`.
3.  **Demo Login**:
    - Go to `/auth`.
    - Click "Use Demo Account".
    - Click "Sign In".
    - Verify redirection to `/dashboard`.

## 3. Dashboard & Stores
1.  **View Dashboard**:
    - Verify the summary cards (Total Stores, Total Products, etc.) are visible.
    - Verify the "Connected Stores" list is present.
2.  **Connect Salla**:
    - Click "Connect Store".
    - Select "Salla".
    - (If configured) Verify redirection to Salla OAuth.
    - (Mock/Manual) Verify store appears in the list after connection.
3.  **Connect Trendyol**:
    - Click "Connect Store".
    - Select "Trendyol".
    - Enter API Key and Secret.
    - Click "Connect".
    - Verify store appears in the list.

## 4. Products Management
1.  **List Products**:
    - Go to `/dashboard/products`.
    - Verify the table displays products (if any).
    - Test the search bar.
2.  **Product Details**:
    - Click on a product name.
    - Verify the Product Details page (`/products/[id]`) loads.
    - Verify product information (Image, Name, Price, Stock) is correct.
3.  **Competitor Links**:
    - On the Product Details page, look for "Competitor Links".
    - Add a new competitor link (e.g., a valid URL).
    - Verify the link appears in the list.
    - Click the link to verify it opens in a new tab.

## 5. UI & Dark Mode
1.  **Responsive Design**:
    - Resize the browser window to mobile width.
    - Verify the hamburger menu appears in the top right of the Landing Page.
    - Verify the Dashboard sidebar collapses or becomes a drawer (if implemented) or remains usable.
2.  **Dark Mode**:
    - Click the Theme Toggle (Sun/Moon icon) in the header.
    - Switch to "Dark".
    - Verify the background becomes dark and text becomes light.
    - Verify cards and inputs have appropriate contrast.
    - Switch back to "Light" or "System".

## 6. Landing Page & Internationalization
1.  **Navigation**:
    - Click "Features", "How it Works", and "Pricing" links.
    - Verify smooth scrolling or navigation to the respective pages.
2.  **Mobile Menu**:
    - On mobile view, open the hamburger menu.
    - Click the links to verify navigation.
3.  **Language Switcher**:
    - Locate the Language Switcher (Globe/Languages icon) in the header.
    - Switch to "العربية" (Arabic).
    - Verify the layout flips to RTL (Right-to-Left).
    - Verify text content is translated (e.g., "Start Free Trial" becomes "ابدأ التجربة المجانية").
    - Switch back to "English".
    - Verify layout returns to LTR.

## 7. Additional Pages
1.  **Verify Existence**:
    - Navigate to `/product`, `/features`, `/pricing`.
    - Navigate to `/about`, `/careers`, `/blog`, `/contact`.
    - Navigate to `/legal/privacy`, `/legal/terms`, `/legal/cookies`.
    - Verify each page loads with its placeholder content.

## 8. Troubleshooting
- **Appwrite Rate Limit**: If you see a "Rate limit exceeded" error, wait for a minute and try again. This is a temporary protection from the backend.
