import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canManageContent, canManageRecords } from '@/lib/authz';
import { getAllPosts, createPost, getPostById, updatePost, deletePost } from '@/lib/queries/posts';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, excerpt, content, featured_image_url, status: postStatus, category, tags, published_at } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const slug = slugify(title) + '-' + Date.now();
    const authorId = parseInt(session.user.id);

    const id = await createPost({
      title, slug, excerpt, content, featured_image_url,
      author_id: authorId,
      status: postStatus || 'DRAFT',
      category, tags,
      published_at: postStatus === 'PUBLISHED' ? (published_at || new Date().toISOString()) : null,
    });

    return NextResponse.json({ success: true, id, slug }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !canManageContent(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });

    if (updates.status === 'PUBLISHED' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    await updatePost(id, updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });

    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
