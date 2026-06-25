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

export async function getAllSiteContent(): Promise<SiteContent[]> {
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
