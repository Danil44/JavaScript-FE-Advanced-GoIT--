"use strict";
const form = document.querySelector(".search__form");
const userTable = document.querySelector(".user-table");
form.addEventListener("submit", handleUserInfo);

// =======================   GET ALL USERS    ================================
const getAllUsers = () => {
  return fetch("https://test-users-api.herokuapp.com/users/")
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(user => user.data)
    .catch(err => console.log(err));
};

function handleUserInfo(evt) {
  evt.preventDefault();
  getAllUsers().then(showAllUsers);
  this.reset();
}
function showAllUsers(users) {
  userTable.innerHTML += users.reduce(
    (acc, user) =>
      acc +
      `<tr>
 <td>${user.name}</td>
 <td>${user.age}</td>
</tr>
`,
    ""
  );
}

// =======================   GET USER BY ID    ================================
const input = document.querySelector("input");
const idSearchForm = document.querySelector(".id-search-form");
const result = document.querySelector(".result");
idSearchForm.addEventListener("submit", handleUser);

const getUserById = id => {
  return fetch(`https://test-users-api.herokuapp.com/users/${id}`)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(user => user.data)
    .catch(err => console.log(err));
};
function handleUser(evt) {
  evt.preventDefault();
  getUserById(input.value).then(showUserById);
  this.reset();
}
function showUserById(user) {
  if (user === undefined) {
    return (result.innerHTML = `<p> User with this ID is not defined!
    </p>`);
  }
  result.innerHTML = `<p>
  User name:${user.name}<br>
  User age:${user.age}
  </p>`;
}

// =======================   ADD NEW USER    ================================
const addUserForm = document.querySelector(".add-user__form");
const inputName = document.querySelector('input[name="name"]');
const inputAge = document.querySelector('input[name="age"]');
addUserForm.addEventListener("submit", handleAddUser);
function handleAddUser(evt) {
  evt.preventDefault();
  postUser(inputName, inputAge).then(showResult);
}
function postUser(userName, userAge) {
  return fetch("https://test-users-api.herokuapp.com/users/", {
    method: "POST",
    body: JSON.stringify({
      name: `${userName.value}`,
      age: `${userAge.value}`
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(user => user.data)
    .catch(err => console.log(err));
}
function showResult(result) {
  alert(`Welcome ${result.name}!`);
  console.log(result);
}

// =======================   REMOVE USER BY ID   ==============================
const removeUserForm = document.querySelector(".remove-user__form");
const userIdInput = removeUserForm.querySelector("input");
removeUserForm.addEventListener("submit", hadleRemoveUser);

const removeUser = id => {
  return fetch(`https://test-users-api.herokuapp.com/users/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (response.ok) alert("success");
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));
};
function hadleRemoveUser(evt) {
  evt.preventDefault();
  removeUser(userIdInput.value);
}

// ====================== UPDATE USER BY ID ====================================
const updateUserForm = document.querySelector(".update-user__form");
const updateIdInput = updateUserForm.querySelector('input[name="id"]');
const updateNameInput = updateUserForm.querySelector('input[name="name"]');
const updateAgeInput = updateUserForm.querySelector('input[name="age"]');
const updateResult = document.querySelector(".update-user__result");

updateUserForm.addEventListener("submit", handleUpdateUser);

const updateUser = (id, user) => {
  return fetch(`https://test-users-api.herokuapp.com/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(user => user.data)
    .catch(err => console.log(err));
};
function handleUpdateUser(evt) {
  const userToUpdate = {
    name: updateNameInput.value,
    age: Number(updateAgeInput.value)
  };
  evt.preventDefault();
  updateUser(updateIdInput.value, userToUpdate).then(showNewInfo);
  this.reset();
}
function showNewInfo(updatedUser) {
  updateResult.innerHTML = `<p>
  Name:${updatedUser.name}<br>
  Age:${updatedUser.age}
  </p>`;
  console.log(updatedUser);
}
