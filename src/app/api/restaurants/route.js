import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function GET() {
  try {
    const restaurants = await prismaClient.restaurant.findMany();
    const mapped = restaurants.map(r => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : [],
      occupancy: { filled: 10, total: 20, waitlist: 0, waitTime: 0 } // Mock occupancy for now
    }));
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
