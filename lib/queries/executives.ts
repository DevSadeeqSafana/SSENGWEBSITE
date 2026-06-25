import { query } from '../db';

export interface Executive {
  id?: number;
  name: string;
  title: string; // e.g., Engr., Dr., Prof.
  position?: string | null; // e.g., President, Secretary General
  category: 'PRESIDENT' | 'BOD' | 'NEC' | 'SEC' | 'BOA' | 'PATRON';
  avatar_url?: string | null;
  bio?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  display_order?: number;
  is_active?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export async function getAllExecutives(category?: Executive['category'], isActiveOnly: boolean = true): Promise<Executive[]> {
  let sql = 'SELECT * FROM executives';
  const conditions: string[] = [];
  const params: any[] = [];

  if (isActiveOnly) {
    conditions.push('is_active = 1');
  }

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' ORDER BY category ASC, display_order ASC, name ASC';
  return query<Executive[]>(sql, params);
}

export async function getExecutiveById(id: number): Promise<Executive | null> {
  const sql = 'SELECT * FROM executives WHERE id = ? LIMIT 1';
  const rows = await query<Executive[]>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createExecutive(exec: Omit<Executive, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const sql = `
    INSERT INTO executives (
      name, title, position, category, avatar_url, bio, email, linkedin_url, display_order, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    exec.name,
    exec.title,
    exec.position || null,
    exec.category,
    exec.avatar_url || null,
    exec.bio || null,
    exec.email || null,
    exec.linkedin_url || null,
    exec.display_order || 0,
    exec.is_active ? 1 : 0
  ];

  const result = await query(sql, params);
  return result.insertId;
}

export async function updateExecutive(id: number, exec: Partial<Omit<Executive, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(exec).forEach(([key, val]) => {
    fields.push(`${key} = ?`);
    if (key === 'is_active') {
      params.push(val ? 1 : 0);
    } else {
      params.push(val === undefined ? null : val);
    }
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE executives SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function deleteExecutive(id: number): Promise<boolean> {
  const sql = 'DELETE FROM executives WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}
