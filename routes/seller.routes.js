import express from 'express';
const router = express.Router();

// Seller routes will be implemented here
router.get('/', (req, res) => {
  res.json({ message: 'Seller routes working' });
});

export default router; 