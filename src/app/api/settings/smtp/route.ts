import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let config = await prisma.smtpConfig.findUnique({ where: { id: 1 } });

    if (!config) {
        config = await prisma.smtpConfig.create({
            data: {
                id: 1,
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                user: '',
                pass: '',
                fromName: 'Tim Marketing',
                fromEmail: '',
                dailyEmailLimit: 50,
                dailyEmailSentCount: 0,
                lastResetDate: new Date(),
            },
        });
    } else {
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
    }

    return NextResponse.json({
        ...config,
        pass: session.role === 'ADMIN' ? config.pass : '********',
    });
}

export async function POST(request: Request) {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const body = await request.json();
    const config = await prisma.smtpConfig.upsert({
        where: { id: 1 },
        update: {
            host: body.host,
            port: parseInt(body.port),
            secure: Boolean(body.secure),
            user: body.user,
            pass: body.pass,
            fromName: body.fromName,
            fromEmail: body.fromEmail,
            dailyEmailLimit: parseInt(body.dailyEmailLimit) || 50,
        },
        create: {
            id: 1,
            host: body.host,
            port: parseInt(body.port),
            secure: Boolean(body.secure),
            user: body.user,
            pass: body.pass,
            fromName: body.fromName,
            fromEmail: body.fromEmail,
            dailyEmailLimit: parseInt(body.dailyEmailLimit) || 50,
            dailyEmailSentCount: 0,
            lastResetDate: new Date(),
        },
    });

    return NextResponse.json(config);
}