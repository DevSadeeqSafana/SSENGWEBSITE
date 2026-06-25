import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById } from '@/lib/queries/users';
import { getPublishedPosts } from '@/lib/queries/posts';
import { getUpcomingEvents } from '@/lib/queries/events';
import styles from './portal.module.css';
import { formatDate } from '@/lib/utils';
import { BadgeCheck, CalendarDays, CheckCircle, IdCard, Newspaper, Ticket, Zap } from 'lucide-react';

export const revalidate = 60;

export default async function PortalDashboard() {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session!.user.id);

  let user: any = null, recentPosts: any[] = [], upcomingEvents: any[] = [];

  try { user = await getUserById(userId); } catch {}
  try { recentPosts = (await getPublishedPosts()).slice(0, 3); } catch {}
  try { upcomingEvents = (await getUpcomingEvents()).slice(0, 3); } catch {}

  const name = user ? `${user.first_name} ${user.last_name}` : session!.user.name;
  const memberNumber = user?.membership_number || 'Pending Assignment';
  const memberStatus = user?.membership_status || 'PENDING';
  const memberType = user?.membership_type || 'ASSOCIATE';
  const memberSince = user?.created_at ? formatDate(user.created_at) : 'N/A';
  const expiresAt = user?.membership_expires_at ? formatDate(user.membership_expires_at) : 'N/A';

  const statusColors: Record<string, string> = {
    ACTIVE: '#10B981',
    PENDING: '#F59E0B',
    SUSPENDED: '#EF4444',
    EXPIRED: '#6B7280',
  };

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>My Dashboard</span>
        <Link href="/portal/profile" className="btn btn-outline btn-sm">Edit Profile →</Link>
      </div>

      <div className={styles.portalBody}>
        {/* Welcome banner */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeTitle}>Welcome back, {name?.split(' ')[0]}!</div>
          <div className={styles.welcomeSub}>
            Here's a summary of your SSE membership and the latest community activity.
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className={styles.memberIdBadge}>
              <IdCard style={{ width: '16px', height: '16px' }} />
              {memberNumber}
            </div>
            <div className={styles.memberIdBadge} style={{ color: statusColors[memberStatus] || '#fff' }}>
              {memberStatus === 'ACTIVE' ? <CheckCircle style={{ width: '16px', height: '16px' }} /> : <BadgeCheck style={{ width: '16px', height: '16px' }} />}
              {memberStatus}
            </div>
            <div className={styles.memberIdBadge}>
              {memberType} Member
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Membership Details */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ticket style={{ width: '18px', height: '18px' }} />
              Membership Details
            </div>
            {[
              { label: 'Membership Type', value: memberType },
              { label: 'Membership Status', value: <span style={{ color: statusColors[memberStatus] || 'inherit', fontWeight: '700' }}>{memberStatus}</span> },
              { label: 'Member Since', value: memberSince },
              { label: 'Membership Expires', value: expiresAt },
              { label: 'Email', value: user?.email || session?.user?.email || '—' },
            ].map(({ label, value }) => (
              <div key={label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value as any}</span>
              </div>
            ))}
            {memberStatus === 'PENDING' && (
              <div className="alert alert-warning" style={{ marginTop: '16px', fontSize: '0.82rem' }}>
                Your membership is awaiting admin approval. You will be notified once activated.
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap style={{ width: '18px', height: '18px' }} />
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/portal/profile" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Update My Profile</Link>
              <Link href="/events" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Browse Upcoming Events</Link>
              <Link href="/programs" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Explore Programs</Link>
              <Link href="/news" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Read Latest News</Link>
              <Link href="/contact" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Contact the Secretariat</Link>
            </div>
          </div>
        </div>

        {/* Latest news and events */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Recent News */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Newspaper style={{ width: '18px', height: '18px' }} />
              Latest News
            </div>
            {recentPosts.length === 0 ? (
              <p style={{ color: 'var(--gray-mid)', fontSize: '0.88rem' }}>No posts published yet.</p>
            ) : recentPosts.map((post: any) => (
              <Link key={post.id} href={`/news/${post.slug}`} style={{ display: 'block', marginBottom: '14px', textDecoration: 'none' }}>
                <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem', marginBottom: '3px' }}>{post.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{formatDate(post.published_at)}</div>
              </Link>
            ))}
            <Link href="/news" className={`${styles.infoRow} btn btn-outline btn-sm`} style={{ justifyContent: 'center', marginTop: '8px', borderTop: '1px solid var(--gray-border)', paddingTop: '12px' }}>View All Posts →</Link>
          </div>

          {/* Upcoming Events */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays style={{ width: '18px', height: '18px' }} />
              Upcoming Events
            </div>
            {upcomingEvents.length === 0 ? (
              <p style={{ color: 'var(--gray-mid)', fontSize: '0.88rem' }}>No upcoming events.</p>
            ) : upcomingEvents.map((ev: any) => (
              <Link key={ev.id} href={`/events/${ev.slug}`} style={{ display: 'block', marginBottom: '14px', textDecoration: 'none' }}>
                <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem', marginBottom: '3px' }}>{ev.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>
                  {formatDate(ev.start_date)} · {ev.location || 'Virtual'}
                </div>
              </Link>
            ))}
            <Link href="/events" className="btn btn-outline btn-sm" style={{ justifyContent: 'center', marginTop: '8px', display: 'block', textAlign: 'center' }}>View All Events →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
