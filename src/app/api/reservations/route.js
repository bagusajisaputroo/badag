import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function GET(request) {
  try {
    // Optionally we can get userId from query string, but for now we'll just fetch all
    // or fetch for the first user since it's a mockup without real auth
    const user = await prismaClient.user.findFirst();
    if (!user) {
       return NextResponse.json({ upcoming: [], selesai: [], dibatalkan: [] });
    }

    const reservations = await prismaClient.reservation.findMany({
      where: { userId: user.id },
      include: { restaurant: true },
      orderBy: { createdAt: 'desc' }
    });

    const upcoming = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Menunggu Konfirmasi');
    const selesai = reservations.filter(r => r.status === 'Selesai');
    const dibatalkan = reservations.filter(r => r.status === 'Dibatalkan');

    const formatRes = (r) => ({
      id: r.id,
      restaurantName: r.restaurant.name,
      status: r.status,
      date: r.date,
      time: r.time,
      guests: r.guests,
      tableType: r.tableType,
      location: r.restaurant.city,
      invoiceId: r.invoiceId,
      totalAmount: r.totalAmount,
      paymentStatus: r.paymentStatus
    });

    return NextResponse.json({
      upcoming: upcoming.map(formatRes),
      selesai: selesai.map(formatRes),
      dibatalkan: dibatalkan.map(formatRes)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await prismaClient.user.findFirst();

    const restaurant = await prismaClient.restaurant.findFirst({
      where: { name: body.restaurantName }
    });

    if (!restaurant || !user) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Generate Invoice ID
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceId = `INV-${dateStr}-${randomHex}`;
    
    // Generate mock amount (e.g. 50k, 100k, 150k based on guests)
    const guests = body.guests || 2;
    const totalAmount = guests * 50000;

    const newRes = await prismaClient.reservation.create({
      data: {
        userId: user.id,
        restaurantId: restaurant.id,
        status: 'Menunggu Konfirmasi',
        date: body.date || 'Hari ini',
        time: body.time || '19:00 WIB',
        guests,
        tableType: body.tableType || 'Meja Indoor',
        invoiceId,
        totalAmount,
        paymentStatus: 'Unpaid'
      }
    });

    return NextResponse.json(newRes, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
