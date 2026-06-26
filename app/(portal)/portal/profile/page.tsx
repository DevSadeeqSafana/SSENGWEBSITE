'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Link as LinkIcon, Lock, Mail, Save, User } from 'lucide-react';
import styles from '../portal.module.css';
import { useToast } from '@/components/ui/FeedbackProvider';

export default function ProfilePage() {
  const toast = useToast();
  const { data: session, update } = useSession();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', state_of_origin: '', institution: '', discipline: '', bio: '', linkedin_url: '', twitter_url: '', github_url: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [tab, setTab] = useState<'profile' | 'security'>('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setForm({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            state_of_origin: data.state_of_origin || '',
            institution: data.institution || '',
            discipline: data.discipline || '',
            bio: data.bio || '',
            linkedin_url: data.linkedin_url || '',
            twitter_url: data.twitter_url || '',
            github_url: data.github_url || '',
          });
        }
      } catch {}
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Profile updated successfully.');
        await update({ name: `${form.first_name} ${form.last_name}` });
      } else {
        const d = await res.json();
        toast.error(d.error || 'Update failed.');
      }
    } catch { toast.error('Update failed. Please try again.'); }
    setSaving(false);
  };

  const handlePwChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }
    if (pwForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: pwForm.current_password, new_password: pwForm.new_password }),
      });
      if (res.ok) { toast.success('Password changed successfully.'); setPwForm({ current_password: '', new_password: '', confirm_password: '' }); }
      else { const d = await res.json(); toast.error(d.error || 'Password change failed.'); }
    } catch { toast.error('Password change failed.'); }
    setSavingPw(false);
  };

  const sf = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const nigerian_states = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>My Profile</span>
      </div>

      <div className={styles.portalBody}>
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--white)', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius-md)', padding: '4px', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
          {(['profile', 'security'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? 'var(--white)' : 'var(--gray-mid)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {t === 'profile' ? <User style={{ width: '16px', height: '16px' }} /> : <Lock style={{ width: '16px', height: '16px' }} />}
                {t === 'profile' ? 'Profile Info' : 'Security'}
              </span>
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className={styles.infoCard}>
            <div className={styles.infoCardTitle}>Personal & Professional Information</div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-mid)' }}>Loading profile...</div>
            ) : (
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input required value={form.first_name} onChange={e => sf('first_name', e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input required value={form.last_name} onChange={e => sf('last_name', e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input value={form.phone} onChange={e => sf('phone', e.target.value)} className="form-control" placeholder="+234 ..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State of Origin</label>
                    <select value={form.state_of_origin} onChange={e => sf('state_of_origin', e.target.value)} className="form-control">
                      <option value="">Select State...</option>
                      {nigerian_states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution / Workplace</label>
                    <input value={form.institution} onChange={e => sf('institution', e.target.value)} className="form-control" placeholder="University / Company" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Engineering Discipline</label>
                    <input value={form.discipline} onChange={e => sf('discipline', e.target.value)} className="form-control" placeholder="e.g. Electrical, Civil, Software" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio / About Me</label>
                  <textarea value={form.bio} onChange={e => sf('bio', e.target.value)} className="form-control" style={{ minHeight: '100px' }} placeholder="Tell us about yourself..." />
                </div>

                <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: '20px', marginTop: '8px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LinkIcon style={{ width: '16px', height: '16px' }} />
                    Social / Professional Links
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input value={form.linkedin_url} onChange={e => sf('linkedin_url', e.target.value)} className="form-control" placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Twitter / X</label>
                      <input value={form.twitter_url} onChange={e => sf('twitter_url', e.target.value)} className="form-control" placeholder="https://twitter.com/..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GitHub</label>
                      <input value={form.github_url} onChange={e => sf('github_url', e.target.value)} className="form-control" placeholder="https://github.com/..." />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '8px' }}>
                  {saving ? 'Saving...' : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Save style={{ width: '16px', height: '16px' }} />
                      Save Profile
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {tab === 'security' && (
          <div className={styles.infoCard} style={{ maxWidth: '520px' }}>
            <div className={styles.infoCardTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock style={{ width: '18px', height: '18px' }} />
              Change Password
            </div>
            <form onSubmit={handlePwChange}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input required type="password" value={pwForm.current_password} onChange={e => setPwForm(p => ({ ...p, current_password: e.target.value }))} className="form-control" autoComplete="current-password" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input required type="password" value={pwForm.new_password} onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))} className="form-control" autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input required type="password" value={pwForm.confirm_password} onChange={e => setPwForm(p => ({ ...p, confirm_password: e.target.value }))} className="form-control" autoComplete="new-password" />
              </div>
              <button type="submit" disabled={savingPw} className="btn btn-primary">
                {savingPw ? 'Changing...' : 'Change Password'}
              </button>
            </form>

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--gray-border)' }}>
              <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '16px', height: '16px' }} />
                Account Email
              </div>
              <div style={{ padding: '12px 16px', background: 'var(--gray-light)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--gray-dark)' }}>
                {session?.user?.email}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-mid)', marginTop: '8px' }}>
                To change your email address, please contact the SSE secretariat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
