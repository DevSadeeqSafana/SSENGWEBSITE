import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProgramBySlug } from '@/lib/queries/programs';
import { formatPrice } from '@/lib/utils';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let program = null;
  try {
    program = await getProgramBySlug(slug);
  } catch (error) {
    console.error('Failed to load program detail:', error);
  }

  if (!program) {
    notFound();
  }

  return (
    <div>
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
              href="/programs" 
              style={{ color: 'var(--accent-light)', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              &larr; Back to Programs
            </Link>
          </div>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
            {program.program_type}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--white)' }}>
            {program.title}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', maxWidth: '800px' }}>
            {program.description}
          </p>
        </div>
      </section>

      {/* Main Details grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
            {/* Left side: Body content */}
            <div>
              {program.featured_image_url && (
                <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '30px' }}>
                  <Image
                    src={program.featured_image_url}
                    alt={program.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700' }}>
                Program Overview
              </h2>
              
              <div 
                style={{ 
                  lineHeight: '1.8', 
                  color: 'var(--gray-dark)', 
                  fontSize: '1.05rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
                dangerouslySetInnerHTML={{ __html: program.content || `<p>${program.description}</p>` }}
              />
            </div>

            {/* Right side: Sidebar Info Box */}
            <div>
              <div 
                style={{ 
                  backgroundColor: 'var(--gray-light)', 
                  border: '1px solid var(--gray-border)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '30px', 
                  position: 'sticky', 
                  top: '100px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700', borderBottom: '1px solid var(--gray-border)', paddingBottom: '10px' }}>
                  Program Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Duration:</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{program.duration || 'Self-paced'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Format:</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', textTransform: 'capitalize' }}>{program.format?.toLowerCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Price:</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {program.is_free ? 'Free' : formatPrice(program.price)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Status:</span>
                    <span 
                      className={`badge ${program.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {program.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {program.status === 'ACTIVE' ? (
                  <a 
                    href={program.registration_url || '/register'} 
                    target={program.registration_url ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-block"
                  >
                    Register / Enroll Now
                  </a>
                ) : (
                  <button 
                    disabled 
                    className="btn btn-outline btn-block"
                    style={{ color: 'var(--gray-mid)', borderColor: 'var(--gray-border)', cursor: 'not-allowed' }}
                  >
                    Registrations Closed
                  </button>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <Link 
                    href="/contact" 
                    style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600', textDecoration: 'underline' }}
                  >
                    Questions? Ask our team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
