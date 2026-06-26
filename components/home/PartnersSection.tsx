import React from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import type { Partner } from '@/lib/queries/partners';
import styles from './home.module.css';

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  if (partners.length === 0) return null;

  const marqueePartners = [...partners, ...partners];

  return (
    <section className={styles.partnersSection}>
      <div className="container">
        <AnimatedSection direction="up" className={styles.partnersHeader}>
          <span className={styles.partnersKicker}>Partners</span>
          <h2 className={styles.partnersTitle}>Organizations working with SSE</h2>
          <p className={styles.partnersText}>
            We collaborate with institutions, technology companies, and ecosystem partners advancing software engineering excellence.
          </p>
        </AnimatedSection>

        <div className={styles.partnersMarquee}>
          <div className={styles.partnersTrack}>
            {marqueePartners.map((partner, index) => (
              <PartnerItem
                key={`${partner.id || partner.name}-${index}`}
                partner={partner}
                ariaHidden={index >= partners.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerItem({ partner, ariaHidden }: { partner: Partner; ariaHidden?: boolean }) {
  const item = (
    <div className={styles.partnerItem}>
      <div className={styles.partnerLogoBox}>
        {partner.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo_url}
            alt={ariaHidden ? '' : `${partner.name} logo`}
            className={styles.partnerLogo}
          />
        ) : (
          <span className={styles.partnerInitials}>
            {partner.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .toUpperCase()
              .slice(0, 3)}
          </span>
        )}
      </div>
      <div className={styles.partnerName}>{partner.name}</div>
    </div>
  );

  if (!partner.website_url) {
    return <div aria-hidden={ariaHidden}>{item}</div>;
  }

  return (
    <a
      href={partner.website_url}
      className={styles.partnerLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : undefined}
    >
      {item}
    </a>
  );
}
