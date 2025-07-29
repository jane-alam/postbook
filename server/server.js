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

app.get('/getAllPosts', (req, res) => {
  const sqlForAllPosts = `SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, posts.postedTime, posts.postId, posts.postText, posts.postImageUrl FROM posts INNER JOIN users ON posts.postedUserId=users.userId ORDER BY posts.postedTime DESC`;

  let query = connection.query(sqlForAllPosts, (err, result) => {
    if (err) {
      console.log("Error Loading all posts from database: ", err);
      throw err;
    }
    else {
      // console.log(result);
      res.send(result);
    }
  });

});

app.get("/getAllComments/:postId", (req, res) => {
  let id = req.params.postId;
  //console.log(id);
  let sqlForAllCommentss = `SELECT users.userName AS commentedUserName, users.userImage AS commentedUserImage, comments.commentId, comments.commentOfPostId, comments.commentText, comments.commentTime FROM comments INNER JOIN users On comments.commentedUserId = users.userId WHERE comments.commentOfPostId = ${id} `;
  let query = connection.query(sqlForAllCommentss, (err, result) => {
    if (err) {
      console.log("Comments Error from server: ", err);
      throw err;
    }
    else {
      res.send(result);
    }
  });
});


app.post("/postComment", (req, res) => {
  const { commentOfPostId, commentedUserId, commentText, commentTime } = req.body;
  let sqlForAddingNewComments = `INSERT INTO comments (commentId, commentOfPostId, commentedUserId, commentText, commentTime) VALUES (NULL, ?, ?, ?, ?);`;

  let query = connection.query(sqlForAddingNewComments, [commentOfPostId, commentedUserId, commentText, commentTime], (err, result) => {
    if (err) {
      console.log("Adding comment error", err);
    }
    else {
      res.send(result);
    }
  });

});



app.listen(port, () => {
  console.log(`Server is runnig on ${port}`);
})