import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { workerId, month, year, amount } = await req.json();

    if (!workerId || !month || !year || !amount) {
      return NextResponse.json({ error: 'সব প্রয়োজনীয় তথ্য প্রদান করুন!' }, { status: 400 });
    }

    // ডাটাবেজে বেতন পরিশোধের রেকর্ড তৈরি বা আপডেট করা (Paid স্ট্যাটাস)
    const payrollRecord = await prisma.payroll.upsert({
      where: {
        workerId_month_year: {
          workerId,
          month,
          year,
        },
      },
      update: {
        amount,
        status: 'PAID',
        paidAt: new Date(),
      },
      create: {
        workerId,
        month,
        year,
        amount,
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'বেতন সফলভাবে পরিশোধ করা হয়েছে!',
      payrollRecord,
    }, { status: 200 });

  } catch (error) {
    console.error('Payroll Error:', error);
    return NextResponse.json({ error: 'সার্ভারে ইন্টারনাল সমস্যা হয়েছে!' }, { status: 500 });
  }
}