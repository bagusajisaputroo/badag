import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const reservation = await prismaClient.reservation.findUnique({
      where: { id },
      include: { restaurant: true }
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservation' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // We only allow updating status, paymentStatus, and cancelReason for now
    const updateData = {};
    if (body.status) updateData.status = body.status;
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.cancelReason) updateData.cancelReason = body.cancelReason;

    const updated = await prismaClient.reservation.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}

