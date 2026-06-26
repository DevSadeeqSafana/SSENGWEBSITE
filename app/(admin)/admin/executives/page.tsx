'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { useConfirm, useToast } from '@/components/ui/FeedbackProvider';

const DEFAULT_FORM = { name: '', title: '', position: '', category: 'BOD', bio: '', email: '', linkedin_url: '', avatar_url: '', display_order: '0', is_active: true };

export default function AdminExecutivesPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [executives, setExecutives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const refetch = () => {
    setLoading(true);
    fetch('/api/executives').then(r => r.json()).then(setExecutives).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refetch(); }, []);

  const openEdit = (ex: any) => {
    setEditing(ex);
    setForm({ name: ex.name, title: ex.title, position: ex.position || '', category: ex.category, bio: ex.bio || '', email: ex.email || '', linkedin_url: ex.linkedin_url || '', avatar_url: ex.avatar_url || '', display_order: ex.display_order?.toString() || '0', is_active: !!ex.is_active });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, display_order: parseInt(form.display_order) || 0, is_active: form.is_active ? 1 : 0 };
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...payload } : payload;
      const res = await fetch('/api/executives', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { toast.success(editing ? 'Executive updated.' : 'Executive added.'); setShowForm(false); refetch(); }
      else { const d = await res.json(); toast.error(d.error || 'Save failed.'); }
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const deleteExec = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: 'Remove executive',
      message: `Remove "${name}" from leadership?`,
      confirmText: 'Remove',
      tone: 'danger',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/executives?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Executive removed.');
        refetch();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Remove failed.');
      }
    } catch {
      toast.error('Remove failed.');
    }
  };

  const sf = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const categories = ['PRESIDENT', 'BOD', 'NEC', 'SEC', 'BOA', 'PATRON'];

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Leadership Management</span>
        <div className={styles.topbarActions}>
          <button onClick={() => { setEditing(null); setForm(DEFAULT_FORM); setShowForm(true); }} className="btn btn-primary btn-sm">+ Add Executive</button>
        </div>
      </div>

      <div className={styles.adminBody}>
        {showForm && (
          <div className={styles.formCard} style={{ marginBottom: '28px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>{editing ? 'Edit Executive' : 'Add New Executive'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Full Name *</label><input required value={form.name} onChange={e => sf('name', e.target.value)} className="form-control" placeholder="Engr. John Doe" /></div>
                <div className="form-group"><label className="form-label">Title/Honorific *</label><input required value={form.title} onChange={e => sf('title', e.target.value)} className="form-control" placeholder="Engr., Dr., Prof." /></div>
                <div className="form-group"><label className="form-label">Position / Role</label><input value={form.position} onChange={e => sf('position', e.target.value)} className="form-control" placeholder="e.g. President, Secretary General" /></div>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select value={form.category} onChange={e => sf('category', e.target.value)} className="form-control">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" value={form.email} onChange={e => sf('email', e.target.value)} className="form-control" /></div>
                <div className="form-group"><label className="form-label">LinkedIn URL</label><input value={form.linkedin_url} onChange={e => sf('linkedin_url', e.target.value)} className="form-control" placeholder="https://linkedin.com/in/..." /></div>
                <div className="form-group"><label className="form-label">Photo URL</label><input value={form.avatar_url} onChange={e => sf('avatar_url', e.target.value)} className="form-control" placeholder="https://..." /></div>
                <div className="form-group"><label className="form-label">Display Order</label><input type="number" value={form.display_order} onChange={e => sf('display_order', e.target.value)} className="form-control" /></div>
              </div>
              <div className="form-group"><label className="form-label">Bio / Description</label><textarea value={form.bio} onChange={e => sf('bio', e.target.value)} className="form-control" style={{ minHeight: '80px' }} /></div>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', fontWeight: '500', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.is_active} onChange={e => sf('is_active', e.target.checked)} /> Active (Visible on public site)
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Add Executive'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}><span className={styles.tableTitle}>All Executives ({executives.length})</span></div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Name</th><th>Position</th><th>Category</th><th>Active</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                  : executives.length === 0 ? <tr><td colSpan={5}><div className={styles.emptyState}><div className={styles.emptyStateIcon}>👤</div><div className={styles.emptyStateText}>No executives added yet.</div></div></td></tr>
                  : executives.map((ex: any) => (
                    <tr key={ex.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.88rem' }}>{ex.title} {ex.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>{ex.email || ''}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{ex.position || '—'}</td>
                      <td><span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>{ex.category}</span></td>
                      <td>
                        <span className={`badge ${ex.is_active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                          {ex.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => openEdit(ex)} className={`${styles.btnAction} ${styles.btnEdit}`}>Edit</button>
                          <button onClick={() => deleteExec(ex.id, ex.name)} className={`${styles.btnAction} ${styles.btnDanger}`}>Remove</button>
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
