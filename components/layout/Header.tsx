'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, Menu, User, X } from 'lucide-react';
import styles from './layout.module.css';
import MobileMenu from './MobileMenu';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header 
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}
        style={isScrolled ? { backgroundColor: 'rgba(13, 27, 75, 0.98)', height: '70px' } : undefined}
      >
        <div className={`${styles.headerContainer} container`}>
          {/* Logo Brand Area */}
          <Link href="/" className={styles.logoArea}>
            <Image 
              src="/images/logo.jpeg" 
              alt="SSE Logo" 
              width={50} 
              height={50} 
              className={styles.logoImage}
              priority
            />
            <div className={styles.brandInfo}>
              <span className={styles.brandAcronym}>SSE</span>
              <span className={styles.brandTitle}>Society of Software Engineers</span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className={styles.navMenu}>
            <div className={styles.navItem}>
              <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>
                Home
              </Link>
            </div>
            
            <div className={styles.navItem}>
              <Link href="/about" className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}>
                About Us
              </Link>
            </div>

            <div className={styles.navItem}>
              <span className={`${styles.navLink} ${isActive('/executives') ? styles.navLinkActive : ''}`}>
                Leadership <ChevronDown style={{ width: '14px', height: '14px' }} />
              </span>
              <div className={styles.dropdown}>
                <Link href="/executives?cat=PRESIDENT" className={styles.dropdownItem}>President's Address</Link>
                <Link href="/executives?cat=BOD" className={styles.dropdownItem}>Board of Directors (BOD)</Link>
                <Link href="/executives?cat=NEC" className={styles.dropdownItem}>National Executive Committee (NEC)</Link>
                <Link href="/executives?cat=BOA" className={styles.dropdownItem}>Board of Advisors (BOA)</Link>
                <Link href="/executives?cat=PATRON" className={styles.dropdownItem}>Patrons</Link>
              </div>
            </div>

            <div className={styles.navItem}>
              <Link href="/programs" className={`${styles.navLink} ${isActive('/programs') ? styles.navLinkActive : ''}`}>
                Programs & Services
              </Link>
            </div>

            <div className={styles.navItem}>
              <Link href="/news" className={`${styles.navLink} ${isActive('/news') ? styles.navLinkActive : ''}`}>
                News & Blog
              </Link>
            </div>

            <div className={styles.navItem}>
              <Link href="/events" className={`${styles.navLink} ${isActive('/events') ? styles.navLinkActive : ''}`}>
                Events
              </Link>
            </div>

            <div className={styles.navItem}>
              <Link href="/contact" className={`${styles.navLink} ${isActive('/contact') ? styles.navLinkActive : ''}`}>
                Contact Us
              </Link>
            </div>
          </nav>

          {/* Action Buttons / Auth State (Desktop) */}
          <div className={styles.headerActions}>
            {status === 'loading' ? (
              <div style={{ width: '80px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
            ) : session ? (
              <div className={styles.navItem}>
                <span className={`${styles.btn} btn-outline-white btn-sm`} style={{ gap: '6px' }}>
                  <User style={{ width: '16px', height: '16px' }} />
                  Account
                </span>
                <div className={styles.dropdown} style={{ transform: 'translateX(-30%) translateY(0)', left: 'auto', right: '0' }}>
                  <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--gray-border)', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>{session.user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{session.user.email}</div>
                  </div>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className={styles.dropdownItem}>Admin Dashboard</Link>
                  )}
                  <Link href="/portal" className={styles.dropdownItem}>Member Portal</Link>
                  <Link href="/portal/profile" className={styles.dropdownItem}>My Profile</Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className={styles.dropdownItem} 
                    style={{ width: '100%', textAlign: 'left', borderTop: '1px solid var(--gray-border)', marginTop: '8px', color: 'var(--danger)' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className={`${styles.navLink} ${isActive('/login') ? styles.navLinkActive : ''}`} style={{ borderBottom: 'none' }}>
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Join SSE
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button onClick={toggleMobileMenu} className={styles.hamburgerBtn} aria-label="Toggle navigation menu">
            {isMobileMenuOpen ? (
              <X style={{ width: '24px', height: '24px' }} />
            ) : (
              <Menu style={{ width: '24px', height: '24px' }} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} toggleClose={toggleMobileMenu} />
    </>
  );
}
