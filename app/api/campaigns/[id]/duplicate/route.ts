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
      },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Create duplicate campaign
    const duplicatedCampaign = await db.campaign.create({
      data: {
        name: `${existingCampaign.name} (Copy)`,
        description: existingCampaign.description,
        status: 'draft',
        contacts: {
          connect: existingCampaign.contacts.map(contact => ({ id: contact.id })),
        },
        sequences: {
          connect: existingCampaign.sequences.map(sequence => ({ id: sequence.id })),
        },
      },
      include: {
        contacts: true,
        sequences: true,
        analytics: true,
      },
    });

    return NextResponse.json(duplicatedCampaign);
  } catch (error) {
    console.error('Error duplicating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate campaign' },
      { status: 500 }
    );
  }
}