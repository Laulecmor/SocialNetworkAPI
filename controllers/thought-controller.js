// Importing the Thought and User models
const { Thought, User } = require('../models');

// Controller object for managing thought-related operations
const thoughtController = {

  // Get all thoughts
  async getThoughts(req, res) {
    try {
      // Fetch all thoughts from the database, sorted by createdAt date in descending order
      const dbThoughtData = await Thought.find().sort({ createdAt: -1 });
      res.json(dbThoughtData); // Send the fetched thoughts as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Get a single thought by ID
  async getSingleThought(req, res) {
    try {
      // Find a single thought by its ID
      const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId });
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this ID!' }); // If thought not found, send a 404 response
      }
      res.json(dbThoughtData); // Send the fetched thought as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      // Create a new thought using the request body
      const dbThoughtData = await Thought.create(req.body);
      
      // Update the user's thoughts array with the ID of the newly created thought
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user with this ID!' }); // If user not found, send a 404 response
      }

      res.json({ message: 'Thought created!' }); // Send a success message as response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Update a thought by ID
  async updateThought(req, res) {
    try {
      // Find and update a thought by its ID using the request body
      const dbThoughtData = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
      
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this ID!' }); // If thought not found, send a 404 response
      }

      res.json(dbThoughtData); // Send the updated thought as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Delete a thought by ID
  async deleteThought(req, res) {
    try {
      // Find and remove a thought by its ID
      const dbThoughtData = await Thought.findOneAndRemove({ _id: req.params.thoughtId })

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this ID!' }); // If thought not found, send a 404 response
      }

      // Remove the thought ID from the user's thoughts array
      const dbUserData = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user with this ID!' }); // If user not found, send a 404 response
      }

      res.json({ message: 'Thought deleted!' }); // Send a success message as response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Add a reaction to a thought
  async addReaction(req, res) {
    try {
      // Add a reaction to a thought by its ID
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this ID!' }); // If thought not found, send a 404 response
      }

      res.json(dbThoughtData); // Send the updated thought as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },

  // Remove a reaction from a thought
  async removeReaction(req, res) {
    try {
      // Remove a reaction from a thought by its ID and the reaction ID
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this ID!' }); // If thought not found, send a 404 response
      }

      res.json(dbThoughtData); // Send the updated thought as a response
    } catch (err) {
      console.log(err); // Log any errors that occur
      res.status(500).json(err); // Send a 500 (Internal Server Error) response with the error information
    }
  },
};

module.exports = thoughtController; // Export the thoughtController object
