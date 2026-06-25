import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById } from '@/lib/queries/users';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { current_password, new_password } = await req.json();

    if (!current_password || !new_password) {
      return NextResponse.json({ error: 'Both current and new passwords are required.' }, { status: 400 });
    }

    if (new_password.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);

    // Fetch the user with their hashed password
    const rows = await query<any[]>('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [userId]);
    if (!rows.length) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    const isValid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 });
    }

    const newHash = await bcrypt.hash(new_password, 12);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Failed to change password.' }, { status: 500 });
  }
}
