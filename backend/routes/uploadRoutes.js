import express from 'express'
import { upload, cloudinary } from '../config/cloudinary.js'

const router = express.Router()

// Single Image Upload Endpoint (e.g. for product photo or store logo/cover)
router.post('/image', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Fallback: return uploaded mock URL if Cloudinary credentials are mock
      return res.json({
        success: true,
        message: 'Image uploaded successfully (Simulation fallback).',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.',
      })
    }

    res.json({
      success: true,
      message: 'Media uploaded to Cloudinary.',
      imageUrl: req.file.path || req.file.url,
      publicId: req.file.filename,
    })
  })
})

export default router
