const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
    let validUsers = users.filter(user => user.username === username && user.password ===password);
    return (validUsers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Validate that both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Check if the user is registered and the password is valid
  if (authenticatedUser(username, password)) {
    // Generate a JWT token with a secret key and an expiration time
    const token = jwt.sign({ username }, "accessKey", { expiresIn: '1h' });
    return res.status(200).json({ message: "User logged in successfully", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Extract the token from the Authorization header in the format "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: Token not provided." });
  }
  
  const token = authHeader.split(" ")[1];
  let username;
  
  try {
    const decoded = jwt.verify(token, "accessKey");
    username = decoded.username;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
  
  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Extract review from the request body
  const review = req.body.review;
  if (!review) {
    return res.status(400).json({ message: "Please provide a review in the request body" });
  }
  
  // Initialize the reviews property if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }
  
  // Add or update the review for the current user
  book.reviews[username] = review;
  
  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Extract the token from the Authorization header in the format "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: Token not provided." });
  }
  
  const token = authHeader.split(" ")[1];
  let username;
  
  try {
    const decoded = jwt.verify(token, "accessKey");
    username = decoded.username;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
  
  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Check if the book has reviews and if the user has submitted a review
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for the user" });
  }
  
  // Delete the review for the current user
  delete book.reviews[username];
  
  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
