'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, FileText, Hash, Image as ImageIcon, Loader2, Save, Search, Type } from 'lucide-react';
import type { ContentSection } from './contentSections';
import styles from '../admin.module.css';
import { useToast } from '@/components/ui/FeedbackProvider';

interface ContentItem {
  id: number;
  section_key: string;
  label: string;
  content_type: string;
  content_value: string;
}

function getFieldIcon(contentType: string) {
  if (contentType === 'IMAGE_URL') return ImageIcon;
  if (contentType === 'NUMBER') return Hash;
  if (contentType === 'RICHTEXT') return FileText;
  return Type;
}

function isCompactField(item: ContentItem) {
  return item.content_type === 'TEXT' || item.content_type === 'NUMBER' || item.content_type === 'IMAGE_URL';
}

export default function ContentEditor({ section }: { section: ContentSection }) {
  const toast = useToast();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (ignore) return;

        setItems(data);

        const vals: Record<string, string> = {};
        data.forEach((item: ContentItem) => {
          vals[item.section_key] = item.content_value || '';
        });
        setEditValues(vals);
      } catch {
        if (!ignore) {
          toast.error('Failed to load site content.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, [toast]);

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
        toast.success('Content saved.');
        setTimeout(() => setSavedKey(null), 2000);
      } else {
        toast.error('Save failed. Please try again.');
      }
    } catch {
      toast.error('Save failed. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const sectionItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items
      .filter((item) => section.prefixes.some((prefix) => item.section_key.startsWith(`${prefix}_`)))
      .filter((item) => {
        if (!normalizedSearch) return true;
        return (
          item.label.toLowerCase().includes(normalizedSearch) ||
          item.section_key.toLowerCase().includes(normalizedSearch)
        );
      });
  }, [items, searchTerm, section.prefixes]);

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Site Content (CMS)</span>
        <div className={styles.topbarActions}>
          <div className={styles.cmsSearch}>
            <Search size={15} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search this section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.adminBody}>
        <div className={styles.cmsHero}>
          <div className={styles.cmsHeroIcon}>
            <FileText size={20} aria-hidden="true" />
          </div>
          <div>
            <div className={styles.cmsKicker}>CMS Section</div>
            <div className={styles.cmsTitle}>{section.title}</div>
            <div className={styles.cmsDescription}>{section.description}</div>
          </div>
          <div className={styles.cmsCount}>
            {sectionItems.length}
            <span>items</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--gray-mid)' }}>Loading content keys...</p>
          </div>
        ) : (
          <div className={styles.cmsGrid}>
            {sectionItems.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateText}>No CMS items found for this section.</div>
              </div>
            ) : sectionItems.map((item) => {
              const FieldIcon = getFieldIcon(item.content_type);
              const compact = isCompactField(item);
              const currentValue = editValues[item.section_key] || '';

              return (
                <div
                  key={item.section_key}
                  className={`${styles.cmsFieldCard} ${compact ? '' : styles.cmsFieldWide}`}
                >
                  <div className={styles.cmsFieldHeader}>
                    <div className={styles.cmsFieldMeta}>
                      <span className={styles.cmsFieldIcon}>
                        <FieldIcon size={15} aria-hidden="true" />
                      </span>
                      <div>
                        <label className={styles.cmsFieldLabel}>{item.label}</label>
                        <div className={styles.cmsFieldDetails}>
                          <code>{item.section_key}</code>
                          <span>{item.content_type}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSave(item.section_key)}
                      disabled={saving === item.section_key}
                      className={`${styles.cmsSaveBtn} ${savedKey === item.section_key ? styles.cmsSaveBtnSaved : ''}`}
                    >
                      {saving === item.section_key ? (
                        <Loader2 size={14} aria-hidden="true" className={styles.cmsSpin} />
                      ) : savedKey === item.section_key ? (
                        <Check size={14} aria-hidden="true" />
                      ) : (
                        <Save size={14} aria-hidden="true" />
                      )}
                      <span>{saving === item.section_key ? 'Saving' : savedKey === item.section_key ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  {compact ? (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [item.section_key]: e.target.value }))}
                      className={styles.cmsInput}
                      placeholder={`Enter ${item.label}...`}
                    />
                  ) : (
                    <textarea
                      value={currentValue}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [item.section_key]: e.target.value }))}
                      className={styles.cmsTextarea}
                      placeholder={`Enter ${item.label}...`}
                    />
                  )}

                  {item.content_type === 'IMAGE_URL' && currentValue && (
                    <div
                      className={styles.cmsImagePreview}
                      style={{ backgroundImage: `url(${currentValue})` }}
                      aria-label={`${item.label} preview`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
