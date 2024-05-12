const express = require('express');
const router = express.Router()
const Logic = require("../controllers/booksController")
console.log(Logic)

router.post('/create-books',Logic.createBooks)
router.get('/get-books',Logic.getBooks)
router.put("/edit-book/:id",Logic.editBook)
router.get("/get-book/:id",Logic.getSingleBook)


module.exports = router