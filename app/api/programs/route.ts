import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent, canManageRecords } from '@/lib/authz';
import { getAllPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/queries/programs';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const programs = await getAllPrograms();
    return NextResponse.json(programs);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, program_type, ...rest } = body;

    if (!title || !program_type) {
      return NextResponse.json({ error: 'Title and program type are required.' }, { status: 400 });
    }

    const slug = slugify(title) + '-' + Date.now();
    const id = await createProgram({ title, slug, description, content: content || description || '', program_type, ...rest });

    return NextResponse.json({ success: true, id, slug }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Program ID required' }, { status: 400 });

    await updateProgram(id, updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageRecords(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0');
    if (!id) return NextResponse.json({ error: 'Program ID required' }, { status: 400 });

    await deleteProgram(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
