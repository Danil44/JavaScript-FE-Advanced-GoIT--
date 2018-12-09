"use strict";
const getAllUsersBtn = document.querySelector(".get-users__btn");
const userTable = document.querySelector(".user-table");
const usersResult = document.querySelector(".users-result");

const idSearchInput = document.querySelector("input");
const idSearchForm = document.querySelector(".id-search-form");
const idSearchResult = document.querySelector(".result");
const allUsersList = userTable.children;

const addUserForm = document.querySelector(".add-user__form");
const inputName = document.querySelector('input[name="name"]');
const inputAge = document.querySelector('input[name="age"]');
const addUserResult = document.querySelector(".add-user__result");

const removeUserForm = document.querySelector(".remove-user__form");
const userIdInput = removeUserForm.querySelector("input");
const removeUserResult = document.querySelector(".remove-user__result");

const updateUserForm = document.querySelector(".update-user__form");
const updateIdInput = updateUserForm.querySelector('input[name="id"]');
const updateNameInput = updateUserForm.querySelector('input[name="name"]');
const updateAgeInput = updateUserForm.querySelector('input[name="age"]');
const updateResult = document.querySelector(".update-user__result");

function clearOtherResults() {
  usersResult.innerHTML = "";
  idSearchResult.innerHTML = "";
  addUserResult.innerHTML = "";
  removeUserResult.innerHTML = "";
  updateResult.innerHTML = "";
}

// =======================   GET ALL USERS    ================================
getAllUsersBtn.addEventListener("click", handleUserInfo);

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
  getAllUsersBtn.removeEventListener("click", handleUserInfo);
}
function showAllUsers(users) {
  clearOtherResults();
  usersResult.innerHTML = users.reduce(
    (acc, user) =>
      acc +
      `<tr>
 <td>${user.name}</td>
 <td>${user.age}</td>
 <td>${user.id}</td>
</tr>
`,
    ""
  );
}

// =======================   GET USER BY ID    ================================
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
  if (idSearchInput.value === "") {
    idSearchForm.classList.add("invalid-form");
    return (idSearchResult.innerHTML = `<p class="invalid-form"> Please, enter users's id!
    </p>`);
  }
  getUserById(idSearchInput.value).then(showUserById);
  this.reset();
}

function showUserById(user) {
  clearOtherResults();
  idSearchForm.classList.remove("invalid-form");
  getAllUsersBtn.addEventListener("click", handleUserInfo);
  if (user === undefined) {
    return (idSearchResult.innerHTML = `<p class="invalid-form"> User with this id is not defined! 
    </p>`);
  }
  idSearchResult.innerHTML = `<p>
  User name:${user.name}<br>
  User age:${user.age}<br>
  User id:${user.id}
  </p>`;
}

// =======================   ADD NEW USER    ================================
addUserForm.addEventListener("submit", handleAddUser);

const addUser = (userName, userAge) => {
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
};

function handleAddUser(evt) {
  evt.preventDefault();
  if (/[0-9]/.test(inputName.value) || Number.isNaN(inputAge.value)) {
    return (addUserResult.innerHTML = `<p class="invalid-form">INVALID INPUT!<br>Name can match only a characters.<br>Age can match only a numbers.</p>`);
  }
  addUser(inputName, inputAge).then(showAddedUser);
  this.reset();
}

function showAddedUser(user) {
  clearOtherResults();
  getAllUsersBtn.addEventListener("click", handleUserInfo);
  addUserResult.innerHTML = `<p>
  User name:${user.name}<br>
  User age:${user.age}<br>
  User id:${user._id}
  </p>`;
}

// =======================   REMOVE USER BY ID   ==============================
removeUserForm.addEventListener("submit", hadleRemoveUser);

const removeUser = id => {
  return fetch(`https://test-users-api.herokuapp.com/users/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(user => user.data)
    .catch(err => console.log(err));
};

function hadleRemoveUser(evt) {
  evt.preventDefault();
  removeUser(userIdInput.value).then(showRemovedUser);
  this.reset();
}

function showRemovedUser(user) {
  clearOtherResults();
  getAllUsersBtn.addEventListener("click", handleUserInfo);
  if (user === undefined || user === null) {
    return (removeUserResult.innerHTML = `<p class="invalid-form"> User with this id is not defined! 
    </p>`);
  }
  removeUserResult.innerHTML = `<p>
  User name:${user.name}<br>
  User age:${user.age}<br>
  User id:${user.id}
  </p>`;
}

// ====================== UPDATE USER BY ID ====================================
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
  clearOtherResults();
  getAllUsersBtn.addEventListener("click", handleUserInfo);
  if (updatedUser === undefined) {
    return (updateResult.innerHTML = `<p class="invalid-form"> User with this id is not defined! 
    </p>`);
  }
  updateResult.innerHTML = `<p>
  User name:${updatedUser.name}<br>
  User age:${updatedUser.age}<br>
  User Id:${updatedUser.id}
  </p>`;
}
