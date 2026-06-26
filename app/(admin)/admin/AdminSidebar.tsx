'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  CalendarDays,
  ChevronDown,
  Circle,
  ExternalLink,
  GraduationCap,
  Handshake,
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
  subLinks?: Omit<NavLink, 'subLinks'>[];
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
      {
        href: '/admin/content',
        label: 'Site Content (CMS)',
        Icon: Settings,
        subLinks: [
          { href: '/admin/content/hero', label: 'Hero Section', Icon: Circle },
          { href: '/admin/content/mission-strip', label: 'Vision & Mission', Icon: Circle },
          { href: '/admin/content/stats', label: 'Stats Counter', Icon: Circle },
          { href: '/admin/content/cta', label: 'Call To Action', Icon: Circle },
          { href: '/admin/content/about', label: 'About Page', Icon: Circle },
          { href: '/admin/content/footer', label: 'Footer Contact', Icon: Circle },
          { href: '/admin/content/social', label: 'Social Links', Icon: Circle },
        ],
      },
    ],
  },
  {
    section: 'Content Management',
    links: [
      { href: '/admin/news', label: 'News & Blog', Icon: Newspaper },
      { href: '/admin/events', label: 'Events', Icon: CalendarDays },
      { href: '/admin/programs', label: 'Programs', Icon: GraduationCap },
      { href: '/admin/partners', label: 'Partners', Icon: Handshake },
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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    '/admin/content': pathname.startsWith('/admin/content'),
  });

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
            {group.links.map((link) => {
              const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
              const expanded = link.subLinks ? (openGroups[link.href] ?? active) : false;

              return (
                <div key={link.href}>
                  <SidebarLink
                    link={link}
                    active={active}
                    expanded={expanded}
                    onToggle={
                      link.subLinks
                        ? () => setOpenGroups((prev) => ({ ...prev, [link.href]: !(prev[link.href] ?? active) }))
                        : undefined
                    }
                  />
                  {link.subLinks && expanded && (
                    <div className={styles.sidebarSubnav}>
                      {link.subLinks.map((subLink) => (
                        <SidebarLink
                          key={subLink.href}
                          link={subLink}
                          active={pathname === subLink.href}
                          subItem
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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

function SidebarLink({
  link,
  active,
  expanded = false,
  onToggle,
  subItem = false,
}: {
  link: NavLink;
  active: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  subItem?: boolean;
}) {
  const Icon = link.Icon;
  const className = subItem
    ? `${styles.sidebarSubLink} ${active ? styles.sidebarSubLinkActive : ''}`
    : `${styles.sidebarLink} ${active ? styles.sidebarLinkActive : ''}`;

  if (onToggle) {
    return (
      <button type="button" className={`${className} ${styles.sidebarAccordionBtn}`} onClick={onToggle}>
        <Icon size={16} aria-hidden="true" />
        <span>{link.label}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`${styles.sidebarChevron} ${expanded ? styles.sidebarChevronOpen : ''}`}
        />
      </button>
    );
  }

  return (
    <Link
      href={link.href}
      className={className}
    >
      <Icon size={subItem ? 7 : 16} aria-hidden="true" />
      <span>{link.label}</span>
    </Link>
  );
}
