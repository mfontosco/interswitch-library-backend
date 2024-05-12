const { Book, Sequelize } = require("../database/models/index")
require("dotenv").config()
const cloudinary = require('cloudinary');

console.log("books", Book)

const Logic = {}
Logic.createBooks = async (req, res) => {
    const { isbn, title, author, genre, image_url } = req.body
    console.log("body", isbn, title, author, genre, image_url)
    if (isNaN(isbn)) {
        return res.status(400).json({
            status: "failed",
            message: "ISBN must be a number"
        });
    }
    try {
        cloudinary.config({
            cloud_name: "mychat",
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
            secure: true,
        });
        
        const response = await cloudinary.v2.uploader.upload(image_url, {
            resource_type: "image",
            folder: "images",
            height: 400,
            width: 400,
            quality: "auto",
            crop: "scale",
        });
        console.log("response-cloud", response)


        const book = await Book.create({
            title,
            isbn,
            genre,
            image_url: response.secure_url,
            author,
        })
        if (!book) {
            res.status(404).json({
                status: "failed",
                message: "failed to create book"
            })
        }
        res.status(201).json({
            status: "success",
            message: "book created successfully",
            book
        })
    } catch (error) {
        console.log("error",error)
        res.status(500).json({
            status: "failed",
            message: error
        })
    }
}

Logic.getBooks = async (req, res) => {
    const { title } = req.query
  
    try {
        const books = await Book.findAll({
            where:{[Sequelize.Op.and]:[{
                    is_available:true
            },]},
            attributes: ['id', 'title', 'isbn', 'author', 'genre', 'image_url'],
            order: [["title", 'ASC']]
        })
        
        if (books.length === 0) {
            res.status(404).json({
                status: "failed",
                message: "books not found",
                books
            })
        } else {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            res.status(200).json({
                status: "success",
                books
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}
Logic.borrowBook = async (req, res) => {
    
    try {
        const response = await Books.findByPk({
            where: {
                id: id
            }
        })
    } catch (error) {

    }
}

Logic.editBook = async (req, res) => {
    const { id } = req.params;
    const { isbn, title, author, genre, image_url } = req.body;

    try {
        const existingBook = await Book.findByPk(id);
        if (!existingBook) {
            return res.status(404).json({
                status: "failed",
                message: "Book not found"
            });
        }

        // If there's a new image URL provided, upload it to Cloudinary
        let imageUrl = existingBook.image_url;
        if (image_url) {
            cloudinary.config({
                cloud_name: "mychat",
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_SECRET_KEY,
                secure: true,
            });
            const response = await cloudinary.v2.uploader.upload(image_url, {
                resource_type: "image",
                folder: "book_images",
                height: 400,
                width: 400,
                quality: "auto",
                crop: "scale",
            });
            imageUrl = response.secure_url;
        }

        // Update the book details
        existingBook.isbn = isbn;
        existingBook.title = title;
        existingBook.author = author;
        existingBook.genre = genre;
        existingBook.image_url = imageUrl;

        // Save the updated book details
        await existingBook.save();

        res.status(200).json({
            status: "success",
            message: "Book updated successfully",
            book: existingBook
        });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
};
Logic.getSingleBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                status: "failed",
                message: "Book not found"
            });
        }

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

        res.status(200).json({
            status: "success",
            book
        });
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
};


module.exports = Logic

