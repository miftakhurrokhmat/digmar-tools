import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');
    const period = searchParams.get('period');
    const userId = searchParams.get('userId');

    const deals = await prisma.deal.findMany({
      where: {
        ...(cityId ? { cityId: parseInt(cityId) } : {}),
        ...(period ? { targetPeriod: period } : {}),
        ...(userId ? { createdById: userId } : {}),
      },
      include: {
        stage: true,
        city: true,
        createdBy: { select: { id: true, name: true, email: true } },
        activities: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(deals);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data deal' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    const body = await request.json();

    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const deal = await prisma.deal.create({
      data: {
        clientName: body.clientName,
        companyName: body.companyName || null,
        phone: body.phone,
        dealValue: parseFloat(body.dealValue),
        productCategory: body.productCategory || 'PROFESSIONAL_TRAINING',
        customerType: body.customerType || 'B2C_PRO_SMK',
        topic: body.topic || null,
        targetPeriod: body.targetPeriod || currentPeriod,
        createdById: session?.id || null,
        cityId: parseInt(body.cityId),
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        stageId: parseInt(body.stageId),
      },
      include: {
        stage: true,
        city: true,
        createdBy: { select: { id: true, name: true, email: true } },
        activities: true,
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat deal' }, { status: 500 });
  }
}
