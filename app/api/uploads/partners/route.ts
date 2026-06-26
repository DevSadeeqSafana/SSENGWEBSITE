import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent } from '@/lib/authz';

const MAX_LOGO_BYTES = 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('logo');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Logo file is required.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Logo must be a JPG, PNG, WebP, GIF, or SVG file.' }, { status: 400 });
    }

    if (file.size > MAX_LOGO_BYTES) {
      return NextResponse.json({ error: 'Logo must be 1MB or smaller.' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${bytes.toString('base64')}`;

    return NextResponse.json({ logo_url: dataUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to upload partner logo.' }, { status: 500 });
  }
}
