import https from "https";
import fs from "fs";
import posts from "./routes/post.mjs";
import users from "./routes/user.mjs";
import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit'; 

const PORT = 3000;
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),    //Man in the middle attack protection
    cert: fs.readFileSync('keys/certificate.pem')   //Session jacking protection
};

//rate limiter for all routes
//Protection from DDoS Attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Apply the rate limiter globally to all requests
app.use(limiter);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    // CSP
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self';"); //ClickJacking & Cross site scripting protection
    // HTTP Strict Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // Man in the middle attack protection
    next();
});

app.use("/post", posts);
app.route("/post", posts);
app.use("/user", users);
app.route("/user", users);

let server = https.createServer(options, app);
console.log(PORT);
server.listen(PORT);
