const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Event = require('../../models/event');
const Ticket = require('../../models/ticket');
const User = require('../../models/user');
const Guest = require('../../models/guest');
const QRCODE = require('../../models/qrCode');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const PaymentHandler = require('../../utils/paystack');
const { customAlphabet } = require('nanoid');
const QRCode = require('qrcode');
const keys = require('../../config/keys');
const { generateInvoice } = require('../../utils/invoiceService');
const cart = require('../../models/cart');

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

    for (const ticketItem of cart.tickets) {
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
              ticketId
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
          bytes: qrBuffer
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
    const {
      cart,
      guest,
      user,
      finalAmount,
      events,
      tickets,
      discountPrice,
      amountBeforeDiscount,
      payStackId,
      billingEmail,
    } = req.body;
    const ID = await newObjectId();

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
      events,
      tickets,
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

    if (id) {
      updateOrder = await Order.findOneAndUpdate({ _id: id }, update)
    } else {
      updateOrder = await Order.findOneAndUpdate({ payStackId: payStackId }, update)
    }
  
    const cartDoc = await Cart.findById(updateOrder.cart)
      .populate('tickets.eventId')
      .populate('tickets.ticketId')
    if (status) {
      // add user to registered attendees or unregistered attendees
      const cartEvents = cartDoc.tickets.map(e => e.eventId)
      let quantity = 0;
      for (const item of cartDoc.tickets) { quantity += item.quantity }

      if (cartDoc.user) { // add to registered attendees
        for (const item of cartEvents) {
          const eve = await Event.findById(item._id)
          eve.attendees += quantity
          eve.registeredAttendees.push(cartDoc.user)
          await eve.save()
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
      for (items of qrAssigner) {
        const invoice = await generateInvoice(items);
      }
        const newOrder = {
          _id: updateOrder._id,
          created: updateOrder.createdAt,
          user: updateOrder.user !== null ? updateOrder.user : updateOrder.guest,
          cart: cartDoc,
          finalAmount: updateOrder.finalAmount,
          events: updateOrder.events,
          tickets: updateOrder.tickets,
          discountPrice: updateOrder.discountPrice,
          amountBeforeDiscount: updateOrder.amountBeforeDiscount,
          billingEmail: updateOrder.billingEmail,

          paystackReference: payStackReference || "",
          paymentMethod: `paid with ${paymentMethod || ""}`,
          //image: 'https://res.cloudinary.com/dduai6ryd/image/upload/v1736088530/ithoan/images/logo/business_logo.png'
        };
  
        // decrease quantity if the order has been successful
        decreaseQuantity(cartDoc.tickets);
  
        // await mailgun.sendEmail(updateOrder.billingEmail, 'order-confirmation', newOrder);
  
        // send email to admin
        /*if (adminEmail) {
          await mailgun.sendEmail(adminEmail, 'admin-order-confirmation', newOrder);
        }*/
       // send email to organizer if event user role is organizer
       const alertedOrganizer = [];
       /*for (const eventId of cartDoc.events) {
         const organizer = await Event.findOne({ _id: eventId }).populate('user');
         if (organizer.user.role === ROLES.Organizer) {
            if (!alertedOrganizer.includes(organizer.user._id)){
              alertedOrganizer.push(organizer.user._id)
              // send organizer email here as user can select multiple events belonging to different organizers
              // so we want to alert each organizer
            }
         }
       }*/
  
        return res.status(200).json({
          success: true,
          message: `Your order has been placed successfully!`,
          order: { _id: updateOrder._id },
          // paystack_access_code: paystackData.access_code,
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
      };
    }

    // === User Logic ===
    else if (currentUser.role === ROLES.User) {
      if (orderDoc?.payStackId?.length > 0) { paymentDetails = await PaymentHandler(orderDoc?.payStackId); }
      order = {
        ...order,
        paymentStatus: paymentDetails?.data?.status || "",
        paymentDate: paymentDetails?.data?.paid_at || "",
        paymentCurrency: paymentDetails?.data?.currency || "",
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

      order = {
        ...order,
        events: filteredEvents,
        cart: {
          ...orderDoc.cart.toObject(),
          tickets: filteredTickets,
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
    const invoice = req.body.invoice;
    const pdfBuffer = await generateInvoice(invoice, true);

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
            return {
              ...order.toObject(),
              events: relevantEvents,
              cart: {
                ...order.cart.toObject(),
                tickets: relevantTickets,
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
    let orders = await Order.find({'user._id': user._id})
      .populate('events')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        }
      })
      .populate('guest')
      .sort('-createdAt')
      return res.status(200).json({
        status: 200,
        orders
      });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// DELETE /order/id/:id
router.delete('/id/:id', auth, async (req, res) => {
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
      }
    }

    // Delete the order
    await order.deleteOne();  

    return res.status(200).json({ message: 'Order deleted and tickets restocked successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while deleting the order.' });
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


module.exports = router;
