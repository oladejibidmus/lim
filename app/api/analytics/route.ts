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
    const campaignId = searchParams.get('campaignId');
    const sequenceId = searchParams.get('sequenceId');

    const whereClause: any = {};
    if (campaignId) {
      whereClause.campaignId = campaignId;
    }
    if (sequenceId) {
      whereClause.sequenceId = sequenceId;
    }

    const analytics = await db.analytics.findMany({
      where: whereClause,
      include: {
        campaign: true,
        sequence: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
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
    const { campaignId, sequenceId, emailsSent, emailsOpened, emailsClicked, replies } = body;

    // Validate required fields
    if (!campaignId && !sequenceId) {
      return NextResponse.json(
        { error: 'Either campaignId or sequenceId is required' },
        { status: 400 }
      );
    }

    // Create analytics record
    const analytics = await db.analytics.create({
      data: {
        campaignId,
        sequenceId,
        emailsSent: emailsSent || 0,
        emailsOpened: emailsOpened || 0,
        emailsClicked: emailsClicked || 0,
        replies: replies || 0,
      },
      include: {
        campaign: true,
        sequence: true,
      },
    });

    return NextResponse.json(analytics, { status: 201 });
  } catch (error) {
    console.error('Error creating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to create analytics' },
      { status: 500 }
    );
  }
}