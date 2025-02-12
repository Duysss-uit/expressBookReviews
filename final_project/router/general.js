const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop - Using async/await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an async operation to fetch books
    const bookList = await Promise.resolve(books);
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN - Using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: 'Book not found' });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get book details based on author - Using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author.toLowerCase();
    const bookList = await Promise.resolve(books);
    const results = Object.entries(bookList)
      .filter(([_, book]) => book.author && book.author.toLowerCase().includes(author))
      .map(([isbn, book]) => ({ isbn, ...book }));

    if (results.length > 0) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: "No books found for the specified author" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title - Using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title.toLowerCase();
    const bookList = await Promise.resolve(books);
    const results = Object.entries(bookList)
      .filter(([_, book]) => book.title && book.title.toLowerCase().includes(title))
      .map(([isbn, book]) => ({ isbn, ...book }));

    if (results.length > 0) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: "No books found with the specified title" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Get book review - Using async/await
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Book or reviews not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book reviews", error: error.message });
  }
});

module.exports.general = public_users;
