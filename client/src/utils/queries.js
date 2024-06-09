import { gql } from '@apollo/client';

// Graphql code to fetch user information
// On server side, user token will be taken from header to use when fetching data

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;