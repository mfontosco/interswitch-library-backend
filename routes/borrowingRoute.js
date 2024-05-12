const express = require('express');
const router = express.Router()
const Logic = require("../controllers/borrowingController")


router.post('/borrow-book',Logic.Borrow);
router.post('/return-borrowed-book',Logic.ReturnBook);
router.get('/get-borrowed-books',Logic.getBorrowings)
router.get('/get-dashboard-counts',Logic.getDashboardStats)
// router.get('/get-borrowed-counts',Logic.getDayToDayBorrowedBooksCount)
router.get("/get-day-to-day-count",Logic.getDayToDayBorrowedBooksCount)


module.exports = router