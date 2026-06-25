import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getAllPrograms, Program } from '@/lib/queries/programs';
import { formatPrice } from '@/lib/utils';

export const revalidate = 0;

export default async function ProgramsPage() {
  let programs: Program[] = [];
  try {
    programs = await getAllPrograms();
  } catch (error) {
    console.error('Failed to load programs list:', error);
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
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Programs & Certifications</h1>
          <p style={{ color: 'var(--accent-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Elevate Your Technical and Engineering Skills
          </p>
        </div>
      </section>

      {/* Roster Section */}
      <section className="section">
        <div className="container">
          <SectionHeader 
            title="Available Educational Pathways" 
            subtitle="Training & Mentorship" 
          />

          {programs.length === 0 ? (
            <div className="text-center" style={{ padding: '80px', color: 'var(--gray-mid)' }}>
              We are currently designing new educational programs. Please check back soon for our training calendar!
            </div>
          ) : (
            <div className="grid grid-3">
              {programs.map((program, index) => (
                <AnimatedSection 
                  key={program.id} 
                  direction="up" 
                  delay={index * 0.08}
                  className="card"
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                    <Image
                      src={program.featured_image_url || '/images/logo.jpeg'}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 5 }}>
                      <span className="badge badge-primary">{program.program_type}</span>
                    </div>
                    {program.status !== 'ACTIVE' && (
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          backgroundColor: 'rgba(13,27,75,0.7)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'var(--white)',
                          fontWeight: '700',
                          fontSize: '1.2rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      >
                        {program.status.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body">
                    <div className="card-meta">
                      <span>⏱️ {program.duration || 'Self-paced'}</span>
                      <span>📍 {program.format}</span>
                    </div>
                    <h3 className="card-title">
                      <Link href={`/programs/${program.slug}`}>{program.title}</Link>
                    </h3>
                    <p className="card-text">
                      {program.description || 'Join our structured, expert-led program to advance your understanding of software engineering systems.'}
                    </p>
                    
                    <div className="flex-between" style={{ marginTop: 'auto', borderTop: '1px solid var(--gray-border)', paddingTop: '15px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem' }}>
                        {program.is_free ? 'Free' : formatPrice(program.price)}
                      </span>
                      <Link 
                        href={`/programs/${program.slug}`} 
                        className={`btn ${program.status === 'ACTIVE' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        style={{ padding: '8px 18px' }}
                      >
                        {program.status === 'ACTIVE' ? 'Enroll / Details' : 'View Info'}
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
