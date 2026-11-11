import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let config = await prisma.smtpConfig.findUnique({ where: { id: 1 } });

    if (!config) {
        return NextResponse.json({
            dailyEmailLimit: 50,
            dailyEmailSentCount: 0,
            remaining: 50,
        });
    }

    // Reset otomatis jika sudah ganti tanggal
    const today = new Date().toISOString().slice(0, 10);
    const lastReset = new Date(config.lastResetDate).toISOString().slice(0, 10);
    if (today !== lastReset) {
        config = await prisma.smtpConfig.update({
            where: { id: 1 },
            data: {
                dailyEmailSentCount: 0,
                lastResetDate: new Date(),
            },
        });
    }

    const remaining = Math.max(0, config.dailyEmailLimit - config.dailyEmailSentCount);

    return NextResponse.json({
        dailyEmailLimit: config.dailyEmailLimit,
        dailyEmailSentCount: config.dailyEmailSentCount,
        remaining,
    });
}