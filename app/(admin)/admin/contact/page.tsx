'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { formatDate } from '@/lib/utils';

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) setMessages(await res.json());
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchMessages();
    } catch {}
  };

  const filtered = messages.filter(m =>
    filterStatus === 'ALL' || m.status === filterStatus
  );

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Contact Inbox</span>
        <div className={styles.topbarActions}>
          <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: '600' }}>
            {messages.filter(m => m.status === 'UNREAD').length} unread
          </span>
        </div>
      </div>

      <div className={styles.adminBody}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageHeaderTitle}>Contact Submissions</div>
            <div className={styles.pageHeaderSub}>Review messages sent via the public contact form.</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['ALL', 'UNREAD', 'READ', 'RESPONDED'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`${styles.btnAction} ${filterStatus === s ? styles.btnEdit : ''}`}
                style={{ borderColor: 'var(--gray-border)', color: filterStatus === s ? 'var(--accent)' : 'var(--gray-mid)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-mid)' }}>No messages found.</td></tr>
                ) : filtered.map((m: any) => (
                  <React.Fragment key={m.id}>
                    <tr style={{ backgroundColor: m.status === 'UNREAD' ? 'rgba(37,99,235,0.03)' : 'transparent' }}>
                      <td>
                        <div style={{ fontWeight: m.status === 'UNREAD' ? '700' : '500', color: 'var(--primary)', fontSize: '0.88rem' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{m.email}</div>
                        {m.phone && <div style={{ fontSize: '0.72rem', color: 'var(--gray-mid)' }}>{m.phone}</div>}
                      </td>
                      <td style={{ fontWeight: m.status === 'UNREAD' ? '600' : '400', fontSize: '0.88rem' }}>
                        {m.subject || 'General Enquiry'}
                      </td>
                      <td>
                        <span className={`badge ${m.status === 'UNREAD' ? 'badge-danger' : m.status === 'READ' ? 'badge-warning' : 'badge-success'}`}
                          style={{ fontSize: '0.68rem' }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>{formatDate(m.created_at)}</td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button
                            onClick={() => { setExpanded(expanded === m.id ? null : m.id); updateStatus(m.id, 'READ'); }}
                            className={`${styles.btnAction} ${styles.btnEdit}`}
                          >
                            {expanded === m.id ? 'Hide' : 'View'}
                          </button>
                          <button
                            onClick={() => updateStatus(m.id, 'RESPONDED')}
                            className={`${styles.btnAction} ${styles.btnSuccess}`}
                          >
                            ✓ Responded
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === m.id && (
                      <tr>
                        <td colSpan={5} style={{ backgroundColor: 'var(--gray-light)', borderTop: '1px solid var(--gray-border)' }}>
                          <div style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', fontSize: '0.88rem' }}>
                              Full Message:
                            </div>
                            <p style={{ color: 'var(--gray-dark)', lineHeight: '1.7', fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>
                              {m.message}
                            </p>
                            <div style={{ marginTop: '12px' }}>
                              <a
                                href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your Enquiry'}`}
                                className="btn btn-primary btn-sm"
                              >
                                ✉️ Reply via Email
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
