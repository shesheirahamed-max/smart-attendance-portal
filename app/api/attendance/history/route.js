import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');

    let attendances;
    if (workerId) {
      attendances = await prisma.attendance.findMany({
        where: {
          user: {
            OR: [
              { id: workerId },
              { phone: workerId }
            ]
          }
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      attendances = await prisma.attendance.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    const formattedData = attendances.map(item => {
      const dateObj = new Date(item.createdAt);
      return {
        id: item.id,
        workerId: item.user?.phone || item.userId,
        name: item.user?.name || 'Worker',
        image: item.selfieUrl || null,
        date: dateObj.toLocaleDateString(),
        time: dateObj.toLocaleTimeString(),
        createdAt: item.createdAt
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Fetch Attendance Error:", error);
    return NextResponse.json(
      { success: false, message: 'Database theke data ante shomossa hoyese!' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { workerId, name, image } = body;

    if (!workerId) {
      return NextResponse.json(
        { success: false, message: 'Worker ID baotattik!' },
        { status: 400 }
      );
    }

    // Prothome user khuje dekha j database-e ache kina
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: workerId },
          { phone: workerId }
        ]
      }
    });

    // Jodi user na thake, tahote notun user create korbe (password default ekta dewa holo)
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || 'Worker',
          phone: workerId,
          password: 'defaultpassword', 
          role: 'WORKER'
        }
      });
    }

    // Attendance table-e data entry kora
    const newRecord = await prisma.attendance.create({
      data: {
        userId: user.id,
        selfieUrl: image || null,
      },
      include: { user: true }
    });

    const dateObj = new Date(newRecord.createdAt);

    return NextResponse.json({
      success: true,
      message: 'Hazira safolvabe database-e songrokhito hoyese!',
      data: {
        id: newRecord.id,
        workerId: user.phone,
        name: user.name,
        image: newRecord.selfieUrl,
        date: dateObj.toLocaleDateString(),
        time: dateObj.toLocaleTimeString(),
      },
    }, { status: 201 });

  } catch (error) {
    console.error("API Error Details:", error);
    return NextResponse.json(
      { success: false, message: 'Server-e abontorin truti ghotese: ' + error.message },
      { status: 500 }
    );
  }
}