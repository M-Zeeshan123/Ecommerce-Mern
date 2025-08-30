const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: "User already exists with this email or username" 
            });
        }

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString(),
            isAdmin: req.body.isAdmin || false
        });

        // Save user
        const savedUser = await newUser.save();
        
        // Remove password from response
        const { password, ...others } = savedUser._doc;
        
        return res.status(201).json(others);
    } catch (err) {
        return res.status(500).json({
            error: "Error creating user",
            message: err.message
        });
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        // Find user
        const user = await User.findOne({ email: req.body.email });
        
        // If user doesn't exist
        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        // Decrypt and verify password
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        // Generate token
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "365d" }
        );

        // Remove password from response
        const { password, ...info } = user._doc;

        // Send response
        return res.status(200).json({ ...info, accessToken });

    } catch (err) {
        return res.status(500).json({
            error: "Server error",
            message: err.message
        });
 
    }
})






module.exports = router;