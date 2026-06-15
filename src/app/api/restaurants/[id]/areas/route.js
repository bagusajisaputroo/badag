import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const restaurantId = resolvedParams.id;
    const body = await request.json();
    const { areas } = body; // Array of area objects

    if (!Array.isArray(areas)) {
      return NextResponse.json({ error: 'areas must be an array' }, { status: 400 });
    }

    // To be safe on SQLite and preserve frontend IDs:
    // 1. Find existing areas
    // 2. Delete ones that are no longer in the payload
    // 3. Upsert the ones in the payload

    const currentAreaIds = areas.map(a => a.id).filter(Boolean);

    await prismaClient.$transaction(async (tx) => {
      // Delete removed areas
      await tx.restaurantArea.deleteMany({
        where: {
          restaurantId,
          id: { notIn: currentAreaIds.length > 0 ? currentAreaIds : ['NONE'] }
        }
      });

      // Upsert areas
      for (const a of areas) {
        await tx.restaurantArea.upsert({
          where: { id: a.id || 'NEW_ID_THAT_WILL_NEVER_MATCH' },
          update: {
            name: a.name,
            total: Number(a.total),
            seatoAllocated: Number(a.seatoAllocated),
            seatoOccupied: Number(a.seatoOccupied || 0),
            walkInOccupied: Number(a.walkInOccupied || 0)
          },
          create: {
            id: a.id, // Preserve the ID from frontend so it doesn't break React state
            restaurantId,
            name: a.name,
            total: Number(a.total),
            seatoAllocated: Number(a.seatoAllocated),
            seatoOccupied: Number(a.seatoOccupied || 0),
            walkInOccupied: Number(a.walkInOccupied || 0)
          }
        });
      }
    });

    // Fetch the updated areas
    const updatedAreas = await prismaClient.restaurantArea.findMany({
      where: { restaurantId }
    });

    return NextResponse.json({ success: true, areas: updatedAreas });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to sync areas' }, { status: 500 });
  }
}
