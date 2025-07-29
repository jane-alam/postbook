const showLoggedUsername = () => {
  const userNameElement = document.getElementById('logged-username');

  let user = localStorage.getItem('loggedInUser');
  if (user) {
    user = JSON.parse(user);
  }

  // Show username in the post page
  userNameElement.innerText = user.userName;

};

const checkLoggedInUser = () => {
  let user = localStorage.getItem('loggedInUser');
  if (user) {
    user = JSON.parse(user);
  }
  else {
    window.location.href = './index.html';
  }
};

const logOut = () => {
  localStorage.clear();
  checkLoggedInUser();
};

// Get All Posts 
const fetchAllPosts = async () => {
  let data;

  try {
    const res = await fetch("http://localhost:5000/getAllPosts");
    data = await res.json();
    console.log(data);
    showAllPosts(data);
  }
  catch (err) {
    console.log("Error Fetching Posts.", err);

  }
};

const showAllPosts = (allPosts) => {
  const postContainer = document.getElementById('post-container');
  postContainer.innerHTML = "";

  allPosts.forEach(async (post) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    postDiv.innerHTML = `
      <div class="post-header">
        <div class="post-user-image">
          <img
            src=${post.postedUserImage} />
        </div>
        <div class="post-username-time">
          <p class="post-username">${post.postedUserName}</p>
          <div class="posted-time">
            <span>${post.postedTime}</span>
            <span>hours ago</span>
          </div>
        </div>
      </div>
      <div class="post-text">${post.postText}</div>
      <div class="post-image">
        <img
          src=${post.postImageUrl} alt="post-image" />
      </div>
    `;
    postContainer.appendChild(postDiv);

    //Post Comment 
    let postComments = await fetchAllCommentsOfAPost(post.postId);
    console.log('PostComments: ', postComments);

    postComments.forEach((comment) => {
      const commentsHolderDiv = document.createElement('div');
      commentsHolderDiv.classList.add('comments-holder');
      commentsHolderDiv.innerHTML = `
        <div class="comment">
          <div class="comment-user-image">
            <img
              src=${comment.commentedUserImage}
              alt="comment-user-image" />
          </div>
          <div class="comment-text-container">
            <h4>${comment.commentedUserName}</h4>
            <p class="comment-text">${comment.commentText}</p>
          </div>
        </div>
      `;
      postDiv.appendChild(commentsHolderDiv);
    });

    // New Comment Input 
    const addNewCommentDiv = document.createElement('div');
    addNewCommentDiv.classList.add("postComment-holder");
    addNewCommentDiv.innerHTML = `
        <div class="post-comment-input-field-holder">
          <input type="text" placeholder="Post your comment" class="postComment-input-field"
            id="postComment-input-for-postId-${post.postId}" />
        </div>
        <div class="comment-btn-holder">
          <button onClick=handlePostComment(${post.postId}) id="comment-btn" class="postComment-btn">Comment</button>
        </div>
    `;

    postDiv.appendChild(addNewCommentDiv);

  });

};

const handlePostComment = async (postId) => {
  // Collecting Logged in UserId from localstorage
  let user = localStorage.getItem('loggedInUser');
  if (user) {
    user = JSON.parse(user);
  }

  const commentedUserId = user.userId;

  // Getting Comment text from input
  const commentTextElement = document.getElementById(`postComment-input-for-postId-${postId}`);
  const commentText = commentTextElement.value;

  // Current time of the comment
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  let timeOfComment = now.toISOString();
  const commentObject = {
    commentOfPostId: postId,
    commentedUserId: commentedUserId,
    commentText: commentText,
    commentTime: timeOfComment,
  };

  try {
    const res = await fetch('http://localhost:5000/postComment', {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(commentObject),
    });
    const data = await res.json();
  }
  catch (err) {
    console.log("While send data ", err);
  }
  finally {
    location.reload();
  }


};

const fetchAllCommentsOfAPost = async (postId) => {
  let commentsOfPost = [];
  try {
    const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
    commentsOfPost = await res.json();
  }
  catch (err) {
    console.log("Error Comment: ", err);
  }
  finally {
    return commentsOfPost;
  }

};
fetchAllPosts();
showLoggedUsername();
