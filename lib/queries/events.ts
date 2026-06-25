import { query } from '../db';

export interface Event {
  id?: number;
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  featured_image_url?: string | null;
  organizer_id?: number | null;
  organizer_name?: string; // Virtual join field
  event_type: 'CONFERENCE' | 'WEBINAR' | 'WORKSHOP' | 'MEETUP' | 'HACKATHON' | 'SUMMIT';
  status: 'UPCOMING' | 'ONGOING' | 'PAST' | 'CANCELLED';
  location?: string | null;
  venue_address?: string | null;
  is_virtual?: boolean | number;
  meeting_link?: string | null;
  registration_url?: string | null;
  is_free?: boolean | number;
  ticket_price?: number | null;
  start_date: string;
  end_date?: string | null;
  registration_deadline?: string | null;
  max_attendees?: number | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllEvents(status?: Event['status']): Promise<Event[]> {
  let sql = `
    SELECT e.*, CONCAT(u.first_name, ' ', u.last_name) as organizer_name 
    FROM events e 
    LEFT JOIN users u ON e.organizer_id = u.id
  `;
  const params: any[] = [];

  if (status) {
    sql += ' WHERE e.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY e.start_date ASC';
  return query<Event[]>(sql, params);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const sql = `
    SELECT e.*, CONCAT(u.first_name, ' ', u.last_name) as organizer_name 
    FROM events e 
    LEFT JOIN users u ON e.organizer_id = u.id 
    WHERE e.slug = ? LIMIT 1
  `;
  const rows = await query<Event[]>(sql, [slug]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getEventById(id: number): Promise<Event | null> {
  const sql = 'SELECT * FROM events WHERE id = ? LIMIT 1';
  const rows = await query<Event[]>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const sql = `
    INSERT INTO events (
      title, slug, description, content, featured_image_url, organizer_id, event_type, status,
      location, venue_address, is_virtual, meeting_link, registration_url, is_free, ticket_price,
      start_date, end_date, registration_deadline, max_attendees
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    event.title,
    event.slug,
    event.description || null,
    event.content,
    event.featured_image_url || null,
    event.organizer_id || null,
    event.event_type || 'WEBINAR',
    event.status || 'UPCOMING',
    event.location || null,
    event.venue_address || null,
    event.is_virtual ? 1 : 0,
    event.meeting_link || null,
    event.registration_url || null,
    event.is_free ? 1 : 0,
    event.ticket_price || null,
    event.start_date,
    event.end_date || null,
    event.registration_deadline || null,
    event.max_attendees || null
  ];

  const result = await query(sql, params);
  return result.insertId;
}

export async function updateEvent(id: number, event: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(event).forEach(([key, val]) => {
    fields.push(`${key} = ?`);
    if (key === 'is_virtual' || key === 'is_free') {
      params.push(val ? 1 : 0);
    } else {
      params.push(val === undefined ? null : val);
    }
  });

  if (fields.length === 0) return false;

  const sql = `UPDATE events SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const result = await query(sql, params);
  return result.affectedRows > 0;
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return getAllEvents('UPCOMING');
}

export async function deleteEvent(id: number): Promise<boolean> {
  const sql = 'DELETE FROM events WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}
