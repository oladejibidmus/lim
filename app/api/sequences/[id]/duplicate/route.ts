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
    const originalSequence = await db.sequence.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!originalSequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }

    // Create duplicate sequence
    const duplicateSequence = await db.sequence.create({
      data: {
        name: `${originalSequence.name} (Copy)`,
        description: originalSequence.description,
        status: 'draft',
        steps: originalSequence.steps,
        subscribers: 0,
        completed: 0,
        avgOpenRate: 0,
        userId: user.id,
      },
    })

    return NextResponse.json({
      message: 'Sequence duplicated successfully',
      sequence: duplicateSequence,
    })
  } catch (error) {
    console.error('Duplicate sequence error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}