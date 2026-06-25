import React from 'react';
import Link from 'next/link';
import AnimatedSection from '../ui/AnimatedSection';
import styles from './home.module.css';

interface CTASectionProps {
  content: Record<string, string>;
}

export default function CTASection({ content }: CTASectionProps) {
  const headline = content.cta_headline || "Ready to Join Nigeria's Premier Software Engineering Community?";
  const subtext = content.cta_subtext || "Become part of a network of software professionals, innovators, and academic leaders driving Nigeria's digital transformation.";
  const primaryLabel = content.cta_primary_label || 'Register Now';
  const secondaryLabel = content.cta_secondary_label || 'Contact Us';

  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <AnimatedSection direction="up" className={styles.ctaContainer}>
          <h2 className={styles.ctaHeadline}>{headline}</h2>
          <p className={styles.ctaSubtext}>{subtext}</p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className="btn btn-primary btn-lg">
              {primaryLabel}
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-lg">
              {secondaryLabel}
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
