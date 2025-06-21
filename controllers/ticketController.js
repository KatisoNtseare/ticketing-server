import Ticket from '../models/Ticket.js';

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
      createdBy: req.user._id,
    });

    console.log(`Ticket created by user ${req.user.email}: ${title}`);

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error.message);
    res.status(500).json({ message: 'Server error creating ticket' });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === 'admin') {
      tickets = await Ticket.find().populate('createdBy', 'name email role');
      console.log(`Admin ${req.user.email} fetched all tickets`);
    } else {
      tickets = await Ticket.find({ createdBy: req.user._id });
      console.log(`User ${req.user.email} fetched own tickets`);
    }

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error.message);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, priority, assignedTo } = req.body;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      console.log(`Ticket update failed – not found: ${id}`);
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only admins allowed to update
    if (req.user.role !== 'admin') {
      console.log(`Unauthorized ticket update by ${req.user.email}`);
      return res.status(403).json({ message: 'Admin access required' });
    }


    if ('createdBy' in req.body) {
      console.log(`Blocked attempt to modify createdBy on ticket ${id}`);
      return res.status(400).json({ message: "Cannot modify 'createdBy' field." });
    }


    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;

    const updated = await ticket.save();

    console.log(`Ticket ${id} updated successfully by ${req.user.email}`);
    res.json(updated);
  } catch (error) {
    console.error('Error updating ticket:', error.message);
    res.status(500).json({ message: 'Server error updating ticket' });
  }
};



export const deleteTicket = async (req, res) => {
  const { id } = req.params;
  console.log(`Request to delete ticket with id: ${id} by user ${req.user._id}`);

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      console.log('Ticket not found');
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.createdBy.toString() !== req.user._id.toString()) {
      console.log('User not authorized to delete this ticket');
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }

    // Instead of ticket.remove(), do:
    await Ticket.findByIdAndDelete(id);
    console.log('Ticket deleted successfully');

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error.message);
    res.status(500).json({ message: 'Server error deleting ticket' });
  }
};
