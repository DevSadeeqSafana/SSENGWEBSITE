'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { useConfirm, useToast } from '@/components/ui/FeedbackProvider';

const DEFAULT_FORM = { title: '', description: '', content: '', program_type: 'TRAINING', format: 'ONLINE', status: 'ACTIVE', duration: '', is_free: true, price: '', registration_url: '', featured_image_url: '', display_order: '0' };

export default function AdminProgramsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/programs').then(r => r.json()).then(setPrograms).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description || '', content: p.content || '', program_type: p.program_type, format: p.format || 'ONLINE', status: p.status, duration: p.duration || '', is_free: !!p.is_free, price: p.price || '', registration_url: p.registration_url || '', featured_image_url: p.featured_image_url || '', display_order: p.display_order?.toString() || '0' });
    setShowForm(true);
  };

  const refetch = () => { setLoading(true); fetch('/api/programs').then(r => r.json()).then(setPrograms).catch(() => {}).finally(() => setLoading(false)); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, is_free: form.is_free ? 1 : 0, price: form.price || null, display_order: parseInt(form.display_order) || 0 };
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...payload } : payload;
      const res = await fetch('/api/programs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { toast.success(editing ? 'Program updated.' : 'Program created.'); setShowForm(false); refetch(); }
      else { const d = await res.json(); toast.error(d.error || 'Save failed.'); }
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const deleteProgram = async (id: number, title: string) => {
    const confirmed = await confirm({
      title: 'Delete program',
      message: `Delete "${title}"?`,
      confirmText: 'Delete',
      tone: 'danger',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/programs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Program deleted.');
        refetch();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Delete failed.');
      }
    } catch {
      toast.error('Delete failed.');
    }
  };

  const sf = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Programs & Certifications</span>
        <div className={styles.topbarActions}>
          <button onClick={() => { setEditing(null); setForm(DEFAULT_FORM); setShowForm(true); }} className="btn btn-primary btn-sm">+ New Program</button>
        </div>
      </div>

      <div className={styles.adminBody}>
        {showForm && (
          <div className={styles.formCard} style={{ marginBottom: '28px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>{editing ? 'Edit Program' : 'New Program'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group"><label className="form-label">Program Title *</label><input required value={form.title} onChange={e => sf('title', e.target.value)} className="form-control" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Type</label>
                  <select value={form.program_type} onChange={e => sf('program_type', e.target.value)} className="form-control">
                    {['TRAINING','CERTIFICATION','MENTORSHIP','BOOTCAMP','WORKSHOP'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Format</label>
                  <select value={form.format} onChange={e => sf('format', e.target.value)} className="form-control">
                    {['ONLINE','PHYSICAL','HYBRID'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select value={form.status} onChange={e => sf('status', e.target.value)} className="form-control">
                    {['ACTIVE','INACTIVE','COMING_SOON'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Duration</label><input value={form.duration} onChange={e => sf('duration', e.target.value)} className="form-control" placeholder="e.g. 8 weeks, 3 months" /></div>
                <div className="form-group"><label className="form-label">Display Order</label><input type="number" value={form.display_order} onChange={e => sf('display_order', e.target.value)} className="form-control" /></div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.is_free} onChange={e => sf('is_free', e.target.checked)} /> Free Program
                </label>
                {!form.is_free && <div style={{ flex: 1 }}><input type="number" value={form.price} onChange={e => sf('price', e.target.value)} className="form-control" placeholder="Price in ₦" /></div>}
              </div>
              <div className="form-group"><label className="form-label">Registration URL</label><input value={form.registration_url} onChange={e => sf('registration_url', e.target.value)} className="form-control" placeholder="https://..." /></div>
              <div className="form-group"><label className="form-label">Featured Image URL</label><input value={form.featured_image_url} onChange={e => sf('featured_image_url', e.target.value)} className="form-control" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea value={form.description} onChange={e => sf('description', e.target.value)} className="form-control" style={{ minHeight: '80px' }} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}><span className={styles.tableTitle}>All Programs ({programs.length})</span></div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Title</th><th>Type</th><th>Format</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                  : programs.length === 0 ? <tr><td colSpan={6}><div className={styles.emptyState}><div className={styles.emptyStateIcon}>🎓</div><div className={styles.emptyStateText}>No programs yet.</div></div></td></tr>
                  : programs.map((p: any) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem' }}>{p.title}</td>
                      <td><span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{p.program_type}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>{p.format}</td>
                      <td style={{ fontWeight: '600', fontSize: '0.88rem', color: p.is_free ? 'var(--success)' : 'var(--primary)' }}>{p.is_free ? 'Free' : `₦${p.price}`}</td>
                      <td><span className={`badge ${p.status === 'ACTIVE' ? 'badge-success' : p.status === 'COMING_SOON' ? 'badge-warning' : 'badge-secondary'}`} style={{ fontSize: '0.68rem' }}>{p.status}</span></td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => openEdit(p)} className={`${styles.btnAction} ${styles.btnEdit}`}>Edit</button>
                          <button onClick={() => deleteProgram(p.id, p.title)} className={`${styles.btnAction} ${styles.btnDanger}`}>Delete</button>
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
