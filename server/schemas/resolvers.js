const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth');

// Replaces API Controllers

const resolvers = {
  Query: {
    // Used to test on Apollo Server
    users: async () => {
      return User.find({});
    },

    // Fetches data based on user._id that was unpacked from token in header
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    // Login user, sign a token, and send back to client with both user information and token
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },

    // Create user, sign a token, and send back to client with both user information and token
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Updates user document to include book that the user wants to save
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: {...args}
            }
          },
          {
            new: true,
            runValidators: true
          }
        );
        return user
      }
      throw AuthenticationError;
    },

    // Updates user document to include book that the user wants to remove
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: {
                bookId: bookId
              }
            }
          },
          { new: true }
        );
        return user
      }
      throw AuthenticationError;
    }
  }
}

module.exports = resolvers