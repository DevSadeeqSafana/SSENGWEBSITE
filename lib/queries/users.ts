import { query } from '../db';

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  role: 'ADMIN' | 'EDITOR' | 'MEMBER';
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  membership_number?: string | null;
  membership_type?: 'STUDENT' | 'ASSOCIATE' | 'FULL' | 'FELLOW';
  membership_status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  bio?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  twitter_url?: string | null;
  state?: string | null;
  country?: string | null;
  specialty?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const rows = await query<User[]>(sql, [email]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getUserById(id: number): Promise<User | null> {
  const sql = 'SELECT * FROM users WHERE id = ? LIMIT 1';
  const rows = await query<User[]>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const sql = `
    INSERT INTO users (
      email, password_hash, role, first_name, last_name, phone, avatar_url,
      membership_number, membership_type, membership_status, bio,
      linkedin_url, github_url, twitter_url, state, country, specialty
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    user.email,
    user.password_hash,
    user.role || 'MEMBER',
    user.first_name,
    user.last_name,
    user.phone || null,
    user.avatar_url || null,
    user.membership_number || null,
    user.membership_type || 'ASSOCIATE',
    user.membership_status || 'PENDING',
    user.bio || null,
    user.linkedin_url || null,
    user.github_url || null,
    user.twitter_url || null,
    user.state || null,
    user.country || 'Nigeria',
    user.specialty || null
  ];

  const result = await query(sql, params);
  return result.insertId;
}

export async function updateUserProfile(id: number, profile: Partial<Omit<User, 'id' | 'email' | 'password_hash' | 'role' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(profile).forEach(([key, val]) => {
    fields.push(`${key} = ?`);
    params.push(val === undefined ? null : val);
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function updateUserRoleAndStatus(id: number, updates: { role?: User['role'], membership_status?: User['membership_status'], membership_type?: User['membership_type'], membership_number?: User['membership_number'] }): Promise<boolean> {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(updates).forEach(([key, val]) => {
    if (val !== undefined) {
      fields.push(`${key} = ?`);
      params.push(val);
    }
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function getAllUsers(): Promise<Omit<User, 'password_hash'>[]> {
  const sql = 'SELECT id, email, role, first_name, last_name, phone, membership_number, membership_type, membership_status, created_at FROM users ORDER BY created_at DESC';
  return query<Omit<User, 'password_hash'>[]>(sql);
}

export async function deleteUser(id: number): Promise<boolean> {
  const sql = 'DELETE FROM users WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

export async function getNextMembershipNumber(): Promise<string> {
  // Pattern: SSE/MEM/Year/Index
  const year = new Date().getFullYear();
  const sql = "SELECT COUNT(*) as count FROM users WHERE membership_number LIKE ?";
  const rows = await query(sql, [`SSE/MEM/${year}/%`]);
  const nextNum = (rows[0].count + 1).toString().padStart(4, '0');
  return `SSE/MEM/${year}/${nextNum}`;
}
