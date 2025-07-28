const router = require('express').Router();
const apiRoutes = require('./api');
const keys = require('../config/keys');
const { apiURL } = keys.app;

const Event = require('../models/event');
const Gallery = require('../models/gallery');
const Product = require('../models/product');

const api = `/${apiURL}`;

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
    <script>window.location.href = "${url}"</script>
  </body>
  </html>
`;

router.get('/event/:slug', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) return res.status(404).send('Event not found');

  res.set('Content-Type', 'text/html');
  res.send(renderMetaPage({
    title: event.name,
    description: truncateDescription(event.description),
    image: `https://thelinkhangout.com/api${event.compactImage}` || '',
    url: `https://thelinkhangout.com/event/${event.slug}`
  }));
});

router.get('/gallery/:slug', async (req, res) => {
  const gallery = await Gallery.findOne({ slug: req.params.slug });
  if (!gallery) return res.status(404).send('Gallery not found');

  res.set('Content-Type', 'text/html');
  res.send(renderMetaPage({
    title: gallery.name || 'Gallery',
    description: truncateDescription(gallery.description),
    image: `https://thelinkhangout.com/api${gallery.compactImage}` || '',
    url: `https://thelinkhangout.com/gallery/${gallery.slug}`
  }));
});

router.get('/product/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).send('Product not found');

  res.set('Content-Type', 'text/html');
  res.send(renderMetaPage({
    title: product.name,
    description: truncateDescription(product.description),
    image: `https://thelinkhangout.com/api${product.compactImage}`|| '',
    url: `https://thelinkhangout.com/product/${product.slug}`
  }));
});

router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;
