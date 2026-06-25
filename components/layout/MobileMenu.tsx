'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import styles from './layout.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  toggleClose: () => void;
}

export default function MobileMenu({ isOpen, toggleClose }: MobileMenuProps) {
  const { data: session } = useSession();
  const [isLeadershipOpen, setIsLeadershipOpen] = useState(false);

  return (
    <div 
      className={`${styles.mobileMenuOverlay} ${isOpen ? styles.mobileMenuOverlayActive : ''}`}
      onClick={toggleClose}
    >
      <div 
        className={`${styles.mobileSidebar} ${isOpen ? styles.mobileSidebarActive : ''}`}
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside menu
      >
        <div className={styles.mobileHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image 
              src="/images/logo.jpeg" 
              alt="SSE Logo" 
              width={40} 
              height={40} 
              style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '2px' }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
              SSE
            </span>
          </div>
          <button onClick={toggleClose} className={styles.mobileCloseBtn} aria-label="Close menu">
            <X style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        <nav className={styles.mobileNav}>
          <Link href="/" onClick={toggleClose} className={styles.mobileNavLink}>
            Home
          </Link>
          <Link href="/about" onClick={toggleClose} className={styles.mobileNavLink}>
            About Us
          </Link>
          
          <div className={`${styles.mobileNavLink} ${styles.mobileNavLinkWithSub}`}>
            <button 
              onClick={() => setIsLeadershipOpen(!isLeadershipOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', color: 'inherit', font: 'inherit', padding: 0 }}
            >
              <span>Leadership</span>
              {isLeadershipOpen ? (
                <ChevronUp style={{ width: '18px', height: '18px' }} />
              ) : (
                <ChevronDown style={{ width: '18px', height: '18px' }} />
              )}
            </button>
            {isLeadershipOpen && (
              <div className={styles.mobileSubNav}>
                <Link href="/executives?cat=PRESIDENT" onClick={toggleClose} className={styles.mobileSubNavLink}>
                  President's Address
                </Link>
                <Link href="/executives?cat=BOD" onClick={toggleClose} className={styles.mobileSubNavLink}>
                  Board of Directors
                </Link>
                <Link href="/executives?cat=NEC" onClick={toggleClose} className={styles.mobileSubNavLink}>
                  Executive Committee
                </Link>
                <Link href="/executives?cat=BOA" onClick={toggleClose} className={styles.mobileSubNavLink}>
                  Board of Advisors
                </Link>
                <Link href="/executives?cat=PATRON" onClick={toggleClose} className={styles.mobileSubNavLink}>
                  Patrons
                </Link>
              </div>
            )}
          </div>

          <Link href="/programs" onClick={toggleClose} className={styles.mobileNavLink}>
            Programs & Services
          </Link>
          <Link href="/news" onClick={toggleClose} className={styles.mobileNavLink}>
            News & Blog
          </Link>
          <Link href="/events" onClick={toggleClose} className={styles.mobileNavLink}>
            Events
          </Link>
          <Link href="/contact" onClick={toggleClose} className={styles.mobileNavLink}>
            Contact Us
          </Link>
        </nav>

        <div className={styles.mobileActions}>
          {session ? (
            <>
              <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '10px' }}>
                <div style={{ fontWeight: '600', color: 'var(--white)' }}>{session.user.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>{session.user.role} Portal</div>
              </div>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" onClick={toggleClose} className="btn btn-primary btn-sm btn-block" style={{ marginBottom: '10px' }}>
                  Admin Dashboard
                </Link>
              )}
              <Link href="/portal" onClick={toggleClose} className="btn btn-outline-white btn-sm btn-block">
                Member Portal
              </Link>
              <button 
                onClick={() => { signOut({ callbackUrl: '/' }); toggleClose(); }} 
                className="btn btn-sm btn-block" 
                style={{ color: 'var(--danger)', marginTop: '10px', textDecoration: 'underline' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={toggleClose} className="btn btn-outline-white btn-sm btn-block" style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                Log In
              </Link>
              <Link href="/register" onClick={toggleClose} className="btn btn-primary btn-sm btn-block">
                Join SSE
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
