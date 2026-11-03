import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: [{ region: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kota' }, { status: 500 });
  }
}
