'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Settings,
  UserRound,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './admin.module.css';

interface NavLink {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
}

interface NavGroup {
  section: string;
  links: NavLink[];
}

const navItems: NavGroup[] = [
  {
    section: 'Overview',
    links: [
      { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
    ],
  },
  {
    section: 'Content Management',
    links: [
      { href: '/admin/news', label: 'News & Blog', Icon: Newspaper },
      { href: '/admin/events', label: 'Events', Icon: CalendarDays },
      { href: '/admin/programs', label: 'Programs', Icon: GraduationCap },
      { href: '/admin/executives', label: 'Leadership', Icon: UserRound },
    ],
  },
  {
    section: 'Community',
    links: [
      { href: '/admin/members', label: 'Members', Icon: Users },
      { href: '/admin/contact', label: 'Contact Inbox', Icon: Inbox },
      { href: '/admin/newsletter', label: 'Newsletter', Icon: Mail },
    ],
  },
  {
    section: 'Settings',
    links: [
      { href: '/admin/content', label: 'Site Content (CMS)', Icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Image
          src="/images/logo.jpeg"
          alt="SSE Logo"
          width={38}
          height={38}
          style={{ borderRadius: '4px', backgroundColor: '#fff', padding: '2px' }}
        />
        <div className={styles.sidebarBrandText}>
          <span className={styles.sidebarBrandName}>SSE</span>
          <span className={styles.sidebarBrandSub}>Admin Panel</span>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map((group) => (
          <div key={group.section}>
            <div className={styles.sidebarSection}>{group.section}</div>
            {group.links.map((link) => (
              <SidebarLink
                key={link.href}
                link={link}
                active={link.exact ? pathname === link.href : pathname.startsWith(link.href)}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarUserInfo}>
          <div className={styles.sidebarAvatar}>{initials}</div>
          <div>
            <div className={styles.sidebarUserName}>{session?.user?.name || 'Admin'}</div>
            <div className={styles.sidebarUserRole}>{session?.user?.role || 'ADMIN'}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Sign Out</span>
        </button>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            target="_blank"
          >
            <ExternalLink size={14} aria-hidden="true" />
            <span>View Public Site</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ link, active }: { link: NavLink; active: boolean }) {
  const Icon = link.Icon;

  return (
    <Link
      href={link.href}
      className={`${styles.sidebarLink} ${active ? styles.sidebarLinkActive : ''}`}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{link.label}</span>
    </Link>
  );
}
