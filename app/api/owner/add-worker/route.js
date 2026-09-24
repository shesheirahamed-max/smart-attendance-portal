import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, phone, password, salaryRate } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Name, phone and password are required' }, { status: 400 });
    }

    // পাসওয়ার্ড হাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prisma দিয়ে ডেটাবেসে নতুন কর্মী তৈরি করা (salaryRate সহ)
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

    return NextResponse.json({ success: true, worker: newWorker }, { status: 201 });
  } catch (error) {
    console.error('Error adding worker:', error);
    return NextResponse.json({ error: 'Internal Server Error or Phone/Email already exists' }, { status: 500 });
  }
}