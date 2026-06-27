import { NextResponse } from 'next/server';
import { prisma as prismaClient } from '../../../lib/prisma';

export async function POST(request) {
  try {
    const { userId, restaurantId, reservationId, rating, comment } = await request.json();

    if (!userId || !restaurantId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if review already exists for this reservation
    if (reservationId) {
      const existing = await prismaClient.review.findUnique({
        where: { reservationId }
      });
      if (existing) {
        return NextResponse.json({ error: 'Review already submitted for this reservation' }, { status: 400 });
      }
    }

    // Get user and restaurant details for the stream
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    const restaurant = await prismaClient.restaurant.findUnique({ where: { id: restaurantId } });

    if (!user || !restaurant) {
      return NextResponse.json({ error: 'User or Restaurant not found' }, { status: 404 });
    }

    // Create Review
    const newReview = await prismaClient.review.create({
      data: {
        userId,
        restaurantId,
        reservationId,
        rating,
        comment
      }
    });

    // Create Stream post
    await prismaClient.stream.create({
      data: {
        authorName: user.name,
        authorAvatar: user.initials,
        type: 'USER_REVIEW',
        content: `Mengulas ${restaurant.name}: "${comment || 'Bagus sekali!'}"`,
        rating: rating,
        imageUrl: restaurant.imageUrl
      }
    });

    // Update User Stats
    await prismaClient.user.update({
      where: { id: userId },
      data: { statsUlasan: user.statsUlasan + 1 }
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reviews] Error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Return all reviews for random feed
    const reviews = await prismaClient.review.findMany({
      include: {
        user: true,
        restaurant: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[GET /api/reviews] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
