export function getCartPriceSummary(tickets = [], products=[]) {
  let subTotal = 0;
  let total = 0;


  // calculate product first
  products.forEach(product => {
    const productPrice = product.price;
    subTotal += productPrice * product.quantity;

    total += productPrice * product.quantity;
  })

  tickets.forEach(ticket => {
    const originalPrice = ticket.price || 0;
    const hasDiscount = ticket.discount && ticket.discountPrice < originalPrice;
    const discountPrice = hasDiscount ? ticket.discountPrice : originalPrice;

    // Subtotal adds original price
    subTotal += originalPrice * ticket.quantity;

    // Apply discount
    let finalPrice = discountPrice;

    // Apply coupon if any
    if (ticket.coupon) {
      if (ticket.couponPercentage > 0) {
        finalPrice -= ticket.couponDiscount || 0;
      } else if (ticket.couponAmount > 0) {
        finalPrice -= ticket.couponAmount || 0;
      }
    }

    if (finalPrice < 0) finalPrice = 0;

    total += finalPrice;
  });

  return {
    subTotal: subTotal.toLocaleString(),
    total: total.toLocaleString(),
  };
}
