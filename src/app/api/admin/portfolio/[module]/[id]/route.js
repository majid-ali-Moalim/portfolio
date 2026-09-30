import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { saveModuleItem, deleteModuleItem } from '@/lib/portfolioStore';

async function checkAuth() {
  const session = await getSession();
  return !!session;
}

export async function PUT(request, { params }) {
  const isAuth = await checkAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { module, id } = await params;
  const body = await request.json();

  try {
    const updated = await saveModuleItem(module, body, id);
    // Comprehensive cache invalidation
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin');
    if (module === 'posts') {
      revalidatePath('/blog', 'layout');
      revalidatePath('/blog');
    }
    const response = NextResponse.json(updated);
    // Prevent caching of this response
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const isAuth = await checkAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { module, id } = await params;

  try {
    await deleteModuleItem(module, id);
    // Comprehensive cache invalidation
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin');
    const response = NextResponse.json({ success: true });
    // Prevent caching of this response
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

