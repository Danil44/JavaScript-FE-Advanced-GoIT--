"use strict";
const getAllUsersBtn = document.querySelector(".get-users__btn");
const userTable = document.querySelector(".user-table");
const usersResult = document.querySelector(".users-result");

const idSearchInput = document.querySelector("input");
const idSearchForm = document.querySelector(".id-search-form");
const idSearchResult = document.querySelector(".id-search-result");
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

const allResults = Array.from(document.querySelectorAll(".result"));

const USER_IS_UNDEFINED = `<p class="invalid-form"> User with this id is not defined! 
</p>`;
const IVALID_INPUT = `<p class="invalid-form">INVALID INPUT!<br>Name can match only a characters.<br>Age can match only a numbers.</p>`;
const EMPTY_INPUT = `<p class="invalid-form"> Please, enter users's id!
</p>`;
const API_USERS = "https://test-users-api.herokuapp.com/users/";

// =======================   GET ALL USERS    ================================
getAllUsersBtn.addEventListener("click", handleUserInfo);

const fetchAllUsers = () => {
  return fetch(API_USERS)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(user => showAllUsersTable(user.data))
    .catch(err => console.log(err));
};

function handleUserInfo(evt) {
  evt.preventDefault();
  fetchAllUsers();
  getAllUsersBtn.removeEventListener("click", handleUserInfo);
}

function showAllUsersTable(users) {
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
const fetchUserId = id => {
  return fetch(API_USERS + id)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(user => {
      if (user.data === undefined || null) {
        return (idSearchResult.innerHTML = USER_IS_UNDEFINED);
      }
      showResult(user.data, idSearchResult);
    })
    .catch(err => console.log(err));
};

function handleUser(evt) {
  evt.preventDefault();
  if (idSearchInput.value === "") {
    idSearchForm.classList.add("invalid-form");
    return (idSearchResult.innerHTML = EMPTY_INPUT);
  }
  fetchUserId(idSearchInput.value);
  this.reset();
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
    .then(user => showResult(user.data, addUserResult))
    .catch(err => console.log(err));
};

function handleAddUser(evt) {
  evt.preventDefault();
  if (/[0-9]/.test(inputName.value) || Number.isNaN(inputAge.value)) {
    return (addUserResult.innerHTML = IVALID_INPUT);
  }
  addUser(inputName, inputAge);
  this.reset();
}

// =======================   REMOVE USER BY ID   ==============================
removeUserForm.addEventListener("submit", hadleRemoveUser);

const removeUser = id => {
  return fetch(API_USERS + id, {
    method: "DELETE"
  })
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(user => {
      if (user.data === undefined || user.data === null) {
        return (removeUserResult.innerHTML = USER_IS_UNDEFINED);
      }
      showResult(user.data, removeUserResult);
    })
    .catch(err => console.log(err));
};

function hadleRemoveUser(evt) {
  evt.preventDefault();
  removeUser(userIdInput.value);
  this.reset();
}

// ====================== UPDATE USER BY ID ====================================
updateUserForm.addEventListener("submit", handleUpdateUser);

const updateUser = (id, user) => {
  return fetch(API_USERS + id, {
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
    .then(user => {
      if (updatedUser === undefined) {
        return (updateResult.innerHTML = USER_IS_UNDEFINED);
      }
      showResult(user.data, updateResult);
    })
    .catch(err => console.log(err));
};

function handleUpdateUser(evt) {
  const userToUpdate = {
    name: updateNameInput.value,
    age: Number(updateAgeInput.value)
  };
  evt.preventDefault();
  updateUser(updateIdInput.value, userToUpdate);
  this.reset();
}
// ==========================================================================
function clearOtherResults() {
  allResults.forEach(result => (result.innerHTML = ""));
}

function showResult(user, resultBlock) {
  clearOtherResults();
  idSearchForm.classList.remove("invalid-form");
  getAllUsersBtn.addEventListener("click", handleUserInfo);
  resultBlock.innerHTML = `<p>
  User name:${user.name}<br>
  User age:${user.age}<br>
  User id:${user.id}
  </p>`;
}
