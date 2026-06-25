import { query } from '../db';

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status?: 'UNREAD' | 'READ' | 'RESPONDED';
  created_at?: string;
}

export interface NewsletterSubscriber {
  id?: number;
  email: string;
  name?: string | null;
  status?: 'SUBSCRIBED' | 'UNSUBSCRIBED';
  subscribed_at?: string;
  unsubscribed_at?: string | null;
}

// Contact Submissions
export async function createContactSubmission(sub: Omit<ContactSubmission, 'id' | 'status' | 'created_at'>): Promise<number> {
  const sql = `
    INSERT INTO contact_submissions (name, email, phone, subject, message, status)
    VALUES (?, ?, ?, ?, ?, 'UNREAD')
  `;
  const params = [sub.name, sub.email, sub.phone || null, sub.subject || null, sub.message];
  const result = await query(sql, params);
  return result.insertId;
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const sql = 'SELECT * FROM contact_submissions ORDER BY created_at DESC';
  return query<ContactSubmission[]>(sql);
}

export async function updateContactSubmissionStatus(id: number, status: ContactSubmission['status']): Promise<boolean> {
  const sql = 'UPDATE contact_submissions SET status = ? WHERE id = ?';
  const result = await query(sql, [status, id]);
  return result.affectedRows > 0;
}

// Newsletter Subscribers
export async function subscribeNewsletter(email: string, name?: string): Promise<boolean> {
  // Use INSERT INTO ... ON DUPLICATE KEY UPDATE to handle resubscription
  const sql = `
    INSERT INTO newsletter_subscribers (email, name, status, subscribed_at, unsubscribed_at)
    VALUES (?, ?, 'SUBSCRIBED', CURRENT_TIMESTAMP, NULL)
    ON DUPLICATE KEY UPDATE status = 'SUBSCRIBED', name = VALUES(name), unsubscribed_at = NULL
  `;
  const result = await query(sql, [email, name || null]);
  return result.affectedRows > 0;
}

export async function unsubscribeNewsletter(email: string): Promise<boolean> {
  const sql = `
    UPDATE newsletter_subscribers 
    SET status = 'UNSUBSCRIBED', unsubscribed_at = CURRENT_TIMESTAMP 
    WHERE email = ?
  `;
  const result = await query(sql, [email]);
  return result.affectedRows > 0;
}

export async function getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const sql = 'SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC';
  return query<NewsletterSubscriber[]>(sql);
}
