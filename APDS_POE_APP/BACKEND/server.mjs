import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('its working again!!')
});

app.get('/Test',(req,res)=>{
    res.send('Testing /Test end point')
});

app.listen(PORT);
