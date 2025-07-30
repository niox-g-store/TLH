const express = require('express');
const mongoose = require('mongoose');
const mailgun = require('../../services/mailgun');
const router = express.Router();
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Event = require('../../models/event');
const Ticket = require('../../models/ticket');
const User = require('../../models/user');
const Organizer = require('../../models/organizer');
const Withdrawal = require('../../models/withdrawal');
const Guest = require('../../models/guest');
const QRCODE = require('../../models/qrCode');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const { PaymentHandler } = require('../../utils/paystack');
const { customAlphabet } = require('nanoid');
const QRCode = require('qrcode');
const keys = require('../../config/keys');
const orderQueue = require('../../queues/orderQueue');
const { generateInvoice } = require('../../utils/invoiceService');

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

const assignQrCode = async (order, cart) => {
  try {
    const isGuest = !!order.guest;
    let userOrGuestId = isGuest ? order.guest : order.user._id;

    const allQrCodes = [];

    if (isGuest) {
      userOrGuestId = await Guest.findOne({_id: userOrGuestId})
    } else {
      userOrGuestId = await User.findOne({ _id: userOrGuestId }).populate('organizer')
    }

    // Only process ticket items for QR codes
    const ticketItems = cart.tickets.filter(item => item.type !== 'product');
    
    for (const ticketItem of ticketItems) {
      const ticketLocation = await Ticket.findOne({ _id: ticketItem.ticketId })
      const { coupon,
              ticketType,
              eventName,
              quantity,
              price,
              discount,
              discountAmount,
              discountPrice,
              couponDiscount,
              couponAmount,
              couponPercentage,
              eventId,
              ticketId,
      } = ticketItem;

      for (let i = 0; i < quantity; i++) {
        const shortCode = nanoid();

        /*const payload = {
          code: shortCode,
          ticketType,
          eventName,
          coupon,
          price,
          discount,
          discountAmount,
          discountPrice,
          couponDiscount,
          couponAmount,
          couponPercentage,
          orderId: order._id,
          userId: userOrGuestId,
          ownedByModel: isGuest ? 'Guest' : 'User',
          index: i,
        };*/

        const ppayload = {
          code: shortCode,
          userId: userOrGuestId._id,
          email: userOrGuestId.email,
          eventName,
          ticketType,
        };

        const qrPayload = JSON.stringify(ppayload);

        const qrBuffer = await QRCode.toBuffer(qrPayload);
        let name;
        if (!isGuest) {
          if (userOrGuestId.organizer) {
            name = userOrGuestId.organizer.companyName
          } else {
            name = userOrGuestId.name
          }
        } else {
          name = userOrGuestId.name
        }

        const qr = new QRCODE({
          eventId,
          ticketId,
          ticketType,
          eventName,
          coupon,
          price,
          discount,
          discountAmount,
          discountPrice,
          couponDiscount,
          couponAmount,
          couponPercentage,
          order: order._id,
          ownedBy: userOrGuestId,
          billingEmail: userOrGuestId.email,
          billingName: name,
          ownedByModel: isGuest ? 'Guest' : 'User',
          code: shortCode,
          bytes: qrBuffer,
          ticketLocation: ticketLocation.location
        });

        const savedQr = await qr.save();
        allQrCodes.push(savedQr);
      }
    }

    return allQrCodes;
  } catch (error) {
    throw new Error('Failed to assign QR codes');
  }
};

/**
 * generates unique code
 */
const generateUniqueCode = () => {
  //const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code
}

/**
 * create new object id (_id)
 * @returns 
 */
const newObjectId = async() => {
  let uniqueCode = generateUniqueCode()
  let orderFound = await Order.exists({ _id: uniqueCode })

  while (orderFound) {
    uniqueCode = generateUniqueCode();
    orderFound = await Order.exists({ _id: uniqueCode })
  }
  return uniqueCode;
}


router.post('/add', async (req, res) => {
  try {
    let {
      cart,
      guest,
      user,
      finalAmount,
      events,
      tickets,
      products,
      discountPrice,
      amountBeforeDiscount,
      payStackId,
      billingEmail,
      address,
      phoneNumber,
      coupon
    } = req.body;
    const ID = await newObjectId();
    products = products.map(i => i.productId)

    const cartDoc = await Cart.findById(cart);
    if (!cartDoc) {
      return res.status(400).json({ error: 'Cart not found' });
    }
    if (guest) {
        cartDoc.guest = guest
        await cartDoc.save()
    }
    if (payStackId) {
      const fetchOrder = await Order.exists({ payStackId: payStackId })
      if (fetchOrder) {
        return res.status(200).json({ order: fetchOrder })
      }
    }

    const order = new Order({
      _id: ID,
      cart,
      user,
      guest,
      //events: [...new Set(events.map(id => mongoose.Types.ObjectId(id)))],
      events,
      phoneNumber: phoneNumber || null,
      address: address || null,
      products: products || [],
      coupon: coupon ? coupon.couponId : null,
      tickets: tickets || [],
      finalAmount,
      discountAmount: discountPrice || 0,
      amountBeforeDiscount,
      payStackId,
      billingEmail,
      status: false
    });

    await order.save();

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


router.put('/edit/order/', async (req, res) => {
  try {
    const id = req.body.orderId || null;
    const guest = req.body.guest;
    let update, status, updateOrder,
        payStackReference, paymentMethod, payStackId,
        verifyPayment, paymentStatus, paymentFees;
    if (id) { // free ticket
      status = req.body.status;
      update = {
          $set: {
            status,
          }
        }
    } else {
      payStackId = req.body.payStackId;
      payStackReference = req.body.paystackReference;
    
      // confirm order via paystack
      verifyPayment = await PaymentHandler(payStackId);
      paymentStatus = verifyPayment.data.status
      status = verifyPayment.data.status === 'success' ? true : false;
      paymentMethod = verifyPayment.data.channel;
      paymentFees = Math.round(verifyPayment.data.fees / 100);

      update = {
        $set: {
          payStackReference,
          status,
          paymentMethod,
          paymentStatus,
          paymentFees,
        }
      }
    }

    if (id) {  // free ticket update
      updateOrder = await Order.findOneAndUpdate({ _id: id }, update)
        .populate('cart')
        .populate('guest')
        .populate('events')
        .populate('coupon')
    } else {
      updateOrder = await Order.findOneAndUpdate({ payStackId: payStackId }, update)
        .populate('cart')
        .populate('guest')
        .populate('events')
        .populate('coupon')
    }
  
    const cartDoc = await Cart.findById(updateOrder.cart)
      .populate({
        path: 'tickets.eventId',
        populate: { path: 'user' }
      })
      .populate('tickets.ticketId')
      .populate('products')
    if (status) {
      // add user to registered attendees or unregistered attendees
      const cartEvents = cartDoc.tickets.map(e => e.eventId);

      let quantity = 0;
      for (const item of cartDoc.tickets) {
        const tick = await Ticket.findById(item.ticketId);
        tick.soldCount += item.quantity;
        await tick.save()
        quantity += item.quantity
      }

      if (cartDoc.user) { // add to registered attendees
        for (const item of cartEvents) {
          const eve = await Event.findById(item._id);
          eve.attendees += quantity;

          const userIdStr = cartDoc.user.toString();
          const alreadyRegistered = eve.registeredAttendees.some(id => id.toString() === userIdStr);

          if (!alreadyRegistered) {
            eve.registeredAttendees.push(cartDoc.user);
          }

          await eve.save();
        }
      } else {
        for (const item of cartEvents) {
          const eve = await Event.findById(item._id)
          eve.attendees += quantity
          eve.unregisteredAttendees.push(guest._id)
          await eve.save()
        }
      }
      // assign qr code to the ticket
      
      const qrAssigner = await assignQrCode(updateOrder, cartDoc);
      const eventNames = cartDoc.tickets.map((item) => item.eventId.name);
      const newOrder = {
        _id: updateOrder._id,
        createdAt: updateOrder.createdAt,
        name: updateOrder.guest !== null ? updateOrder.guest.name : updateOrder.user.name,
        cart: cartDoc,
        eventNames,
        coupon: updateOrder.coupon,
        billingEmail: updateOrder.billingEmail
      };
      const adminEmails = await User.find({ role: ROLES.Admin }).select('email')
      const alertedOrganizer = [];
      const organizerEmailsAndData = [];
      const cartDocEvents = cartDoc.tickets.map((item) => item.eventId)
      for (const eventId of cartDocEvents) {
        const organizer = await Event.findOne({ _id: eventId }).populate('user')
        if (organizer.user.role === ROLES.Organizer) {
          if (!alertedOrganizer.map(id => id.toString()).includes(organizer.user._id.toString())) {
            alertedOrganizer.push(organizer.user._id)
          }
        }
      }
      // here sort newOrder and create an array of objects of orders and email,
      // where the host of the event in that order is the organizer
      // this will let an organizer get an order email that relates to their event or events
      if (alertedOrganizer.length > 0) {
        for (const organizer of alertedOrganizer) {
          const organizerEmail = await User.findById(organizer)
          const matchedEventNames = updateOrder.events
            .filter(event => event.user.equals(organizer))
            .map(event => event.name);
          const filteredTickets = cartDoc?.tickets?.filter(
            (ticket) =>
              ticket.eventId &&
              ticket.eventId.user &&
              ticket.eventId.user.equals(organizer)
          );
          // here create a new cartDoc with the total from organizerCart cuz we want an organizer
          // to only see the total of their cart items
          const total = filteredTickets.reduce((sum, item) => {
            const itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          const newCartDoc = {
            _id: updateOrder._id,
            createdAt: updateOrder.createdAt,
            name: newOrder.name,
            eventsNames: matchedEventNames,
            cart: {
              ...updateOrder.cart.toObject(),
              tickets: filteredTickets,
              total,
            },
            coupon: updateOrder.coupon,
          }
          organizerEmailsAndData.push({
            email: organizerEmail.email,
            newOrder: newCartDoc
          })
        }
      }

      // Check if this is a product order
      const hasProducts = cartDoc.products.some(item => item.type === 'product');
      const hasTickets = cartDoc.tickets.some(item => item.type !== 'product');

      // Decrease product quantities
      if (hasProducts) {
        await decreaseProductQuantity(cartDoc.products.filter(item => item.type === 'product'));
      }

      // Decrease ticket quantities
      if (hasTickets) {
        // create withdraw object here
        // free orders are not eligible for withdrawals
        if (!id) {
          // create a withdrawal
          await createWithdrawal(cartDoc, updateOrder);
        }
        await decreaseQuantity(cartDoc.tickets.filter(item => item.type !== 'product'));
      }

      // call background jobs with product order flag
      await orderQueue.add('new-order', { 
        qrAssigner, 
        newOrder, 
        adminEmails, 
        organizerEmailsAndData,
        isProductOrder: hasProducts
      });

      // decrease quantity if the order has been successful
      // decreaseQuantity(cartDoc.tickets);

  
        return res.status(200).json({
          success: true,
          message: `Your order has been placed successfully!`,
          order: { _id: updateOrder._id },
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
})

// fetch order api
router.get(
  '/id/:id',
  auth,
  async (req, res) => {
  try {
    const orderId = req.params.id;
    const currentUser = req.user;
    // Base order query
    let orderDoc = await Order.findOne({ _id: orderId })
      .populate('events')
      .populate('products')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        },
      })
      .populate('guest');
    if (!orderDoc || !orderDoc.cart) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    let address = null, phoneNumber = null;
    if (orderDoc.address?? orderDoc.address.street.length > 0) {
      address = orderDoc.address
    }
    if (orderDoc.phoneNumber && orderDoc.phoneNumber.length > 0) {
      phoneNumber = orderDoc.phoneNumber
    }

    let order = {
      _id: orderDoc._id,
      createdAt: orderDoc.createdAt,
      user: orderDoc.user,
      guest: orderDoc.guest,
      billingEmail: orderDoc.billingEmail,
      address: address !== null ? address : null,
      phoneNumber: phoneNumber !== null ? phoneNumber : null,
      finalAmount: orderDoc.finalAmount,
      discountAmount: orderDoc.discountAmount,
      paymentMethod: orderDoc.paymentMethod,
      paymentFees: orderDoc.paymentFees,
      amountBeforeDiscount: orderDoc.amountBeforeDiscount,
      status: orderDoc.status,
      cart: orderDoc.cart,
      events: orderDoc.events,
    };

    let paymentDetails;

    // === Admin Logic ===
    if (currentUser.role === ROLES.Admin) {
      if (orderDoc?.payStackId?.length > 0) { paymentDetails = await PaymentHandler(orderDoc?.payStackId); }
      order = {
        ...order,
        payStackId: orderDoc?.payStackId || "",
        payStackReference: orderDoc?.payStackReference || "",
        paymentStatus: paymentDetails?.data.status || "",
        paymentDate: paymentDetails?.data.paid_at || "",
        paymentCurrency: paymentDetails?.data.currency || "",
        products: orderDoc?.products,
        productStatus: orderDoc?.productStatus
      };
    }

    // === User Logic ===
    else if (currentUser.role === ROLES.Member) {
      if (orderDoc?.payStackId?.length > 0) { paymentDetails = await PaymentHandler(orderDoc?.payStackId); }
      order = {
        ...order,
        paymentStatus: paymentDetails?.data?.status || "",
        paymentDate: paymentDetails?.data?.paid_at || "",
        paymentCurrency: paymentDetails?.data?.currency || "",
        products: orderDoc?.products || [],
        productStatus: orderDoc?.productStatus
      };
    }

    // === Organizer Logic ===
    else if (currentUser.role === ROLES.Organizer) {
      const organizerId = currentUser._id.toString();

      const filteredEvents = orderDoc.events.filter(
        (event) => event.user.toString() === organizerId
      );

      const filteredTickets = orderDoc.cart?.tickets?.filter(
        (ticket) =>
          ticket.eventId &&
          ticket.eventId.user &&
          ticket.eventId.user.toString() === organizerId
      );
      const total = filteredTickets.reduce((sum, item) => {
        const itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
        return sum + (itemPrice * item.quantity);
      }, 0);

      order = {
        ...order,
        events: filteredEvents,
        cart: {
          ...orderDoc.cart.toObject(),
          tickets: filteredTickets,
          total,
        }
      };
    }

    const isGuest = !!orderDoc.guest;
    let userOrGuestId = isGuest ? orderDoc.guest : orderDoc.user._id;

    if (isGuest) {
      userOrGuestId = await Guest.findOne({_id: userOrGuestId})
    } else {
      userOrGuestId = await User.findOne({ _id: userOrGuestId }).populate('organizer')
    }
    const invoice = await QRCODE.find({ order: orderId })
    for (let qr of invoice) {
      qr.ownedBy = userOrGuestId;
      qr.ownedByModel = isGuest ? 'Guest' : 'User';
      await qr.save();
    }

    return res.status(200).json({ order, invoice });

  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/invoice-download', auth, async (req, res) => {
  try {
    const { productData = null, orderId = null } = req.body;
    const invoice = req.body.invoice;
    let pdfBuffer = null;
    if (productData && orderId) {
      const order = await Order.findById(orderId).populate('guest');
      order.name = order?.guest ? order.guest.name : order.user.name
      pdfBuffer = await generateInvoice(order, true, productData)
    } else {
      pdfBuffer = await generateInvoice(invoice);
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment`,
      'Content-Length': pdfBuffer.length,
    });
    return res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({ message: 'Failed to generate invoice.' });
  }
});

// fetch orders related to an organizer event or all orders for admin
router.get(
  '/all_orders',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
  try {
    const user = req.user;
    let orders = await Order.find()
      .populate('events')
      .populate('products')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        }
      })
      .populate('guest')
      .sort('-createdAt')
    if (user.role === ROLES.Organizer) {
      const organizerId = user._id.toString();

      orders = orders
        .map((order) => {
          // Filter events that belong to organizer
          const relevantEvents = order.events.filter(
            (event) => event.user.toString() === organizerId
          );

          // Filter tickets in cart that belong to organizer's events
          const relevantTickets = order.cart?.tickets?.filter(
            (ticket) =>
              ticket.eventId &&
              ticket.eventId.user &&
              ticket.eventId.user.toString() === organizerId
          );

          // Only return the order if there's at least one relevant event or ticket
          if (relevantEvents.length > 0 || relevantTickets.length > 0) {
            const total = relevantTickets.reduce((sum, item) => {
              const itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
                return sum + (itemPrice * item.quantity);
            }, 0);
            return {
              ...order.toObject(),
              events: relevantEvents,
              
              cart: {
                ...order.cart.toObject(),
                tickets: relevantTickets,
                total
              },
            };
          }

          return null;
        })
        .filter(Boolean); // remove nulls
    }
    return res.status(200).json({
      status: 200,
      orders
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
})


// fetch my orders api
router.get(
  '/me',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer, ROLES.Member),
  async (req, res) => {
    try {
      const user = req.user;
      let query = {};

      if (user.role === ROLES.Admin) {
        // Fetch orders from all admin users
        const adminUsers = await User.find({ role: ROLES.Admin }).select('_id');
        const adminUserIds = adminUsers.map(u => u._id);
        query = { 'user._id': { $in: adminUserIds } };
      } else {
        // Fetch only the user's own orders
        query = { 'user._id': user._id };
      }

      const orders = await Order.find(query)
        .populate('events')
        .populate('products')
        .populate({
          path: 'cart',
          populate: {
            path: 'tickets.eventId',
          }
        })
        .populate('guest')
        .sort('-createdAt');const createdWithdrawals = [];


      return res.status(200).json({
        status: 200,
        orders
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


// DELETE /order/id/:id
router.delete('/id/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const orderId = req.params.id;
    const currentUser = req.user;

    const order = await Order.findById(orderId)
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.ticketId'
        }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Admins only can delete orders
    if (currentUser.role !== ROLES.Admin) {
      return res.status(403).json({ message: 'Unauthorized to delete this order.' });
    }

    if (order.cart && order.cart.tickets && order.cart.tickets.length > 0) {
      // increase quantity only if the order status === 'true'
      if (order.status === 'true') {
        await increaseQuantity(order.cart.tickets);
        await increaseProductQuantity(order?.cart?.products);
      }
    }

    // Delete the order
    await order.deleteOne();  

    return res.status(200).json({ message: 'Order deleted and tickets restocked successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while deleting the order.' });
  }
});

// PUT /order/:id/product-status - Update product order status (Admin only)
router.put('/:id/product-status', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!['processing', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { productStatus: status },
      { new: true }
    ).populate({
      path: 'cart',
      populate: {
        path: 'products'
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send email notification to user
    const productNames = order.cart.products.map(p => p.productName).join(', ');
    const emailData = {
      orderId: order._id,
      productNames,
      status,
      customerName: order.user?.name || order.guest?.name || 'Customer'
    };

    await mailgun.sendEmail(order.billingEmail, 'product-status-update', emailData);

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

const increaseQuantity = (tickets) => {
  const bulkOptions = tickets.map(item => ({
    updateOne: {
      filter: { _id: item.ticketId },
      update: { $inc: { quantity: item.quantity } }
    }
  }));

  return Ticket.bulkWrite(bulkOptions);
};

const decreaseQuantity = (tickets) => {
  const bulkOptions = tickets.map(item => ({
    updateOne: {
      filter: { _id: item.ticketId },
      update: { $inc: { quantity: -item.quantity } }
    }
  }));

  return Ticket.bulkWrite(bulkOptions);
};

const decreaseProductQuantity = async (products) => {
  const bulkOptions = products.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: {
        $inc: {
          quantity: -item.quantity,
          'SizeQuantity.$[elem].quantity': -item.quantity
        }
      },
      arrayFilters: [
        { 'elem.size': item.selectedSize }
      ]
    }
  }));

  return Product.bulkWrite(bulkOptions);
};


const increaseProductQuantity = async (products) => {
  const bulkOptions = products.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: {
        $inc: {
          quantity: item.quantity,
          'SizeQuantity.$[elem].quantity': item.quantity
        }
      },
      arrayFilters: [
        { 'elem.size': item.selectedSize }
      ]
    }
  }));

  return Product.bulkWrite(bulkOptions);
};


const createWithdrawal = async (cartDoc, updateOrder) => {
  // const createdWithdrawals = [];

  const ticketsInCart = cartDoc.tickets || [];
  const eventTicketMap = new Map();

  // Group tickets by eventId
  for (const ticket of ticketsInCart) {
    const eventIdStr = ticket.eventId._id.toString();
    if (!eventTicketMap.has(eventIdStr)) {
      eventTicketMap.set(eventIdStr, []);
    }
    eventTicketMap.get(eventIdStr).push(ticket);
  }

  for (const [eventIdStr, tickets] of eventTicketMap.entries()) {
    const event = await Event.findById(eventIdStr).populate('user');
    const owner = event.user;
    if (!owner) continue;

    for (const ticket of tickets) {
      const quantity = ticket.quantity || 1;
      const expected = ticket.expectedPayout || 0;

      let itemPrice;
      itemPrice = ticket.discount && ticket.discountPrice ? ticket.discountPrice : ticket.price;
      if (ticket?.coupon) { // here we have a coupon ticket applied
        if (ticket.couponPercentage > 0) { // percentage coupon
          itemPrice -= ticket.couponDiscount
        } else if (ticket.couponAmount > 0) {  // fixed coupon
          itemPrice -= ticket.couponAmount // here coupon amount is negative
        }
      }
      const amount = owner.role === ROLES.Organizer ?
        expected
        :
        reverseExpectedPayout(itemPrice, expected, ticket.quantity);

      let adminCommission = 0
      if (owner.role === ROLES.Organizer) {
        adminCommission = reverseExpectedPayout(itemPrice, expected, ticket.quantity, true)
      } else {
        adminCommission = amount
      }

      const withdrawal = new Withdrawal({
        user: owner._id,
        event: event._id,
        ticket: ticket.ticketId,
        ticketQuantity: quantity,
        order: updateOrder._id,
        amount,
        commission: adminCommission,
        bankAccountNumber: owner.bankAccountNumber,
        bankAccountName: owner.bankAccountName,
        bankName: owner.bankName,
      });

      await withdrawal.save();
      // createdWithdrawals.push(withdrawal);
    }
  }
}

const reverseExpectedPayout = (
  price, expectedPayout,
  quantity, isCalculatingCommission = false,
) => {
  let parsedPrice = parseFloat(price) || 0;
  const parsedExpected = parseFloat(expectedPayout) || 0;
  if (!isCalculatingCommission) {
    parsedPrice = parsedPrice * quantity
  }

  // Calculate Paystack fee
  let paystackFee = 0
  if (parsedPrice > 2500) {
    paystackFee = (1.5 / 100) * parsedPrice + 100;
  } else {
    paystackFee = (1.5 / 100) * parsedPrice;
  }
  if (paystackFee > 2000) paystackFee = 2000;
  if (isCalculatingCommission) {
    paystackFee *= quantity
  }

  let adminEarning = 0;
  if (isCalculatingCommission) {
  // get commission price from expectedPayout
    adminEarning = (parsedPrice * quantity) - parsedExpected - paystackFee
  } else {
    adminEarning = parsedPrice - paystackFee
  }

  return adminEarning;
}


module.exports = router;