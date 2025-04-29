import express from 'express';
const router = express.Router();

// Logistics routes will be implemented here
router.get('/', (req, res) => {
  res.json({ message: 'Logistics routes working' });
});

export default router; 