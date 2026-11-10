import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getAuthSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
                createdBy: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Header Kolom CSV
        const headers = [
            'ID Deal',
            'Nama Klien / Kontak',
            'Instansi / Perusahaan',
            'No. WhatsApp',
            'Kategori Produk',
            'Segmentasi Customer',
            'Kebutuhan Topik',
            'Wilayah',
            'Region',
            'Tahapan (Pipeline Stage)',
            'Nilai Deal (IDR)',
            'Target Periode',
            'PIC (Created By)',
            'Tanggal Input'
        ];

        const escapeCsv = (str: string | number | null | undefined) => {
            if (str === null || str === undefined) return '""';
            const text = String(str).replace(/"/g, '""');
            return `"${text}"`;
        };

        const getProductLabel = (cat: string) => {
            return cat === 'KIDS_MENTORING' ? 'Mentoring Anak' : 'Pelatihan Profesional';
        };

        const getCustomerLabel = (type: string) => {
            switch (type) {
                case 'B2B_CORP_GOV_CAMPUS':
                    return 'B2B (Instansi/Kampus)';
                case 'B2C_STUDENT_PARENT':
                    return 'B2C (Siswa/Ortu)';
                case 'B2C_PRO_SMK':
                default:
                    return 'B2C (Pro/SMK)';
            }
        };

        const rows = deals.map((d) => [
            escapeCsv(d.id),
            escapeCsv(d.clientName),
            escapeCsv(d.companyName || '-'),
            escapeCsv(d.phone),
            escapeCsv(getProductLabel(d.productCategory)),
            escapeCsv(getCustomerLabel(d.customerType)),
            escapeCsv(d.topic || '-'),
            escapeCsv(d.city.name),
            escapeCsv(d.city.region),
            escapeCsv(d.stage.name),
            escapeCsv(d.dealValue),
            escapeCsv(d.targetPeriod),
            escapeCsv(d.createdBy?.name || 'Admin'),
            escapeCsv(new Date(d.createdAt).toLocaleDateString('id-ID')),
        ]);

        // Tambahkan BOM (Byte Order Mark) \uFEFF agar Microsoft Excel otomatis membaca UTF-8 dengan benar
        const csvContent = '\uFEFF' + [
            headers.join(';'),
            ...rows.map((row) => row.join(';')),
        ].join('\r\n');

        const fileName = `laporan-pipeline-${period || 'semua-periode'}-${Date.now()}.csv`;

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Gagal mengekspor data laporan' }, { status: 500 });
    }
}