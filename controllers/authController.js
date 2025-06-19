// Handles user authentication logic:
// Registration hash the password, save user
// Login which verify password, return JWT token with role info

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//User Regeristration // usuing the post request
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`Registration failed for "${email}" - User already exists.`);
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists. Try logging in.',
                email
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        console.log(`New user registered:
            Name: ${name}
            Email: ${email}
            Role: ${user.role}`);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(`Error during registration for "${email}":`, error.message);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred during registration.'
        });
    }
};

//Login the user and return JWT token

export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`Login failed - No user found with email "${email}"`);
            return res.status(400).json({
                success: false,
                message: 'No account found with that email address.',
                email
            });
        }

        if (role !== user.role) {
            console.log(`Login failed - Role mismatch for "${email}". Tried: "${role}", Actual: "${user.role}"`);
            return res.status(400).json({
                success: false,
                message: `Role mismatch. This account is registered as a "${user.role}".`,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed - Incorrect password for "${email}"`);
            return res.status(400).json({
                success: false,
                message: 'Incorrect password. Please try again.',
            });
        }

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`Login successful:
            Email: ${email}
            Role: ${user.role}
            Token expires in: 1 hour`
        );

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error(`Error during login for "${email}":`, error.message);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred during login.'
        });
    }
};
