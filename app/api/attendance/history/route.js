import { NextResponse } from 'next/server';

let attendanceRecords = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: attendanceRecords,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { workerId, name, image } = body;

    if (!workerId) {
      return NextResponse.json(
        { success: false, message: 'কর্মী আইডি (Worker ID) বাধ্যতামূলক!' },
        { status: 400 }
      );
    }

    const newRecord = {
      workerId,
      name: name || 'N/A',
      image: image || null,
      createdAt: new Date().toISOString(),
    };

    attendanceRecords.unshift(newRecord);

    return NextResponse.json({
      success: true,
      message: 'হাজিরা সফলভাবে সংরক্ষিত হয়েছে!',
      data: newRecord,
    }, { status: 201 });

  } catch (error) {
    console.error("API Error Details:", error);
    return NextResponse.json(
      { success: false, message: 'সার্ভারে অভ্যন্তরীণ ত্রুটি ঘটেছে!' },
      { status: 500 }
    );
  }
}