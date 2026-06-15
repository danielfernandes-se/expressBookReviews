const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({
        message: "Unable to register user."
      });
    }
  
    if (!isValid(username)) {
      return res.status(404).json({
        message: "User already exists!"
      });
    }
  
    users.push({
      username: username,
      password: password
    });
  
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

public_users.get("/asyncbooks", async (req, res) => {
    try {
      const response = await axios.get("http://localhost:5000/");
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.json(books[isbn]);
 });
  

 public_users.get("/asyncisbn/:isbn", async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(
        `http://localhost:5000/isbn/${isbn}`
      );
  
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });


// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
    const keys = Object.keys(books);
  
    const result = keys
      .map(key => books[key])
      .filter(book => book.author === author);
  
    return res.json(result);
  
  });

  public_users.get("/asyncauthor/:author", async (req, res) => {
    try {
      const author = req.params.author;
  
      const response = await axios.get(
        `http://localhost:5000/author/${author}`
      );
  
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });


// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;
    const keys = Object.keys(books);
  
    const result = keys
      .map(key => books[key])
      .filter(book => book.title === title);
  
    return res.json(result);
  
  });

  public_users.get("/asynctitle/:title", async (req, res) => {
    try {
      const title = req.params.title;
  
      const response = await axios.get(
        `http://localhost:5000/title/${title}`
      );
  
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    return res.json(books[isbn].reviews);
  
  });

module.exports.general = public_users;
