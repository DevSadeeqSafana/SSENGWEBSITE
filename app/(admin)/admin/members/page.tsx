'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../admin.module.css';
import { canManageAdmins } from '@/lib/authz';
import { formatDate } from '@/lib/utils';
import { useConfirm, useToast } from '@/components/ui/FeedbackProvider';

type MemberRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'MEMBER';
type MembershipStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';

interface Member {
  id: number;
  email: string;
  role: MemberRole;
  first_name: string;
  last_name: string;
  membership_number?: string | null;
  membership_type?: string | null;
  membership_status: MembershipStatus;
  created_at: string;
}

type MemberUpdates = Partial<Pick<Member, 'role' | 'membership_status' | 'membership_type' | 'membership_number'>>;

export default function AdminMembersPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const currentUserCanManageAdmins = canManageAdmins(session?.user?.role);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      setMembers(await res.json());
    } catch {}
    setLoading(false);
  };

  const updateMember = async (id: number, updates: MemberUpdates) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        toast.success('Member updated successfully.');
        fetchMembers();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Failed to update member.');
      }
    } catch {
      toast.error('Failed to update member.');
    }
    setActionLoading(null);
  };

  const deleteMember = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: 'Delete member',
      message: `Are you sure you want to delete member "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      tone: 'danger',
    });
    if (!confirmed) return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Member deleted.');
        fetchMembers();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Failed to delete member.');
      }
    } catch {
      toast.error('Failed to delete member.');
    }
    setActionLoading(null);
  };

  const filtered = members.filter(m => {
    const matchesSearch =
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.membership_number || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || m.membership_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Member Management</span>
        <div className={styles.topbarActions}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>
            {members.length} total members
          </span>
        </div>
      </div>

      <div className={styles.adminBody}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageHeaderTitle}>All Members</div>
            <div className={styles.pageHeaderSub}>Approve, activate, suspend, or remove member accounts.</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search name, email or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
            style={{ flex: 1, minWidth: '240px', maxWidth: '380px', padding: '9px 14px', fontSize: '0.88rem' }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="form-control"
            style={{ width: '180px', padding: '9px 14px', fontSize: '0.88rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Membership ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-mid)' }}>Loading members...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-mid)' }}>No members found.</td></tr>
                ) : filtered.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.88rem' }}>
                        {m.first_name} {m.last_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{m.email}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: '500' }}>{m.role}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {m.membership_number || '—'}
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>
                        {m.membership_type || 'ASSOCIATE'}
                      </span>
                    </td>
                    <td>
                      <select
                        value={m.membership_status}
                        onChange={e => updateMember(m.id, { membership_status: e.target.value as MembershipStatus })}
                        disabled={actionLoading === m.id}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.78rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--gray-border)',
                          backgroundColor: m.membership_status === 'ACTIVE' ? '#ECFDF5' : m.membership_status === 'PENDING' ? '#FFFBEB' : '#FEF2F2',
                          color: m.membership_status === 'ACTIVE' ? '#065F46' : m.membership_status === 'PENDING' ? '#92400E' : '#991B1B',
                          fontWeight: '600',
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="EXPIRED">Expired</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>
                      {formatDate(m.created_at)}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <select
                          value={m.role}
                          onChange={(e) => updateMember(m.id, { role: e.target.value as MemberRole })}
                          disabled={
                            actionLoading === m.id ||
                            !currentUserCanManageAdmins ||
                            m.role === 'SUPER_ADMIN'
                          }
                          title={
                            m.role === 'SUPER_ADMIN'
                              ? 'The super admin role cannot be changed here.'
                              : currentUserCanManageAdmins
                                ? 'Change member role'
                                : 'Only the super admin can change roles.'
                          }
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.78rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--gray-border)',
                            backgroundColor: '#fff',
                            color: 'var(--primary)',
                            fontWeight: '600',
                          }}
                        >
                          {m.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Admin</option>}
                          <option value="MEMBER">Member</option>
                          <option value="EDITOR">Editor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <button
                          onClick={() => deleteMember(m.id, `${m.first_name} ${m.last_name}`)}
                          disabled={actionLoading === m.id || m.role === 'SUPER_ADMIN'}
                          className={`${styles.btnAction} ${styles.btnDanger}`}
                          title={m.role === 'SUPER_ADMIN' ? 'The super admin account cannot be deleted.' : 'Delete member'}
                        >
                          Delete
                        </button>
                      </div>
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
