# Good Guys Roofing Experts

A Next.js 15 website powered by the CMS.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your CMS API key

4. Run the development server:
   ```bash
   npm run dev
   ```

## CMS Integration

This project is connected to your CMS. Content is fetched via the API and cached using ISR.

### Revalidation

When you publish content in the CMS, it automatically triggers revalidation via the webhook endpoint at `/api/revalidate`.

Configure your webhook URL in the CMS Settings → Developer → Revalidation Webhook.

### API Endpoints

- `/content` - Fetch published content
- `/design` - Get active design template
- `/project` - Project metadata
- `/sitemap` - All published URLs
