import { query } from '../db';

export interface SiteContent {
  id?: number;
  section_key: string;
  label: string;
  content_type: 'TEXT' | 'RICHTEXT' | 'IMAGE_URL' | 'JSON' | 'NUMBER';
  content_value: string;
  updated_by?: number | null;
  updated_at?: string;
}

const defaultSiteContent: Pick<SiteContent, 'section_key' | 'label' | 'content_type' | 'content_value'>[] = [
  {
    section_key: 'hero_image_1',
    label: 'Hero: Slide Image 1 URL',
    content_type: 'IMAGE_URL',
    content_value: '/images/hero_slide_1.png',
  },
  {
    section_key: 'hero_image_2',
    label: 'Hero: Slide Image 2 URL',
    content_type: 'IMAGE_URL',
    content_value: '/images/hero_slide_2.png',
  },
  {
    section_key: 'hero_image_3',
    label: 'Hero: Slide Image 3 URL',
    content_type: 'IMAGE_URL',
    content_value: '/images/hero_slide_3.png',
  },
];

async function ensureDefaultSiteContent(): Promise<void> {
  const sql = `
    INSERT INTO site_content (section_key, label, content_type, content_value)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE section_key = section_key
  `;

  await Promise.all(
    defaultSiteContent.map((item) =>
      query(sql, [item.section_key, item.label, item.content_type, item.content_value])
    )
  );
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  await ensureDefaultSiteContent();
  const sql = 'SELECT * FROM site_content ORDER BY section_key ASC';
  return query<SiteContent[]>(sql);
}

export async function getSiteContentMap(): Promise<Record<string, string>> {
  const content = await query<Pick<SiteContent, 'section_key' | 'content_value'>[]>(
    'SELECT section_key, content_value FROM site_content'
  );
  const map: Record<string, string> = {};
  content.forEach((item) => {
    map[item.section_key] = item.content_value || '';
  });
  return map;
}

export async function updateSiteContent(key: string, value: string, userId: number | null): Promise<boolean> {
  const sql = 'UPDATE site_content SET content_value = ?, updated_by = ? WHERE section_key = ?';
  const result = await query(sql, [value, userId, key]);
  return result.affectedRows > 0;
}
