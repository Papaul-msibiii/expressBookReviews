const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res
      .status(409)
      .json({ message: "Username already exists or is invalid" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Without promise
  // return res.status(200).send(JSON.stringify(books, null, 4));

  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };

    const allBooks = await getBooks();
    res.status(200).json({ books: allBooks });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des livres" });
  }

});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Without promise
  // const isbn = req.params.isbn;
  // const book = books[isbn];

  // if (book) {
  //   return res.status(200).send(JSON.stringify(book, null, 4));
  // } else {
  //   return res.status(404).json({ message: "Book not found" });
  // }

  try {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
      });
    };

    const book = await getBookByISBN(isbn);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Without promise
  // const author = req.params.author.toLowerCase();
  // const filtered = Object.values(books).filter(
  //   (book) => book.author.toLowerCase() === author
  // );

  // if (filtered.length > 0) {
  //   return res.status(200).send(JSON.stringify(filtered, null, 4));
  // } else {
  //   return res.status(404).json({ message: "No books found by this author" });
  // }

  try {
    const author = req.params.author;

    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(book => book.author === author);
        if (result.length > 0) resolve(result);
        else reject("Aucun livre trouvé pour cet auteur");
      });
    };

    const booksByAuthor = await getBooksByAuthor(author);
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Without promise
  // const title = req.params.title.toLowerCase();
  // const filtered = Object.values(books).filter(
  //   (book) => book.title.toLowerCase() === title
  // );

  // if (filtered.length > 0) {
  //   return res.status(200).send(JSON.stringify(filtered, null, 4));
  // } else {
  //   return res.status(404).json({ message: "No books found with this title" });
  // }

  try {
    const title = req.params.title;

    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(book => book.title === title);
        if (result.length > 0) resolve(result);
        else reject("Aucun livre trouvé avec ce titre");
      });
    };

    const booksByTitle = await getBooksByTitle(title);
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
