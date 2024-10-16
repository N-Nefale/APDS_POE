import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URL || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;

try{

    conn = await client.connect();
    console.log('mongoDB is connected!!');
} catch(e) {
    console.error(e);
}

let db = client.db("swiftDB");

export default db;