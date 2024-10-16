import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Regex patterns for input validation
const nameRegex = /^[a-zA-Z\s-]+$/;                                    //protects from cross-site-scripting attacks
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; //protects from SQL / NoSql Injection and also whitlisting input 

//signup
router.post("/signup", async (req, res) => {
    const { name, password } = req.body;

    // Validate name and password
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: "Invalid name format. Name can only contain letters, spaces, or hyphens." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and include at least one letter and one number." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //Already salted
    let newDocument = {
        name: name,
        password: hashedPassword
    };

    try {
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

//login
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;

    // Validate name and password
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: "Invalid name format." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Invalid password format." });
    }

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            // Authentication successful
            const token = jwt.sign(
                { Username: user.name },
                "this_secret_should_be_longer_than_it_is",
                { expiresIn: "1h" } //Session Timeout for session jacking
            );
            res.status(200).json({
                message: "Authentication successful",
                token: token,
                name: user.name,
            });
            console.log("your new token is", token);
        }
    } catch (error) {
        console.error("login error:", error);
        res.status(500).json({ message: "login failed" });
    }
});

export default router;
