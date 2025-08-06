import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      )
    }

    const faculties = await prisma.faculty.findMany({
      where: {
        universityId: universityId,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(faculties)
  } catch (error) {
    console.error('Failed to fetch faculties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch faculties' },
      { status: 500 }
    )
  }
}