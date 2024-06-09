// Import required modules
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 3001;
const { ApolloServer } = require('@apollo/server');
const { typeDefs, resolvers } = require('./schemas');
const { expressMiddleware } = require('@apollo/server/express4')

// Initialize Apollo Server with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const startApolloServer = async () => {
  await server.start(); // Start the Apollo Server

  // Middleware to parse URL-encoded and JSON request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply Apollo GraphQL middleware with authentication context
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve static files in production environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Serve the React app for any unspecified routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the Express server once the database connection is open
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

// Call the function to start the Apollo Server and Express app
startApolloServer();
