'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { formatDate } from '@/lib/utils';
import { useConfirm, useToast } from '@/components/ui/FeedbackProvider';

export default function AdminNewsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', status: 'DRAFT', featured_image_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) setPosts(await res.json());
    } catch {}
    setLoading(false);
  };

  const openNew = () => { setEditing(null); setForm({ title: '', excerpt: '', content: '', category: '', status: 'DRAFT', featured_image_url: '' }); setShowForm(true); };
  const openEdit = (post: any) => { setEditing(post); setForm({ title: post.title, excerpt: post.excerpt || '', content: post.content || '', category: post.category || '', status: post.status, featured_image_url: post.featured_image_url || '' }); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/posts', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editing ? 'Post updated.' : 'Post created.');
        setShowForm(false);
        fetchPosts();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Save failed.');
      }
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const deletePost = async (id: number, title: string) => {
    const confirmed = await confirm({
      title: 'Delete post',
      message: `Delete post "${title}"?`,
      confirmText: 'Delete',
      tone: 'danger',
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted.');
        fetchPosts();
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
        <span className={styles.topbarTitle}>News & Blog</span>
        <div className={styles.topbarActions}>
          <button onClick={openNew} className="btn btn-primary btn-sm">+ New Post</button>
        </div>
      </div>

      <div className={styles.adminBody}>
        {showForm && (
          <div className={styles.formCard} style={{ marginBottom: '28px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
              {editing ? 'Edit Post' : 'Create New Post'}
            </h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="form-control" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-control" placeholder="e.g. Announcement, Tech" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="form-control">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Featured Image URL</label>
                <input value={form.featured_image_url} onChange={e => setForm(p => ({ ...p, featured_image_url: e.target.value }))} className="form-control" placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Excerpt / Summary</label>
                <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} className="form-control" style={{ minHeight: '80px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Full Content (HTML supported)</label>
                <textarea required value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className={`form-control ${styles.contentEditor}`} style={{ minHeight: '200px' }} placeholder="<p>Write your article here...</p>" />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>All Posts ({posts.length})</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                  : posts.length === 0 ? <tr><td colSpan={6}><div className={styles.emptyState}><div className={styles.emptyStateIcon}>📰</div><div className={styles.emptyStateText}>No posts yet. Create your first post.</div></div></td></tr>
                  : posts.map((p: any) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem', maxWidth: '280px' }}>{p.title}</td>
                      <td style={{ fontSize: '0.82rem' }}>{p.author_name || '—'}</td>
                      <td>{p.category ? <span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>{p.category}</span> : '—'}</td>
                      <td>
                        <span className={`badge ${p.status === 'PUBLISHED' ? 'badge-success' : p.status === 'DRAFT' ? 'badge-warning' : 'badge-secondary'}`} style={{ fontSize: '0.68rem' }}>{p.status}</span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>{formatDate(p.published_at || p.created_at)}</td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => openEdit(p)} className={`${styles.btnAction} ${styles.btnEdit}`}>Edit</button>
                          <button onClick={() => deletePost(p.id, p.title)} className={`${styles.btnAction} ${styles.btnDanger}`}>Delete</button>
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
