// Importing the User and Thought models
const { User, Thought } = require('../models');

// Controller object for managing user-related operations
const userController = {

  // Get all users
  async getUsers(req, res) {
    try {
      // Fetch all users from the database and exclude the '__v' field
      const dbUserData = await User.find().select('-__v');
      res.json(dbUserData); // Send the fetched users as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Get a single user by ID
  async getSingleUser(req, res) {
    try {
      // Find a single user by its ID, populate its 'friends' and 'thoughts' fields, and exclude the '__v' field
      const dbUserData = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this ID!' }); // If user not found, send a 404 response
      }

      res.json(dbUserData); // Send the fetched user as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      // Create a new user using the request body
      const dbUserData = await User.create(req.body);
      res.json(dbUserData); // Send the created user as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      // Find and update a user by its ID using the request body, and return the updated user
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this ID!' }); // If user not found, send a 404 response
      }

      res.json(dbUserData); // Send the updated user as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
    try {
      // Add a friend to a user by its ID, and return the updated user
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this ID!' }); // If user not found, send a 404 response
      }

      res.json(dbUserData); // Send the updated user as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Remove a friend from a user
  async removeFriend(req, res) {
    try {
      // Remove a friend from a user by its ID, and return the updated user
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this ID!' }); // If user not found, send a 404 response
      }

      res.json(dbUserData); // Send the updated user as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },
};

module.exports = userController; // Export the userController object
