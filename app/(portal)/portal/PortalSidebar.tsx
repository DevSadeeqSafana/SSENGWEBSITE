'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { CalendarDays, ExternalLink, GraduationCap, Home, Newspaper, Settings, User } from 'lucide-react';
import styles from './portal.module.css';

const navLinks = [
  { href: '/portal', label: 'Dashboard', Icon: Home, exact: true },
  { href: '/portal/profile', label: 'My Profile', Icon: User },
  { href: '/news', label: 'News & Blog', Icon: Newspaper, external: true },
  { href: '/events', label: 'Events', Icon: CalendarDays, external: true },
  { href: '/programs', label: 'Programs', Icon: GraduationCap, external: true },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ME';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Image src="/images/logo.jpeg" alt="SSE" width={36} height={36} style={{ borderRadius: '4px', backgroundColor: '#fff', padding: '2px' }} />
        <div className={styles.sidebarBrandText}>
          <span className={styles.sidebarBrandName}>SSE</span>
          <span className={styles.sidebarBrandSub}>Member Portal</span>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {navLinks.map((link) => {
          const Icon = link.Icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.sidebarLink} ${
                link.exact ? pathname === link.href : pathname.startsWith(link.href) ? styles.sidebarLinkActive : ''
              } ${!link.exact && pathname.startsWith(link.href) ? styles.sidebarLinkActive : ''}`}
              {...(link.external ? { target: '_blank' } : {})}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              <span>{link.label}</span>
              {link.external && <ExternalLink style={{ width: '12px', height: '12px', marginLeft: 'auto', opacity: 0.5 }} />}
            </Link>
          );
        })}

        {session?.user?.role === 'ADMIN' && (
          <Link href="/admin" className={styles.sidebarLink} style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
            <Settings style={{ width: '16px', height: '16px' }} />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.memberBadge}>
          <div className={styles.memberAvatar}>{initials}</div>
          <div>
            <div className={styles.memberName}>{session?.user?.name}</div>
            <div className={styles.memberStatus}>{(session?.user as any)?.membership_status || 'PENDING'}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
