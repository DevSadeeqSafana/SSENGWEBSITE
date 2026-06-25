import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, PenLine } from 'lucide-react';
import { Post } from '@/lib/queries/posts';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import { formatDate } from '@/lib/utils';

interface LatestNewsProps {
  posts: Post[];
}

export default function LatestNews({ posts }: LatestNewsProps) {
  const displayPosts = posts
    .filter(p => p.status === 'PUBLISHED')
    .slice(0, 3);

  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHeader title="Latest News & Insights" subtitle="Stay Updated" />

        <div className="grid grid-3" style={{ marginBottom: '40px' }}>
          {displayPosts.length === 0 ? (
            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '40px', color: 'var(--gray-mid)' }}>
              No published articles available at the moment. Please check back later.
            </div>
          ) : (
            displayPosts.map((post, index) => (
              <AnimatedSection key={post.id} direction="up" delay={index * 0.1} className="card">
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <PenLine style={{ width: '14px', height: '14px' }} />
                      {post.author_name || 'SSE Admin'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <CalendarDays style={{ width: '14px', height: '14px' }} />
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>
                  <h3 className="card-title">
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="card-text">
                    {post.excerpt || 'Read the latest announcement and engineering articles published by the Society of Software Engineers.'}
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
            ))
          )}
        </div>

        <div className="text-center">
          <Link href="/news" className="btn btn-outline">
            Read More News
          </Link>
        </div>
      </div>
    </section>
  );
}
