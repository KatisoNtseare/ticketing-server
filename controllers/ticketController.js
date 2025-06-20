import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !description) return res.status(400).json({ message: 'Title and description required' });

  try {
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id,
    });

    console.log('[createTicket] Ticket created:', ticket._id);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error.message);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = req.user.role === 'admin'
      ? await Ticket.find().populate('createdBy', 'name email role')
      : await Ticket.find({ createdBy: req.user._id });

    res.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error.message);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const { status, priority, assignedTo } = req.body;
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;

    const updated = await ticket.save();
    console.log('[updateTicket] Updated:', ticket._id);
    res.json(updated);
  } catch (error) {
    console.error('Update ticket error:', error.message);
    res.status(500).json({ message: 'Failed to update ticket' });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this ticket' });
    }

    await ticket.deleteOne();
    console.log('[deleteTicket] Deleted:', ticket._id);
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    console.error('Delete ticket error:', error.message);
    res.status(500).json({ message: 'Failed to delete ticket' });
  }
};
