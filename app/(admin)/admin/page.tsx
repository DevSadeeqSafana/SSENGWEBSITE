import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { CalendarDays, CheckCircle2, Mail, Newspaper, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getAllPosts } from '@/lib/queries/posts';
import { getAllEvents } from '@/lib/queries/events';
import { getAllUsers } from '@/lib/queries/users';
import { getAllContactSubmissions } from '@/lib/queries/interactions';
import { getAllNewsletterSubscribers } from '@/lib/queries/interactions';
import styles from './admin.module.css';

export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  let posts: any[] = [];
  let events: any[] = [];
  let members: any[] = [];
  let contacts: any[] = [];
  let subscribers: any[] = [];

  try { posts = await getAllPosts(); } catch {}
  try { events = await getAllEvents(); } catch {}
  try { members = await getAllUsers(); } catch {}
  try { contacts = await getAllContactSubmissions(); } catch {}
  try { subscribers = await getAllNewsletterSubscribers(); } catch {}

  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED').length;
  const upcomingEvents = events.filter((e) => e.status === 'UPCOMING').length;
  const activeMembers = members.filter((m) => m.membership_status === 'ACTIVE').length;
  const unreadContacts = contacts.filter((c) => c.status === 'UNREAD').length;
  const activeSubscribers = subscribers.filter((s) => s.status === 'SUBSCRIBED').length;

  const stats: { label: string; value: number; Icon: LucideIcon; href: string; color: string }[] = [
    { label: 'Total Members', value: members.length, Icon: Users, href: '/admin/members', color: '#2563EB' },
    { label: 'Active Members', value: activeMembers, Icon: CheckCircle2, href: '/admin/members', color: '#10B981' },
    { label: 'Published Posts', value: publishedPosts, Icon: Newspaper, href: '/admin/news', color: '#F59E0B' },
    { label: 'Upcoming Events', value: upcomingEvents, Icon: CalendarDays, href: '/admin/events', color: '#8B5CF6' },
    { label: 'Unread Messages', value: unreadContacts, Icon: Mail, href: '/admin/contact', color: '#EF4444' },
    { label: 'Subscribers', value: activeSubscribers, Icon: Mail, href: '/admin/newsletter', color: '#06B6D4' },
  ];

  const recentMembers = members.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Dashboard Overview</span>
        <div className={styles.topbarActions}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>
            Welcome back, <strong>{session?.user?.name}</strong>
          </span>
        </div>
      </div>

      <div className={styles.adminBody}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat) => {
            const Icon = stat.Icon;

            return (
              <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
                <div className={styles.statCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className={styles.statCardLabel}>{stat.label}</div>
                      <div className={styles.statCardValue} style={{ color: stat.color }}>{stat.value}</div>
                    </div>
                    <Icon size={34} color={stat.color} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Recent Members</span>
              <Link href="/admin/members" className={`${styles.btnAction} ${styles.btnEdit}`}>View All</Link>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray-mid)', padding: '30px' }}>No members yet</td></tr>
                ) : recentMembers.map((member: any) => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem' }}>{member.first_name} {member.last_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{member.email}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${member.membership_status === 'ACTIVE' ? 'badge-success' : member.membership_status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {member.membership_status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>
                      {new Date(member.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>Recent Messages</span>
              <Link href="/admin/contact" className={`${styles.btnAction} ${styles.btnEdit}`}>View All</Link>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray-mid)', padding: '30px' }}>No messages yet</td></tr>
                ) : recentContacts.map((contact: any) => (
                  <tr key={contact.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem' }}>{contact.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{contact.email}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.subject || 'General Enquiry'}
                    </td>
                    <td>
                      <span
                        className={`badge ${contact.status === 'UNREAD' ? 'badge-danger' : contact.status === 'READ' ? 'badge-warning' : 'badge-success'}`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/news" className="btn btn-primary btn-sm">+ New Post</Link>
          <Link href="/admin/events" className="btn btn-secondary btn-sm">+ New Event</Link>
          <Link href="/admin/programs" className="btn btn-outline btn-sm">+ New Program</Link>
          <Link href="/admin/executives" className="btn btn-outline btn-sm">+ Add Executive</Link>
          <Link href="/admin/content" className="btn btn-outline btn-sm">
            <Settings size={16} aria-hidden="true" />
            Edit Site Copy
          </Link>
        </div>
      </div>
    </div>
  );
}
