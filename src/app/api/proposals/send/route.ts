import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getAuthSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const dealId = formData.get('dealId') as string;
        const recipientEmail = formData.get('recipientEmail') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;
        const file = formData.get('attachment') as File | null;

        if (!dealId || !recipientEmail || !subject || !message) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        // Pengecekan SMTP & Validasi Kuota Terpusat
        let smtp = await prisma.smtpConfig.findUnique({ where: { id: 1 } });
        if (!smtp || !smtp.user || !smtp.pass) {
            return NextResponse.json({ error: 'Konfigurasi SMTP belum diatur oleh Admin' }, { status: 400 });
        }

        const today = new Date().toISOString().slice(0, 10);
        const lastReset = new Date(smtp.lastResetDate).toISOString().slice(0, 10);
        let currentSent = smtp.dailyEmailSentCount;

        if (today !== lastReset) {
            currentSent = 0;
            await prisma.smtpConfig.update({
                where: { id: 1 },
                data: { dailyEmailSentCount: 0, lastResetDate: new Date() },
            });
        }

        if (currentSent >= smtp.dailyEmailLimit) {
            return NextResponse.json(
                { error: `Kuota email kantor hari ini telah habis (${smtp.dailyEmailLimit}/${smtp.dailyEmailLimit}). Hubungi Admin.` },
                { status: 429 }
            );
        }

        // Siapkan lampiran jika ada
        const attachments: any[] = [];
        let fileInfo = '';
        if (file && typeof file !== 'string') {
            const bytes = await file.arrayBuffer();
            attachments.push({
                filename: file.name,
                content: Buffer.from(bytes),
            });
            fileInfo = `Lampiran: ${file.name}`;
        }

        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
            auth: {
                user: smtp.user,
                pass: smtp.pass,
            },
        });

        try {
            await transporter.sendMail({
                from: `"${smtp.fromName}" <${smtp.fromEmail || smtp.user}>`,
                to: recipientEmail,
                subject,
                text: message,
                html: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">${message.replace(/\n/g, '<br/>')}</div>`,
                attachments,
            });

            // Increment kuota terpusat
            await prisma.smtpConfig.update({
                where: { id: 1 },
                data: { dailyEmailSentCount: { increment: 1 } },
            });

            // Simpan log pengiriman sukses
            await prisma.communicationLog.create({
                data: {
                    channel: 'EMAIL',
                    recipient: recipientEmail,
                    subject,
                    status: 'SENT',
                    metadata: fileInfo || null,
                    dealId,
                    senderId: session.id,
                },
            });

            // Simpan email ke entitas Deal & otomatis pindah ke stage Proposal (id: 3)
            const updatedDeal = await prisma.deal.update({
                where: { id: dealId },
                data: {
                    email: recipientEmail,
                    stageId: 3,
                },
                include: {
                    stage: true,
                    city: true,
                    createdBy: { select: { id: true, name: true, email: true } },
                    activities: true,
                },
            });

            // Catat log aktivitas deal
            await prisma.dealActivity.create({
                data: {
                    dealId,
                    activityType: 'NOTE',
                    notes: `[EMAIL SENT] Proposal terkirim ke ${recipientEmail}. Subjek: "${subject}" ${fileInfo}`,
                },
            });

            return NextResponse.json({ success: true, deal: updatedDeal });
        } catch (mailError: any) {
            await prisma.communicationLog.create({
                data: {
                    channel: 'EMAIL',
                    recipient: recipientEmail,
                    subject,
                    status: 'FAILED',
                    errorMessage: mailError.message || 'Gagal terkirim',
                    metadata: fileInfo || null,
                    dealId,
                    senderId: session.id,
                },
            });

            return NextResponse.json({ error: `Gagal mengirim email: ${mailError.message}` }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}