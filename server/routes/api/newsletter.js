const express = require('express');
const router = express.Router();
const multer = require('multer');
const keys = require('../../config/keys.js');
const crypto = require('crypto');
const path = require("path");
const mailgun = require('../../services/mailgun.js');
const Newsletter = require('../../models/newsletter.js');
const Campaign = require('../../models/campaign.js');
const User = require('../../models/user.js');
const Guest = require('../../models/guest.js');
const Event = require('../../models/event.js');
const Organizer = require('../../models/organizer');

const role = require('../../middleware/role.js');
const auth = require('../../middleware/auth.js');
const { ROLES } = require('../../utils/constants');
const { deleteFilesFromPath } = require("../../utils/deleteFiles");

const { news } = keys.mailgun;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads/newsletter");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const removeImagesFromCampaign = (campaign, removeImageUrls) => {
  if (!campaign || !Array.isArray(campaign.imageUrls)) return campaign;

  const normalizedPaths = removeImageUrls.map(url => {
    const parts = url.split('/api/');
    return '/' + parts[1] || url;
  });

  campaign.imageUrls = campaign.imageUrls.filter(imagePath => {
    return !normalizedPaths.includes(imagePath.replace(/\\/g, '/'));
  });

  return campaign;
}

const createMemberToMailingList = async (email, organizer=false) => {
  if (!email && organizer) {
    await mailgun.createMembers(organizer.hostName, organizer.sendTo );
  } else {
    const sm = email.split('@')[0];
    let name = sm.charAt(0).toUpperCase() + sm.slice(1)
    name = name.replace(/[^a-zA-z]/g, '')
    await mailgun.createMember(email, name, '');
  }
  return;
}

router.post('/unsubscribe/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email.' });
    }

    const findUser = await Newsletter.findOne({ email });

    if (!findUser) {
      return res.status(400).json({
        error:
          'No email address found for user!'
      });
    }
    if (!findUser.subscribed) {
      return res.status(400).json({
        error: "Not subscribed"
      })
    }
    const update = {
      $set: {
        subscribed: false,
      }
    }
    await Newsletter.findOneAndUpdate({ email }, update);
    const mailgunUpdate = await mailgun.updateMember(email, { subscribed: false });

    return mailgunUpdate && res.status(200).json({
      success: true,
      message:
        'Your changes are updated and you will no longer receive marketing emails from us'
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


router.get('/mailing_list_details',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      // const opendEmailDetails = await mailgun.getAnalyticsData();
      const mailingListDetails = await mailgun.getMailingListMembersCount();
      // const mailingListSubscribers = await mailgun.getMailingListDetails();
      const mailingListSubscribers = await Newsletter.find({ subscribed: true }).countDocuments();
      //let opened = 0;
      /*if (opendEmailDetails && opendEmailDetails.totalOpens) {
        opened = opendEmailDetails.totalOpens
      }*/
      return res.status(200).json({
        success: true,
        data: {
          members: mailingListDetails,
          subscribed: mailingListSubscribers,
        }
      })
    } catch (error) {
      return res.status(400).json({
        error: 'Error fetching mailing list details Please try again.'
      });
    }
})


router.post('/subscribe', async (req, res) => {
  try {
    let email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    email = email.trim().toLowerCase();

    // Check if email is valid
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = regex.test(email);
    if (!validEmail) {
      return res.status(400).json({ error: 'Use a valid email next time' });
    }

    // Check if email already exists and user is subscribed
    const existingEmail = await Newsletter.findOne({ email });
    if (existingEmail && existingEmail.subscribed) {
      return res
        .status(400)
        .json({ error: 'You have already subscribed to the newsletter' });
    } else if (existingEmail && !existingEmail.subscribed) {
      await Newsletter.findOneAndUpdate({email}, { $set: { subscribed: true } });
      const mailgunUpdate = await mailgun.updateMember(email, { subscribed: true });

      return mailgunUpdate && res
        .status(200)
        .json({
          success: true,
          message: 'You have successfully subscribed to the newsletter',
        })
    }

    // Save the new email to the database
    const news = new Newsletter({
      email: email,
    });
    await news.save();
    await createMemberToMailingList(email);

    // Add user email to Mailgun mailing list
    const sm = email.split('@')[0];
    let name = sm.charAt(0).toUpperCase() + sm.slice(1)
    name = name.replace(/[^a-zA-z]/g, '')
    await mailgun.createMember(email, name);

    // Send subscription confirmation email
    await mailgun.sendEmail(email, 'newsletter-subscription', null);

    return res.status(200).json({
      success: true,
      message: 'You have successfully subscribed to the newsletter',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'An error occurred while processing your subscription. Please try again later.',
    });
  }
});

// return all created campaign messages
router.get('/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const user = req.user;
      let campaigns = [];

      if (user.role === ROLES.Admin) {
        const adminUsers = await User.find({ role: ROLES.Admin }).select('_id');
        const adminUserIds = adminUsers.map(u => u._id);

        campaigns = await Campaign.find({ user: { $in: adminUserIds } })
          .populate('event')
          .sort('-createdAt');
      } else if (user.role === ROLES.Organizer) {
        campaigns = await Campaign.find({ user: user._id })
          .populate('event')
          .sort('-createdAt');
      }

      return res.status(200).json({
        success: true,
        campaigns
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Error fetching campaigns. Please try again.'
      });
    }
  }
);



// return a campaign message
router.get(
  '/:campaignId',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
  try {
    const id = req.params.campaignId
    const campaign = await Campaign.findById(id)
      .populate('user');
    return res.status(200).json({
      success: true,
      campaign
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Error fetching campaign Please try again.'
    });
  }
});


// deletes a campaign
router.delete('/delete/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, user: req.user._id });
    deleteFilesFromPath(campaign.imageUrls)
    await campaign.deleteOne();

    return res.status(200).json({
      success: true,
      message: `Campaign has been deleted successfully!`,
      campaign
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Error deleting campaign Please try again.'
    });
  }
})


// sends campaign
router.post('/send',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {

  try {
    const {
      campaignId,
      newsletterSelected,
      registeredAttendees,
      unregisteredAttendees,
      eventId = null,
    } = req.body;
    const camp = await Campaign.findById(campaignId);
    if (!camp) {
      return res.status(400).json({ error: 'Campaign not found' })
    }

    if (eventId) { // here we're sending a reminder to attendees of an event
      // get registeredAttendees or unregisteredAttendees
      const event = await Event.findById(eventId).populate('user');
      const hostName = event?.user?.organizer ? event?.user?.companyName : event?.user?.name
      const eventRegisteredAtt_ = event.registeredAttendees;
      const eventUnregisteredAtt_ = event.unregisteredAttendees;
      const attendees = [];
      if (registeredAttendees) {
        for (let userId of eventRegisteredAtt_) {
          if (!attendees.includes(userId.toString())) {
            attendees.push(userId.toString())
          }
        }
      } 
      if (unregisteredAttendees) {
        for (let guestId of eventUnregisteredAtt_) {
          if (!attendees.includes(guestId.toString())) {
            attendees.push(guestId.toString());
          }
        }
      }

      // find emails of each attendess from attendees
      const emailAttenddes = [];
      const sendTo = [];
      for (const id of attendees) {
        const guest = await Guest.findById(id)
        const user = await User.findById(id).populate('organizer');
        if (guest) {
          if (!emailAttenddes.includes(guest.email)) { // sort emails so duplicates don't exist
            emailAttenddes.push(guest.email)
            sendTo.push({
              email: guest.email,
              name: guest.name
            })
          }
        } else if (user) {
          if (!emailAttenddes.includes(user.email)) {
            emailAttenddes.push(user.email)
            sendTo.push({
              email: user.email,
              name: user?.organizer? user?.organizer?.companyName : user.name
            })
          }
        }
      }
      const getML = await mailgun.getMailingList(hostName)
      if (getML) {
        await mailgun.destroyMailingList(hostName);
      }
      // create mailing list
      await mailgun.createMailingList(hostName);
      // create member to mailing list
      await createMemberToMailingList(false, {
        hostName,
        sendTo
      });
      // here after creating mailing list, we'll send the campaign email
      // admin sender will always be newsletter@thelinkhangout.com, an overide
      // to trimmedAddress@thelinkhangout.com is in mailgun
      const trimmedAddress = hostName.trim().replace(/\s/g, '').toLowerCase();
      if (req.user.role === ROLES.Admin) {
        await mailgun.sendEmail(`${trimmedAddress}@thelinkhangout.com`, 'newsletter', camp, null);
      } else {
        await mailgun.sendEmail(`${trimmedAddress}@thelinkhangout.com`, 'org-newsletter', camp, null, hostName);
      }
      await Campaign.findOneAndUpdate(
        { _id: camp._id },
        { sent: true,
          sentDate: new Date(),
          timeSent: camp.timeSent + 1,
          sentTo: sendTo.length
        }
      )
      return res.status(200).json({
        success: true,
        message: `sent!!`,
      });
    }

    if (newsletterSelected) {
      const newsletterCount = await Newsletter.countDocuments();
      if (req.user.role === ROLES.Admin) {
        await mailgun.sendEmail(news, 'newsletter', camp);
      }

      await Campaign.findOneAndUpdate(
          { _id: camp._id },
          { sent: true,
            sentDate: new Date(),
            sentTo: newsletterCount
          }
        )
        return res.status(200).json({
          success: true,
          message: `sent!!`,
        });
    }
  } catch (error) {
    return res.status(400).json({
      error: 'Error sending campaign Please try again.'
    })
  }
})


// create and store a caomapign message to db
router.post('/create',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  upload.array('images', 6),
  async (req, res) => {
    try {
      let {
        title, content,
        eventId, shouldEmailContainUserName = false,
        linkName, linkUrl
      } = req.body;
      eventId = eventId === 'null' ? null : eventId
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: 'You must enter title & content.' });
      }
      const files = req.files;
      const imageUrls = files.map((file) => `/uploads/newsletter/${file.filename}`);
      const organizer = await Organizer.findById(req.user.organizer);
      const user = await User.findById(req.user._id);
      const event = await Event.findById(eventId)

      const newCampaign = new Campaign({
        title,
        content,
        imageUrls,
        user: user?._id,
        event: event?._id || null,
        organizer: organizer?._id,
        shouldEmailContainUserName,
        linkName: linkName || null,
        linkUrl: linkUrl || null
      });

      const savedCampaign = await newCampaign.save();

      return res.status(200).json({
        success: true,
        message: 'Campaign has been created successfully!, You can preview and send it',
        campaign: savedCampaign
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Error creating campaign Please try again.'
      });
    }
});

module.exports = router;