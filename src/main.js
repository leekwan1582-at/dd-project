import {
  addEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
  searchEntries,
} from "./services/diary.js";
import { EntryForm } from "./components/EntryForm.js";
import { renderEntries } from "./components/EntryList.js";
import "./styles/main.css";

const entriesContainer = document.getElementById("entries");
const searchInput = document.getElementById("search-input");

let editingId = null;
let cachedEntries = [];

const form = EntryForm({
  onSubmit: async (data) => {
    try {
      if (editingId) {
        await updateEntry(editingId, {
          tag: data.tag,
          title: data.title,
          symptom: data.symptom,
          tried: data.tried,
          root_cause: data.rootCause,
          fix: data.fix,
          lesson: data.lesson,
        });
        editingId = null;
      } else {
        await addEntry(data);
      }
      form.reset();
      await load();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  },
  onCancel: () => {
    editingId = null;
    form.reset();
  },
});

async function load() {
  cachedEntries = await getAllEntries();
  draw(cachedEntries);
}

function draw(entries) {
  renderEntries(entriesContainer, entries, {
    onEdit: (id) => {
      const entry = cachedEntries.find((e) => e.id === id);
      if (!entry) return;
      editingId = id;
      form.fill(entry);
    },
    onDelete: async (id) => {
      if (!confirm("Delete this entry?")) return;
      await deleteEntry(id);
      await load();
    },
  });
}

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const q = searchInput.value.trim();
    if (!q) return draw(cachedEntries);
    const results = await searchEntries(q);
    draw(results);
  }, 250);
});

load();
