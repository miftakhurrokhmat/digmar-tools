import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // 1. Seed Akun Default (Admin & Marketing)
  const defaultPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@digmar.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@digmar.com',
      password: defaultPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'marketing@digmar.com' },
    update: {},
    create: {
      name: 'Tim Marketing Jogja-Solo',
      email: 'marketing@digmar.com',
      password: defaultPassword,
      role: 'MARKETING',
    },
  });

  // 2. Seed Master Tahapan Pipeline
  const defaultStages = [
    { name: 'Lead In', order: 1, colorHex: '#3b82f6' },
    { name: 'Contacted', order: 2, colorHex: '#8b5cf6' },
    { name: 'Proposal', order: 3, colorHex: '#f59e0b' },
    { name: 'Closed Won', order: 4, colorHex: '#10b981' },
    { name: 'Closed Lost', order: 5, colorHex: '#ef4444' },
  ];

  for (const stage of defaultStages) {
    await prisma.stage.upsert({
      where: { order: stage.order },
      update: { name: stage.name, colorHex: stage.colorHex },
      create: stage,
    });
  }

  // 3. Seed Master Wilayah (5 DIY + 7 Solo Raya)
  const defaultCities = [
    { name: 'Kota Yogyakarta', region: 'D.I. Yogyakarta', latitude: -7.7956, longitude: 110.3695, zoom: 13 },
    { name: 'Kab. Sleman', region: 'D.I. Yogyakarta', latitude: -7.7161, longitude: 110.3556, zoom: 12 },
    { name: 'Kab. Bantul', region: 'D.I. Yogyakarta', latitude: -7.8926, longitude: 110.3283, zoom: 12 },
    { name: 'Kab. Kulon Progo', region: 'D.I. Yogyakarta', latitude: -7.8286, longitude: 110.1583, zoom: 12 },
    { name: 'Kab. Gunungkidul', region: 'D.I. Yogyakarta', latitude: -7.9609, longitude: 110.6027, zoom: 11 },
    { name: 'Kota Surakarta', region: 'Solo Raya', latitude: -7.5561, longitude: 110.8316, zoom: 13 },
    { name: 'Kab. Sukoharjo', region: 'Solo Raya', latitude: -7.6836, longitude: 110.8354, zoom: 12 },
    { name: 'Kab. Karanganyar', region: 'Solo Raya', latitude: -7.5962, longitude: 110.9511, zoom: 12 },
    { name: 'Kab. Sragen', region: 'Solo Raya', latitude: -7.4267, longitude: 111.0222, zoom: 12 },
    { name: 'Kab. Boyolali', region: 'Solo Raya', latitude: -7.5361, longitude: 110.5947, zoom: 12 },
    { name: 'Kab. Klaten', region: 'Solo Raya', latitude: -7.7058, longitude: 110.6022, zoom: 12 },
    { name: 'Kab. Wonogiri', region: 'Solo Raya', latitude: -7.8139, longitude: 110.9258, zoom: 11 },
  ];

  for (const city of defaultCities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {
        region: city.region,
        latitude: city.latitude,
        longitude: city.longitude,
        zoom: city.zoom,
      },
      create: city,
    });
  }

  console.log('✓ Seeding selesai 100%!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
