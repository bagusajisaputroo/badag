import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userProfile = {
  initials: "BU",
  name: "Budi Utomo",
  email: "budi.utomo@gmail.com",
  stats: {
    reservasi: 12,
    ulasan: 8,
    favorit: 24
  },
  location: "Bandung, Jawa Barat"
};

const promoBanners = [
  {
    title: "Diskon 20% di Union Coffee",
    subtitle: "Klaim sekarang",
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800",
    color: "linear-gradient(135deg, rgba(14,165,160,0.8), rgba(13,138,133,0.9))"
  },
  {
    title: "Happy Hour 3–6PM",
    subtitle: "Minuman beli 1 gratis 1",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
    color: "linear-gradient(135deg, rgba(27,52,97,0.8), rgba(37,72,128,0.9))"
  },
  {
    title: "New Opening: Sage Rooftop",
    subtitle: "Lihat promo eksklusif",
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800",
    color: "linear-gradient(135deg, rgba(250,204,21,0.8), rgba(234,179,8,0.9))"
  }
];

const restaurants = [
  {
    name: 'Union Coffee Dago',
    address: 'Jl. Ir. H. Djuanda, Bandung',
    city: 'Bandung',
    distance: '1.2km',
    type: 'Specialty Coffee',
    rating: 4.9,
    reviewsCount: 312,
    status: 'Tersedia', 
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600',
    tags: ['Cafe', 'Buka 24 Jam', 'Rating 4.5+'],
    isTrending: true,
    isRecommended: false,
  },
  {
    name: 'Njonja Groot',
    address: 'Jl. Hasanudin, Bandung',
    city: 'Bandung',
    distance: '800m',
    type: 'European',
    rating: 4.7,
    reviewsCount: 198,
    status: 'Ramai',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600',
    tags: ['Restoran', 'Rating 4.5+'],
    isTrending: true,
    isRecommended: false,
  },
  {
    name: 'Sage Rooftop Bar',
    address: 'Sudirman, Jakarta',
    city: 'Jakarta',
    distance: '3.1km',
    type: 'International',
    rating: 4.8,
    reviewsCount: 445,
    status: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=600',
    tags: ['Rooftop', 'Restoran', 'Rating 4.5+'],
    isTrending: true,
    isRecommended: false,
  },
  {
    name: 'Bellamie Boulangerie',
    address: 'Dago, Bandung',
    city: 'Bandung',
    distance: '1.5km',
    type: 'French Bakery',
    rating: 4.8,
    reviewsCount: 267,
    status: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=600',
    tags: ['Cafe', 'Rating 4.5+'],
    isTrending: false,
    isRecommended: true,
  },
  {
    name: 'Roemah Nenek',
    address: 'Setiabudhi, Bandung',
    city: 'Bandung',
    distance: '2.1km',
    type: 'Indonesian',
    rating: 4.6,
    reviewsCount: 189,
    status: 'Ramai',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600',
    tags: ['Restoran', 'Rating 4.5+'],
    isTrending: false,
    isRecommended: true,
  },
  {
    name: 'Burgreens Kemang',
    address: 'Kemang, Jakarta',
    city: 'Jakarta',
    distance: '4.2km',
    type: 'Healthy Food',
    rating: 4.5,
    reviewsCount: 321,
    status: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600',
    tags: ['Restoran', 'Rating 4.5+'],
    isTrending: false,
    isRecommended: true,
  },
  {
    name: 'Kopi Tuku',
    address: 'Cipete, Jakarta',
    city: 'Jakarta',
    distance: '2.8km',
    type: 'Local Coffee',
    rating: 4.6,
    reviewsCount: 278,
    status: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600',
    tags: ['Cafe', 'Buka 24 Jam', 'Rating 4.5+'],
    isTrending: true,
    isRecommended: false,
  },
  {
    name: 'Dailydose Coffee',
    address: 'Menteng, Jakarta',
    city: 'Jakarta',
    distance: '1.9km',
    type: 'Specialty Coffee',
    rating: 4.7,
    reviewsCount: 356,
    status: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1495474472202-42944523bb75?q=80&w=600',
    tags: ['Cafe', 'Rating 4.5+'],
    isTrending: false,
    isRecommended: true,
  },
  {
    name: 'Namaaz Dining',
    address: 'Senopati, Jakarta',
    city: 'Jakarta',
    distance: '5.1km',
    type: 'Fine Dining',
    rating: 4.9,
    reviewsCount: 512,
    status: 'Penuh',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600',
    tags: ['Fine Dining', 'Restoran', 'Rating 4.5+'],
    isTrending: true,
    isRecommended: false,
  }
];

const reservations = [
  {
    restaurantName: 'Union Coffee Dago',
    status: 'Confirmed',
    date: 'Sabtu, 17 Mei 2025',
    time: '19.00 WIB',
    guests: 2,
    tableType: 'Meja Indoor',
  },
  {
    restaurantName: 'Kopi Tuku',
    status: 'Menunggu Konfirmasi',
    date: 'Minggu, 18 Mei 2025',
    time: '10.00 WIB',
    guests: 3,
    tableType: 'Meja Outdoor',
  },
  {
    restaurantName: 'Roemah Nenek',
    date: '10 Mei 2025',
    time: '18.30 WIB',
    status: 'Selesai'
  },
  {
    restaurantName: 'Bellamie Boulangerie',
    date: '2 April 2025',
    time: '18.30 WIB',
    status: 'Selesai'
  },
  {
    restaurantName: 'Burgreens Kemang',
    date: '1 Mei 2025',
    time: '12.00 WIB',
    status: 'Dibatalkan'
  }
];

async function main() {
  console.log('Start seeding...');

  // Clean existing data to avoid duplicates if re-run
  await prisma.reservation.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.promoBanner.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default User
  const user = await prisma.user.create({
    data: {
      name: userProfile.name,
      email: userProfile.email,
      initials: userProfile.initials,
      location: userProfile.location,
      statsReservasi: userProfile.stats.reservasi,
      statsUlasan: userProfile.stats.ulasan,
      statsFavorit: userProfile.stats.favorit,
    },
  });
  console.log(`Created user with id: ${user.id}`);

  // 2. Create Promo Banners
  for (const p of promoBanners) {
    await prisma.promoBanner.create({ data: p });
  }
  console.log(`Created ${promoBanners.length} promo banners`);

  // 3. Create Restaurants
  const restaurantMap = {};
  for (const r of restaurants) {
    const createdRestaurant = await prisma.restaurant.create({
      data: {
        name: r.name,
        address: r.address,
        city: r.city,
        distance: r.distance,
        type: r.type,
        rating: r.rating,
        reviewsCount: r.reviewsCount,
        status: r.status,
        imageUrl: r.imageUrl,
        tags: JSON.stringify(r.tags),
        isTrending: r.isTrending,
        isRecommended: r.isRecommended,
      },
    });
    restaurantMap[r.name] = createdRestaurant.id;
    console.log(`Created restaurant: ${createdRestaurant.name}`);
  }

  // 4. Create Reservations
  for (const res of reservations) {
    const restoId = restaurantMap[res.restaurantName];
    if (restoId) {
      const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const invoiceId = `INV-${dateStr}-${randomHex}`;
      const guests = res.guests || 2;
      const totalAmount = guests * 50000;

      await prisma.reservation.create({
        data: {
          userId: user.id,
          restaurantId: restoId,
          status: res.status,
          date: res.date,
          time: res.time,
          guests: guests,
          tableType: res.tableType || 'Meja Indoor',
          invoiceId,
          totalAmount,
          paymentStatus: 'Unpaid'
        },
      });
      console.log(`Created reservation for: ${res.restaurantName}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
