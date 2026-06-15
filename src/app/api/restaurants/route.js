import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function GET() {
  try {
    const restaurants = await prismaClient.restaurant.findMany({
      include: {
        areas: true
      }
    });
    const mapped = restaurants.map(r => {
      // Calculate occupancy dynamically from areas
      let filled = 0;
      let total = 0;
      
      if (r.areas && r.areas.length > 0) {
        r.areas.forEach(a => {
          total += a.total;
          filled += a.seatoOccupied + a.walkInOccupied;
        });
      } else {
        // Fallback for uninitialized restaurants
        total = 20;
        filled = 10;
      }

      return {
        ...r,
        tags: r.tags ? JSON.parse(r.tags) : [],
        occupancy: { filled, total, waitlist: 0, waitTime: 0 }
      };
    });
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newRestaurant = await prismaClient.restaurant.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        type: body.type,
        status: body.status,
        tags: JSON.stringify(body.tags || []),
      }
    });
    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
  }
}
