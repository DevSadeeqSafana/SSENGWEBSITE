import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent } from '@/lib/authz';
import { subscribeNewsletter, unsubscribeNewsletter, getAllNewsletterSubscribers } from '@/lib/queries/interactions';

export async function GET(req: Request) {
  // Admin listing
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const subscribers = await getAllNewsletterSubscribers();
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    await subscribeNewsletter(email, name || '');

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to the newsletter.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await unsubscribeNewsletter(email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
