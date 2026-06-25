import React from 'react';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function RegisterPage() {
  const benefits = [
    { title: 'Standard Credentialing', desc: 'Hold an official SSE credential that verifies your software engineering competency across Nigeria.' },
    { title: 'Exclusive Networks', desc: 'Connect directly with industry fellows, technology leads, software executives, and senior developers.' },
    { title: 'Training & Programs', desc: 'Participate in professional development courses, hackathons, and certifications at member-only prices.' },
    { title: 'Advocacy & Standards', desc: 'Contribute to defining standard practices and national policies for software systems and engineering education.' },
  ];

  return (
    <section className="section section-alt" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="grid grid-2" style={{ gap: '50px', alignItems: 'center' }}>
          {/* Benefits Info Panel */}
          <AnimatedSection direction="right">
            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--accent)', display: 'block', marginBottom: '10px' }}>
              Why Join SSE?
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px', lineHeight: '1.2' }}>
              Empowering Professional Software Engineers
            </h1>
            <p style={{ color: 'var(--gray-mid)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '35px' }}>
              By joining the Society of Software Engineers, you align yourself with a community committed to professional ethics, lifelong learning, and technical innovation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {benefits.map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.08)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' }}>
                    ✓
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '3px' }}>{benefit.title}</h4>
                    <p style={{ color: 'var(--gray-mid)', fontSize: '0.88rem', lineHeight: '1.5' }}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Registration Form Panel */}
          <AnimatedSection direction="left">
            <RegisterForm />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
