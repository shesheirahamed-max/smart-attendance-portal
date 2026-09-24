import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId, salaryRate } = await req.json();

    if (!userId || salaryRate === undefined) {
      return NextResponse.json({ error: 'User ID and salary rate are required' }, { status: 400 });
    }

    // ইউজারের salaryRate আপডেট করা
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { salaryRate: parseFloat(salaryRate) },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update Salary Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}