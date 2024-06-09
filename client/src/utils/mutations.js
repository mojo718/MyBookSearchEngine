import { gql } from '@apollo/client';

// Graphql commands to login, create a user, save and remove a book from a user

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($authors: [String]!, $description: String!, $title: String!, $bookId: String!, $image: String, $link: String) {
    saveBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image, link: $link) {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        authors
        bookId
        description
        image
        link
        title
      }
    }
  } 
`;

export const REMOVE_BOOK = gql`
  mutation saveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        authors
        bookId
        description
        image
        link
        title
      }
    }
  }
`;