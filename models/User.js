import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,  // Hashed password
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Role can only be user or admin
        default: 'user',
    },
}, {
    timestamps: true,
});


const User = mongoose.model('User', userSchema);
export default User;