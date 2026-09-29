import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { getModuleItems, saveModuleItem } from '@/lib/portfolioStore';

async function checkAuth() {
  const session = await getSession();
  return !!session;
}

export async function GET(request, { params }) {
  const { module } = await params;
  try {
    if (module === 'messages') {
      const isAuth = await checkAuth();
      if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const items = await getModuleItems(module);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { module } = await params;
  const body = await request.json();

  if (module === 'messages' && body.isPublicContact) {
    try {
      const msg = await saveModuleItem('messages', {
        name: body.name || 'Anonymous',
        email: body.email,
        subject: body.subject || 'Portfolio Inquiry',
        message: body.message,
      });
      return NextResponse.json(msg, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  const isAuth = await checkAuth();
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const saved = await saveModuleItem(module, body);
    revalidatePath('/');
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

