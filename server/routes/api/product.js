const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require("path");
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Product = require('../../models/product');
const { deleteFilesFromPath } = require("../../utils/deleteFiles");
const mongoose = require('mongoose');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/file_manager/uploads/products");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// GET /product/store - Get all products for store (public)
router.get('/store', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort('-createdAt');
    
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// GET /product/item/:slug - Get single product by slug (public)
router.get('/item/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug, isActive: true });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// GET /product - Get all products (Admin only)
router.get(
  '/',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const products = await Product.find().sort('-createdAt');
      return res.status(200).json({ products });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /product/:id - Get single product (Admin only)
router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ error: 'Product not found.' });
      }

      return res.status(200).json({ product });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// POST /product/add - Add new product (Admin only)
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.array('images', 50),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        discountPrice = 0,
        quantity,
        sku,
        isActive = true,
        sizeQuantity,
        colorAndImage
      } = req.body;

      const files = req.files;

      if (!name || !description || !price || !quantity) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'At least one image file is required.' });
      }

      const normalizedName = name.trim().toLowerCase();

      const existingProduct = await Product.findOne({
        name: { $regex: `^${normalizedName}$`, $options: 'i' }
      });
      if (existingProduct) {
        files.forEach(file => {
          deleteFilesFromPath([`/uploads/products/${file.filename}`]);
        });
        return res.status(400).json({ error: 'A product with this name already exists.' });
      }

      const imageUrls = files.map((file) => `/uploads/products/${file.filename}`);
      const parsedColorAndImage = colorAndImage ? JSON.parse(colorAndImage) : [];
      const updatedColorAndImage = [];
      for (const entry of parsedColorAndImage) {
        const color = entry.color;
        const findFileName = entry?.findFileName;

        if (findFileName) {
          let matchedFiles = []
          for (const image of findFileName.image) {
            const found = files.filter((file) =>
              file.originalname.toLowerCase().includes(image.toLowerCase())
            );
            if (found && found.length > 0) {
              matchedFiles.push(found[0])
            }
          }
          if (matchedFiles.length > 0) {
            const imageUrls = matchedFiles.map((file) => `/uploads/products/${file.filename}`);
            updatedColorAndImage.push({
              _id: new mongoose.Types.ObjectId(),
              color,
              imageUrl: imageUrls
            });
          }
        }
      };

      const product = new Product({
        name,
        description,
        price,
        discountPrice,
        quantity,
        sku: sku || `PRD-${Date.now()}`,
        imageUrls,
        isActive: isActive !== undefined ? isActive : true,
        SizeQuantity: sizeQuantity ? JSON.parse(sizeQuantity) : [],
        colorAndImage: updatedColorAndImage.length > 0 ? updatedColorAndImage : []
      });

      await product.save();

      return res.status(200).json({
        success: true,
        message: 'Product has been added successfully!',
        product
      });
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  upload.array('images', 50),
  async (req, res) => {
    try {
      const productId = req.params.id;
      let {
        name,
        description,
        price,
        discountPrice,
        quantity,
        sku,
        isActive,
        removeImage,
        sizeQuantity,
        colorAndImage,
        colorAndImageToRemove
      } = req.body;
      colorAndImageToRemove = colorAndImageToRemove ? JSON.parse(colorAndImageToRemove) : []

      if (!Array.isArray(removeImage)) removeImage = removeImage ? [removeImage] : [];

      if (!Array.isArray(colorAndImageToRemove)) {
        colorAndImageToRemove = colorAndImageToRemove ? [colorAndImageToRemove] : [];
      }
      const files = req.files || [];

      const product = await Product.findById(productId);
      if (!product) return res.status(400).json({ error: 'Product not found.' });

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.quantity = quantity || product.quantity;
      product.sku = sku || product.sku;
      product.isActive = isActive !== undefined ? isActive : product.isActive;

      if (sizeQuantity) product.SizeQuantity = JSON.parse(sizeQuantity);

      const parsedColorAndImage = colorAndImage ? JSON.parse(colorAndImage) : [];

      const updatedColorAndImage = [];

      for (const entry of parsedColorAndImage) {
        const color = entry.color;
        const findFileName = entry?.findFileName;

        if (findFileName) {
          let matchedFiles = []
          for (const image of findFileName.image) {
            const found = files.filter((file) =>
              file.originalname.toLowerCase().includes(image.toLowerCase())
            );
            if (found && found.length > 0) {
              matchedFiles.push(found[0])
            }
          }
          if (matchedFiles.length > 0) {
            const imageUrls = matchedFiles.map((file) => `/uploads/products/${file.filename}`);
            updatedColorAndImage.push({
              _id: new mongoose.Types.ObjectId(),
              color,
              imageUrl: imageUrls
            });
          }
        }
      };
      if (updatedColorAndImage.length > 0) {
        for (const i of updatedColorAndImage) {
          if (i) {
            product.colorAndImage.push(i);
          }
        }
      } else {
        const normalizedPaths = [];
        // remove images in product.colorAndImage that are not in parsedColorAndImage
        if (colorAndImageToRemove.length > 0) {
          for (const item of colorAndImageToRemove) {
            for (const url of item.imageUrl) {
              normalizedPaths.push(url)
            }
          }
        }
        deleteFilesFromPath(normalizedPaths);
        product.colorAndImage = parsedColorAndImage
      }

      if (removeImage.length > 0) {
        const normalizedPaths = removeImage.map(url => {
          const parts = url.split('/api/');
          return '/' + parts[1] || url;
        });

        product.imageUrls = product.imageUrls.filter(imagePath => {
          return !normalizedPaths.includes(imagePath.replace(/\\/g, '/'));
        });

        deleteFilesFromPath(normalizedPaths);
      }

      await product.save();

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        product
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


// DELETE /product/:id - Delete product (Admin only)
router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      // Delete associated images
      if (product.imageUrls && product.imageUrls.length > 0) {
        deleteFilesFromPath(product.imageUrls);
      }

      // delete associated colour images
      if (product.colorAndImage.length > 0) {
        let normalizedPaths = [];
        for (const item of product.colorAndImage) {
          for (const url of item.imageUrl) {
            // check if any url in normalizedPaths is not in product.imageUrls
            if (!product.imageUrls.includes(url)) {
              normalizedPaths.push(url)
            }
          }
        }
        deleteFilesFromPath(normalizedPaths);
      }

      await product.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully!'
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;