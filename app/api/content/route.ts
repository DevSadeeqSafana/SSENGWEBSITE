import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent } from '@/lib/authz';
import { getAllSiteContent, updateSiteContent } from '@/lib/queries/content';

export async function GET() {
  try {
    const content = await getAllSiteContent();
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section_key, content_value } = await req.json();

    if (!section_key) {
      return NextResponse.json({ error: 'section_key is required.' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const success = await updateSiteContent(section_key, content_value || '', userId);

    if (!success) {
      return NextResponse.json({ error: 'Content key not found or no changes made.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
