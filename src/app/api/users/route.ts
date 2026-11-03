import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
  }

  const { name, email, password, role } = await request.json();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role || 'MARKETING' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
