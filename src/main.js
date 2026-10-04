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
const consoleContainer = document.getElementById("console-container");
const consoleOutput = document.getElementById("console-output");

let editingId = null;
let cachedEntries = [];

/**
 * Appends a line to the on-page console and reveals it, so failures are not
 * silently swallowed by the "No entries yet." empty state.
 *
 * @param {"info" | "error"} kind - Severity, used as a CSS modifier.
 * @param {string} text - Message text, inserted as text (never HTML).
 * @returns {void}
 */
function logMessage(kind, text) {
  const line = document.createElement("div");
  line.className = `console-line console-line--${kind}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  consoleOutput.append(line);
  consoleContainer.hidden = false;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

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
      logMessage("error", "Save failed: " + err.message);
    }
  },
  onCancel: () => {
    editingId = null;
    form.reset();
  },
});

async function load() {
  try {
    cachedEntries = await getAllEntries();
    draw(cachedEntries);
    logMessage(
      "info",
      `Loaded ${cachedEntries.length} ${cachedEntries.length === 1 ? "entry" : "entries"}.`,
    );
  } catch (err) {
    logMessage("error", "Load failed: " + err.message);
  }
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
      try {
        await deleteEntry(id);
        await load();
      } catch (err) {
        logMessage("error", "Delete failed: " + err.message);
      }
    },
  });
}

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const q = searchInput.value.trim();
    if (!q) return draw(cachedEntries);
    try {
      const results = await searchEntries(q);
      draw(results);
      logMessage("info", `Search "${q}" returned ${results.length}.`);
    } catch (err) {
      logMessage("error", "Search failed: " + err.message);
    }
  }, 250);
});

load();
