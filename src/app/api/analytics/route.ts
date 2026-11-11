import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getAuthSession();

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Akses ditolak. Fitur analitik hanya untuk Admin / Manajemen.' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const currentYear = new Date().getFullYear().toString();
        const year = searchParams.get('year') || currentYear;
        const month = searchParams.get('month') || 'all';

        // Filter targetPeriod berdasarkan kombinasi tahun & bulan
        let dealPeriodWhere: any = {};
        let dateRangeWhere: any = {};

        if (month && month !== 'all') {
            const formattedPeriod = `${year}-${month.padStart(2, '0')}`;
            dealPeriodWhere = { targetPeriod: formattedPeriod };

            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
            dateRangeWhere = { createdAt: { gte: startDate, lte: endDate } };
        } else {
            dealPeriodWhere = { targetPeriod: { startsWith: `${year}-` } };

            const startDate = new Date(parseInt(year), 0, 1);
            const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
            dateRangeWhere = { createdAt: { gte: startDate, lte: endDate } };
        }

        const [deals, commLogs, users] = await Promise.all([
            prisma.deal.findMany({
                where: dealPeriodWhere,
                include: {
                    city: true,
                    stage: true,
                    createdBy: { select: { id: true, name: true, role: true } },
                },
            }),
            prisma.communicationLog.findMany({
                where: dateRangeWhere,
                select: { channel: true, status: true, senderId: true },
            }),
            prisma.user.findMany({
                select: { id: true, name: true, role: true },
            }),
        ]);

        // 1. Ringkasan Global
        const totalDeals = deals.length;
        const wonDeals = deals.filter((d) => d.stageId === 4);
        const lostDeals = deals.filter((d) => d.stageId === 5);
        const totalPipelineValue = deals.reduce((acc, curr) => acc + curr.dealValue, 0);
        const totalWonValue = wonDeals.reduce((acc, curr) => acc + curr.dealValue, 0);
        const winRate = totalDeals > 0 ? ((wonDeals.length / totalDeals) * 100).toFixed(1) : '0';

        // 2. Agregasi Berdasarkan Region & Wilayah
        const regionStats: Record<string, { totalValue: number; wonValue: number; dealCount: number }> = {
            'D.I. Yogyakarta': { totalValue: 0, wonValue: 0, dealCount: 0 },
            'Solo Raya': { totalValue: 0, wonValue: 0, dealCount: 0 },
        };

        const cityStats: Record<string, { name: string; region: string; totalValue: number; count: number }> = {};

        deals.forEach((d) => {
            const reg = d.city.region;
            if (regionStats[reg]) {
                regionStats[reg].totalValue += d.dealValue;
                regionStats[reg].dealCount += 1;
                if (d.stageId === 4) regionStats[reg].wonValue += d.dealValue;
            }

            if (!cityStats[d.city.name]) {
                cityStats[d.city.name] = { name: d.city.name, region: d.city.region, totalValue: 0, count: 0 };
            }
            cityStats[d.city.name].totalValue += d.dealValue;
            cityStats[d.city.name].count += 1;
        });

        // 3. Breakdown Produk & Tipe Customer
        const productStats = {
            PROFESSIONAL_TRAINING: deals
                .filter((d) => d.productCategory === 'PROFESSIONAL_TRAINING')
                .reduce((acc, c) => acc + c.dealValue, 0),
            KIDS_MENTORING: deals
                .filter((d) => d.productCategory === 'KIDS_MENTORING')
                .reduce((acc, c) => acc + c.dealValue, 0),
        };

        const customerTypeStats = {
            B2B: deals.filter((d) => d.customerType === 'B2B_CORP_GOV_CAMPUS').length,
            B2C_PRO: deals.filter((d) => d.customerType === 'B2C_PRO_SMK').length,
            B2C_STUDENT: deals.filter((d) => d.customerType === 'B2C_STUDENT_PARENT').length,
        };

        // 4. Leaderboard Kinerja PIC Sales
        const salesLeaderboard = users
            .map((u) => {
                const userDeals = deals.filter((d) => d.createdById === u.id);
                const userWon = userDeals.filter((d) => d.stageId === 4);
                const userLogs = commLogs.filter((c) => c.senderId === u.id);

                return {
                    id: u.id,
                    name: u.name,
                    role: u.role,
                    totalDeals: userDeals.length,
                    wonDeals: userWon.length,
                    wonValue: userWon.reduce((acc, c) => acc + c.dealValue, 0),
                    pipelineValue: userDeals.reduce((acc, c) => acc + c.dealValue, 0),
                    commCount: userLogs.length,
                };
            })
            .sort((a, b) => b.wonValue - a.wonValue);

        return NextResponse.json({
            filter: { year, month },
            summary: {
                totalDeals,
                wonCount: wonDeals.length,
                lostCount: lostDeals.length,
                totalPipelineValue,
                totalWonValue,
                winRate,
            },
            regionStats,
            cityStats: Object.values(cityStats).sort((a, b) => b.totalValue - a.totalValue),
            productStats,
            customerTypeStats,
            salesLeaderboard,
            commStats: {
                totalEmails: commLogs.filter((c) => c.channel === 'EMAIL' && c.status === 'SENT').length,
                totalWhatsapp: commLogs.filter((c) => c.channel === 'WHATSAPP').length,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Gagal memproses analitik' }, { status: 500 });
    }
}