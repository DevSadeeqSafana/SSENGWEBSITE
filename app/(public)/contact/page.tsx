import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ContactForm from '@/components/forms/ContactForm';
import { getSiteContentMap } from '@/lib/queries/content';

export const revalidate = 0;

export default async function ContactPage() {
  let content: Record<string, string> = {};
  try {
    content = await getSiteContentMap();
  } catch (error) {
    console.error('Failed to load contact page details:', error);
  }

  const address = content.footer_address || 'Abuja Nigeria';
  const email = content.footer_email || 'info@sse.ng';
  const phone = content.footer_phone || '07003100071';
  
  const facebook = content.social_facebook || '#';
  const twitter = content.social_twitter || '#';
  const linkedin = content.social_linkedin || '#';
  const github = content.social_github || '#';
  const telegram = content.social_telegram || '#';

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
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Contact Us</h1>
          <p style={{ color: 'var(--accent-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            We would love to hear from you. Get in touch with our administrators.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '50px', alignItems: 'flex-start' }}>
            {/* Info details */}
            <AnimatedSection direction="right">
              <SectionHeader title="Contact Information" subtitle="Get In Touch" centered={false} />
              <p style={{ color: 'var(--gray-mid)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '35px' }}>
                Have questions about membership, training certifications, partnerships, or upcoming events? Our national secretariat is ready to assist you. Complete the contact form or reach out directly via our official channels.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    📍
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>National Secretariat</h4>
                    <p style={{ color: 'var(--gray-dark)', fontSize: '0.95rem' }}>{address}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    ✉️
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Email Address</h4>
                    <a href={`mailto:${email}`} style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '0.95rem' }}>{email}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    📞
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Phone Line</h4>
                    <a href={`tel:${phone}`} style={{ color: 'var(--gray-dark)', fontSize: '0.95rem' }}>{phone}</a>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <h4 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '15px' }}>Connect Socially</h4>
              <div style={{ display: 'flex', gap: '15px' }}>
                {facebook !== '#' && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    FB
                  </a>
                )}
                {twitter !== '#' && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    X
                  </a>
                )}
                {linkedin !== '#' && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    LN
                  </a>
                )}
                {github !== '#' && (
                  <a href={github} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    GH
                  </a>
                )}
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="left">
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
