const handleLogin = async () => {
  const userIdInput = document.getElementById('user-id');
  const userPasswordInput = document.getElementById('password');

  const userId = userIdInput.value;
  const password = userPasswordInput.value;

  const user = {
    userId: userId,
    password: password,
  };
  const userInfo = await fetchUserInfo(user);

  const errorElement = document.getElementById("user-login-error");

  // User data Condition
  if (userInfo.length == 0) {
    errorElement.classList.remove("hidden");
  }
  else {
    errorElement.classList.add("hidden");

    // Save User Information
    localStorage.setItem("loggedInUser", JSON.stringify(userInfo[0]));
    window.location.href = "/post.html";
  }


};


const fetchUserInfo = async (user) => {
  let data;
  try {
    const res = await fetch('http://localhost:5000/getUserInfo', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    data = await res.json();
  }
  catch (err) {
    console.log("Error connecting to the server:", err);
  }
  finally {
    return data;
  }
}