import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getAllPosts, Post } from '@/lib/queries/posts';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function NewsPage() {
  let posts: Post[] = [];
  try {
    posts = await getAllPosts('PUBLISHED');
  } catch (error) {
    console.error('Failed to load published posts:', error);
  }

  return (
    <div>
      {/* Banner */}
      <section 
        style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--white)', 
          padding: '80px 0', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--primary) 0%, #1a2f7c 100%)',
          borderBottom: '4px solid var(--accent)'
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>News & Technical Articles</h1>
          <p style={{ color: 'var(--accent-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Engineering updates, announcements, and deep dives from Nigeria
          </p>
        </div>
      </section>

      {/* Roster Section */}
      <section className="section">
        <div className="container">
          <SectionHeader 
            title="Society Updates & Insights" 
            subtitle="Tech Bulletin" 
          />

          {posts.length === 0 ? (
            <div className="text-center" style={{ padding: '80px', color: 'var(--gray-mid)' }}>
              No articles have been published yet. Please check back later for announcements and insights.
            </div>
          ) : (
            <div className="grid grid-3">
              {posts.map((post, index) => (
                <AnimatedSection 
                  key={post.id} 
                  direction="up" 
                  delay={index * 0.08}
                  className="card"
                >
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <Image
                      src={post.featured_image_url || '/images/logo.jpeg'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    {post.category && (
                      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 5 }}>
                        <span className="badge badge-secondary">{post.category}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body">
                    <div className="card-meta">
                      <span>✍️ {post.author_name || 'SSE Admin'}</span>
                      <span>📅 {formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <h3 className="card-title">
                      <Link href={`/news/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="card-text">
                      {post.excerpt || 'Read this post to learn about new engineering strategies and announcements from the Society of Software Engineers.'}
                    </p>
                    
                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--gray-border)', paddingTop: '15px' }}>
                      <Link 
                        href={`/news/${post.slug}`} 
                        className="text-accent"
                        style={{ fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        Read Full Article &rarr;
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
