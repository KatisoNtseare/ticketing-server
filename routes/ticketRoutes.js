import express from 'express';
import {
  createTicket,
  getMyTickets,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/', protect, getMyTickets);
router.put('/:id', protect, adminOnly, updateTicket);
router.delete('/:id', protect, deleteTicket);

export default router;
