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
    revalidatePath('/');
    return NextResponse.json(updated);
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
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

