'use client';

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import { useConfirm, useToast } from '@/components/ui/FeedbackProvider';

type PartnerStatus = 'ACTIVE' | 'INACTIVE';

interface Partner {
  id: number;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  description?: string | null;
  status: PartnerStatus;
  display_order?: number;
}

const DEFAULT_FORM = {
  name: '',
  logo_url: '',
  website_url: '',
  description: '',
  status: 'ACTIVE' as PartnerStatus,
  display_order: '0',
};

export default function AdminPartnersPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const refetch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/partners');
      if (res.ok) {
        setPartners(await res.json());
      }
    } catch {
      toast.error('Failed to load partners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadPartners() {
      try {
        const res = await fetch('/api/partners');
        if (res.ok && !ignore) {
          setPartners(await res.json());
        }
      } catch {
        if (!ignore) {
          toast.error('Failed to load partners.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPartners();

    return () => {
      ignore = true;
    };
  }, [toast]);

  const openNew = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setShowForm(true);
  };

  const openEdit = (partner: Partner) => {
    setEditing(partner);
    setForm({
      name: partner.name,
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      description: partner.description || '',
      status: partner.status,
      display_order: partner.display_order?.toString() || '0',
    });
    setShowForm(true);
  };

  const updateForm = (key: keyof typeof DEFAULT_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadLogo = async (file: File) => {
    setUploadingLogo(true);

    const uploadData = new FormData();
    uploadData.append('logo', file);

    try {
      const res = await fetch('/api/uploads/partners', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.logo_url) {
        updateForm('logo_url', data.logo_url);
        toast.success('Logo uploaded.');
      } else {
        toast.error(data?.error || 'Logo upload failed.');
      }
    } catch {
      toast.error('Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      logo_url: form.logo_url || null,
      website_url: form.website_url || null,
      description: form.description || null,
      display_order: parseInt(form.display_order, 10) || 0,
    };

    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...payload } : payload;
      const res = await fetch('/api/partners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editing ? 'Partner updated.' : 'Partner added.');
        setShowForm(false);
        refetch();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Save failed.');
      }
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const deletePartner = async (partner: Partner) => {
    const confirmed = await confirm({
      title: 'Delete partner',
      message: `Delete partner "${partner.name}"?`,
      confirmText: 'Delete',
      tone: 'danger',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/partners?id=${partner.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Partner deleted.');
        refetch();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Delete failed.');
      }
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Partners</span>
        <div className={styles.topbarActions}>
          <button onClick={openNew} className="btn btn-primary btn-sm">+ New Partner</button>
        </div>
      </div>

      <div className={styles.adminBody}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageHeaderTitle}>Partner Organizations</div>
            <div className={styles.pageHeaderSub}>Add and manage partners displayed below the homepage call-to-action.</div>
          </div>
        </div>

        {showForm && (
          <div className={styles.formCard} style={{ marginBottom: '28px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
              {editing ? 'Edit Partner' : 'New Partner'}
            </h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Partner Name *</label>
                <input required value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="form-control" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Logo URL</label>
                  <input value={form.logo_url} onChange={(e) => updateForm('logo_url', e.target.value)} className="form-control" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input value={form.website_url} onChange={(e) => updateForm('website_url', e.target.value)} className="form-control" placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Logo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogo(file);
                      e.target.value = '';
                    }}
                    disabled={uploadingLogo}
                    className="form-control"
                    style={{ maxWidth: '360px' }}
                  />
                  {uploadingLogo && <span style={{ color: 'var(--gray-mid)', fontSize: '0.85rem' }}>Uploading...</span>}
                  {form.logo_url && (
                    <button type="button" onClick={() => updateForm('logo_url', '')} className="btn btn-outline btn-sm">
                      Remove Logo
                    </button>
                  )}
                </div>
                {form.logo_url && (
                  <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '150px', height: '70px', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-sm)', backgroundColor: '#fff', padding: '10px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.logo_url} alt="Partner logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select value={form.status} onChange={(e) => updateForm('status', e.target.value)} className="form-control">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => updateForm('display_order', e.target.value)} className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} className="form-control" style={{ minHeight: '80px' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}><span className={styles.tableTitle}>All Partners ({partners.length})</span></div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Partner</th><th>Website</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                  : partners.length === 0 ? <tr><td colSpan={5}><div className={styles.emptyState}><div className={styles.emptyStateText}>No partners yet.</div></div></td></tr>
                  : partners.map((partner) => (
                    <tr key={partner.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.88rem' }}>{partner.name}</div>
                        {partner.description && <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)', maxWidth: '420px' }}>{partner.description}</div>}
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>{partner.website_url || '-'}</td>
                      <td style={{ fontSize: '0.82rem' }}>{partner.display_order || 0}</td>
                      <td><span className={`badge ${partner.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary'}`} style={{ fontSize: '0.68rem' }}>{partner.status}</span></td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => openEdit(partner)} className={`${styles.btnAction} ${styles.btnEdit}`}>Edit</button>
                          <button onClick={() => deletePartner(partner)} className={`${styles.btnAction} ${styles.btnDanger}`}>Delete</button>
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
