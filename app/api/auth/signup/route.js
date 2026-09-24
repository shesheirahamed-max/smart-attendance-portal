import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, phone, password, role } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'ফোন নম্বর এবং পাসওয়ার্ড আবশ্যক!' }, { status: 400 });
    }

    // চেক করা যাক এই ফোন নম্বর দিয়ে আগে কোনো অ্যাকাউন্ট খোলা হয়েছে কি না
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'এই ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে!' }, { status: 400 });
    }

    // পাসওয়ার্ড সিকিউর করার জন্য হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // নতুন ইউজার তৈরি করা
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role: role || 'WORKER', // ডিফল্টভাবে ওয়ার্কার হিসেবে সেট হবে
      },
    });

    return NextResponse.json({ 
      message: 'সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!', 
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role
      } 
    }, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'সার্ভারে ইন্টারনাল সমস্যা হয়েছে!' }, { status: 500 });
  }
}