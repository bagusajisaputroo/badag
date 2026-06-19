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
    
    const reservation = await prismaClient.reservation.findUnique({ where: { id } });
    if (!reservation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const oldStatus = reservation.status;
    const newStatus = body.status;
    const cancelledBy = body.cancelledBy || null; // "user" | "admin" | "system"

    // Build update data
    const updateData = {};
    if (newStatus) updateData.status = newStatus;
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.cancelReason) updateData.cancelReason = body.cancelReason;
    if (cancelledBy) updateData.cancelledBy = cancelledBy;

    // ============================================
    // LOGIC: Handle seatoOccupied changes per area
    // ============================================

    // Helper: increment seatoOccupied on the correct area
    const incrementSeatoOccupied = async () => {
      if (reservation.areaId) {
        const area = await prismaClient.restaurantArea.findUnique({ where: { id: reservation.areaId } });
        if (area) {
          await prismaClient.restaurantArea.update({
            where: { id: area.id },
            data: { seatoOccupied: area.seatoOccupied + 1 }
          });
        }
      }
    };

    // Helper: decrement seatoOccupied on the correct area
    const decrementSeatoOccupied = async () => {
      if (reservation.areaId) {
        const area = await prismaClient.restaurantArea.findUnique({ where: { id: reservation.areaId } });
        if (area && area.seatoOccupied > 0) {
          await prismaClient.restaurantArea.update({
            where: { id: area.id },
            data: { seatoOccupied: area.seatoOccupied - 1 }
          });
        }
      }
    };

    // 1. Menunggu Konfirmasi → Confirmed (Admin Approve)
    //    → seatoOccupied +1
    if (oldStatus === 'Menunggu Konfirmasi' && newStatus === 'Confirmed') {
      await incrementSeatoOccupied();
    }

    // 2. Confirmed → Dibatalkan (User Cancel dari reservasi yang sudah di-approve)
    //    → seatoOccupied -1, cancelCount +1 (jika cancelledBy === 'user')
    if (oldStatus === 'Confirmed' && newStatus === 'Dibatalkan') {
      await decrementSeatoOccupied();

      if (cancelledBy === 'user') {
        const user = await prismaClient.user.findUnique({ where: { id: reservation.userId } });
        if (user) {
          const newCount = user.cancelCount + 1;
          let updateUserData = { cancelCount: newCount };
          if (newCount >= 5) {
            updateUserData.bannedUntil = new Date(Date.now() + 60 * 60 * 1000);
          }
          await prismaClient.user.update({ where: { id: user.id }, data: updateUserData });
        }
      }
    }

    // 3. Menunggu Konfirmasi → Dibatalkan (User Cancel sebelum di-approve)
    //    → cancelCount +1 (jika cancelledBy === 'user'), seatoOccupied tidak berubah
    if (oldStatus === 'Menunggu Konfirmasi' && newStatus === 'Dibatalkan') {
      if (cancelledBy === 'user') {
        const user = await prismaClient.user.findUnique({ where: { id: reservation.userId } });
        if (user) {
          const newCount = user.cancelCount + 1;
          let updateUserData = { cancelCount: newCount };
          if (newCount >= 5) {
            updateUserData.bannedUntil = new Date(Date.now() + 60 * 60 * 1000);
          }
          await prismaClient.user.update({ where: { id: user.id }, data: updateUserData });
        }
      }
    }

    // 4. Menunggu Konfirmasi → Ditolak Restoran (Admin Reject)
    //    → TIDAK tambah cancelCount, TIDAK ubah seatoOccupied
    //    (No additional logic needed — status change only)

    // 5. Confirmed → Selesai (Admin marks as completed)
    //    → seatoOccupied -1
    if (oldStatus === 'Confirmed' && newStatus === 'Selesai') {
      await decrementSeatoOccupied();
    }

    // Execute the update
    const updated = await prismaClient.reservation.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/reservations/:id] Error:', error);
    return NextResponse.json({ error: 'Failed to update reservation', details: error.message }, { status: 500 });
  }
}
