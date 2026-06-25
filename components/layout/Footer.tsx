import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSiteContentMap } from '@/lib/queries/content';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import styles from './layout.module.css';
import NewsletterForm from '../forms/NewsletterForm';

export default async function Footer() {
  // Fetch site content dynamically from the database (Server Component)
  let content: Record<string, string> = {};
  try {
    content = await getSiteContentMap();
  } catch (error) {
    console.error('Failed to load footer site content:', error);
  }

  const tagline = content.footer_tagline || 'Advancing Software Engineering. Empowering Nigeria\'s Digital Future.';
  const address = content.footer_address || 'Lagos, Nigeria';
  const email = content.footer_email || 'info@sse.ng';
  const phone = content.footer_phone || '+234 000 000 0000';
  
  const facebook = content.social_facebook || '#';
  const twitter = content.social_twitter || '#';
  const linkedin = content.social_linkedin || '#';
  const github = content.social_github || '#';
  const telegram = content.social_telegram || '#';

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerGrid} container`}>
        {/* Column 1: Brand details */}
        <div className={styles.footerColumn}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Image 
              src="/images/logo.jpeg" 
              alt="SSE Logo" 
              width={45} 
              height={45} 
              style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '2px' }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.5px' }}>
              SSE
            </span>
          </div>
          <p className={styles.footerAboutText}>{tagline}</p>
          
          <div className={styles.footerSocialList}>
            {facebook !== '#' && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Facebook">
                <span className={styles.footerSocialText}>f</span>
              </a>
            )}
            {twitter !== '#' && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Twitter/X">
                <span className={styles.footerSocialText}>X</span>
              </a>
            )}
            {linkedin !== '#' && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="LinkedIn">
                <span className={styles.footerSocialText}>in</span>
              </a>
            )}
            {github !== '#' && (
              <a href={github} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="GitHub">
                <span className={styles.footerSocialText}>GH</span>
              </a>
            )}
            {telegram !== '#' && (
              <a href={telegram} target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Telegram">
                <Send style={{ width: '18px', height: '18px' }} />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className={styles.footerColumn}>
          <h4>Quick Links</h4>
          <ul className={styles.footerLinksList}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/executives">Leadership</Link>
            </li>
            <li>
              <Link href="/news">News & Events</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className={styles.footerColumn}>
          <h4>Get In Touch</h4>
          <div className={styles.footerContactInfo}>
            <div className={styles.footerContactItem}>
              <MapPin className={styles.footerContactIcon} style={{ width: '18px', height: '18px' }} />
              <span>{address}</span>
            </div>
            <div className={styles.footerContactItem}>
              <Mail className={styles.footerContactIcon} style={{ width: '18px', height: '18px' }} />
              <a href={`mailto:${email}`} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{email}</a>
            </div>
            <div className={styles.footerContactItem}>
              <Phone className={styles.footerContactIcon} style={{ width: '18px', height: '18px' }} />
              <a href={`tel:${phone}`} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{phone}</a>
            </div>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div className={styles.footerColumn}>
          <h4>Newsletter</h4>
          <p className={styles.footerNewsletterText}>
            Subscribe to our newsletter to receive the latest updates, event news, and tech insights.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className={`${styles.footerBottom} container`}>
        <p className={styles.footerCopyright}>
          &copy; {currentYear} Society of Software Engineers (SSE). All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
