const jwt = require('jsonwebtoken');

const secret = process.env.MY_SECRET || 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes

  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer <tokenvalue>"], pop will return the removed item from the array formed by the split
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // Unpacks token information from header
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },

  // Creates a token for the user's session
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};