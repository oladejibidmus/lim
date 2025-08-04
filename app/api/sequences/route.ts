import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const sequences = await db.sequence.findMany({
      where: whereClause,
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        campaigns: true,
        analytics: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(sequences);
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sequences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, status, steps, campaignIds } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Create sequence with steps
    const sequence = await db.sequence.create({
      data: {
        name,
        description,
        status: status || 'draft',
        campaigns: campaignIds ? {
          connect: campaignIds.map((id: string) => ({ id })),
        } : undefined,
        steps: steps ? {
          create: steps.map((step: any, index: number) => ({
            type: step.type,
            subject: step.subject,
            content: step.content,
            delay: step.delay,
            order: index,
          })),
        } : undefined,
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        campaigns: true,
        analytics: true,
      },
    });

    return NextResponse.json(sequence, { status: 201 });
  } catch (error) {
    console.error('Error creating sequence:', error);
    return NextResponse.json(
      { error: 'Failed to create sequence' },
      { status: 500 }
    );
  }
}