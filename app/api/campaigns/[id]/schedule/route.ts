import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduledAt } = body;

    if (!scheduledAt) {
      return NextResponse.json({ error: 'Scheduled date is required' }, { status: 400 });
    }

    // Check if campaign exists
    const existingCampaign = await db.campaign.findUnique({
      where: { id: params.id },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (existingCampaign.status !== 'draft') {
      return NextResponse.json({ error: 'Campaign can only be scheduled from draft status' }, { status: 400 });
    }

    // Update campaign status to scheduled
    const updatedCampaign = await db.campaign.update({
      where: { id: params.id },
      data: {
        status: 'scheduled',
      },
      include: {
        contacts: true,
        sequences: true,
        analytics: true,
      },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error('Error scheduling campaign:', error);
    return NextResponse.json(
      { error: 'Failed to schedule campaign' },
      { status: 500 }
    );
  }
}