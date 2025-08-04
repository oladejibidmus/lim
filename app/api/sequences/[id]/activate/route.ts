import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if sequence exists and belongs to user
    const sequence = await db.sequence.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }

    if (sequence.status === 'active') {
      return NextResponse.json(
        { error: 'Sequence is already active' },
        { status: 400 }
      )
    }

    // Update sequence status to active
    const updatedSequence = await db.sequence.update({
      where: { id: params.id },
      data: {
        status: 'active',
      },
    })

    return NextResponse.json({
      message: 'Sequence activated successfully',
      sequence: updatedSequence,
    })
  } catch (error) {
    console.error('Activate sequence error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}