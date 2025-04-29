import express from 'express';
const router = express.Router();

// Buyer routes will be implemented here
router.get('/', (req, res) => {
  res.json({ message: 'Buyer routes working' });
});

export default router; 