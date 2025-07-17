const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const mailgun = require('../../services/mailgun');
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const Organizer = require('../../models/organizer');
const keys = require('../../config/keys');
const { EMAIL_PROVIDER, JWT_COOKIE, ROLES } = require('../../utils/constants');
const { OAuth2Client } = require('google-auth-library');
const { clientID } = keys.google
const client = new OAuth2Client(clientID);
const { secret, tokenLife } = keys.jwt;


const normalizeCompanyName = (str) => {
  if (!str) return '';
  return str.replace(/\s+/g, '').toLowerCase();
};

/**
 * 
 * @param {*} token 
 * @returns 
 */
const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientID,
  });
  const payload = ticket.getPayload();
  return payload;
};

/**
 * checkIfEmail - check if input passed is an email or user name
 * @param {} input 
 * @returns 
 */
const checkIfEmail = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input) ? true : false
}


router.post('/login', async (req, res) => {
  try {
    let { email, password, rememberMe } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email or username' });
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }
    const isEmail = checkIfEmail(email);
    email = email.trim().toLowerCase();
    let user = null;
    if (isEmail) {
      user = await User.findOne({ email })
    } else {
      user = await User.findOne({ userName: email })
    }

    if (!user) {
      return res
        .status(400)
        .send({ error: isEmail ?
                'No user found for this email address.' :
                'No user found with that username.' });
    }
    if (user?.banned) {
      return res.status(400).json({ error: 'You cannot login at this time' })
    }

    if (user && user.provider !== EMAIL_PROVIDER.Email) {
      return res.status(400).send({
        error: `That email address is already in use using ${user.provider} provider.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Password Incorrect'
      });
    }

    const payload = {
      id: user.id
    };

    const token = jwt.sign(payload, secret, { expiresIn: rememberMe ? '30d' : tokenLife });

    if (!token) {
      throw new Error();
    }

    await mailgun.sendEmail(
      user.email,
      'signin',
      user
    );

    return res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
        banned: user.banned
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    let { email, name, userName, password, isSubscribed } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    if (!name) {
      return res.status(400).json({ error: 'You must enter your name.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }
    if (!userName) {
      return res.status(400).json({ error: 'You must enter your username.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser?.banned) {
      return res.status(400).json({ error: 'You cannot sign up at this time' })
    }
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: 'That username is already in use.' })
    }

    let subscribed = false;
    /*if (isSubscribed) {
      // add user to newsteller as they are subscribed
      const news = new Newsletter({
        email
      })
      await news.save();
      // also add user email to mailgun mailing list
      mailgun.createMember(email, firstName, lastName)
      subscribed = true;
    }*/

    const user = new User({
      email,
      name,
      userName,
      password
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    const registeredUser = await user.save();

    const payload = {
      id: registeredUser.id
    };

    await mailgun.sendEmail(
      registeredUser.email,
      'signup',
      registeredUser
    );

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    return res.status(200).json({
      success: true,
      subscribed,
      token: `Bearer ${token}`,
      user: {
        id: registeredUser.id,
        name: registeredUser.name,
        userName: registeredUser.userName,
        email: registeredUser.email,
        role: registeredUser.role,
        banned: registeredUser.banned
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


router.post('/register/organizer', async (req, res) => {
  try {
    let {
      email, companyName,
      userName, password,
      phoneNumber, isSubscribed
    } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    if (!companyName) {
      return res.status(400).json({ error: 'You must enter your company name.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }
    if (!userName) {
      return res.status(400).json({ error: 'You must enter your username.' });
    }
    if (!phoneNumber) {
      return res.status(400).json({ error: 'You must eneter your phone number' })
    }

    const existingUser = await User.findOne({ email });
    if (existingUser?.banned) {
      return res.status(400).json({ error: 'You cannot sign up at this time' })
    }
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }

    
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: 'That username is already in use.' })
    }
    const normalizedIncoming = normalizeCompanyName(companyName);

    const allOrganizers = await User.find({ companyName: { $ne: null } }, 'companyName');

    const hasSimilarName = allOrganizers.some(org => {
      return normalizeCompanyName(org.companyName) === normalizedIncoming;
    });

    if (hasSimilarName) {
      return res.status(400).json({ error: 'You cannot use that company name' })
    }

    let subscribed = false;
    /*if (isSubscribed) {
      // add user to newsteller as they are subscribed
      const news = new Newsletter({
        email
      })
      await news.save();
      // also add user email to mailgun mailing list
      mailgun.createMember(email, firstName, lastName)
      subscribed = true;
    }*/

    const organizer = new Organizer({
      email,
      companyName,
      phoneNumber
    });
    await organizer.save();

    const user = new User({
      email,
      companyName,
      phoneNumber,
      userName,
      password,
      role: ROLES.Organizer,
      organizer
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    const registeredUser = await user.save();



    const payload = {
      id: registeredUser.id
    };

    await mailgun.sendEmail(
      registeredUser.email,
      'organizer-signup',
      registeredUser
    );

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    return res.status(200).json({
      success: true,
      subscribed,
      token: `Bearer ${token}`,
      user: {
        id: registeredUser.id,
        companyName: registeredUser.name,
        userName: registeredUser.userName,
        email: registeredUser.email,
        role: registeredUser.role,
        banned: registeredUser.banned
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/forgot', async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'You must enter an email address.' });
    }

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser?.banned) {
      return res.status(400).json({ error: 'You cannot make this request' })
    }

    if (!existingUser) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }

    // stops users that didn't register with email provider from resetting password
    if (existingUser && existingUser.provider !== EMAIL_PROVIDER.Email) {
      return res.status(400).send({
        error: `Your email cannot perfrom this action`
      });
    }

    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString('hex');

    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000;

    await existingUser.save();

    await mailgun.sendEmail(
      existingUser.email,
      'reset',
      resetToken,
    );

    return res.status(200).json({
      success: true,
      message: 'Please check your email for the link to reset your password.'
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/reset/:token', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const resetUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!resetUser) {
      return res.status(400).json({
        error:
          'Your token has expired. Please attempt to reset your password again.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    resetUser.password = hash;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    await resetUser.save();

    await mailgun.sendEmail(resetUser.email, 'reset-confirmation', null);

    return res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// change password for logged in user when user goes to profile settings from frontend
router.post('/reset', auth, async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const email = req.user.email;

    if (!email) {
      return res.status(401).send('Unauthenticated');
    }

    if (!password) {
      return res.status(400).json({ error: 'You must enter a password.' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ error: 'That email does not exist' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: 'Please enter your correct old password.' });
    }
    const oldPasswordMatch = await bcrypt.compare(confirmPassword, existingUser.password);
    if (oldPasswordMatch) {
      return res
        .status(400)
        .json({ error: "Your new password can't be the same as your current password. Choose a different one." })
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(confirmPassword, salt);
    existingUser.password = hash;
    await existingUser.save();

    await mailgun.sendEmail(existingUser.email, 'reset-confirmation', null);

    return res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please login with your new password.'
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


// for google sign up
router.post('/register/google', async (req, res) => {
  try {
    const { isSubscribed, credential } = req.body;
    const user = await verifyGoogleToken(credential);

    // check if user email already exist
    const email = user.email.trim().toLowerCase()
    const existingEmail = await User.findOne({ email })
    if (existingEmail.banned) {
      return res.status(400).json({ error: 'You cannot sign up at this time' })
    }    
    if (existingEmail) {
      return res.status(400).json({
        error: 'That email address is already in use.'
      })
    }


    let subscribed = false;
    /*if (isSubscribed) {
      // add user to newsteller as they are subscribed
      const news = new Newsletter({
        email
      })
      await news.save();
      // also add user email to mailgun mailing list
      mailgun.createMember(email, firstName, lastName)
      subscribed = true
    }*/

    const newUser = new User({
      email: email,
      name: user.given_name + user.family_name,
      googleId: user.sub,
      provider: EMAIL_PROVIDER.Google,
    })

    const registeredUser = await newUser.save();

    const payload = {
      id: registeredUser.id
    };

    await mailgun.sendEmail(
      registeredUser.email,
      'signup',
      registeredUser
    );

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    return res.status(200).json({
      success: true,
      subscribed,
      token: `Bearer ${token}`,
      user: {
        id: registeredUser.id,
        name: registeredUser.name,
        userName: registeredUser.userName,
        email: registeredUser.email,
        role: registeredUser.role,
        banned: registeredUser.banned
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error Creating google account"
    })
  }
})


router.post('/google/signin', async (req, res) => {
  try {
    const { credential } = req.body;
    const user = await verifyGoogleToken(credential);

    if (!user.email) {
      return res.status(400).json({ error: 'You must login with an email.' });
    }

    // check if user email already exist
    const email = user.email.trim().toLowerCase()
    const existingEmail = await User.findOne({ email })
    if (existingEmail.banned) {
      return res.status(400).json({ error: 'You cannot sign in at this time' })
    }
    if (!existingEmail) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }



    if (existingEmail && existingEmail.provider !== EMAIL_PROVIDER.Google) {
      return res.status(400).send({
        error: `This email is already registered with a password`
      });
    }

    const payload = {
      id: existingEmail.id
    };

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    if (!token) {
      throw new Error();
    }

    await mailgun.sendEmail(
      existingEmail.email,
      'signin',
      existingEmail
    );

    return res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
        banned: user.banned
      }
    });
  } catch (eror) {
    return res.status(400).json({
      error: "Error logging ing with google account"
    })
  }
});

module.exports = router;
