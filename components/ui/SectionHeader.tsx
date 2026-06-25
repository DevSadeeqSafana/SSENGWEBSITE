import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true, dark = false }: SectionHeaderProps) {
  return (
    <div 
      style={{
        marginBottom: '50px',
        textAlign: centered ? 'center' : 'left',
        maxWidth: centered ? '700px' : '100%',
        marginLeft: centered ? 'auto' : '0',
        marginRight: centered ? 'auto' : '0',
      }}
    >
      {subtitle && (
        <span 
          style={{
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '2.5px',
            color: dark ? 'var(--accent-light)' : 'var(--accent)',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          {subtitle}
        </span>
      )}
      <h2 
        style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: dark ? 'var(--white)' : 'var(--primary)',
          letterSpacing: '-0.5px',
          lineHeight: '1.2'
        }}
      >
        {title}
      </h2>
      
      {/* Brand Motif divider: Line + Code block bracket + Line */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: centered ? 'center' : 'flex-start',
          gap: '15px',
          marginTop: '15px'
        }}
      >
        <div style={{ height: '2px', width: '40px', backgroundColor: dark ? 'rgba(255,255,255,0.2)' : 'var(--gray-border)' }}></div>
        <span 
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.9rem', 
            color: dark ? 'var(--accent-light)' : 'var(--accent)', 
            fontWeight: 700 
          }}
        >
          &lt;/&gt;
        </span>
        <div style={{ height: '2px', width: '40px', backgroundColor: dark ? 'rgba(255,255,255,0.2)' : 'var(--gray-border)' }}></div>
      </div>
    </div>
  );
}
