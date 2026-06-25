import { query } from '../db';

export interface Program {
  id?: number;
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  featured_image_url?: string | null;
  program_type: 'TRAINING' | 'CERTIFICATION' | 'MENTORSHIP' | 'BOOTCAMP' | 'WORKSHOP';
  duration?: string | null;
  format?: 'ONLINE' | 'PHYSICAL' | 'HYBRID';
  status: 'ACTIVE' | 'INACTIVE' | 'COMING_SOON';
  is_free?: boolean | number;
  price?: number | null;
  registration_url?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getAllPrograms(status?: Program['status']): Promise<Program[]> {
  let sql = 'SELECT * FROM programs';
  const params: any[] = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY display_order ASC, created_at DESC';
  return query<Program[]>(sql, params);
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const sql = 'SELECT * FROM programs WHERE slug = ? LIMIT 1';
  const rows = await query<Program[]>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getProgramById(id: number): Promise<Program | null> {
  const sql = 'SELECT * FROM programs WHERE id = ? LIMIT 1';
  const rows = await query<Program[]>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createProgram(program: Omit<Program, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const sql = `
    INSERT INTO programs (
      title, slug, description, content, featured_image_url, program_type,
      duration, format, status, is_free, price, registration_url, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    program.title,
    program.slug,
    program.description || null,
    program.content,
    program.featured_image_url || null,
    program.program_type || 'TRAINING',
    program.duration || null,
    program.format || 'ONLINE',
    program.status || 'ACTIVE',
    program.is_free ? 1 : 0,
    program.price || null,
    program.registration_url || null,
    program.display_order || 0
  ];

  const result = await query(sql, params);
  return result.insertId;
}

export async function updateProgram(id: number, program: Partial<Omit<Program, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(program).forEach(([key, val]) => {
    fields.push(`${key} = ?`);
    if (key === 'is_free') {
      params.push(val ? 1 : 0);
    } else {
      params.push(val === undefined ? null : val);
    }
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE programs SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function deleteProgram(id: number): Promise<boolean> {
  const sql = 'DELETE FROM programs WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}
