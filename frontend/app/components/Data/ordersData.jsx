export const orders = Array.from({ length: 50 }).map((_, i) => {
  const hasDiscount = Math.random() < 0.5;
  const amountBefore = Math.floor(Math.random() * 50000) + 5000;
  const discountAmount = hasDiscount ? Math.floor(amountBefore * (Math.random() * 0.3)) : 0;
  const finalAmount = amountBefore - discountAmount;

  const paymentMethods = ['Card', 'Bank Transfer', 'PayPal', 'Crypto'];
  const events = ['Bash Party', 'Tech Fest', 'Art Expo', 'Old School Jam', 'Concert Vibes'];
  const eventImages = {
    'Bash Party': '/images/bash-party.jpg',
    'Tech Fest': '/images/tech-fest.jpg',
    'Art Expo': '/images/art-expo.jpg',
    'Old School Jam': '/images/old-school-jam.jpg',
    'Concert Vibes': '/images/concert-vibes.jpg',
  };

  const event = events[Math.floor(Math.random() * events.length)];
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  return {
    id: `ORD-${1000 + i}`,
    event,
    tickets: ['Regular', 'VIP', 'Backstage'],
    paymentMethod,
    paymentStatus: 'Paid',
    amountBeforeDiscount: amountBefore,
    discountAmount,
    finalAmount,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    image: eventImages[event],
  };
});
