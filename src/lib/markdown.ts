import { marked } from 'marked';

// Configure marked for safe HTML output
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Convert Markdown to HTML
 * Use this for body_md and other markdown content
 */
export function renderMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  return marked.parse(markdown) as string;
}

/**
 * Render markdown for use with dangerouslySetInnerHTML
 */
export function markdownToHtml(markdown: string | null | undefined): { __html: string } {
  return { __html: renderMarkdown(markdown) };
}
