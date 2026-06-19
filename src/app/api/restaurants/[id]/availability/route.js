import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const restaurantId = resolvedParams.id;
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    console.log(`[API /availability] Request received for restaurant: ${restaurantId}, date: ${date}`);

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Fetch restaurant areas to know the capacity
    const areas = await prismaClient.restaurantArea.findMany({
      where: { restaurantId }
    });

    // Fetch reservations for this date (only active ones)
    const reservations = await prismaClient.reservation.findMany({
      where: {
        restaurantId,
        date,
        status: { in: ['Confirmed', 'Menunggu Konfirmasi'] }
      }
    });

    // We will generate time slots from 12:00 to 21:00
    const times = [];
    for (let i = 12; i <= 21; i++) {
      const h = i.toString().padStart(2, '0');
      times.push(`${h}:00`);
      if (i < 21) times.push(`${h}:30`);
    }

    // Calculate availability per time slot
    const availability = times.map(time => {
      let totalAvailable = 0;
      const areaAvailability = {};

      areas.forEach(area => {
        // Count how many reservations exist for this area at this time
        // Match by areaId (correct field) — fallback to tableType matching area name for legacy data
        const bookedCount = reservations.filter(r => 
          r.time === time && (r.areaId === area.id || r.tableType === area.name)
        ).length;
        
        // Assume 1 reservation = 1 table (slot)
        const availableInArea = Math.max(0, area.seatoAllocated - bookedCount);
        
        areaAvailability[area.id] = {
          name: area.name,
          allocated: area.seatoAllocated,
          booked: bookedCount,
          available: availableInArea
        };

        totalAvailable += availableInArea;
      });

      return {
        time,
        totalAvailable,
        isFull: totalAvailable === 0,
        areas: areaAvailability
      };
    });

    return NextResponse.json({ success: true, date, availability });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
