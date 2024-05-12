const { Borrowing,Book,User, Sequelize } = require("../database/models/index")
const moment = require('moment');

const Logic = {}
Logic.Borrow = async (req, res) => {
    const { user_id, book_id } = req.body

    console.log("body", user_id, book_id)
    try {
        const  isExistUser = await User.findByPk(user_id);
        
        if (!isExistUser) return
        
        const isBookExisting = await Book.findByPk(book_id)

        if(!isBookExisting){
            return res.status(404).json({message:"The book does not exist"})
        }else{
        
        const Borrow = await Borrowing.create({
            user_id,
             book_id,
             borrowing_date : new Date()
        })
        if (!Borrow) {
            res.status(404).json({
                status: "failed",
                message: "failed to Borrow Book"
            })
        }

        await Book.update({is_available:false},{where:{id:book_id}})

        res.status(201).json({
            status: "success",
            message: "Book Borrowing created successfully",
            Borrow
        })
    }
    } catch (error) {
        throw new Error(error)
    }
}


Logic.ReturnBook = async (req, res) => {
    const { user_id, book_id } = req.body;

    try {
        // Check if the user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the book exists
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the book is borrowed by the user
        const borrowing = await Borrowing.findOne({
            where: {
                user_id: user_id,
                book_id: book_id,
                returned: false
            }
        });

        if (!borrowing) {
            return res.status(404).json({ message: "The book is not borrowed by the user" });
        }

        // Update borrowing record to set returned
        await borrowing.update({ returned: true });

        // Update book availability
        await Book.update({ is_available: true }, { where: { id: book_id } });

        return res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
        console.error("Error returning book:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



Logic.getBorrowings = async (req, res) => {
    const { title } = req.query
    let where = {}
    
    try {
        const Borrowings = await Borrowing.findAll({
            where:{
                returned:{
                    [Sequelize.Op.not]:true
                }
            },
            attributes: ["id","user_id","book_id","borrowing_date","returned"],
            include:{
                model: Book,
                attributes: ["id","author","isbn","title","image_url"],
            
            },
            order: [[{ model: Book }, "title", 'ASC']]
        })
        if (Borrowings.length === 0) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.status(404).json({
                status: "failed",
                message: "borrowed books not found",
                Borrowings
            })
        } else {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.status(200).json({
                status: "success",
                Borrowings
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

const getBorrowedBooksCount =async(req,res)=>{
try {
    const getBorrowedCounts = await Borrowing.count({
        where:{
            returned:{
                [Sequelize.Op.not]:true
            }
        }
    })
    // res.status(200).json({
    //     status:"success",
    //     message:"counts successful",
    //     count:getBorrowedCounts
    // })
    return getBorrowedCounts
} catch (error) {
    // res.status(500).json({
    //     status:"failed",
    //     message:"internal server error"
    // })
    throw new Error(error)
}
}



Logic.getDayToDayBorrowedBooksCount = async (req, res) => {
    try {
        // Get the start date (e.g., one week ago)
        const startDate = moment().subtract(7, 'days').startOf('day');
        
        // Get the end date (today)
        const endDate = moment().endOf('day');

        // Query to get day-to-day counts of borrowed books within the date range
        const dayToDayCounts = await Borrowing.findAll({
            attributes: [
                [Sequelize.literal('DATE(borrowing_date)'), 'date'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                borrowing_date: {
                    [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()]
                },
                returned: false
            },
            group: Sequelize.literal('DATE(borrowing_date)'),
            order: Sequelize.literal('DATE(borrowing_date)')
        });

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.status(200).json({
            status: "success",
            message: "Day-to-day borrowed books count retrieved successfully",
            counts: dayToDayCounts
        });
    } catch (error) {
        console.error("Error retrieving day-to-day borrowed books count:", error);
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
};
const getOverdueBorrowedBooksCount = async (req, res) => {
    try {
         
        
        const startDate = moment().subtract(7, 'days').startOf('day');
        const overdueCount = await Borrowing.count({
            where: {
                borrowing_date: {
                    [Sequelize.Op.lt]: startDate.toDate()
                },
                returned:false
            }
        });
        return overdueCount
        // res.status(200).json({
        //     status: "success",
        //     message: "Count of overdue borrowed books retrieved successfully",
        //     count: overdueCount
        // });
    } catch (error) {
        console.error("Error retrieving count of overdue borrowed books:", error);
        // res.status(500).json({
        //     status: "failed",
        //     message: "Internal server error"
        // });
        throw new Error(error)
    }

};
const newMembersCount = async (req, res) => {
    try {
        
        const currentDate = new Date();
     
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; 
        
        const count = await User.count({
            where: {
                created_at: {
                    [Sequelize.Op.and]: [
                        Sequelize.literal(`EXTRACT(YEAR FROM "created_at") = ${currentYear}`),
                        Sequelize.literal(`EXTRACT(MONTH FROM "created_at") = ${currentMonth}`)
                    ]
                }
            }
        });
            return count
        // res.status(200).json({
        //     status: "success",
        //     count: count
        // });
    } catch (error) {
        console.error("Error counting new members:", error);
        // res.status(500).json({ message: "Internal server error" });
        throw new Error(error)
    }
}
Logic.getDashboardStats=async(req,res)=>{
    let stat ={}
    stat.borrowedBookCount = await getBorrowedBooksCount(req,res)
    stat.overdueCount = await getOverdueBorrowedBooksCount(req,res)
    stat.newMemberCount = await newMembersCount(req,res)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    res.status(200).json({
        success:true,
        stat
    })
}
module.exports = Logic

