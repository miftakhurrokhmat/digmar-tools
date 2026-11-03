import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const activities = await prisma.dealActivity.findMany({
    where: { dealId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(activities);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { activityType, notes } = await request.json();

  const activity = await prisma.dealActivity.create({
    data: {
      dealId: id,
      activityType: activityType || 'NOTE',
      notes,
    },
  });
  return NextResponse.json(activity, { status: 201 });
}
