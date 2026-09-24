import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // নির্দিষ্ট কর্মীর হাজিরার মোট দিন গণনা করা
    const attendanceCount = await prisma.attendance.count({
      where: userId ? { userId } : {},
    });

    // কর্মীর তথ্য ও দৈনিক বেতন (ধরে নিলাম প্রতিদিনের বেতন ৫০০ টাকা বা ডাটাবেস থেকে আসবে)
    const dailyRate = 500; 
    const totalSalary = attendanceCount * dailyRate;

    // যদি সবার তালিকা মালিকের জন্য দরকার হয়
    const salaryHistory = {
      totalDaysPresent: attendanceCount,
      dailyRate: dailyRate,
      totalEarned: totalSalary,
    };

    return NextResponse.json({ success: true, salaryHistory });
  } catch (error) {
    console.error('Salary Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}