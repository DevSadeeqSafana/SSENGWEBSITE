'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';

interface ContentItem {
  id: number;
  section_key: string;
  label: string;
  content_type: string;
  content_value: string;
}

export default function SiteContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      setItems(data);
      const vals: Record<string, string> = {};
      data.forEach((item: ContentItem) => {
        vals[item.section_key] = item.content_value || '';
      });
      setEditValues(vals);
    } catch (e) {
      setError('Failed to load site content.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_key: key, content_value: editValues[key] }),
      });
      if (res.ok) {
        setSavedKey(key);
        setTimeout(() => setSavedKey(null), 2000);
      }
    } catch (e) {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by prefix
  const groups = filtered.reduce((acc: Record<string, ContentItem[]>, item) => {
    const prefix = item.section_key.split('_')[0];
    const groupName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Site Content Editor</span>
        <div className={styles.topbarActions}>
          <input
            type="text"
            placeholder="Search content keys..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ width: '260px', padding: '8px 14px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div className={styles.adminBody}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageHeaderTitle}>Site Content (CMS)</div>
            <div className={styles.pageHeaderSub}>
              Edit all public-facing website copy without touching the codebase.
              Changes take effect immediately on save.
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--gray-mid)' }}>Loading content keys...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {Object.entries(groups).map(([groupName, groupItems]) => (
              <div key={groupName} className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <span className={styles.tableTitle}>{groupName} Section</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-mid)', fontWeight: '500' }}>
                    {groupItems.length} content item{groupItems.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {groupItems.map((item) => (
                    <div key={item.section_key} style={{ borderBottom: '1px solid var(--gray-border)', paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', display: 'block' }}>
                            {item.label}
                          </label>
                          <code style={{ fontSize: '0.7rem', color: 'var(--gray-mid)', backgroundColor: 'var(--gray-light)', padding: '2px 6px', borderRadius: '3px' }}>
                            {item.section_key}
                          </code>
                          <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: '500' }}>
                            [{item.content_type}]
                          </span>
                        </div>
                        <button
                          onClick={() => handleSave(item.section_key)}
                          disabled={saving === item.section_key}
                          className={`${styles.btnAction} ${savedKey === item.section_key ? styles.btnSuccess : styles.btnEdit}`}
                          style={{ flexShrink: 0, marginLeft: '16px' }}
                        >
                          {saving === item.section_key ? 'Saving...' : savedKey === item.section_key ? '✓ Saved!' : 'Save'}
                        </button>
                      </div>
                      {item.content_type === 'TEXT' || item.content_type === 'NUMBER' || item.content_type === 'IMAGE_URL' ? (
                        <input
                          type="text"
                          value={editValues[item.section_key] || ''}
                          onChange={e => setEditValues(prev => ({ ...prev, [item.section_key]: e.target.value }))}
                          className="form-control"
                          style={{ fontSize: '0.88rem' }}
                          placeholder={`Enter ${item.label}...`}
                        />
                      ) : (
                        <textarea
                          value={editValues[item.section_key] || ''}
                          onChange={e => setEditValues(prev => ({ ...prev, [item.section_key]: e.target.value }))}
                          className={`form-control ${styles.contentEditor}`}
                          style={{ minHeight: item.content_type === 'RICHTEXT' ? '100px' : '80px' }}
                          placeholder={`Enter ${item.label}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
