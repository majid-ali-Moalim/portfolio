import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getModuleItems, saveModuleItem } from '@/lib/portfolioStore';

export async function GET() {
  try {
    const achievements = await getModuleItems('achievements');
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const saved = await saveModuleItem('achievements', {
      title: body.title,
      description: body.description,
      bullets: body.bullets || [],
      tags: body.tags || [],
      category: body.category || 'General',
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
