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

    // Check if campaign exists
    const existingCampaign = await db.campaign.findUnique({
      where: { id: params.id },
      include: {
        contacts: true,
        sequences: true,
        analytics: true,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (existingCampaign.status !== 'draft') {
      return NextResponse.json({ error: 'Campaign can only be sent from draft status' }, { status: 400 });
    }

    // Update campaign status to sent
    const updatedCampaign = await db.campaign.update({
      where: { id: params.id },
      data: {
        status: 'sent',
      },
      include: {
        contacts: true,
        sequences: true,
        analytics: true,
      },
    });

    // Create analytics record
    await db.analytics.create({
      data: {
        campaignId: params.id,
        emailsSent: existingCampaign.contacts.length,
        emailsOpened: 0,
        emailsClicked: 0,
        replies: 0,
      },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}