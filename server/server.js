const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;


// Middlewares

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Hello World Running on ${port}`);
})

app.listen(port, () => {
  console.log(`Server is runnig on ${port}`);
})