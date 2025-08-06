import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { universityId, facultyId, grade } = await request.json()

    // Validate required fields
    if (!universityId || !facultyId || !grade) {
      return NextResponse.json(
        { error: 'University, faculty, and grade are required' },
        { status: 400 }
      )
    }

    // Validate that the faculty belongs to the university
    const faculty = await prisma.faculty.findFirst({
      where: {
        id: facultyId,
        universityId: universityId,
      },
    })

    if (!faculty) {
      return NextResponse.json(
        { error: 'Invalid faculty for the selected university' },
        { status: 400 }
      )
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        universityId,
        facultyId,
        grade: parseInt(grade),
        isVerified: true,
      },
      include: {
        university: true,
        faculty: true,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        faculty: updatedUser.faculty,
        grade: updatedUser.grade,
        isVerified: updatedUser.isVerified,
      },
    })
  } catch (error) {
    console.error('Failed to update user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}