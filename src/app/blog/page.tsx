import { getContent, getProject } from '@/lib/cms-client';
import { Hero } from '@/components/sections/Hero';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export async function generateMetadata() {
  const project = await getProject();
  return {
    title: 'Blog',
    description: "Latest news and insights from " + project.name,
  };
}

export default async function BlogPage() {
  const [{ items: posts }, project] = await Promise.all([
    getContent({ type: 'blog' }),
    getProject(),
  ]);

  return (
    <>
      <Hero 
        headline="Blog"
        subheadline="Latest news, tips, and insights"
      />
      <section className="py-16 container mx-auto px-4">
        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Link key={post.id} href={"/blog/" + post.slug}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {post.featured_image_url && (
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title || 'Blog post image'}
                      className="w-full h-48 object-cover -mt-6 -mx-6 mb-4"
                      style={{ width: 'calc(100% + 3rem)', maxWidth: 'calc(100% + 3rem)' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-muted line-clamp-3">{post.excerpt}</p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </section>
    </>
  );
}
