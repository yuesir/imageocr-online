# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ImageOCR Online is a Next.js 15 web application that provides OCR (Optical Character Recognition) services for various document types. The application supports multiple OCR providers including Tesseract.js (client-side), Tencent Cloud OCR, and Alibaba Cloud VL API. It features user authentication, file storage, usage tracking, and a blog system, all powered by Supabase.

## Development Commands

```bash
# Start Next.js development server (port 3000)
npm run dev

# Start Express API server (port 3001) - optional, for local API development
npm run server:dev

# Run both Next.js and Express server concurrently
npm run full:dev

# Type checking without emitting files
npm run check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

## Architecture

### Project Structure

- **`app/`** - Next.js App Router directory with pages and API routes
  - **`app/api/ocr/`** - OCR processing endpoints (Tesseract, Tencent, Alibaba VL)
  - **`app/api/upload/`** - File upload handling
  - **`app/blog/`** - Blog listing and individual blog post pages (MDX-based)
  - Multiple OCR-specific page directories (e.g., `business-cards-ocr/`, `credit-cards-ocr/`, `handwriting-to-text/`, etc.)

- **`api/`** - Optional standalone Express server (legacy/alternative API)
  - Configured to run on port 3001
  - Can run in parallel with Next.js dev server

- **`components/`** - React components organized by feature
  - **`components/ocr/`** - Specialized OCR components for different document types
  - **`components/ui/`** - Reusable UI components (Radix UI based)
  - **`components/auth/`** - Authentication-related components
  - **`components/layout/`** - Layout components
  - **`components/blog/`** - Blog-related components

- **`lib/`** - Core utilities and clients
  - **`lib/supabase.ts`** - Supabase client initialization with browser and admin clients, includes full database TypeScript types
  - **`lib/analytics.ts`** - Google Analytics 4 integration
  - **`lib/ip-usage.ts`** - IP-based rate limiting and usage tracking
  - **`lib/blog.ts`** - Blog post loading and metadata handling

- **`content/`** - MDX blog content files

- **`supabase/migrations/`** - Database schema migrations

- **`hooks/`** - Custom React hooks

### Multi-Provider OCR System

The application supports four OCR processing methods:

1. **Tesseract.js (Default)** - Client-side OCR processing via `app/api/ocr/route.ts`
   - Supports multiple languages: English, Chinese (Simplified & Traditional)
   - Processes files from Supabase Storage
   - Returns confidence scores, text detections, and language detection

2. **Tencent Cloud OCR** - Server-side via `app/api/ocr/tencent/route.ts`
   - Requires `TENCENT_SECRET_ID` and `TENCENT_SECRET_KEY` environment variables
   - Supports regional configuration via `TENCENT_REGION`
   - See `TENCENT_OCR_SETUP.md` for detailed setup

3. **Alibaba Cloud VL API** - Server-side via `app/api/ocr/ali_vl/route.ts`
   - Requires `ALI_VL_API_KEY` environment variable

4. **Baidu OCR (general_basic)** - Server-side via `app/api/ocr/baidu/route.ts`
   - Requires `BAIDU_OCR_API_KEY` and `BAIDU_OCR_SECRET_KEY` environment variables
   - Docs: https://cloud.baidu.com/doc/OCR/s/zk3h7xz52

There is also an **auto endpoint** at `app/api/ocr/auto/route.ts` (used by the main OCR pages) that randomly picks between Alibaba Cloud VL and Baidu OCR on each request and falls back to the other provider if the selected one fails. Shared request handling (auth, rate limiting, file download, result saving) lives in `lib/ocr-handler.ts`, and provider implementations live in `lib/ocr-providers.ts`.

### Authentication & Database

- **Supabase** is used for:
  - User authentication (sign up, login, session management)
  - PostgreSQL database with the following key tables:
    - `users` - User accounts
    - `user_preferences` - User settings (theme, language, OCR preferences)
    - `files` - Uploaded file metadata
    - `ocr_results` - OCR processing results
    - `result_exports` - Exported result files
    - `ip_usage` - Anonymous user rate limiting (5 requests/day per IP)
    - `user_usage` - Authenticated user rate limiting (10 requests/day)
  - File storage in `ocr-files` bucket

- The `lib/supabase.ts` file includes complete TypeScript type definitions for all database tables.

### Usage Tracking & Rate Limiting

The application implements a two-tier rate limiting system:

- **Anonymous users**: 5 OCR requests per day (tracked by IP address)
- **Authenticated users**: 10 OCR requests per day (tracked by user email)

Usage tracking is handled by `lib/ip-usage.ts` with functions:
- `checkIPDailyLimit()` and `updateIPUsage()` for anonymous users
- `checkUserDailyLimit()` and `updateUserUsage()` for authenticated users

### Blog System

- Blog posts are written in **MDX** format and stored in `content/blog/`
- MDX processing configured in `next.config.js` with plugins:
  - `remark-gfm` - GitHub Flavored Markdown
  - `remark-reading-time` - Calculate reading time
  - `rehype-slug` - Add IDs to headings
  - `rehype-autolink-headings` - Auto-link headings
  - `rehype-prism-plus` - Syntax highlighting
- Blog metadata and loading handled by `lib/blog.ts`
- Custom MDX components defined in `mdx-components.tsx`

### Analytics

The application integrates two analytics platforms:

1. **Google Analytics 4** - Via `@next/third-parties`:
   - Configured with `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Analytics utilities in `lib/analytics.ts`
   - See `GOOGLE_ANALYTICS_SETUP.md` for detailed setup
   - Features GDPR-compliant cookie consent mechanism

2. **Microsoft Clarity** - User behavior analytics:
   - Configured with `NEXT_PUBLIC_CLARITY_ID`
   - Component located at `components/analytics/Clarity.tsx`
   - Only loads in production environment
   - Provides session recordings and heatmaps

### TypeScript Configuration

- Path aliases configured in `tsconfig.json`:
  - `@/*` maps to project root
  - `@/components/*` maps to `./components/*`
  - `@/lib/*` maps to `./lib/*`
  - `@/hooks/*` maps to `./hooks/*`
  - `@/utils/*` maps to `./utils/*`

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Tencent Cloud OCR (optional)
TENCENT_SECRET_ID=your_tencent_secret_id
TENCENT_SECRET_KEY=your_tencent_secret_key
TENCENT_REGION=ap-beijing

# Baidu OCR (optional)
BAIDU_OCR_API_KEY=your_baidu_ocr_api_key
BAIDU_OCR_SECRET_KEY=your_baidu_ocr_secret_key

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id

# Microsoft Clarity (optional)
NEXT_PUBLIC_CLARITY_ID=your_clarity_project_id

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Key Implementation Details

### OCR Processing Flow

1. User uploads file via `/api/upload` endpoint
2. File is stored in Supabase Storage with metadata in `files` table
3. OCR processing is triggered (either Tesseract, Tencent, or Alibaba)
4. Results saved to `ocr_results` table with:
   - Extracted text
   - Confidence score
   - Language detection
   - Processing time
   - Word and character counts

### Authentication Flow

- Supabase Auth handles all authentication
- Session management uses `@supabase/ssr` for server-side rendering
- Protected routes verify user session via `supabase.auth.getUser()`
- API routes require `Authorization: Bearer <token>` header

### File Upload & Storage

- Files uploaded to Supabase Storage bucket `ocr-files`
- Supported formats: JPG, PNG, PDF, WEBP
- File metadata stored in `files` table with user ownership tracking

### Specialized OCR Pages

The application includes multiple specialized OCR pages for different document types:
- Business cards, credit cards, driver's licenses, IDs, passports
- Receipts and invoices
- Handwritten notes and handwriting-to-text
- Language-specific OCR (Arabic, Chinese, Japanese, Greek, Indian languages)

Each specialized page typically has:
- A client component (`*Client.tsx`) for the UI
- A `page.tsx` that wraps the client component
- Shared OCR logic from `components/ocr/` directory

## Important Notes

- The Express server in `api/` directory is optional and primarily for local development or as an alternative API layer
- MDX pages are automatically rendered with custom components defined in `mdx-components.tsx`
- Tesseract.js requires special webpack configuration (see `next.config.js`) to handle worker files
- The application gracefully degrades when Supabase credentials are not configured (mock client is returned)
- Rate limiting errors should return appropriate HTTP status codes (429 for rate limit exceeded)
