# Google Analytics Setup Guide

This document provides complete instructions for setting up Google Analytics 4 (GA4) on the Bangladesh Election Tracker website.

## Overview

The project uses **two analytics solutions**:

1. **Vercel Web Analytics** - Automatically tracks Core Web Vitals and performance metrics
2. **Google Analytics 4 (GA4)** - Provides comprehensive visitor tracking and behavior analysis

---

## Step-by-Step Setup Instructions

### Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account (create one if needed)
3. Click **"Start measuring"** or **"Create"** in the left menu
4. Enter your account name: `Bangladesh Election Tracker`
5. Accept the Google Analytics terms

### Step 2: Create a Property

1. Under "Property Setup":
   - **Property name**: `Bangladesh Election Tracker`
   - **Reporting time zone**: `Asia/Dhaka` (or your preferred timezone)
   - **Currency**: `BDT` (Bangladeshi Taka) or `USD`

2. Click **"Next"**

### Step 3: Create a Data Stream

1. **Platform**: Select **"Web"**
2. Enter your website details:
   - **Website URL**: `https://bdelection.live` (or your domain)
   - **Stream name**: `Bangladesh Election Tracker Website`
3. Click **"Create stream"**

### Step 4: Get Your Measurement ID

After creating the data stream, you'll see:

- **Measurement ID**: This is your GA4 ID, looks like: `G-XXXXXXXXXX`
- Copy this ID - you'll need it next

### Step 5: Add to Environment Variables

#### For Local Development:

Create or edit `.env.local` in your project root:

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 4.

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
   - **Value**: `G-XXXXXXXXXX`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **"Save"**

### Step 6: Verify Installation

1. #### Locally:

   ```bash
   npm run dev
   ```

   - Open browser DevTools (F12)
   - Go to **Network** tab
   - Visit a page on your site
   - Search for requests to `googletagmanager.com`
   - You should see requests going through

2. #### Real-time Dashboard:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Select your property
   - Click **"Real time"** in the left menu
   - Load your website in a new tab
   - You should see your user session appear in real-time

### Step 7: (Optional) Create Custom Events

You can track custom events by adding this code where needed:

```typescript
// Track custom events
const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Example usage:
// When user votes or clicks important button
trackEvent("election_search", {
  constituency: "Dhaka-1",
  query_time: new Date().toISOString(),
});
```

### Step 8: (Optional) Set Up Goals/Conversions

In Google Analytics:

1. Go to **Admin** → **Conversions** (or **Goals** in older GA3)
2. Click **"+ New conversion event"**
3. Examples to create:
   - `search_constituency` - When user searches
   - `view_results` - When user views results
   - `share_result` - When user shares results
   - `toggle_theme` - When user switches dark/light mode

---

## Dashboard Access

Once installed and tracking for 24+ hours:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property: **Bangladesh Election Tracker**
3. Explore these key reports:
   - **Acquisition** → **Overview** - How users found you
   - **Engagement** → **Pages and screens** - Most viewed pages
   - **Engagement** → **Events** - User interactions
   - **Retention** → **Returning users** - Repeat visitors
   - **Demographics** → Geographic location of viewers

---

## Troubleshooting

### GA4 Script not Loading?

1. Check `.env.local` has correct `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
2. Clear browser cache and hard refresh (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify the measurement ID starts with `G-`

### No Data in Real-time?

- GA4 takes 1-2 minutes to show real-time data
- Check **Admin** → **Data Collection & Modification** → **Data streams**
- Verify stream status (should say "Data stream is collecting data")
- Make sure you're on the actual website (localhost won't appear in real-time)

### Test Data Appearing?

- Google Analytics shows test traffic from your IP
- This is useful for testing without affecting real data
- Go to **Admin** → **Data Filters** to exclude your IP if desired

---

## Performance Considerations

- **GA4 Script**: Loaded with `strategy="afterInteractive"` (waits for page hydration)
- **Bundle Effect**: Adds ~50KB to First Load JS
- **Vercel Analytics**: Adds negligible overhead (already built-in)

---

## Deployment Checklist

✅ Measurement ID added to Vercel environment variables  
✅ Environment variable name: `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`  
✅ Code deployed to production  
✅ Real-time traffic visible in GA4 dashboard  
✅ Reports showing accurate visitor data

---

## Support Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics#topic=9143232)
- [Next.js Analytics Integration](https://nextjs.org/learn/seo/monitor-performance/analytics)
- [Track Custom Events Guide](https://support.google.com/analytics/answer/11396674)
- [Debug GA4 Issues](https://support.google.com/analytics/answer/9411986)

---

## Summary

The Bangladesh Election Tracker now has two complementary analytics solutions:

| Feature                 | Vercel Analytics | Google Analytics 4 |
| ----------------------- | ---------------- | ------------------ |
| **Core Web Vitals**     | ✅               | ✅                 |
| **Page Views**          | ✅               | ✅                 |
| **User Sessions**       | ✅               | ✅                 |
| **Event Tracking**      | ❌               | ✅                 |
| **Custom Reports**      | ❌               | ✅                 |
| **Real-time Dashboard** | ❌               | ✅                 |
| **Setup Required**      | None             | Yes (this guide)   |

**Next Steps**: Complete Step 4 with your actual Measurement ID, then follow Steps 5-6 to activate analytics on your site.
