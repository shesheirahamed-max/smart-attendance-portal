import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ১. নির্দিষ্ট কর্মীর তথ্য (যেখানে salaryRate এবং hourlyRate রয়েছে) ফেচ করা
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ২. নির্দিষ্ট কর্মীর হাজিরার মোট দিন গণনা করা
    const attendanceCount = await prisma.attendance.count({
      where: { userId },
    });

    // ৩. ডাটাবেস থেকে পাওয়া salaryRate ব্যবহার করে মোট বেতন হিসাব করা
    const dailyRate = user.salaryRate || 500; // যদি সেট করা না থাকে ডিফল্ট ৫০০ ধরবে
    const totalSalary = attendanceCount * dailyRate;

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
}+