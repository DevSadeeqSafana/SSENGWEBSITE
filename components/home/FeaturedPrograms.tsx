import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { Program } from '@/lib/queries/programs';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import { formatPrice } from '@/lib/utils';

interface FeaturedProgramsProps {
  programs: Program[];
}

export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const displayPrograms = programs.slice(0, 3);

  return (
    <section className="section section-alt">
      <div className="container">
        <SectionHeader title="Featured Programs & Certifications" subtitle="Build Your Capacity" />

        <div className="grid grid-3" style={{ marginBottom: '40px' }}>
          {displayPrograms.length === 0 ? (
            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '40px', color: 'var(--gray-mid)' }}>
              No active programs available at the moment. Please check back later.
            </div>
          ) : (
            displayPrograms.map((program, index) => (
              <AnimatedSection key={program.id} direction="up" delay={index * 0.1} className="card">
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
                </div>

                <div className="card-body">
                  <div className="card-meta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Clock style={{ width: '14px', height: '14px' }} />
                      {program.duration || 'Self-paced'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin style={{ width: '14px', height: '14px' }} />
                      {program.format}
                    </span>
                  </div>
                  <h3 className="card-title">
                    <Link href={`/programs/${program.slug}`}>{program.title}</Link>
                  </h3>
                  <p className="card-text">
                    {program.description || 'Advance your software engineering skills with this expert-curated learning path.'}
                  </p>

                  <div className="flex-between" style={{ marginTop: 'auto', borderTop: '1px solid var(--gray-border)', paddingTop: '15px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      {program.is_free ? 'Free' : formatPrice(program.price)}
                    </span>
                    <Link href={`/programs/${program.slug}`} className="btn btn-outline btn-sm" style={{ padding: '6px 14px', borderWidth: '1px' }}>
                      Learn More
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))
          )}
        </div>

        <div className="text-center">
          <Link href="/programs" className="btn btn-secondary">
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
