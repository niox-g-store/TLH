export const eventCategoryFinder = (eventCategory, value) => {
  return eventCategory.find(e => e.label === value);
}

export const ticketCouponFinder = (coupons, value) => {
  if (value && coupons) {
    return value.map(val => coupons.find(coupon => coupon.value === val._id)).filter(Boolean);
  }
  return null;
};

