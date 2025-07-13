const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered." });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
  const matchingBooks = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: `No books found for author: ${author}` });
  }
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
  const matchingBooks = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: `No books found with title: ${title}` });
  }
    
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  } 
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/async-books', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };

    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books." });
  }
});

/**
 * ✅ Task 11: Get book by ISBN using Async/Await with Promise
 */
public_users.get('/async-isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(`Book with ISBN ${isbn} not found`);
        }
      });
    };

    const book = await getBookByISBN();
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

/**
 * ✅ Task 12: Get books by author using Async/Await with Promise
 */
public_users.get('/async-author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();

    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        for (let key in books) {
          if (books[key].author.toLowerCase() === author) {
            matchingBooks.push(books[key]);
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(`No books found for author: ${author}`);
        }
      });
    };

    const booksByAuthor = await getBooksByAuthor();
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

/**
 * ✅ Task 13: Get books by title using Async/Await with Promise
 */
public_users.get('/async-title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();

    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        for (let key in books) {
          if (books[key].title.toLowerCase() === title) {
            matchingBooks.push(books[key]);
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(`No books found with title: ${title}`);
        }
      });
    };

    const booksByTitle = await getBooksByTitle();
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});


module.exports.general = public_users;
