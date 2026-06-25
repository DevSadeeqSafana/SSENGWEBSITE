import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllExecutives, createExecutive, updateExecutive, deleteExecutive } from '@/lib/queries/executives';

export async function GET() {
  try {
    const executives = await getAllExecutives(undefined, false);
    return NextResponse.json(executives);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch executives' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, title, category } = body;

    if (!name || !title || !category) {
      return NextResponse.json({ error: 'Name, title, and category are required.' }, { status: 400 });
    }

    const id = await createExecutive({ ...body, is_active: body.is_active !== false });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create executive' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Executive ID required' }, { status: 400 });

    await updateExecutive(id, updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update executive' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0');
    if (!id) return NextResponse.json({ error: 'Executive ID required' }, { status: 400 });

    await deleteExecutive(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete executive' }, { status: 500 });
  }
}
