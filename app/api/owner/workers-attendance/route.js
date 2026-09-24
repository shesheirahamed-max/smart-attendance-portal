import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') || 'September';

    // শুধুমাত্র ওয়ার্কারদের ডেটা এবং তাদের পে-রোল ও অ্যাটেন্ডেন্স ফেচ করা
    const workers = await prisma.user.findMany({
      where: { role: 'WORKER' },
      include: {
        attendances: true,
        payrolls: {
          where: { month },
        },
      },
    });

    const summary = workers.map(worker => {
      const totalPresent = worker.attendances.length;
      const salaryRate = worker.salaryRate || 500;
      const totalSalary = totalPresent * salaryRate;

      // Payroll মডেল অনুযায়ী চেক করা যে পেমেন্ট করা হয়েছে কি না
      const payrollRecord = worker.payrolls && worker.payrolls[0];
      const isPaid = payrollRecord && payrollRecord.totalAmount > 0;
      const status = isPaid ? 'PAID' : 'UNPAID';

      return {
        id: worker.id,
        name: worker.name || 'Unnamed Worker',
        phone: worker.phone || 'N/A',
        totalSalary: totalSalary,
        status: status,
      };
    });

    return NextResponse.json({ success: true, workers: summary });
  } catch (error) {
    console.error('Owner Attendance Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}