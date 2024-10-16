import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

//signup
router.post("/signup", async (req, res) => {
    const password = bcrypt.hash(req.body.password,10)
    let newDocument = {
        name: req.body.name,
        password: (await password).toString()
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

router.post("/Login", bruteforce.prevent, async (req, res) => {
const {name, password} = req.body;
console.log(name +" "+ password);
try {
    const collection = await db.collection("users");
    const user = await collection.findOne({name});

    if(!user){
        return res.status(401).json({message:"Authentication failed"});
    }

    //compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password,user.password)

    if(!passwordMatch){
        return res.status(401).json({message:"Authentication failed"});
    }
    else{
     //Authenitication successful 
     const token = jwt.sign({Username:req.body.username,password:req.body.password},"this_secret_should_be_longer_than_it_is",{expiresIn:"1h"})   
     res.status(200).json({message:"Authentication successful",token:token, name: req.body.name});
     console.log("your new token is",token);
    }
}
catch(error){
    console.error("login error:", error)
    res.status(500).json({message:"login failed"});
}
});
export default router


