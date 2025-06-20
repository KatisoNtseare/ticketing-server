import Ticket from '../models/Ticket.js';

// @desc    Create a new ticket (user)
// @route   POST /api/tickets
// @access  Private (user)
export const createTicket = async (req, res) => {
    const { title, description, priority } = req.body;

    if (!title || !description) {
    return res.status(400).json({ message: 'Please provide title and description' });
    }

    try {
    const ticket = await Ticket.create({
        title,
        description,
        priority: priority || 'Low',
      createdBy: req.user._id,  // From auth middleware
    });

    res.status(201).json(ticket);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating ticket' });
    }
};

// @desc    Get all tickets for logged in user
// @route   GET /api/tickets
// @access  Private (user/admin)
export const getMyTickets = async (req, res) => {
    try {
    let tickets;

    if (req.user.role === 'admin') {
      // Admin can see all tickets
        tickets = await Ticket.find().populate('createdBy', 'name email role');
    } else {
      // User only sees their own tickets
        tickets = await Ticket.find({ createdBy: req.user._id });
    }

    res.json(tickets);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tickets' });
    }
};

// @desc    Update a ticket (admin only)
// @route   PUT /api/tickets/:id
// @access  Private (admin)
export const updateTicket = async (req, res) => {
    const { id } = req.params;
    const { priority, status, assignedTo } = req.body;

    try {
    const ticket = await Ticket.findById(id);

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Update allowed fields
    if (priority) ticket.priority = priority;
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    const updatedTicket = await ticket.save();

    res.json(updatedTicket);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating ticket' });
    }
};
