import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all records
router.get("/", async(req, res )=> {
    let collection = await db.collection("posts");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

//create new record
router.post("/upload", async (req,res) => {
    let newDocument = {
        user: req.body.user,
        contennt: req.body.contennt,
        image: req.body.image
    };
    let collection = await db.collection("posts");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

export default router;
