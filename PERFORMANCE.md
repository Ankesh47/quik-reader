# Performance Optimizations

This document details the performance improvements implemented in the Focal application.

## 1. Data Fetching Optimization (Server Side)
**File:** `src/actions/story.ts`

### Caching Strategy
We utilized Next.js `unstable_cache` to cache the result of the dashboard story list.
*   **Problem:** Every page load was hitting the MongoDB database, causing latency and unnecessary load.
*   **Solution:** The `getAllStories` result is now cached for **1 hour** (3600s).
*   **Implementation:**
    ```typescript
    export const getAllStories = unstable_cache(
        async () => { ... },
        ['stories-list'],
        { revalidate: 3600, tags: ['stories'] }
    );
    ```

## 2. Rendering Optimization (Client Side)
**Files:**
*   `src/components/rsvp/WordDisplay.tsx`
*   `src/components/rsvp/ProgressBar.tsx`

### React.memo
*   **Problem:** The RSVP engine updates the state 600+ times per minute. This caused the entire parent component tree to re-render, forcing React to diff the entire DOM on every word change.
*   **Solution:** We wrapped the visual components in `React.memo`. This ensures they only re-render when their specific props (word or progress) change, detached from the parent's unrelated state updates.

## 3. Database Resilience
**File:** `src/lib/db.ts`

### Connection Timeout
*   **Problem:** If the database IP was blocked (common in Vercel), the app would hang indefinitely until the serverless function timed out.
*   **Solution:** Added `serverSelectionTimeoutMS: 5000` to the Mongoose connection. This forces a "fail fast" behavior (5s) so the user gets immediate feedback instead of a hanging screen.

## 4. Authentication Instrumentation
**File:** `src/actions/auth.ts`
*   Added performance logging (currently commented out) to measure:
    *   DB Connection time
    *   User Fetch time
    *   Bcrypt Comparison time
    *   JWT Signing time
    *   *Usage:* Uncomment lines in `src/actions/auth.ts` to debug login slowness.
