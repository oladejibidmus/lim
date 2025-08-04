import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const bulkDeleteSchema = z.object({
  contactIds: z.array(z.string()).min(1, 'At least one contact ID is required'),
})

const bulkAddTagsSchema = z.object({
  contactIds: z.array(z.string()).min(1, 'At least one contact ID is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
})

const bulkImportSchema = z.object({
  contacts: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    tags: z.array(z.string()).optional(),
  })).min(1, 'At least one contact is required'),
})

// POST /api/contacts/bulk/delete - Delete multiple contacts
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'delete':
        return handleBulkDelete(request, user)
      case 'addTags':
        return handleBulkAddTags(request, user)
      case 'import':
        return handleBulkImport(request, user)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleBulkDelete(request: NextRequest, user: any) {
  const body = await request.json()
  const validatedData = bulkDeleteSchema.parse(body)

  // Delete contacts that belong to the user
  const result = await db.contact.deleteMany({
    where: {
      id: { in: validatedData.contactIds },
      userId: user.id,
    },
  })

  return NextResponse.json({
    message: `${result.count} contacts deleted successfully`,
    deletedCount: result.count,
  })
}

async function handleBulkAddTags(request: NextRequest, user: any) {
  const body = await request.json()
  const validatedData = bulkAddTagsSchema.parse(body)

  // Get contacts that belong to the user
  const contacts = await db.contact.findMany({
    where: {
      id: { in: validatedData.contactIds },
      userId: user.id,
    },
  })

  if (contacts.length === 0) {
    return NextResponse.json({ error: 'No contacts found' }, { status: 404 })
  }

  // Update each contact's tags
  const updatePromises = contacts.map(contact => {
    const existingTags = contact.tags || []
    const newTags = [...new Set([...existingTags, ...validatedData.tags])]
    
    return db.contact.update({
      where: { id: contact.id },
      data: { tags: newTags },
    })
  })

  await Promise.all(updatePromises)

  return NextResponse.json({
    message: `Tags added to ${contacts.length} contacts successfully`,
    updatedCount: contacts.length,
  })
}

async function handleBulkImport(request: NextRequest, user: any) {
  const body = await request.json()
  const validatedData = bulkImportSchema.parse(body)

  const importedContacts = []
  const skippedContacts = []

  for (const contactData of validatedData.contacts) {
    // Check if contact with this email already exists
    const existingContact = await db.contact.findFirst({
      where: {
        userId: user.id,
        email: contactData.email,
      },
    })

    if (existingContact) {
      skippedContacts.push({
        email: contactData.email,
        reason: 'Email already exists',
      })
      continue
    }

    // Create new contact
    const contact = await db.contact.create({
      data: {
        name: contactData.name,
        email: contactData.email,
        tags: contactData.tags || [],
        userId: user.id,
      },
    })

    importedContacts.push(contact)
  }

  return NextResponse.json({
    message: `Import completed. ${importedContacts.length} contacts imported, ${skippedContacts.length} skipped.`,
    importedCount: importedContacts.length,
    skippedCount: skippedContacts.length,
    importedContacts,
    skippedContacts,
  })
}