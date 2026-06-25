import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getSiteContentMap } from '@/lib/queries/content';
import { Eye, Star, Target } from 'lucide-react';

export const revalidate = 0;

export default async function AboutPage() {
  let content: Record<string, string> = {};
  
  try {
    content = await getSiteContentMap();
  } catch (error) {
    console.error('Failed to load about page content:', error);
  }

  const aboutIntro = content.about_intro || 'The Society of Software Engineers (SSE) is the foremost professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem. The Society serves as a platform for software professionals, academics, innovators, technology leaders, and aspiring engineers to collaborate, exchange knowledge, develop practical solutions, and advance the software engineering profession in line with international standards.';
  
  const visionBody = content.strip_vision_body || 'To build a vibrant and globally respected community of software engineering professionals that inspires technological innovation, nurtures exceptional talent, and positions Nigeria as a leading hub for software development and digital solutions.';
  
  const missionBody = content.strip_mission_body || 'To advance the software engineering profession through professional development, technical capacity building, research, mentorship, strategic partnerships, advocacy, and the promotion of quality software practices. We are committed to equipping software engineers with the knowledge, skills, and ethical values needed to create reliable, secure, and innovative software solutions that accelerate economic growth and improve society.';

  const coreValues = [
    { title: 'Excellence', desc: 'We strive for the highest standards in engineering practices, education, and professional conduct.' },
    { title: 'Innovation', desc: 'We foster creativity and embrace emerging technologies to solve complex local and global problems.' },
    { title: 'Integrity & Ethics', desc: 'We promote honesty, responsibility, and strong ethical values in software design and professional relationships.' },
    { title: 'Collaboration', desc: 'We build a supportive, inclusive, and diverse community where professionals, academics, and students thrive together.' },
  ];

  return (
    <div>
      {/* Page Banner Header */}
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
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>About Our Society</h1>
          <p style={{ color: 'var(--accent-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Advancing the Standard of Software Engineering in Nigeria
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '50px' }}>
            <AnimatedSection direction="right">
              <SectionHeader title="Who We Are" subtitle="Overview" centered={false} />
              <div 
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--gray-dark)' }}
                dangerouslySetInnerHTML={{ __html: aboutIntro }}
              />
            </AnimatedSection>
            
            <AnimatedSection direction="left" className="flex-center">
              {/* Decorative brand box */}
              <div 
                style={{ 
                  backgroundColor: 'var(--gray-light)', 
                  border: '1px solid var(--gray-border)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '40px',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '-20px', 
                    right: '-20px', 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '8rem', 
                    color: 'rgba(37,99,235,0.05)', 
                    fontWeight: 800,
                    pointerEvents: 'none' 
                  }}
                >
                  &lt;/&gt;
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '15px', fontWeight: '700' }}>
                  Forward-Looking Ecosystem
                </h3>
                <p style={{ color: 'var(--gray-mid)', marginBottom: '20px', fontSize: '0.95rem' }}>
                  SSE works alongside key regulatory and standard bodies to define professional metrics, ethical baselines, and educational standards that directly guide and elevate Nigerian software practitioners.
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Star style={{ width: '24px', height: '24px', color: 'var(--accent)' }} />
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Chartered Principles & Standards</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Vision & Mission Strip */}
      <section className="section section-alt">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '40px' }}>
            <AnimatedSection direction="up" delay={0.1} className="card" style={{ padding: '40px', backgroundColor: 'var(--white)' }}>
              <Eye style={{ width: '40px', height: '40px', marginBottom: '15px', color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '15px', fontWeight: '700' }}>Our Vision</h3>
              <p style={{ color: 'var(--gray-dark)', lineHeight: '1.7' }}>{visionBody}</p>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2} className="card" style={{ padding: '40px', backgroundColor: 'var(--white)' }}>
              <Target style={{ width: '40px', height: '40px', marginBottom: '15px', color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '15px', fontWeight: '700' }}>Our Mission</h3>
              <p style={{ color: 'var(--gray-dark)', lineHeight: '1.7' }}>{missionBody}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <SectionHeader title="Our Core Values" subtitle="What Guides Us" />
          
          <div className="grid grid-4">
            {coreValues.map((val, index) => (
              <AnimatedSection 
                key={val.title} 
                direction="up" 
                delay={index * 0.1} 
                className="card"
                style={{ padding: '30px' }}
              >
                <div 
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'rgba(37,99,235,0.08)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    marginBottom: '20px'
                  }}
                >
                  {index + 1}
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '12px', fontWeight: '700' }}>{val.title}</h3>
                <p style={{ color: 'var(--gray-mid)', fontSize: '0.9rem', lineHeight: '1.6' }}>{val.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
