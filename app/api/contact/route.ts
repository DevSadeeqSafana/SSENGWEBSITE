import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent } from '@/lib/authz';
import { createContactSubmission, getAllContactSubmissions, updateContactSubmissionStatus } from '@/lib/queries/interactions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const submissions = await getAllContactSubmissions();
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const insertId = await createContactSubmission({
      name, email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.', id: insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending your message. Please try again.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

    await updateContactSubmissionStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
