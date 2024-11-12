import express from "express";
import db from "../db/conn.mjs"; // MongoDB connection file
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Regex patterns for input validation
const nameRegex = /^[a-zA-Z\s-]+$/; //protects from cross-site-scripting attacks
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;  //protects from SQL / NoSql Injection and also whitlisting input

// Secret for JWT
const JWT_SECRET = "this_secret_should_be_longer_than_it_is";

// Customer Signup
router.post("/signup", async (req, res) => {
    const { name, idNumber, accountNumber, password } = req.body;

    // Validate name and password
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: "Invalid name format. Name can only contain letters, spaces, or hyphens." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and include at least one letter and one number." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //Already salted

    const newUser = {
        name,
        idNumber,
        accountNumber,
        password: hashedPassword,
        role: "customer", // specify role for user
    };

    try {
        let collection = await db.collection("users");
        let result = await collection.insertOne(newUser);
        res.status(201).json({ message: "User registered", userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

// Staff Signup
router.post("/staff-signup", async (req, res) => {
    const { name, staffId, password } = req.body;

    // Validate inputs
    if (!nameRegex.test(name) || !passwordRegex.test(password)) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = {
        name,
        staffId,
        password: hashedPassword,
        role: "staff", // set role as staff
    };

    try {
        let collection = await db.collection("users");
        let result = await collection.insertOne(newStaff);
        res.status(201).json({ message: "Staff registered", staffId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Error creating staff", error });
    }
});

// Customer and Staff Login
router.post("/login", /*bruteforce.prevent,*/ async (req, res) => {
    const { name, accountNumber, password } = req.body;

    console.log('Hit Login')
    console.log('username: ', name, '\nAccount No: ', accountNumber, '\nPassword', password)

    try {
        const collection = await db.collection("users");

        let user;
        if (!accountNumber.startsWith("STAFF")) {
            user = await collection.findOne({ "name": name,"accountNumber": accountNumber });

        } else {
            const staffID = accountNumber
            user = await collection.findOne({ 'name': name, 'staffId': staffID });
        }


        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        console.log('Toke')
        res.status(200).json({
            message: "Authentication successful",
            token: token,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
});

// Middleware for authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Customer submits a payment
router.post("/submit-payment", authenticateToken, async (req, res) => {
    if (req.user.role !== "customer") {
        return res.status(403).json({ message: "Access denied" });
    }

    const { amount, currency, provider, accountInfo, swiftCode } = req.body;
    const newPayment = {
        userId: req.user.id,
        amount,
        currency,
        provider,
        accountInfo,
        swiftCode,
        status: "pending",
        createdAt: new Date(),
    };

    try {
        let collection = await db.collection("payments");
        let result = await collection.insertOne(newPayment);
        res.status(201).json({ message: "Payment submitted", paymentId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Error submitting payment", error });
    }
});

// Staff approves a payment
router.post("/approve-payment/:paymentId", authenticateToken, async (req, res) => {
    if (req.user.role !== "staff") {
        return res.status(401).json({ message: "Access denied" });
    }

    const { paymentId } = req.params;

    try {
        let collection = await db.collection("payments");
        const payment = await collection.findOne({ _id: new ObjectId(paymentId) });

        if (!payment || payment.status !== "pending") {
            return res.status(404).json({ message: "Payment not found or already processed" });
        }

        await collection.updateOne(
            { _id: new ObjectId(paymentId) },
            { $set: { status: "approved", approvedAt: new Date() } }
        );

        res.status(200).json({ message: "Payment approved" });
    } catch (error) {
        res.status(500).json({ message: "Error approving payment", error });
    }
});

// Staff checks pending payments
router.get("/pending-payments", authenticateToken, async (req, res) => {
    if (req.user.role !== "staff") {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        let collection = await db.collection("payments");
        const pendingPayments = await collection.find({ status: "pending" }).toArray();
        res.status(200).json(pendingPayments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments", error });
    }
});

// Staff retrieves all approved payments
router.get("/approved-payments", authenticateToken, async (req, res) => {
    if (req.user.role !== "staff") {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        let collection = await db.collection("payments");
        const approvedPayments = await collection.find({ status: "approved" }).toArray();
        res.status(200).json(approvedPayments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving approved payments", error });
    }
});


export default router;
