import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, phone, password, salaryRate } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, phone and password are required' }, 
        { status: 400 }
      );
    }

    // পাসওয়ার্ড হাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prisma দিয়ে ডেটাবেসে নতুন কর্মী তৈরি করা
    const newWorker = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone,
        password: hashedPassword,
        role: 'WORKER',
        salaryRate: Number(salaryRate) || 500
      }
    });

    // সিকিউরিটির জন্য পাসওয়ার্ড ফিল্ডটি বাদ দিয়ে রেসপন্স তৈরি করা
    const { password: _, ...workerWithoutPassword } = newWorker;

    return NextResponse.json({ 
      success: true, 
      worker: workerWithoutPassword 
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding worker:', error);

    // Prisma Unique Constraint Error (P2002) হ্যান্ডেল করা
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This phone number or email is already registered.' }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}