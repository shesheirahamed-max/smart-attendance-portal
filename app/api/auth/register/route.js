import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { name, phone, password, role, hourlyRate } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Name, Phone, and Password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role: role || 'WORKER',
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
      },
    });

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}