import { query } from '../db';

export interface Partner {
  id?: number;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

let partnerSchemaReady = false;
let partnerSchemaPromise: Promise<void> | null = null;

async function ensurePartnerSchema(): Promise<void> {
  if (partnerSchemaReady) return;
  if (partnerSchemaPromise) return partnerSchemaPromise;

  partnerSchemaPromise = (async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS partners (
        id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name              VARCHAR(200) NOT NULL,
        logo_url          LONGTEXT,
        website_url       VARCHAR(500),
        description       TEXT,
        status            ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        display_order     INT UNSIGNED DEFAULT 0,
        created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_display_order (display_order)
      ) ENGINE=InnoDB
    `);

    await query('ALTER TABLE partners MODIFY logo_url LONGTEXT');

    partnerSchemaReady = true;
  })().finally(() => {
    partnerSchemaPromise = null;
  });

  return partnerSchemaPromise;
}

export async function getAllPartners(status?: Partner['status']): Promise<Partner[]> {
  await ensurePartnerSchema();

  let sql = 'SELECT * FROM partners';
  const params: unknown[] = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY display_order ASC, created_at DESC';
  return query<Partner[]>(sql, params);
}

export async function createPartner(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  await ensurePartnerSchema();

  const sql = `
    INSERT INTO partners (
      name, logo_url, website_url, description, status, display_order
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    partner.name,
    partner.logo_url || null,
    partner.website_url || null,
    partner.description || null,
    partner.status || 'ACTIVE',
    partner.display_order || 0,
  ];

  const result = await query(sql, params);
  return result.insertId;
}

export async function updatePartner(
  id: number,
  partner: Partial<Omit<Partner, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  await ensurePartnerSchema();

  const fields: string[] = [];
  const params: unknown[] = [];

  Object.entries(partner).forEach(([key, val]) => {
    fields.push(`${key} = ?`);
    params.push(val === undefined ? null : val);
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE partners SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function deletePartner(id: number): Promise<boolean> {
  await ensurePartnerSchema();

  const sql = 'DELETE FROM partners WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}
