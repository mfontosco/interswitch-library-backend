const { User } = require("../database/models/index");
const generateToken = require("../utils/generateToken");
const { sendOTP } = require("../utils/sendOTP"); // Import a function to send OTP
const { Sequelize } = require('sequelize');
const generateRandomOTP =require("../utils/generateRandomOTP");


console.log("user", User);
const Logic = {};

// Endpoint for registering a user
Logic.registerUser = async (req, res) => {
    try {
        const { email, phone, confirm_password, password, first_name, last_name, role, department } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        if (password !== confirm_password) {
            return res.status(401).json({ message: "Password does not match with confirm password" });
        }

        const newUser = await User.create({ email, password, first_name, last_name, phone, confirm_password });
        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Endpoint for logging in a user
Logic.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email, password } });
        if (!user) {
            throw new Error("User does not exist, please register");
        }

        const token = await generateToken(user.id);
        res.status(200).json({
            status: "success",
            user: {
                id: user.id,
                fullName: `${user.first_name} ${user.last_name}`,
                email: user.email,
                is_admin: user.is_admin,
                token: token
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            error: err.message
        });
    }
};

// Endpoint for getting users
Logic.getUsers = async (req, res) => {
    const { author } = req.query;
    let where = {};
    if (author) {
        where = { author: author };
    }

    try {
        const users = await User.findAll({
            where,
            attributes: ['id', 'email', 'phone', 'password', 'first_name', 'last_name', 'created_at', 'is_admin'],
            order: [["first_name", 'ASC']]
        });

        
        if (users.length === 0) {
            res.status(404).json({
                status: "failed",
                message: "Users not found",
                users
            });
        } else {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
            res.status(200).json({
                status: "success",
                users
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        });
    }
};

// Endpoint for sending OTP to email for email verification
Logic.sendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        // Generate random OTP (You need to implement this function)
        const OTP = generateRandomOTP();

        // Save OTP in database with user's email (You need to implement this function)
        // await saveOTPinDatabase(email, OTP);
        const userExist =await User.findOne({
            where:{
                 email:email
            }
        })
        await userExist.update({
            otp:OTP
        })
        await userExist.save()
        // Send OTP to the user's email (You need to implement this function)
        await sendOTP(email, OTP);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


    Logic.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the OTP from the request with the OTP stored in the database
        if (user.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        // Clear the OTP from the database (optional)
        user.otp = null;
        await user.save();

        // If OTP is valid, return success message
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = Logic;
