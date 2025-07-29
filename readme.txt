// Get All posts by User 

SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, posts.postedTime, posts.postText, posts.postImageUrl FROM posts INNER JOIN users ON posts.postedUserId=users.userId ORDER BY posts.postedTime DESC;

// Comments Query

SELECT comments.commentId, comments.commentOfPostId, comments.commentText, comments.commentTime, users.userName AS commentedUserName, users.userImage AS commentedUserImage FROM comments INNER JOIN users On comments.commentedUserId = users.userId

// Specfic Post Comments

SELECT comments.commentId, comments.commentOfPostId, comments.commentText, comments.commentTime, users.userName AS commentedUserName, users.userImage AS commentedUserImage FROM comments INNER JOIN users On comments.commentedUserId = users.userId WHERE comments.commentOfPostId = '1'

