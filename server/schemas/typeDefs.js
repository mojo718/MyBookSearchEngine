// Schemas to allow access to data when data is fetched from database

// Queries and Mutations are allowed commands that the resolver will then use to fetch the appropriate data

const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID!
    authors: [String]!
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String! email: String!, password: String!): Auth
    saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs