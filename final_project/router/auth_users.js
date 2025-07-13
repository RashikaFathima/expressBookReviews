const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: password },
      "access", // secret key
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  const review = req.body.review;

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;
  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required." });
  }

  if (books[isbn]) {
    // If reviews object does not exist, create it
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review for ISBN ${isbn} added/updated.` });
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
