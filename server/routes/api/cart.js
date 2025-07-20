const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const auth = require('../../middleware/auth');

// Create a new cart for ticket
router.post('/add', async (req, res) => {
  try {
    const { item, user } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'No items provided' });
    }
    
    // Create a new cart with the item
    const cart = new Cart({
      tickets: [item],
      user: user ? user._id : null
    });
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cartId: cart._id,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Create a new cart for products
router.post('/add-product', async (req, res) => {
  try {
    const { item, user } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'No items provided' });
    }
    
    // Create a new cart with the product item
    const cart = new Cart({
      products: [item],
      user: user ? user._id : null
    });
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cartId: cart._id,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});
// Get cart by ID
router.get('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const populate = req.query.populate === 'true';

    let cart;
    if (populate) {
      cart = await Cart.findById(cartId)
        .populate('tickets.ticketId')
        .populate('tickets.eventId')
        .populate('tickets.coupon');
    } else {
      cart = await Cart.findById(cartId);
    }

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check if cart is expired
    if (cart.expiresAt && new Date() > cart.expiresAt) {
      await cart.deleteOne();
      return res.status(400).json({ error: 'Cart has expired' });
    }

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


// Add item to cart for tickets
router.put('/:cartId/add', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { item } = req.body;
    
    if (!item) {
      return res.status(400).json({ error: 'No item provided' });
    }
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Check if cart is expired
    if (cart.expiresAt && new Date() > cart.expiresAt) {
      await cart.deleteOne();
      return res.status(400).json({ error: 'Cart has expired' });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.tickets.findIndex(
      cartItem => cartItem.ticketId?.toString() === item.ticketId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists and if the cart quantity doesn't suppase item.ticketQuantity
      if (cart.tickets[existingItemIndex].quantity < item.ticketQuantity) {
        cart.tickets[existingItemIndex].quantity += 1;
      }
    } else {
      // Add new item to cart
      cart.tickets.push(item);
    }
    
    // Update cart expiration
    cart.expiresAt = new Date(+new Date() + 7*24*60*60*1000); // 7 days from now
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Add product to cart
router.put('/:cartId/add-product', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { item } = req.body;
    
    if (!item) {
      return res.status(400).json({ error: 'No item provided' });
    }
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Check if cart is expired
    if (cart.expiresAt && new Date() > cart.expiresAt) {
      await cart.deleteOne();
      return res.status(400).json({ error: 'Cart has expired' });
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.products.findIndex(
      cartItem => cartItem.productId?.toString() === item.productId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      if (cart.products[existingItemIndex].quantity < item.productQuantity) {
        cart.products[existingItemIndex].quantity += 1;
      }
    } else {
      // Add new product to cart
      cart.products.push(item);
    }
    
    // Update cart expiration
    cart.expiresAt = new Date(+new Date() + 7*24*60*60*1000); // 7 days from now
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Remove item from cart
router.put('/:cartId/remove', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { ticketId, productId } = req.body;

    if (!ticketId && !productId) {
      return res.status(400).json({ error: 'No item ID provided' });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (ticketId) {
      cart.tickets = cart.tickets.filter(
        (ticket) => ticket.ticketId.toString() !== ticketId
      );
    }

    if (productId) {
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId
      );
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// udpate cart item
router.put('/:cartId/update', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { ticketId, productId, updates } = req.body;

    if ((!ticketId && !productId) || !updates) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(400).json({ error: 'Cart not found' });
    }

    let itemFound = false;

    if (ticketId) {
      const ticketIndex = cart.tickets.findIndex(
        (ticket) => ticket.ticketId.toString() === ticketId
      );

      if (ticketIndex !== -1) {
        Object.keys(updates).forEach((key) => {
          cart.tickets[ticketIndex][key] = updates[key];
        });
        itemFound = true;
      }
    }

    if (productId) {
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex !== -1) {
        Object.keys(updates).forEach((key) => {
          cart.products[productIndex][key] = updates[key];
        });
        itemFound = true;
      }
    }

    if (!itemFound) {
      return res.status(400).json({ error: 'Item not found in cart' });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Clear/delete cart
router.delete('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    
    const result = await Cart.findByIdAndDelete(cartId);
    
    if (!result) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Cart deleted successfully'
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Associate cart with user (after login)
router.put('/:cartId/user', auth, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Associate cart with user
    cart.user = req.user._id;
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Update entire cart with coupon and final amount
router.put('/:cartId/apply-coupon', async (req, res) => {
  try {
    const { cartId } = req.params;
    const { finalAmount, discountAmount, coupon, couponValidTickets } = req.body;

    if (!finalAmount || !coupon || !Array.isArray(couponValidTickets)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(400).json({ error: 'Cart not found' });
    }

    // Apply ticket updates to cart item
    couponValidTickets.forEach((ticketId) => {
      const item = cart.tickets.find(t => t.ticketId.toString() === ticketId.toString());
      if (item) {
        item.coupon = coupon.couponId;
        if (coupon.type === 'Fixed') {
          item.couponAmount = coupon.amount
          item.couponDiscount = item.discountPrice - coupon.amount
        } else if (coupon.type === 'Percentage') {
          item.couponPercentage = coupon.percentage
          item.couponDiscount = (item.discountPrice > 0  ? item.discountPrice : item.price) * (coupon.percentage / 100)
        }
      }
    });

    cart.total = finalAmount;

    await cart.save();

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({ error: 'Failed to apply coupon to cart' });
  }
});


module.exports = router;