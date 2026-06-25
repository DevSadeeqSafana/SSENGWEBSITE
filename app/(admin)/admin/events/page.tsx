'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { formatDate } from '@/lib/utils';

const DEFAULT_FORM = { title: '', description: '', content: '', event_type: 'WEBINAR', status: 'UPCOMING', location: '', is_virtual: false, is_free: true, ticket_price: '', start_date: '', end_date: '', registration_deadline: '', registration_url: '', featured_image_url: '', max_attendees: '' };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try { const res = await fetch('/api/events'); if (res.ok) setEvents(await res.json()); } catch {}
    setLoading(false);
  };

  const openEdit = (ev: any) => {
    setEditing(ev);
    setForm({
      title: ev.title, description: ev.description || '', content: ev.content || '',
      event_type: ev.event_type, status: ev.status, location: ev.location || '',
      is_virtual: !!ev.is_virtual, is_free: !!ev.is_free, ticket_price: ev.ticket_price || '',
      start_date: ev.start_date ? ev.start_date.substring(0, 16) : '',
      end_date: ev.end_date ? ev.end_date.substring(0, 16) : '',
      registration_deadline: ev.registration_deadline ? ev.registration_deadline.substring(0, 16) : '',
      registration_url: ev.registration_url || '', featured_image_url: ev.featured_image_url || '',
      max_attendees: ev.max_attendees || '',
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, is_virtual: form.is_virtual ? 1 : 0, is_free: form.is_free ? 1 : 0, ticket_price: form.ticket_price || null, max_attendees: form.max_attendees || null };
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...payload } : payload;
      const res = await fetch('/api/events', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setMessage(editing ? 'Event updated!' : 'Event created!'); setShowForm(false); fetchEvents(); }
      else { const d = await res.json(); setMessage(d.error || 'Save failed.'); }
    } catch { setMessage('Save failed.'); }
    setSaving(false); setTimeout(() => setMessage(''), 4000);
  };

  const deleteEvent = async (id: number, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return;
    await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const setField = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Events Management</span>
        <div className={styles.topbarActions}>
          <button onClick={() => { setEditing(null); setForm(DEFAULT_FORM); setShowForm(true); }} className="btn btn-primary btn-sm">+ New Event</button>
        </div>
      </div>

      <div className={styles.adminBody}>
        {message && <div className={`alert ${message.includes('failed') ? 'alert-danger' : 'alert-success'}`} style={{ marginBottom: '20px' }}>{message}</div>}

        {showForm && (
          <div className={styles.formCard} style={{ marginBottom: '28px' }}>
            <h3 style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>{editing ? 'Edit Event' : 'Create New Event'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group"><label className="form-label">Event Title *</label><input required value={form.title} onChange={e => setField('title', e.target.value)} className="form-control" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Type</label>
                  <select value={form.event_type} onChange={e => setField('event_type', e.target.value)} className="form-control">
                    {['CONFERENCE','WEBINAR','WORKSHOP','MEETUP','HACKATHON','SUMMIT'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select value={form.status} onChange={e => setField('status', e.target.value)} className="form-control">
                    {['UPCOMING','ONGOING','PAST','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Format</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '10px' }}>
                    <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                      <input type="checkbox" checked={form.is_virtual} onChange={e => setField('is_virtual', e.target.checked)} /> Virtual
                    </label>
                    <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                      <input type="checkbox" checked={form.is_free} onChange={e => setField('is_free', e.target.checked)} /> Free
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Start Date & Time *</label><input required type="datetime-local" value={form.start_date} onChange={e => setField('start_date', e.target.value)} className="form-control" /></div>
                <div className="form-group"><label className="form-label">End Date & Time</label><input type="datetime-local" value={form.end_date} onChange={e => setField('end_date', e.target.value)} className="form-control" /></div>
                <div className="form-group"><label className="form-label">Location / City</label><input value={form.location} onChange={e => setField('location', e.target.value)} className="form-control" placeholder="Lagos, Nigeria" /></div>
                <div className="form-group"><label className="form-label">Max Attendees</label><input type="number" value={form.max_attendees} onChange={e => setField('max_attendees', e.target.value)} className="form-control" placeholder="Leave blank for unlimited" /></div>
                {!form.is_free && <div className="form-group"><label className="form-label">Ticket Price (₦)</label><input type="number" value={form.ticket_price} onChange={e => setField('ticket_price', e.target.value)} className="form-control" /></div>}
                <div className="form-group"><label className="form-label">Registration URL</label><input value={form.registration_url} onChange={e => setField('registration_url', e.target.value)} className="form-control" placeholder="https://..." /></div>
              </div>
              <div className="form-group"><label className="form-label">Featured Image URL</label><input value={form.featured_image_url} onChange={e => setField('featured_image_url', e.target.value)} className="form-control" placeholder="https://..." /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea value={form.description} onChange={e => setField('description', e.target.value)} className="form-control" style={{ minHeight: '80px' }} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">{saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}><span className={styles.tableTitle}>All Events ({events.length})</span></div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                  : events.length === 0 ? <tr><td colSpan={5}><div className={styles.emptyState}><div className={styles.emptyStateIcon}>📅</div><div className={styles.emptyStateText}>No events yet.</div></div></td></tr>
                  : events.map((ev: any) => (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.88rem' }}>{ev.title}</td>
                      <td><span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{ev.event_type}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>{formatDate(ev.start_date)}</td>
                      <td><span className={`badge ${ev.status === 'UPCOMING' ? 'badge-success' : ev.status === 'ONGOING' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: '0.68rem' }}>{ev.status}</span></td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => openEdit(ev)} className={`${styles.btnAction} ${styles.btnEdit}`}>Edit</button>
                          <button onClick={() => deleteEvent(ev.id, ev.title)} className={`${styles.btnAction} ${styles.btnDanger}`}>Delete</button>
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
