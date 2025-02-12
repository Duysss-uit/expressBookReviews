const axios = require('axios');

// Functions to get all books
function getBooksWithPromise() {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log('Books list from promise callback:', response.data);
    })
    .catch(error => {
      console.error('Error fetching books with promise:', error.message);
    });
}

async function getBooksWithAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('Books list from async-await:', response.data);
  } catch (error) {
    console.error('Error fetching books with async-await:', error.message);
  }
}

// Functions to get book by ISBN
function getBookDetailsWithPromise(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log("Book details (Promise):", response.data);
    })
    .catch(error => {
      console.error("Error fetching book details (Promise):", error.message);
    });
}

async function getBookDetailsWithAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book details (Async-Await):", response.data);
  } catch (error) {
    console.error("Error fetching book details (Async-Await):", error.message);
  }
}

// Functions to get book by title
function getBookDetailsByTitleWithPromise(title) {
  axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
    .then(response => {
      console.log("Book details by title (Promise):", response.data);
    })
    .catch(error => {
      console.error("Error fetching book details by title (Promise):", error.message);
    });
}

async function getBookDetailsByTitleWithAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log("Book details by title (Async-Await):", response.data);
  } catch (error) {
    console.error("Error fetching book details by title (Async-Await):", error.message);
  }
}

// Example usage
const isbn = "1"; // Example ISBN
const title = "Example Book Title"; // Example title

// Test all functions
getBooksWithPromise();
getBooksWithAsync();
getBookDetailsWithPromise(isbn);
getBookDetailsWithAsync(isbn);
getBookDetailsByTitleWithPromise(title);
getBookDetailsByTitleWithAsync(title);

module.exports = {
  getBooksWithPromise,
  getBooksWithAsync,
  getBookDetailsWithPromise,
  getBookDetailsWithAsync,
  getBookDetailsByTitleWithPromise,
  getBookDetailsByTitleWithAsync
};
