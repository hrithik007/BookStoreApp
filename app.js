// Importing ApolloServer and gql from apollo-server
const { ApolloServer, gql } = require('apollo-server');

// Sample data for books and authors (mock database)
const books = [
  { id: '1', title: '1984', authorId: '1' },
  { id: '2', title: 'Brave New World', authorId: '2' },
  { id: '3', title: 'Fahrenheit 451', authorId: '3' },
];

const authors = [
  { id: '1', name: 'George Orwell' },
  { id: '2', name: 'Aldous Huxley' },
  { id: '3', name: 'Ray Bradbury' },
];

// Define schema using GraphQL SDL
const typeDefs = gql`
  # Define Book type with fields
  type Book {
    id: ID!
    title: String!
    author: Author  # Relationship to Author type
  }

  # Define Author type with fields
  type Author {
    id: ID!
    name: String!
    books: [Book]  # List of books written by this author
  }

  # Define root Query type
  type Query {
    books: [Book]         # Query to get all books
    book(id: ID!): Book   # Query to get book by ID
    authors: [Author]     # Query to get all authors
    author(id: ID!): Author  # Query to get author by ID
  }
`;

// Define resolvers - functions that return data for schema fields
const resolvers = {
  Query: {
    books: () => books,  // Return all books
    book: (_, { id }) => books.find(book => book.id === id), // Find book by ID
    authors: () => authors, // Return all authors
    author: (_, { id }) => authors.find(author => author.id === id), // Find author by ID
  },
  Book: {
    // Resolve the author for a book
    author: (book) => authors.find(author => author.id === book.authorId),
  },
  Author: {
    // Resolve the books for an author
    books: (author) => books.filter(book => book.authorId === author.id),
  }
};

// Create an Apollo Server instance with schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server at local host 4000  and print the URL
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`); // Log server URL when ready
});
