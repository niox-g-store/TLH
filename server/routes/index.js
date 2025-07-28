const router = require('express').Router();
const apiRoutes = require('./api');
const keys = require('../config/keys');
const { apiURL } = keys.app;

const Event = require('../models/event');
const Gallery = require('../models/gallery');
const Product = require('../models/product');

const api = `/${apiURL}`;

const isBot = (userAgent = '') => {
  // const botPattern = /bot|crawl|slurp|spider|facebook|twitter|discord|preview|whatsapp/i;
  const botPattern = /Twitterbot|facebookexternalhit|Facebot|LinkedInBot|Slackbot|Pinterest|vkShare|W3C_Validator/i;
  return botPattern.test(userAgent);
};

const truncateDescription = (text = '', maxWords = 20) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const renderMetaPage = ({ title, description, image, url }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description || ''}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description || ''}" />
      <meta name="twitter:image" content="${image}" />
    </head>
    <body>
      <p>Preview for ${title}</p>
    </body>
  </html>
`;


router.get('/event/:slug', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) return res.status(404).send('Event not found');

  const userAgent = req.headers['user-agent'] || '';
  const url = `https://thelinkhangout.com/event/${event.slug}`;

  if (isBot(userAgent)) {
    res.set('Content-Type', 'text/html');
    return res.send(renderMetaPage({
      title: event.name,
      description: truncateDescription(event.description),
      image: `https://thelinkhangout.com/api${event.compactImage}` || '',
      url,
    }));
  }

  return res.sendFile(path.join(__dirname, '../dist/index.html'));
});

router.get('/gallery/:slug', async (req, res) => {
  const gallery = await Gallery.findOne({ slug: req.params.slug });
  if (!gallery) return res.status(404).send('Gallery not found');

  const userAgent = req.headers['user-agent'] || '';
  const url = `https://thelinkhangout.com/gallery/${gallery.slug}`;

  if (isBot(userAgent)) {
    res.set('Content-Type', 'text/html');
    return res.send(renderMetaPage({
      title: gallery.name || 'Gallery',
      description: truncateDescription(gallery.description),
      image: `https://thelinkhangout.com/api${gallery.compactImage}` || '',
      url,
    }));
  }

  return res.sendFile(path.join(__dirname, '../dist/index.html'));
});

router.get('/product/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).send('Product not found');

  const userAgent = req.headers['user-agent'] || '';
  const url = `https://thelinkhangout.com/product/${product.slug}`;

  if (isBot(userAgent)) {
    res.set('Content-Type', 'text/html');
    return res.send(renderMetaPage({
      title: product.name,
      description: truncateDescription(product.description),
      image: `https://thelinkhangout.com/api${product.compactImage}` || '',
      url,
    }));
  }

  return res.sendFile(path.join(__dirname, '../dist/index.html'));
});

router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;
