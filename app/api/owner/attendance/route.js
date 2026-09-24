import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        user: true, // এটি কর্মীর নাম, ফোন নম্বর ইত্যাদি তথ্য যুক্ত করে আনবে
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error('Owner Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
+