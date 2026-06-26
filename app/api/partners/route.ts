import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent, canManageRecords } from '@/lib/authz';
import { createPartner, deletePartner, getAllPartners, updatePartner } from '@/lib/queries/partners';

export async function GET() {
  try {
    const partners = await getAllPartners();
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, logo_url, website_url, description, status, display_order } = body;

    if (!name) {
      return NextResponse.json({ error: 'Partner name is required.' }, { status: 400 });
    }

    const id = await createPartner({
      name,
      logo_url,
      website_url,
      description,
      status: status || 'ACTIVE',
      display_order: Number(display_order) || 0,
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });

    await updatePartner(Number(id), {
      ...updates,
      display_order: Number(updates.display_order) || 0,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageRecords(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    if (!id) return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });

    await deletePartner(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
