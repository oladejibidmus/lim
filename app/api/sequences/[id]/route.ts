import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sequence = await db.sequence.findUnique({
      where: { id: params.id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        campaigns: true,
        analytics: true,
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    return NextResponse.json(sequence);
  } catch (error) {
    console.error('Error fetching sequence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sequence' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, status, steps, campaignIds } = body;

    // Check if sequence exists
    const existingSequence = await db.sequence.findUnique({
      where: { id: params.id },
    });

    if (!existingSequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Update sequence
    const updatedSequence = await db.sequence.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(campaignIds && {
          campaigns: {
            set: campaignIds.map((id: string) => ({ id })),
          },
        }),
        ...(steps && {
          steps: {
            deleteMany: {},
            create: steps.map((step: any, index: number) => ({
              type: step.type,
              subject: step.subject,
              content: step.content,
              delay: step.delay,
              order: index,
            })),
          },
        }),
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        campaigns: true,
        analytics: true,
      },
    });

    return NextResponse.json(updatedSequence);
  } catch (error) {
    console.error('Error updating sequence:', error);
    return NextResponse.json(
      { error: 'Failed to update sequence' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if sequence exists
    const existingSequence = await db.sequence.findUnique({
      where: { id: params.id },
    });

    if (!existingSequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Delete sequence (this will also delete related steps due to cascade)
    await db.sequence.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Sequence deleted successfully' });
  } catch (error) {
    console.error('Error deleting sequence:', error);
    return NextResponse.json(
      { error: 'Failed to delete sequence' },
      { status: 500 }
    );
  }
}