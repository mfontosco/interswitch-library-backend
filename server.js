const dotenv = require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const db = require("./database/models/index")
const cors = require("cors")
const userRoutes = require("./routes/userRoute")
const bookRoutes = require("./routes/booksRoute")
const borrowBookRoutes = require("./routes/borrowingRoute")

const  port = process.env.PORT || 3001;

const app = express()

app.use(cors({
    origin: '*',
}));
app.use(express.json({limit:"50mb"}))
app.use(morgan('dev'))

app.use("/api/v1/users",userRoutes)
app.use('/api/v1/books',bookRoutes)
app.use('/api/v1/borrow',borrowBookRoutes)

db.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
app.get("/",(req,res)=>{
    res.status(200).json({
        "message":"welcome to backend"
    })
})
app.listen(port,(err)=>{
    if(err){
        throw Error(err)
    }
    console.log(`server is running on ${port}`)
})