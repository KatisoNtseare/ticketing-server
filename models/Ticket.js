// This model defines the structure of a support ticket in MongoDB
// Each ticket belongs to one user (createdBy), and may optionally be assigned to an admin (assignedTo)

import mongoose from 'mongoose';


const ticketSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
    trim: true, 
    },


    description: {
    type: String,
    required: true,
    },


    priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], 
    default: 'Low',
    },


    status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
    },


    createdBy: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
    ref: 'User',                          // References the User model
    required: true,                       // Cannot be null
    },

    // assignedTo: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',                          // Also references the User model
    // default: null,                        // Not assigned by default
    // }
},
{
    timestamps: true,
});


const Ticket = mongoose.model('Ticket', ticketSchema);


export default Ticket;
