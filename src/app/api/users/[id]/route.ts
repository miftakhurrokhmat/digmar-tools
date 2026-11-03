import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAuthSession } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  const { id } = await params;
  const { name, email, password, role } = await request.json();
  const dataToUpdate: any = { name, email, role };
  if (password && password.trim()) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  const { id } = await params;
  if (session.id === id) {
    return NextResponse.json({ error: 'Tidak dapat menghapus akun sendiri' }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
