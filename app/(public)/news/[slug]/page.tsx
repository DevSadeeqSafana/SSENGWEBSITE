import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, incrementPostViewCount } from '@/lib/queries/posts';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let post = null;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error('Failed to load post details:', error);
  }

  if (!post) {
    notFound();
  }

  // Increment view count inside the server component (runs on request)
  if (post.id) {
    try {
      await incrementPostViewCount(post.id);
    } catch (e) {
      console.error('Failed to increment view count:', e);
    }
  }

  return (
    <article>
      {/* Banner */}
      <section 
        style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--white)', 
          padding: '60px 0', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #1a2f7c 100%)',
          borderBottom: '4px solid var(--accent)'
        }}
      >
        <div className="container">
          <div style={{ marginBottom: '15px' }}>
            <Link 
              href="/news" 
              style={{ color: 'var(--accent-light)', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              &larr; Back to News
            </Link>
          </div>
          {post.category && (
            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
              {post.category}
            </span>
          )}
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', color: 'var(--white)' }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            <span>✍️ Written by: <strong>{post.author_name || 'SSE Admin'}</strong></span>
            <span>📅 Published: <strong>{formatDate(post.published_at || post.created_at)}</strong></span>
            <span>👁️ Views: <strong>{post.view_count !== undefined ? post.view_count + 1 : 0}</strong></span>
          </div>
        </div>
      </section>

      {/* Main Details grid */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {post.featured_image_url && (
            <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                sizes="(max-width: 800px) 100vw, 800px"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          {post.excerpt && (
            <div 
              style={{ 
                fontSize: '1.2rem', 
                fontWeight: '500', 
                color: 'var(--gray-dark)', 
                lineHeight: '1.7', 
                borderLeft: '4px solid var(--accent)', 
                paddingLeft: '20px', 
                marginBottom: '35px',
                fontStyle: 'italic'
              }}
            >
              {post.excerpt}
            </div>
          )}
          
          <div 
            style={{ 
              lineHeight: '1.9', 
              color: 'var(--dark)', 
              fontSize: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
          />

          {/* Social Share Mock / Author section */}
          <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)', fontWeight: '600' }}>
              TAGS: {post.tags ? (typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags).join(', ') : 'SSE, Tech, Engineering'}
            </span>
            
            <Link 
              href="/news" 
              className="btn btn-outline btn-sm"
            >
              View More Articles
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
