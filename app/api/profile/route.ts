import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, updateUserProfile } from '@/lib/queries/users';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserById(parseInt(session.user.id));
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Never return password hash
    const { password_hash, ...safe } = user as any;
    return NextResponse.json(safe);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { first_name, last_name, phone, state_of_origin, institution, discipline, bio, linkedin_url, twitter_url, github_url } = await req.json();

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);

    await updateUserProfile(userId, {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone: phone || null,
      state: state_of_origin || null,
      specialty: discipline || null,
      bio: bio || null,
      linkedin_url: linkedin_url || null,
      twitter_url: twitter_url || null,
      github_url: github_url || null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
