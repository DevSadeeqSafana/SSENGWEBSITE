import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageAdmins, canManageRecords } from '@/lib/authz';
import { getAllUsers, updateUserRoleAndStatus, deleteUser, getUserById } from '@/lib/queries/users';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageRecords(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageRecords(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role, membership_status, membership_type, membership_number } = await req.json();
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const target = await getUserById(Number(id));
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (role !== undefined) {
      if (!canManageAdmins(session.user.role)) {
        return NextResponse.json({ error: 'Only the super admin can change admin roles.' }, { status: 403 });
      }
      if (target.role === 'SUPER_ADMIN' || role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'The super admin account cannot be changed here.' }, { status: 403 });
      }
    }

    await updateUserRoleAndStatus(id, { role, membership_status, membership_type, membership_number });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    // Prevent admin from deleting themselves
    if (id.toString() === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 403 });
    }

    const target = await getUserById(id);
    if (target?.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'The super admin account cannot be deleted.' }, { status: 403 });
    }

    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
