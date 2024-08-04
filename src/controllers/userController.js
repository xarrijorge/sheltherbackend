import { User } from '../models/User.js'

export const getUser = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const email = req.user.email;
        const updateData = req.body;

        const allowedUpdates = ['name', 'photo', 'address', 'contacts', 'places', 'locations'];
        const sanitizedData = Object.keys(updateData)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Handle array fields
        ['contacts', 'places', 'locations'].forEach(field => {
            if (Array.isArray(sanitizedData[field])) {
                // Replace the entire array
                user[field] = sanitizedData[field];
                delete sanitizedData[field];
            }
        });

        // Update other fields
        Object.assign(user, sanitizedData);

        await user.save();

        const updatedUser = await User.findOne({ email }).select('-password');

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};