import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getAllExecutives, Executive } from '@/lib/queries/executives';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ExecutivesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = (resolvedSearchParams.cat || 'ALL').toUpperCase();

  let executives: Executive[] = [];
  try {
    const categoryFilter = activeCategory === 'ALL' ? undefined : activeCategory as Executive['category'];
    executives = await getAllExecutives(categoryFilter, true);
  } catch (error) {
    console.error('Failed to load executives list:', error);
  }

  // Filter groups
  const categories = [
    { key: 'ALL', label: 'All Leadership' },
    { key: 'PRESIDENT', label: "President's Address" },
    { key: 'BOD', label: 'Board of Directors (BOD)' },
    { key: 'NEC', label: 'Executive Committee (NEC)' },
    { key: 'BOA', label: 'Board of Advisors (BOA)' },
    { key: 'PATRON', label: 'Patrons' },
  ];

  // Helper to group by category for display when "ALL" is selected
  const categoryOrder: Executive['category'][] = ['PRESIDENT', 'BOD', 'NEC', 'BOA', 'PATRON'];
  const getCategoryLabel = (cat: Executive['category']) => {
    switch (cat) {
      case 'PRESIDENT': return 'President';
      case 'BOD': return 'Board of Directors';
      case 'NEC': return 'National Executive Committee';
      case 'BOA': return 'Board of Advisors';
      case 'PATRON': return 'Board of Patrons';
      default: return cat;
    }
  };

  return (
    <div>
      {/* Page Banner */}
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
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Our Leadership</h1>
          <p style={{ color: 'var(--accent-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Governing & Guiding the Society of Software Engineers
          </p>
        </div>
      </section>

      {/* Subnav Navigation */}
      <div 
        style={{ 
          backgroundColor: 'var(--gray-light)', 
          borderBottom: '1px solid var(--gray-border)', 
          position: 'sticky', 
          top: 'var(--header-height)', 
          zIndex: 80,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '20px', padding: '15px 20px' }}>
          {categories.map((cat) => (
            <Link 
              key={cat.key}
              href={`/executives?cat=${cat.key}`}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                fontSize: '0.88rem',
                backgroundColor: activeCategory === cat.key ? 'var(--accent)' : 'transparent',
                color: activeCategory === cat.key ? 'var(--white)' : 'var(--gray-dark)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Executive List Section */}
      <section className="section">
        <div className="container">
          {activeCategory !== 'ALL' ? (
            // Single Category Display
            <div>
              <SectionHeader 
                title={getCategoryLabel(activeCategory as Executive['category'])} 
                subtitle="Roster" 
              />
              
              {executives.length === 0 ? (
                <div className="text-center" style={{ padding: '60px', color: 'var(--gray-mid)' }}>
                  No members are currently listed under this leadership tier.
                </div>
              ) : (
                <div className="grid grid-3">
                  {executives.map((exec, idx) => (
                    <ExecutiveCard key={exec.id} exec={exec} index={idx} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Grouped Category Display
            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
              {categoryOrder.map((cat) => {
                const groupedExecs = executives.filter((e) => e.category === cat);
                if (groupedExecs.length === 0) return null;

                return (
                  <div key={cat}>
                    <SectionHeader title={getCategoryLabel(cat)} subtitle="Leadership Tier" />
                    <div className="grid grid-3">
                      {groupedExecs.map((exec, idx) => (
                        <ExecutiveCard key={exec.id} exec={exec} index={idx} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Executive Card component
function ExecutiveCard({ exec, index }: { exec: Executive; index: number }) {
  return (
    <AnimatedSection 
      direction="up" 
      delay={index * 0.08}
      className="card"
      style={{ overflow: 'hidden' }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '280px', 
          backgroundColor: 'var(--gray-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-mid)',
          fontSize: '3rem',
          borderBottom: '1px solid var(--gray-border)'
        }}
      >
        {exec.avatar_url ? (
          <Image 
            src={exec.avatar_url}
            alt={exec.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(13, 27, 75, 0.06)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--primary)',
              fontWeight: '800'
            }}
          >
            {exec.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="card-body" style={{ textAlign: 'center' }}>
        <span className="badge badge-secondary" style={{ alignSelf: 'center', marginBottom: '10px' }}>
          {exec.position || exec.category}
        </span>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--primary)', fontWeight: '700' }}>
          {exec.title} {exec.name}
        </h3>
        {exec.bio && (
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-mid)', marginBottom: '16px', lineHeight: '1.6' }}>
            {exec.bio}
          </p>
        )}
        
        {/* Social Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--gray-border)' }}>
          {exec.email && (
            <a href={`mailto:${exec.email}`} style={{ color: 'var(--gray-mid)' }} title="Email">
              ✉️
            </a>
          )}
          {exec.linkedin_url && (
            <a href={exec.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0A66C2' }} title="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', display: 'inline' }}>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
