// app/api/revalidate/route.ts
// ============================================
// ISR REVALIDATION ENDPOINT
// ============================================
// Accepts POST requests to invalidate cached pages.
//
// USAGE EXAMPLES:
//
// 1. Revalidate specific paths:
//    curl -X POST https://yoursite.com/api/revalidate \
//      -H "Content-Type: application/json" \
//      -d '{"token":"your_secret","paths":["/","/about","/services/plumbing"]}'
//
// 2. Revalidate by cache tags:
//    curl -X POST https://yoursite.com/api/revalidate \
//      -H "Content-Type: application/json" \
//      -d '{"token":"your_secret","tags":["services","homepage"]}'
//
// 3. Revalidate both paths and tags:
//    curl -X POST https://yoursite.com/api/revalidate \
//      -H "Content-Type: application/json" \
//      -d '{"token":"your_secret","paths":["/"],"tags":["global"]}'
//
// ENVIRONMENT:
//   REVALIDATE_TOKEN - Required at runtime, not at build time.
//
// ============================================

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

interface RevalidateRequest {
  token?: string;
  paths?: string[];
  tags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RevalidateRequest = await request.json();
    const { token, paths, tags } = body;

    // Validate token - only required at runtime when endpoint is called
    const expectedToken = process.env.REVALIDATE_TOKEN;
    
    if (!expectedToken) {
      console.error('[Revalidate] REVALIDATE_TOKEN env var not set');
      return NextResponse.json(
        { ok: false, error: 'Server misconfigured: REVALIDATE_TOKEN not set' },
        { status: 500 }
      );
    }

    if (!token || token !== expectedToken) {
      return NextResponse.json(
        { ok: false, error: 'Invalid or missing token' },
        { status: 401 }
      );
    }

    const revalidated: { paths: string[]; tags: string[] } = {
      paths: [],
      tags: [],
    };

    // Revalidate paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        if (typeof path !== 'string') continue;
        
        // Skip sitemap.xml - Next.js handles dynamic sitemaps automatically
        if (path === '/sitemap.xml') {
          revalidated.paths.push(path + ' (auto-handled)');
          continue;
        }

        try {
          revalidatePath(path);
          revalidated.paths.push(path);
        } catch (err) {
          console.warn(`[Revalidate] Failed to revalidate path "${path}":`, err);
          revalidated.paths.push(`${path} (failed)`);
        }
      }
    }

    // Revalidate tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag !== 'string') continue;

        try {
          revalidateTag(tag);
          revalidated.tags.push(tag);
        } catch (err) {
          console.warn(`[Revalidate] Failed to revalidate tag "${tag}":`, err);
          revalidated.tags.push(`${tag} (failed)`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid request body',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}