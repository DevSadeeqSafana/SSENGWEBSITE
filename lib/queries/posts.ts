import { query } from '../db';

export interface Post {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image_url?: string | null;
  author_id?: number | null;
  author_name?: string; // Virtual join field
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category?: string | null;
  tags?: any; // JSON string or array
  view_count?: number;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllPosts(status?: Post['status']): Promise<Post[]> {
  let sql = `
    SELECT p.*, CONCAT(u.first_name, ' ', u.last_name) as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.author_id = u.id
  `;
  const params: any[] = [];

  if (status) {
    sql += ' WHERE p.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY p.published_at DESC, p.created_at DESC';
  return query<Post[]>(sql, params);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const sql = `
    SELECT p.*, CONCAT(u.first_name, ' ', u.last_name) as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.author_id = u.id 
    WHERE p.slug = ? LIMIT 1
  `;
  const rows = await query<Post[]>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getPostById(id: number): Promise<Post | null> {
  const sql = 'SELECT * FROM posts WHERE id = ? LIMIT 1';
  const rows = await query<Post[]>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createPost(post: Omit<Post, 'id' | 'view_count' | 'created_at' | 'updated_at'>): Promise<number> {
  const sql = `
    INSERT INTO posts (
      title, slug, excerpt, content, featured_image_url, author_id, status, category, tags, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    post.title,
    post.slug,
    post.excerpt || null,
    post.content,
    post.featured_image_url || null,
    post.author_id || null,
    post.status || 'DRAFT',
    post.category || null,
    JSON.stringify(post.tags || []),
    post.published_at || null
  ];

  const result = await query(sql, params);
  return result.insertId;
}

export async function updatePost(id: number, post: Partial<Omit<Post, 'id' | 'view_count' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(post).forEach(([key, val]) => {
    fields.push(`${key} = ?`);
    if (key === 'tags') {
      params.push(JSON.stringify(val));
    } else {
      params.push(val === undefined ? null : val);
    }
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function deletePost(id: number): Promise<boolean> {
  const sql = 'DELETE FROM posts WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

export async function getPublishedPosts(): Promise<Post[]> {
  return getAllPosts('PUBLISHED');
}

export async function incrementPostViewCount(id: number): Promise<void> {
  const sql = 'UPDATE posts SET view_count = view_count + 1 WHERE id = ?';
  await query(sql, [id]);
}
