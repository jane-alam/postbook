const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;


// Middlewares
app.use(cors());
app.use(express.json());

// MySQL server connection
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'postbook'
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection error:", err);
    throw err;
  }
  else {
    console.log("MySQL server connected..");
  }
})

// Get User Data from Server
app.post('/getUserInfo', (req, res) => {
  //console.log(req.body);
  const { userId, password } = req.body;
  const getUserInfoSql = `SELECT userId, userName, userImage FROM users WHERE users.userId = ? AND users.UserPassword = ?`;

  let query = connection.query(getUserInfoSql, [userId, password], (err, result) => {
    if (err) {
      console.log("Error: ", err);
      throw err;
    }
    else {
      res.send(result);
    }

  });
});

app.listen(port, () => {
  console.log(`Server is runnig on ${port}`);
})