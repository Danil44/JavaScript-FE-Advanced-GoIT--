import "./styles.css";
import "./reset.css";
import "./scss/basics.scss";
import "./scss/variables.scss";
import "./scss/components/input-form.scss";
import "./scss/components/background.scss";
import "./scss/components/note__item.scss";
import * as storage from "./services/storage";
import { fetchURLPreview } from "./services/api";
import noteTpl from "./templates/notes.hbs";

const inputForm = document.querySelector(".input-form");
const input = inputForm.querySelector("input");
const notesList = document.querySelector(".notes__list");
const CAN_NOT_LOAD_URL = `<h2 class="errors__text">Sorry, we can't load this URL.</h2>`;
const ALREADY_NOTED_URL = `<h2 class="errors__text">You already noted this URL!</h2>`;
const errorsWrapper = document.querySelector(".note__errors-wrapper");

const persistedNotes = storage.get() ? storage.get() : [];
const userNotes = [];
console.log(persistedNotes);
if (persistedNotes) {
  hydrateNotesGrid(persistedNotes);
}

function hydrateNotesGrid(data) {
  updateNoteView(createLocalNotesGrid(data));
}
// ====================================================

inputForm.addEventListener("submit", showNote);
notesList.addEventListener("click", deleteNote);

function showNote(evt) {
  evt.preventDefault();
  handleFetch();
  this.reset();
}

function handleFetch() {
  fetchURLPreview(input.value).then(noteData => {
    if (noteData === undefined) {
      errorsWrapper.insertAdjacentHTML("afterbegin", CAN_NOT_LOAD_URL);
      return;
    }
    if (checkOnSameURL(noteData.url)) return;
    userNotes.push(noteData);
    storage.set(userNotes);
    resetErrorsBlock();
    updateNoteView(createNewNote(noteData));
    console.log(storage.get());
  });
}

function checkOnSameURL(inputURL) {
  const sameURL = persistedNotes.find(note => note.url === inputURL);
  if (sameURL === undefined) {
    return false;
  }
  errorsWrapper.insertAdjacentHTML("afterbegin", ALREADY_NOTED_URL);
  return true;
}

function resetErrorsBlock() {
  errorsWrapper.innerHTML = "";
}

function createNewNote(inputNote) {
  return noteTpl({
    img: inputNote.image,
    url: inputNote.url,
    title: inputNote.title,
    desc: inputNote.description
  });
}

function createLocalNotesGrid(localNotes) {
  return localNotes.reduce(
    (acc, item) =>
      acc +
      noteTpl({
        img: item.image,
        url: item.url,
        title: item.title,
        desc: item.description
      }),
    ""
  );
}

function updateNoteView(note) {
  notesList.insertAdjacentHTML("afterbegin", note);
}

function deleteNote(evt) {
  evt.preventDefault();
  const noteURL = document.querySelector(".note__link");
  const removedNote = persistedNotes.find(item => item.url === noteURL.href);
  localStorage.removeItem(removedNote);
  const deleteBtn = document.querySelector(".note__delete-btn");
  if (evt.target === deleteBtn || evt.target === deleteBtn.children[0]) {
    deleteBtn.parentNode.remove();
  }
  return;
}
