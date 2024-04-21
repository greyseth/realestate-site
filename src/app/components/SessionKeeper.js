let loginData = {
  login_id: 1,
  login_token: "1234567890",
  first_name: "Person",
  last_name: "Man",
  avatar: "avatar_1710140672606.jpeg",
};

let lastPage = "";

function setLoginData(newLoginData) {
  loginData = newLoginData;
}

function setLastPage(newLastPage) {
  lastPage = newLastPage;
}

export { loginData, lastPage, setLoginData, setLastPage };
