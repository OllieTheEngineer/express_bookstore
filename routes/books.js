const express = require("express");
const Book = require("../models/book");
const router = new express.Router();
const ExpressError = require("../expressError");
const jsonSchema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");


/** GET / => {books: [book, ...]}  */
// getting all books

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */
// getting a book using an id

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */
// creating a book

// router.post("/", async function (req, res, next) {
//   try {
//     const book = await Book.create(req.body);
//     return res.status(201).json({ book });
//   } catch (err) {
//     return next(err);
//   }
// });

router.post("/", async function (req, res, next) {
  const results = jsonSchema.validate(req.body, bookSchema);
  if(!results.valid) {
    console.log(results);
    const newErrors = results.errors.map(e => e.stack);
    const err = new ExpressError(newErrors, 400);
      return next(err);
  }
    const book = await Book.create(req.body);
      return res.status(201).json({ book });
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */
// updating a book

router.put("/:isbn", async function (req, res, next) {
  // try {
  //   const book = await Book.update(req.params.isbn, req.body);
  //   return res.json({ book });
  // } catch (err) {
  //   return next(err);
  // }
  const result = jsonSchema.validate(req.params.isbn, req.body);
  if(!result.valid) {
    console.log(result);
    const newErrora = result.errors.map(e => e.stack);
    const err = new ExpressError(newErrors, 400);
      return next(err);
  }
    const book = await Book.update(req.params.isbn, req.body);
      return res.json({ book });
});

/** DELETE /[isbn]   => {message: "Book deleted"} */
// deletinga book from database

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
