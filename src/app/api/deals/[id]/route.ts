import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.stageId !== undefined) dataToUpdate.stageId = parseInt(body.stageId);
    if (body.clientName !== undefined) dataToUpdate.clientName = body.clientName;
    if (body.companyName !== undefined) dataToUpdate.companyName = body.companyName;
    if (body.phone !== undefined) dataToUpdate.phone = body.phone;
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.dealValue !== undefined) dataToUpdate.dealValue = parseFloat(body.dealValue);
    if (body.productCategory !== undefined) dataToUpdate.productCategory = body.productCategory;
    if (body.customerType !== undefined) dataToUpdate.customerType = body.customerType;
    if (body.topic !== undefined) dataToUpdate.topic = body.topic;
    if (body.targetPeriod !== undefined) dataToUpdate.targetPeriod = body.targetPeriod;
    if (body.cityId !== undefined) dataToUpdate.cityId = parseInt(body.cityId);
    if (body.latitude !== undefined) dataToUpdate.latitude = parseFloat(body.latitude);
    if (body.longitude !== undefined) dataToUpdate.longitude = parseFloat(body.longitude);

    const deal = await prisma.deal.update({
      where: { id },
      data: dataToUpdate,
      include: {
        stage: true,
        city: true,
        createdBy: { select: { id: true, name: true, email: true } },
        activities: true,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui deal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus deal' }, { status: 500 });
  }
}
