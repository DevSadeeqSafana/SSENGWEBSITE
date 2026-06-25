'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { formatDate } from '@/lib/utils';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter?admin=1');
      if (res.ok) setSubscribers(await res.json());
    } catch {}
    setLoading(false);
  };

  const filtered = subscribers.filter(s => filter === 'ALL' || s.status === filter);
  const subscribed = subscribers.filter(s => s.status === 'SUBSCRIBED').length;

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Newsletter Subscribers</span>
        <div className={styles.topbarActions}>
          <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600' }}>
            {subscribed} active subscriber{subscribed !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className={styles.adminBody}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageHeaderTitle}>Subscriber List</div>
            <div className={styles.pageHeaderSub}>View and manage newsletter subscriptions from the public website.</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['ALL', 'SUBSCRIBED', 'UNSUBSCRIBED'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`${styles.btnAction} ${filter === s ? styles.btnEdit : ''}`}
                style={{ borderColor: 'var(--gray-border)', color: filter === s ? 'var(--accent)' : 'var(--gray-mid)' }}
              >
                {s} {s !== 'ALL' && `(${subscribers.filter(sub => sub.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>📧</div>
                        <div className={styles.emptyStateText}>No subscribers yet in this category.</div>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((s: any, i: number) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--gray-mid)', fontSize: '0.78rem' }}>{i + 1}</td>
                    <td style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem' }}>{s.email}</td>
                    <td style={{ fontSize: '0.85rem' }}>{s.name || '—'}</td>
                    <td>
                      <span className={`badge ${s.status === 'SUBSCRIBED' ? 'badge-success' : 'badge-secondary'}`}
                        style={{ fontSize: '0.68rem' }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>
                      {formatDate(s.subscribed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
