import express from 'express';
import {
    createTicket,
    getMyTickets,
    updateTicket,
} from '../controllers/ticketController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a ticket (user)
router.post('/', protect, createTicket);

// Get tickets (user or admin)
router.get('/', protect, getMyTickets);

// Update ticket (admin only)
router.put('/:id', protect, adminOnly, updateTicket);

export default router;
