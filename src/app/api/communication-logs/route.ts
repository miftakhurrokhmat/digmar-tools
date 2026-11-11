import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('dealId');

    const logs = await prisma.communicationLog.findMany({
        where: dealId ? { dealId } : {},
        include: {
            sender: { select: { name: true, email: true } },
            deal: { select: { clientName: true, companyName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    return NextResponse.json(logs);
}

export async function POST(request: Request) {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { channel, recipient, dealId, status, metadata } = body;

    const log = await prisma.communicationLog.create({
        data: {
            channel: channel || 'WHATSAPP',
            recipient,
            status: status || 'SENT',
            metadata: metadata || null,
            dealId,
            senderId: session.id,
        },
    });

    return NextResponse.json(log, { status: 201 });
}