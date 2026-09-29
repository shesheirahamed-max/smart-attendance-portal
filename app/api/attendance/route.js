import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { workerId, userId, name, image, status } = body;

    const identifier = workerId || userId;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Worker ID is required' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: String(identifier) },
          { phone: String(identifier) }
        ]
      }
    });

    if (!user) {
      user = await prisma.user.findFirst({
        where: { name: name || 'Worker' }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database. Please register first.' },
        { status: 404 }
      );
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        selfieUrl: image || null,
        hours: 8,
        date: new Date(),
        checkIn: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, data: newAttendance },
      { status: 201 }
    );
  } catch (error) {
    console.error('Attendance creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during attendance' },
      { status: 500 }
    );
  }
}