import express from "express";
import dotenv from "dotenv"
import connectDb from "./config/db.js";


dotenv.config()

const port = process.env.PORT;
const app = express()

app.get("/", (req,res)=>{
    res.send("hellow")
})

app.listen(port, ()=> {
    console.log("Server started")
    connectDb()
})