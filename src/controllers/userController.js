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

export const addContact = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const newContact = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate new contact data
        if (!newContact.name && !newContact.phone) {
            return res.status(400).json({ error: 'Missing required contact information' });
        }

        // Add the new contact
        user.contacts.push(newContact);

        // Save the user to get the new contact's _id
        await user.save();

        // Get the newly added contact
        const addedContact = user.contacts[user.contacts.length - 1];

        // Send notification
        // await sendContactNotification(user.email, addedContact);

        res.status(201).json({ message: 'Contact added successfully', contact: addedContact });
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'An error occurred while adding the contact' });
    }
};

export const addPlace = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const newPlace = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate new contact data
        if (!newPlace.latitude && !newPlace.longitude) {
            return res.status(400).json({ error: 'Missing required place information' });
        }

        // Add the new contact
        user.places.push(newPlace);

        // Save the user to get the new contact's _id
        await user.save();

        res.status(201).json({ message: 'Place added successfully', place: newPlace });
    } catch (error) {
        console.error('Error adding place:', error);
        res.status(500).json({ error: 'An error occurred while adding the place' });
    }
};

export const addLocation = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const newLocation = req.body;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate new contact data
        if (!newLocation.latitude && !newLocation.longitude) {
            return res.status(400).json({ error: 'Missing required location information' });
        }

        // Add the new contact
        user.locations.push(newLocation);

        // Save the user to get the new contact's _id
        await user.save();

        res.status(201).json({ message: 'Location added successfully', location: newLocation });
    } catch (error) {
        console.error('Error adding location:', error);
        res.status(500).json({ error: 'An error occurred while adding the location' });
    }
};

// remove contact by index
export const removeContact = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const contactIndex = req.params.index;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.contacts.splice(contactIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Contact removed successfully' });
    } catch (error) {
        console.error('Error removing contact:', error);
        res.status(500).json({ error: 'An error occurred while removing the contact' });
    }
}
